module.exports = (sequelize, DataTypes) => {
    return sequelize.define('userkeyword', {
        name: {
            type: DataTypes.STRING(15),
            allowNull: false,
            unique: true
        }
    })
}