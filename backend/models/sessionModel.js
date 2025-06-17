const { DataTypes } = require('sequelize');
const sequelize = require('../DataBase/ininttable'); // Adjust the path as necessary

const Session = sequelize.define('session', {
    session_id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'users', // Name of the referenced table
            key: 'user_id'  // Key in the referenced table
        }
    },
    session_token: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    created_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW, // Automatically set to the current date
    },
    session_expires_at: {
        type: DataTypes.DATE,
        allowNull: false,
       
    },
}, {
    tableName: 'sessions',
    timestamps: false, // If the table doesn't have `createdAt` and `updatedAt` fields
});

module.exports = Session;
