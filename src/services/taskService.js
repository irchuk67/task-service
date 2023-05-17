const mongoose = require('mongoose');
const Task = mongoose.model('Task');

function fetchTasks(role, userId, assigneeId){
    console.log(role)
    let filter;
    if (role === "creator"){
        filter = {createdBy: userId, assignee: assigneeId}
    }
    else if(role === "assignee"){
        filter = {assignee: userId}
    }
    return Task.find(filter)
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

module.exports = {
    updateTask,
    fetchTasks,
    fetchTaskById,
    deleteTask,
    createTask
}