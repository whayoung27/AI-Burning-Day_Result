module.exports = (sequelize, DataTypes) => {
    return sequelize.define('tag', {
        name: {
            type: DataTypes.STRING(15),
            allowNull: false,
            unique: true,
        }
    })
}