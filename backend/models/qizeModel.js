const { DataTypes } = require('sequelize');
const sequelize = require('../DataBase/ininttable');

const Quiz = sequelize.define('quiz', {
  quiz_id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  module_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  course_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  question: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  options: {
    type: DataTypes.ARRAY(DataTypes.TEXT), // PostgreSQL only
    allowNull: false,
  },
  correct: {
    type: DataTypes.INTEGER,
    allowNull: false,
    comment: 'Index of the correct option in the options array',
  },
  created_by: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  created_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  }
}, {
  tableName: 'quizzes',
  timestamps: false,
});

module.exports = Quiz;
