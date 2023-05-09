const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    startDate: {
        type: Date,
        required: true
    },
    endDate: {
        type: Date,
        required: true
    },
    needToRepeat: {
        type: Boolean,
        required: true
    },
    periodOfRepeat: {
        type: Number,
        required: false
    },
    createdBy: {
        type: String,
        required: true
    },
    assignee: {
        type: String,
        required: false
    },
    isReady: {
        type: Boolean,
        required: false,
        default: false
    },
    neededInstruments: {
        type: [String],
        required: false
    }
})

const Task = module.exports = mongoose.model("Task", taskSchema);
