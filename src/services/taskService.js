const mongoose = require('mongoose');
const {NOT_FOUND, OK} = require("../constants/HTTPCodes");
const Task = mongoose.model('Task');

async function fetchTasks(role, userId, assigneeId){
    let filter;
    if (role === "creator" && assigneeId){
        filter = {createdBy: userId, assignee: assigneeId}
    }
    else if(role === "creator"){
        filter = {createdBy: userId}
    }
    else if(role === "assignee"){
        filter = {assignee: userId}
    }

    const tasks = await Task.find(filter);
    if (!tasks) {
        return ;
    } else {
        return tasks.map(task => {
            return {
                id: task._id,
                title: task.title,
                description: task.description,
                startDate: task.startDate,
                endDate: task.endDate,
                needToRepeat: task.needToRepeat,
                periodOfRepeat: task.periodOfRepeat,
                createdBy: task.createdBy,
                assignee: task.assignee,
                isReady: task.isReady,
                neededInstruments: task.neededInstruments
            }
        })
    }
}

function fetchTaskById(id){
    return Task.findById(id)
}

function deleteTask(id){
    return Task.findById(id).then(response => {
        console.log(response)
        if (!response) return null;
        else {
            return Task.deleteOne(response)
                .catch(err => console.log(err))
        }
    })
}

function createTask(newTask, userId){
    const taskToCreate = new Task({
        title: newTask.title,
        description: newTask.description,
        startDate: newTask.startDate,
        endDate: newTask.endDate,
        needToRepeat: newTask.needToRepeat,
        periodOfRepeat: newTask.periodOfRepeat,
        createdBy: userId,
        assignee: newTask.assignee,
        isReady: newTask.isReady,
        neededInstruments: newTask.neededInstruments
    })
    return taskToCreate.save()
}

function updateTask(id, updatedTask) {
    return Task.findById(id)
        .then(task => {
            if (! task) {
                return null
            }
             task.title = updatedTask.title;
             task.description = updatedTask.description;
             task.startDate = updatedTask.startDate;
             task.endDate = updatedTask.endDate ;
             task.needToRepeat = updatedTask.needToRepeat ;
             task.periodOfRepeat = updatedTask.periodOfRepeat ;
             task.assignee = updatedTask.assignee ;
             task.isReady = updatedTask.isReady ;
             task.neededInstruments = updatedTask.neededInstruments
            return  task.save()
        })
}

async function changeStatus(taskId){
    const TaskToMark = await Task.findById(taskId);
    console.log(TaskToMark)
    TaskToMark.isReady = !TaskToMark.isReady;
    TaskToMark.updateDateTime = new Date();
    console.log(TaskToMark)
    return TaskToMark.save();
}

async function getDailyTasks(assigneeId){
    const currentDate = new Date();
    const tasks = await Task.find({
        assignee: assigneeId,
        startDate: {
            $lte: currentDate
        },
        endDate: {
            $gte: currentDate
        }
    });
    return tasks

}

module.exports = {
    updateTask,
    fetchTasks,
    fetchTaskById,
    deleteTask,
    createTask,
    changeStatus,
    getDailyTasks
}