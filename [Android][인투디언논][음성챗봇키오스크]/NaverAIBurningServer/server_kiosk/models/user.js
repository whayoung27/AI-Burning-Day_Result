module.exports = (sequelize, DataTypes) => {
    return sequelize.define('user', {
        name:{
            type: DataTypes.STRING(5),
            allowNULL: false,
            unique: false,
        },
    }, {
        timestamp: false,
        paranoid: true,
        underscored: true,
    });
};