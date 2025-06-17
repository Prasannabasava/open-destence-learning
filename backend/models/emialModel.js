const { DataTypes } = require('sequelize');
const sequelize = require('../DataBase/ininttable');
const  User  = require('./userModel');

// Email Model (sp_emails)
const Emails = sequelize.define('emails', {
  emails_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: User,
      key: 'user_id',
    },
    onDelete: 'CASCADE', 
    onUpdate: 'CASCADE',
  },
  email_subject: {
    type: DataTypes.TEXT,
    allowNull: false,
    defaultValue: '',
  },
  email_content: {
    type: DataTypes.TEXT,
    allowNull: false,
    defaultValue: '',
  },
  email_received: {
    type: DataTypes.TEXT,
    allowNull: false,
    defaultValue: '',
  },
  email_status: {
    type: DataTypes.TEXT,
    allowNull: false,
    defaultValue: '',
  },
  email_date: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
  },
  email_priority: {
    type: DataTypes.TEXT,
    allowNull: false,
    defaultValue: '',
  },
  email_info: {
    type: DataTypes.TEXT,
    allowNull: false,
    defaultValue: '',
  },
  email_sender: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
}, {
  tableName: 'emails',
  timestamps: false,
});



module.exports =  Emails ;
