const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db'); 

const User = sequelize.define('User', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    username: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
            isEmail: true
        }
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    },
    avatar: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: null
    },
    // FIELD 'bio' DIHAPUS DARI SINI
    readingHistory: {
        type: DataTypes.JSONB,
        defaultValue: [],
        allowNull: false
    },
    bookmarks: {
        type: DataTypes.JSONB,
        defaultValue: [],
        allowNull: false
    }
}, {
    tableName: 'users',
    timestamps: true // Ini menghasilkan field 'createdAt' dan 'updatedAt'
});

module.exports = User;