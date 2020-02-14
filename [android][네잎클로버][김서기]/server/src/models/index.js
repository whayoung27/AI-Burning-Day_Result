const path = require('path');
const Sequelize = require('sequelize');

const env = process.env.NODE_ENV || 'development';
const config = require(path.join(__dirname, '../../', 'config', 'config.json'))[env];

var db = {};

const sequel = new Sequelize(config.database, config.username, config.password, {
    host: config.host,
    dialect: config.dialect
})

db.sequelize = sequel;
db.Sequelize = Sequelize;
db.Op = Sequelize.Op;

db.Voices = require('./voice')(sequel, Sequelize);
db.Tags = require('./tag')(sequel, Sequelize);
db.UserKeywords = require('./userkeyword')(sequel, Sequelize);

db.VoiceTags = sequel.define('voiceTags', {
    importance: Sequelize.INTEGER(10)
})

db.Voices.belongsToMany(db.Tags, { through: db.VoiceTags })
db.Tags.belongsToMany(db.Voices, { through: db.VoiceTags })

module.exports = db;