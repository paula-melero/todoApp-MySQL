const mongoose = require("mongoose");
const Joi = require("joi");
const sequelize = require("../startup/db");
const Sequelize = require("sequelize");
const { User } = require("../models/users");

const Task = sequelize.define("task", {
  title: {
    type: Sequelize.String(30),
    allowNull: false,
    validate: { min: 3 }
  },
  description: {
    type: Sequelize.STRING(999),
    allowNull: false,
    validate: { min: 6 }
  },
  date: {
    type: Sequelize.DATE,
    defaultValue: DataTypes.NOW
  },
  status: {
    type: Sequelize.STRING(6),
    defaultValue: "to do",
    validate: {
      isIn: [["to do", "done"]]
    }
  },
  createdBy: {
    type: Sequelize.INTEGER,
    allowNull: false
  }
});
// //define model relationships
Task.belongsTo(User, { foreignKey: "createdBy", as: "id" });

//INPUT VALIDATION FUNCTION
function validateTask(task) {
  const schema = {
    title: Joi.string()
      .min(3)
      .max(30)
      .required(),
    description: Joi.string()
      .min(3)
      .max(255)
  };

  return Joi.validate(task, schema);
}

exports.Task = Task;
exports.validateTask = validateTask;
exports.taskSchema = taskSchema;
