const Sequelize = require("sequelize");
const sequelize = require("../startup/db");
const Joi = require("joi");

//SCHEMA
const Task = sequelize.define("task", {
  title: {
    type: Sequelize.STRING,
    allowNull: false,
    validate: { min: 3, max: 30 }
  },
  description: {
    type: Sequelize.TEXT,
    validate: { min: 6, max: 255 }
  },
  status: {
    type: Sequelize.STRING,
    defaultValue: "to do",
    validate: {
      isIn: [["to do", "done"]]
    }
  }
});

//VALIDATION
const validateTask = task => {
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
};

exports.Task = Task;
exports.validateTask = validateTask;
