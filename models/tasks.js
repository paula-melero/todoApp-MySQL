const mongoose = require("mongoose");
const Joi = require("joi");
const sequelize = require("sequelize");
const { User } = require("../models/users");

const Task = sequelize.define("task", {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
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
    defaultValue: Sequelize.NOW
  },
  createdBy: {
    type: Sequelize.INTEGER,
    allowNull: false
  }
});
//define model relationships
Task.belongsTo(User, { foreignKey: "id", as: "createdBy" });

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
