module.exports = (sequelize, DataTypes) => {
    return sequelize.define('gameData', {
        imageName: {
            type: DataTypes.STRING(30),
            allowNull: false,
            unique: true,
        },
        isAuto: {
            type: DataTypes.BOOLEAN,
            allowNull: true,
        },
        answerAuto: {
            type: DataTypes.STRING(150),
            allowNull: true,
        },
        answerManu: {
            type: DataTypes.STRING(150),
            allowNull: true,
        },
        base64Img: {
            type: DataTypes.TEXT('long'),
            allowNull: false,
        }
    }, {
        timestamps: false,
    });
};