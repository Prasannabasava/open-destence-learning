const { DataTypes } = require('sequelize');
const sequelize = require('../DataBase/ininttable'); // adjust the path to your sequelize instance

const UserCourseProgress = sequelize.define('UserCourseProgress', {
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
  module_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  topic_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  video_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  progress: {
    type: DataTypes.FLOAT, // e.g., percentage like 0.0 to 100.0
    allowNull: false,
  },
  updated_at: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
  },
}, {
  tableName: 'user_courses_progress',
  timestamps: false,
});

module.exports = UserCourseProgress;
