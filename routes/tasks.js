const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const asyncMiddleware = require("../middleware/async");
const validateParams = require("../middleware/validate");
const { Task, validateTask } = require("../models/task");

//GET ALL TASKS FOR AUTH USER
router.get(
  "/",
  auth,
  asyncMiddleware(async (req, res, next) => {
    const { pageSize, page } = req.query;
    const offset = (page - 1) * pageSize;
    const limit = +pageSize;

    const tasks = await Task.findAll({
      offset: offset,
      limit: limit,
      where: { userId: req.user.id },
      order: [["updatedAt", "DESC"]]
    });
    res.status(200).json(tasks);
  })
);

//GET ONE TASK
router.get(
  "/:id",
  auth,
  validateParams,
  asyncMiddleware(async (req, res) => {
    const task = await Task.findOne({
      where: {
        id: req.params.id,
        userId: req.user.id
      }
    });

    if (!task)
      return res
        .status(404)
        .json({ message: "Task with the given ID was not found" });
    res.status(200).json(task);
  })
);

//CREATE TASK FOR AUTH USER
router.post(
  "/",
  auth,
  asyncMiddleware(async (req, res) => {
    const { error } = validateTask(req.body);

    if (error)
      return res.status(400).json({
        statusCode: 400,
        errorCode: error.details[0].path + error.name,
        message: error.details[0].message
      });

    const { title, description } = req.body;
    const result = await Task.create({
      title,
      description,
      userId: req.user.id
    });

    res.status(200).json(result);
  })
);

//UPDATE TASK
router.put(
  "/:id",
  auth,
  validateParams,
  asyncMiddleware(async (req, res) => {
    const { error } = validateTask(req.body);

    if (error) return res.status(400).json(error.details[0].message);

    const { title, description, status } = req.body;

    const result = await Task.update(
      {
        title: title,
        description: description,
        status: status
      },
      {
        where: {
          id: req.params.id,
          userId: req.user.id
        }
      }
    );

    if (result[0] === 0)
      return res
        .status(404)
        .json({ message: "Task with the given ID was not found" });

    res.status(200).json({ message: "Successfully updated task!" });
  })
);

// //DELETE TASK
router.delete(
  "/:id",
  auth,
  validateParams,
  asyncMiddleware(async (req, res) => {
    const result = await Task.destroy({
      where: {
        id: req.params.id,
        userId: req.user.id
      }
    });

    if (!result)
      return res
        .status(404)
        .json({ message: "Task with the given ID was not found" });

    res.status(200).json({ message: "Successfully deleted task!" });
  })
);

module.exports = router;
