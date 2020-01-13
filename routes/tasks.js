const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const asyncMiddleware = require("../middleware/async");
const { Task, validateTask } = require("../models/tasks");

//GET ALL TASKS FOR AUTH USER
router.get(
  "/",
  auth,
  asyncMiddleware(async (req, res, next) => {
    const tasks = await Task.find({ createdBy: req.user._id })
      .select("-createdBy")
      .sort({ date: -1 })
      .skip((req.query.pageNumber - 1) * req.query.pageSize)
      .limit(parseInt(req.query.pageSize));

    res.status(200).json(tasks);
  })
);

//GET ONE TASK
router.get(
  "/:id",
  auth,
  asyncMiddleware(async (req, res) => {
    const task = await Task.findOne({
      _id: req.params.id,
      createdBy: req.user._id
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

    if (error) return res.status(400).json(error.details[0].message);

    //create object with req values
    const { title, description } = req.body;
    const task = new Task({ title, description, createdBy: req.user._id });

    //save to db

    const dbResult = await task.save();
    res.status(200).json(dbResult);
  })
);

//UPDATE TASK
router.put(
  "/:id",
  auth,
  asyncMiddleware(async (req, res) => {
    const { error } = validateTask(req.body);

    if (error) return res.status(400).json(error.details[0].message);

    const { title, description } = req.body;
    //if task does not exist but id is valid
    const foundId = await Task.findById(req.params.id);
    if (!foundId)
      return res
        .status(404)
        .json({ message: "Task with the given ID was not found" });

    const task = await Task.findOneAndUpdate(
      {
        _id: req.params.id,
        createdBy: req.user._id
      },
      {
        $set: { title, description }
      },
      { new: true }
    );

    //if task was not createdBy logged in user
    if (!task)
      return res
        .status(401)
        .json({ message: "Access denied. Cannot edit task with given ID." });

    res.status(200).json(task);
  })
);

//DELETE TASK
router.delete(
  "/:id",
  auth,
  asyncMiddleware(async (req, res) => {
    const foundId = await Task.findById(req.params.id);
    if (!foundId)
      return res
        .status(404)
        .json({ message: "Task with the given ID was not found" });

    const result = await Task.findOneAndDelete({
      _id: req.params.id,
      createdBy: req.user._id
    });

    if (!result)
      return res.status(401).json({
        message: "Access denied. Cannot delete task with given ID."
      });

    res.status(200).json(result);
  })
);

module.exports = router;
