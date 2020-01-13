const mongoose = require('mongoose');
const Joi = require('joi');

//Define task document's schema types
const taskSchema = new mongoose.Schema({
    title: { 
        type: String, 
        required: true, 
        minlength: 3, 
        maxlength: 30 
    },
    description: { 
        type: String, 
        minlength: 3,
        maxlength: 255
    },
    date: { type: Date, default: Date.now },
    status: {
        type: String, 
        enum: ['to do', 'done'], 
        default: 'to do'
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
});

//Compile schema into a task class
const Task = mongoose.model('Task', taskSchema);

//INPUT VALIDATION FUNCTION
function validateTask(task) {
    const schema = {
        title: Joi.string().min(3).max(30).required(),
        description: Joi.string().min(3).max(255)
    };

    return Joi.validate(task, schema);
}

exports.Task = Task;
exports.validateTask = validateTask;
exports.taskSchema = taskSchema;