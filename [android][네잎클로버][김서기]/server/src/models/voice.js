module.exports = (sequelize, DataTypes) => {
    return sequelize.define('voice', {
        createdAt: {
            type: DataTypes.STRING(20),
            allowNull: false,
        },
        file_name: {
            type: DataTypes.STRING(100),
            allowNull: false,
        },
        file_path: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
        phoneNumber: {
            type: DataTypes.STRING(100),
            allowNull: false,
        },
        sch_t: {
            type: DataTypes.STRING(50),
            allowNull: true,
        },
        sch_d: {
            type: DataTypes.STRING(50),
            allowNull: true,
        },
        sch_p: {
            type: DataTypes.STRING(50),
            allowNull: true,
        },
        summary: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        script: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        star: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
            allowNull: false

        }
    }, {
        timestamps: true
    });
}