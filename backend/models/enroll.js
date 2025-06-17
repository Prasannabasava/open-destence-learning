const { DataTypes } = require('sequelize');
const sequelize = require('../DataBase/ininttable');

const Enroll = sequelize.define('enroll', {
  enroll_id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'users',
      key: 'user_id'
    }
  },
  course_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'courses',
      key: 'course_id'
    }
  }
}, {
  tableName: 'enrolls',
  timestamps: true, // This will add createdAt and updatedAt automatically
  underscored: true // This converts createdAt → created_at, updatedAt → updated_at in the DB
});

module.exports = Enroll;
