module.exports = (sequelize, DataTypes) => {
    return sequelize.define('order', {
        user_id:{
            type: DataTypes.INTEGER(5),
            allowNULL: false,
            unique: false,
        },
        menu_id:{
            type: DataTypes.INTEGER(5),
            allowNULL: false,
            unique: false,
        },
        menu_count:{
            type: DataTypes.INTEGER(5),
            allowNULL: false,
            unique: false,
        },
    }, {
        timestamp: false,
        paranoid: true,
        underscored: true,
    });
};