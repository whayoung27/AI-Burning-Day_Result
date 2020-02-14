module.exports = (sequelize, DataTypes) => {
    return sequelize.define('complete', {
        user_id:{
            type: DataTypes.STRING(5),
            allowNULL: false,
            unique: false,
        },
        price:{
            type: DataTypes.INTEGER(7),
            allowNULL: false,
            unique: false,
        },
        menu:{
            type: DataTypes.TEXT,
            allowNULL: false,
            unique: false,
        }
    }, {
        timestamp: false,
        paranoid: true,
        underscored: true,
    });
};