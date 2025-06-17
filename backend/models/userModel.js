const { DataTypes } = require('sequelize');
const sequelize = require('../DataBase/ininttable'); // Assuming you have a configured Sequelize instance

const User = sequelize.define('user', {
    user_id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    user_role: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: 'user',
    },
    user_first_name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    user_middle_name: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    user_last_name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    user_login_email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
            isEmail: true, // Validates email format
        },
    },
    user_password: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            len: [8, 255], // Ensures password has a minimum length
        },
    },
    user_mobile: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            isNumeric: true, // Validates that the mobile number contains only digits
        },
    },
    otp:{
        type: DataTypes.TEXT,
        allowNull: true,
        defaultValue: '',
    },
    otp_expiry: {
        type: DataTypes.DATE,
        allowNull: true,
    },
    user_status: {
        type: DataTypes.BOOLEAN,
        allowNull : false,
        defaultValue: false,
    },
      image_mime_type: {
        type: DataTypes.STRING(50), // Stores MIME type, e.g., 'image/jpeg'
        allowNull: true,
      },
      image_size: {
        type: DataTypes.BIGINT, // Stores file size in bytes
        allowNull: true,
      },
      image_name: {
        type: DataTypes.STRING(255), // Stores original file name
        allowNull: true,
      },
}, {
    tableName: 'users',
    timestamps: false, // If the table doesn't have `createdAt` and `updatedAt` fields
});

module.exports = User;

