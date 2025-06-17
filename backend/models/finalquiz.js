const { DataTypes } = require('sequelize');
const sequelize = require('../DataBase/ininttable');

const UserQuizScore = sequelize.define('final_quiz_scores', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  course_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  quiz_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  score: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      min: 0,
      max: 100,
    },
  },
  created_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  updated_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
}, {
  tableName: 'final_quiz_scores',
  timestamps: false,
  indexes: [
    {
      unique: true,
      fields: ['user_id', 'quiz_id'],
    },
  ],
});

module.exports = UserQuizScore;
