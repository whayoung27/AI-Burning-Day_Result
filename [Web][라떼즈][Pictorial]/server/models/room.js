module.exports = (sequelize, DataTypes) => {
    return sequelize.define('room', {
        code: {
            type: DataTypes.STRING(20),
            allowNull: false,
            unique: true,
        },
        round: {
            type: DataTypes.INTEGER.UNSIGNED,
            allowNull: true,
            defaultValue: 2,
        },
        time: {
            type: DataTypes.INTEGER.UNSIGNED,
            allowNull: true,
            defaultValue: 3,
        },
        gameStart: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false,
        }
    }, {
        timestamps: false,
    });
};