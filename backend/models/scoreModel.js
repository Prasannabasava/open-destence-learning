const { Model, DataTypes } = require("sequelize");
const sequelize = require("../DataBase/ininttable"); // Adjust the path as needed

class Score extends Model {}

Score.init(
  {
    score_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    user_id: {
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
        max: 100, // Adjust as needed
      },
    },
    updated_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize,
    modelName: "Score",
    tableName: "scores",
    timestamps: false, // You can set true if you want Sequelize to manage createdAt/updatedAt
    indexes: [
      {
        unique: true,
        fields: ["user_id", "quiz_id"],
      },
    ],
  }
);

module.exports = Score;
