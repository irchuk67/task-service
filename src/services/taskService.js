const mongoose = require('mongoose');
const Task = mongoose.model('Task');

function fetchTasks(){
    return Task.find({})
}

function fetchTaskById(id){
    return Task.findById(id)
}

function deleteTask(id){
    console.log(id)
    return Task.findById(id).then(response => {
        console.log(response)
        if (!response) return null;
        else {
            return Task.deleteOne(response)
                .catch(err => console.log(err))
        }
    })
}

function createTask(newTask){
    const taskToCreate = new Task({
        text: newTask.text,
        startDate: newTask.startDate,
        endDate: newTask.endDate,
        needToRepeat: newTask.needToRepeat,
        periodOfRepeat: newTask.periodOfRepeat,
        assignedBy: newTask.assignedBy,
        performedBy: newTask.performedBy,
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
             task.text = updatedTask.text;
             task.startDate = updatedTask.startDate;
             task.endDate = updatedTask.endDate ;
             task.needToRepeat = updatedTask.needToRepeat ;
             task.periodOfRepeat = updatedTask.periodOfRepeat ;
             task.assignedBy = updatedTask.assignedBy ;
             task.performedBy = updatedTask.performedBy ;
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