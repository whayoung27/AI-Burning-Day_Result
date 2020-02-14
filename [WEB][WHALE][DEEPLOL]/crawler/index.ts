import {LolApi} from 'twisted';
import {Divisions, Queues, Regions, Tiers} from "twisted/dist/constants";
import {AccountDto} from "./types";
import {Client} from 'pg';
import async = require('async');


const db = new Client({
    connectionString: process.env.DB_URI,
});
const api = new LolApi({key: process.env.API_KEY});
const REGION = Regions.KOREA;

async function crawlAccounts() {
    await db.connect();

    const tiers: Tiers[] = [Tiers.SILVER, Tiers.GOLD, Tiers.PLATINUM, Tiers.DIAMOND,];
    const divisions: Divisions[] = [Divisions.I, Divisions.II, Divisions.III, Divisions.IV,];

    for (const t of tiers) {
        for (const d of divisions) {
            try {
                const res = await api.League.exp(Queues.RANKED_SOLO_5x5, t, d, REGION) as any;
                const arr = res.response as AccountDto[];
                console.log(t, d, arr.length);
                const q = `insert into accounts (summoner_name, account_id, json) values ($1, $2, $3)`;
                for (const a of arr) {
                    db.query(q, [a.summonerName, '', JSON.stringify(a)], (err, res) => {
                        if (err || res.rowCount === 0) console.error('failed to insert', err, a);
                    });
                }
            } catch (e) {
                console.error(t, d, e);
            }
        }
    }

    console.log('this may be hung up even though it had been finished, you need to choose when to terminate');
}

async function crawlAccountIds() {
    await db.connect();

    type Task = {
        pk: number;
        summonerName: string;
    };

    const q = async.queue(async ({pk, summonerName}: Task, cb) => {
        try {
            const res = await api.Summoner.getByName(summonerName, REGION) as any;
            const accountId = res.response.accountId;
            console.log('update', pk, summonerName, accountId);
            db.query(`update accounts set account_id = $1 where pk = $2`, [accountId, pk], (err, res) => {
                if (err || res.rowCount === 0) console.error('failed to update', err, summonerName, accountId, pk);
                else cb();
            });
        } catch (e) {
            console.error(e);
            cb(e);
        }
    }, 10);

    while (1) {
        try {
            const res = await db.query(`select summoner_name, pk from accounts where account_id = '' limit 100`);
            if (res.rowCount === 0) {
                console.log('filling up account ids finished');
                await q.drain();
                break;
            }
            for (const r of res.rows) {
                q.push({
                    pk: r['pk'],
                    summonerName: r['summoner_name'],
                });
            }
            await q.drain();
        } catch (e) {
            console.error(e);
            break;
        }
    }

    console.log('this may be hung up even though it had been finished, you need to choose when to terminate');
}

async function crawlMatchList() {
    await db.connect();

    type Task = {
        accountId: string;
    };

    const q = async.queue(async ({accountId}: Task, cb) => {
        try {
            const res = await api.Match.list(accountId, REGION) as any;
            const list = res.response.matches as { gameId: number }[];
            console.log('get', list.length, 'from', accountId);

            const valuesName: string[] = [];
            const values: number[] = [];
            for (let i = 0; i < list.length; ++i) {
                const l = list[i];
                valuesName.push('($' + (i + 1) + ')');
                values.push(l.gameId);
            }
            db.query(`insert into matches (game_id) values ${valuesName.join(',')} on conflict (game_id) do nothing`, values, (err, res) => {
                if (err) {
                    if (err.message.indexOf('duplicate') !== -1) return;
                    else console.error('failed to insert', err, accountId);
                }
            });
            cb();
        } catch (e) {
            console.error(e);
            cb();
        }
    }, 10);

    try {
        const res = await db.query(`select account_id from accounts where account_id != ''`);
        if (res.rowCount === 0) {
            console.log('seems nothing left to work from db');
        }
        console.log('found', res.rowCount);
        for (const r of res.rows) {
            q.push({accountId: (r['account_id'] as string).trim()})
        }
    } catch (e) {
        console.error(e);
    }

    await q.drain();
}

async function crawlMatches() {
    await db.connect();

    type Task = {
        gameId: number;
    };

    const q = async.queue(async ({gameId}: Task, cb) => {
        try {
            const res = await api.Match.get(gameId, REGION) as any;
            const match = res.response;
            const gameVersion = match.gameVersion;
            console.log('get', gameId);
            db.query(`update matches set game_version = $1, json = $2 where game_id = $3`, [gameVersion, JSON.stringify(match), gameId], (err, res) => {
                if (err) console.error(err);
                cb();
            });
        } catch (e) {
            console.error(e);
            cb();
        }
    }, parseInt(process.env.THREAD_NUM) || 10);

    while (1) {
        try {
            const res = await db.query(`select game_id from matches where game_version is null limit 100`);
            if (res.rowCount === 0) {
                console.log('seems nothing left to work from db');
                break;
            }
            console.log('found', res.rowCount);
            for (const r of res.rows) {
                q.push({gameId: r['game_id']});
            }
        } catch (e) {
            console.error(e);
        }
        await q.drain();
    }

    await q.drain();
}

// crawlAccounts();
// crawlAccountIds();
// crawlMatchList();
crawlMatches();