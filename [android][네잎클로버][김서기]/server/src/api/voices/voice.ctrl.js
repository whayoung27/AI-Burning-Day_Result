const path = require('path');

const { Op, Voices, Tags, VoiceTags } = require('../../models')
const sttNaver = require('./csr');
const keywords = require('./summaryInfo')

const showList = (req, res) => {

    if (req.query.today != "true" && req.query.today != "false" && req.query.today) res.status(400).send({ error: "today 파라메터가 true/false가 아닙니다." })
    else if (req.query.star != "true" && req.query.star != "false" && req.query.star) res.status(400).send({ error: "star 파라메터가 true/false가 아닙니다." })
    else if (req.query.today == "true") {
        var date = new Date();
        var yyyymmdd = date.getFullYear() + '.' + (date.getMonth() + 1) + '.' + date.getDate();

        Voices.findAll({
            attributes: ['id', 'createdAt', 'phoneNumber', 'file_path'],
            where: {
                createdAt: { [Op.startsWith]: yyyymmdd }
            },
            include: [{
                model: Tags,
                attributes: ['name'],
                through: {
                    attributes: ['importance'],
                    where: { importance: { [Op.lt]: 4 } }
                }
            }],
            offset: 0,
            limit: 10,
            order: [['createdAt', 'DESC']],
        })
            .then((result) => {
                res.json(JSON.parse(JSON.stringify(result)))
            })
            .catch(err => {
                res.status(400).send(err.message)
            })
    }
    else if (req.query.star == "true") {
        Voices.findAll({
            attributes: ['id', 'createdAt', 'phoneNumber', 'file_path', 'star'],
            where: {
                star: { [Op.not]: false }
            },
            include: [{
                model: Tags,
                attributes: ['name'],
                through: {
                    attributes: ['importance'],
                    where: { importance: { [Op.lt]: 4 } }
                }
            }],
            offset: 0,
            limit: 10,
            order: [['createdAt', 'DESC']],
        })
            .then((result) => {
                res.json(JSON.parse(JSON.stringify(result)))
            })
            .catch(err => {
                res.status(400).send(err.message)
            })
    }
    else { //default
        Voices.findAll({
            attributes: ['id', 'createdAt', 'phoneNumber', 'file_path'],
            include: [{
                model: Tags,
                attributes: ['name'],
                through: {
                    attributes: ['importance'],
                    where: { importance: { [Op.lt]: 4 } }
                }
            }],
            offset: 0,
            limit: 10,
            order: [['createdAt', 'DESC']],
        })
            .then((result) => {
                res.json(JSON.parse(JSON.stringify(result)))
            })
            .catch(err => {
                res.status(400).send(err.message)
            })
    }

}

const showInfo = (req, res) => {
    // TODO: 찾는 id가 없을 경우
    Voices.findOne({
        where: {
            id: req.params.id
        },
        include: [{
            model: Tags,
            attributes: ['name'],
            through: {
                attributes: ['importance'],
            }
        }],
    })
        .then((result) => {
            if (!result) res.status(404).send({ error: '해당되는 id를 찾을 수 없습니다' })
            else res.json(JSON.parse(JSON.stringify(result)))
        })
        .catch(err => {
            res.status(400).send(err.message)
        })
}

const create = (req, res) => {
    if (!req.file || !req.body.createdAt || !req.body.phone || !req.body.file_path) res.status(400).send({ error: 'field가 빠졌습니다 phone, createdAt, voicefile, filePath 정보를 확인하십시오' });
    else {
        const extCheck = ['.m4a', '.mp3', '.aac', '.ac3', '.ogg', '.flac', '.wav']
        var file = req.file;
        var date = new Date();
        var extension = path.extname(file.originalname);

        const check = extCheck.find(ext => ext == extension);
        if (!check) res.status(400).send({ error: '잘못된 파일 형식입니다' });
        else {
            var basename = path.basename(file.originalname, extension)// + '_' + date.getFullYear() + date.getMonth() + date.getDate();

            Voices.create({
                createdAt: req.body.createdAt,
                file_name: basename + extension,
                file_path: req.body.file_path,
                phoneNumber: req.body.phone,
            })
                .then((result) => {
                    sttNaver(result.id, 'src/uploads/', basename + extension);

                    // python test
                    // var script = '펜션 예약 하려 하는데 1박에 얼마인가요 기분 하루 8만원이야 바베큐장은 이용하면 얼마예요 1인에 2만원씩 추가 하시면 됩니다 이번주 토요일에 1박 하고 싶은데 예약 할까요 네 가능해요 퇴실 시간은 언제나 오전 11시에요 결제는 삼성 페이 되나요 네 제자들께야 '
                    // keywords(result.id, script)

                    res.status(202).json(result) //서버가 요청을 접수했지만 아직 처리하지 않았다.
                })
                .catch(err => {
                    console.log('Failed - add data')
                    res.status(400).send(err.message)
                })
        }
    }

}

const bookmark = (req, res) => {
    // TODO: 찾는 id가 없을 경우
    Voices.update({ star: true }, {
        where: {
            id: req.params.id
        },
    })
        .then(() => {
            res.sendStatus(204)//No Content 서버에서 성공했는데 응답할 바디가 없는 경우
        })
        .catch(err => {
            res.status(400).send(err.message)
        })
}

const undoBookmark = (req, res) => {
    // TODO: 찾는 id가 없을 경우
    Voices.update({ star: false }, {
        where: {
            id: req.params.id
        },
    })
        .then(() => {
            res.sendStatus(204)//No Content 서버에서 성공했는데 응답할 바디가 없는 경우
        })
        .catch(err => {
            res.status(400).send(err.message)
        })
}


module.exports = {
    showList,
    showInfo,
    create,
    bookmark,
    undoBookmark
}