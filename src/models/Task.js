const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
    text: String,
    startDate: Date,
    endDate: Date,
    needToRepeat: Boolean,
    periodOfRepeat: {
        type: Number,
        required: false
    },
    assignedBy: String,
    performedBy: String,
    isReady: Boolean,
    neededInstruments: [String]
})

const Task = module.exports = mongoose.model("Task", taskSchema);
