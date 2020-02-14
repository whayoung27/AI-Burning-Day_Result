module.exports = (sequelize, DataTypes) => {
    return sequelize.define('count', {
        name:{
            type: DataTypes.STRING(5),
            allowNULL: false,
            unique: false,
        },
        int:{
            type: DataTypes.INTEGER(7),
            allowNULL: false,
            unique: false,
        },
    }, {
        timestamp: false,
        paranoid: true,
        underscored: true,
    });
};