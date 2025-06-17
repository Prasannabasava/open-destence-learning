const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../DataBase/ininttable'); 

// Course Model
const Course = sequelize.define('Course', {
  course_id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  course_title: { type: DataTypes.STRING(255), allowNull: false },
  course_description: { type: DataTypes.TEXT, allowNull: false },
  course_duration: { type: DataTypes.INTEGER, allowNull: false },
  course_mode: { type: DataTypes.STRING(50), allowNull: false },
  course_tools: { type: DataTypes.STRING(255), allowNull: false },
  course_for: { type: DataTypes.STRING(255), allowNull: false },
  course_status: { type: DataTypes.STRING(50), allowNull: false, defaultValue: 'Draft' },
  course_type:{ type:DataTypes.STRING(50), allowNull:false},
  created_by: { type: DataTypes.INTEGER, allowNull: false },
  updated_by: { type: DataTypes.INTEGER, allowNull: false },
  course_image: { type: DataTypes.STRING(255), allowNull: true },
  created_at: { type: DataTypes.DATE, allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
  updated_at: { type: DataTypes.DATE, allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') }
}, { tableName: 'courses', timestamps: false });

// Module Model
const Module = sequelize.define('Module', {
  module_id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  course_id: { type: DataTypes.INTEGER, allowNull: false, references: { model: Course, key: 'course_id' }},
  module_title: { type: DataTypes.STRING(255), allowNull: false },
  module_order: { type: DataTypes.INTEGER, allowNull: false },
  created_at: { type: DataTypes.DATE, allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
  updated_at: { type: DataTypes.DATE, allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') }
}, { tableName: 'modules', timestamps: false });

// Topic Model
const Topic = sequelize.define('Topic', {
  topic_id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  module_id: { type: DataTypes.INTEGER, allowNull: false, references: { model: Module, key: 'module_id' }},
  topic_title: { type: DataTypes.STRING(255), allowNull: false },
  topic_order: { type: DataTypes.INTEGER, allowNull: false },
  created_at: { type: DataTypes.DATE, allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
  updated_at: { type: DataTypes.DATE, allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') }
}, { tableName: 'topics', timestamps: false });

// Video Model
const Video = sequelize.define('Video', {
  video_id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  topic_id: { type: DataTypes.INTEGER, allowNull: false, references: { model: Topic, key: 'topic_id' }},
  video_title: { type: DataTypes.STRING(255), allowNull: false },
  video_url: { type: DataTypes.STRING(255), allowNull: false },   // Use this to store filename or path
  video_duration: { type: DataTypes.INTEGER, allowNull: true },
  video_order: { type: DataTypes.INTEGER, allowNull: false },
  created_at: { type: DataTypes.DATE, allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
  updated_at: { type: DataTypes.DATE, allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') }
}, { tableName: 'videos', timestamps: false });

module.exports = {
  Course,
  Module,
  Topic,
  Video
};
