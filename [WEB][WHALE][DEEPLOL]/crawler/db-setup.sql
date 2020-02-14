create table accounts
(
	pk serial
		constraint accounts_pk
			primary key,
	summoner_name char(32) not null,
	account_id char(60),
	json json
);

create table matches
(
	game_id bigint not null,
	game_version char(24),
	json json
);

create index matches__game_version_index
	on matches (game_version);

create unique index matches_game_id_uindex
	on matches (game_id);

alter table matches
	add constraint matches_pk
		primary key (game_id);



