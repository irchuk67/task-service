const express = require('express');
const mongoose = require('mongoose');
const {deleteTask, updateTask, fetchTasks, fetchTaskById, createTask} = require("../../services/TaskService");
const {NO_CONTENT, OK, NOT_FOUND, CREATED} = require("../../constants/HTTPCodes");
const router = express.Router();


router.get('/', async (request, response) => {
    const tasks = await fetchTasks();
    if(!tasks){
        response.status(NOT_FOUND).send('no tasks found')
    }else{
        const formattedTasks = tasks.map(task =>{
            return {
                id: task._id,
                text: task.text,
                startDate: task.startDate,
                endDate: task.endDate,
                needToRepeat: task.needToRepeat,
                periodOfRepeat: task.periodOfRepeat,
                assignedBy: task.assignedBy,
                performedBy: task.performedBy,
                isReady: task.isReady,
                neededInstruments: task.neededInstruments
            }
        })
        response.status(OK).json(formattedTasks)
    }
});

router.get(`/:taskId/`, async (request, response) => {
    const task = await fetchTaskById(request.params.taskId);
    if (!task) {
        response.status(NOT_FOUND).send('no task found')
    }else{
        const taskOut = {
            id: task._id,
            text: task.text,
            startDate: task.startDate,
            endDate: task.endDate,
            needToRepeat: task.needToRepeat,
            periodOfRepeat: task.periodOfRepeat,
            assignedBy: task.assignedBy,
            performedBy: task.performedBy,
            isReady: task.isReady,
            neededInstruments: task.neededInstruments
        }
        response.status(OK).json(taskOut)
    }
})

router.delete(`/:taskId`, async (request, response) => {
    const isDeleted = await deleteTask(request.params.taskId);
    console.log(isDeleted)
    if (!isDeleted){
        response.status(NOT_FOUND).send('no task found')
    }else{
        response.status(NO_CONTENT).send('deleted successfully')
    }
})

router.use(express.json());

router.put('/:taskId', async (request, response) => {
    let updatedTask = await updateTask(request.params.taskId, request.body)
    if (updatedTask === null){
        response.status(NOT_FOUND).send('no Task found')
    }else{
        response.status(OK).json(updatedTask)
    }
})

router.post('/', async (request, response) => {
    const newTask = await createTask(request.body);
    if (!newTask) {
        response.status(NOT_FOUND).send('no Task created')
    }else{
        const TaskOut = {
            id: newTask._id,
            text: newTask.text,
            startDate: newTask.startDate,
            endDate: newTask.endDate,
            needToRepeat: newTask.needToRepeat,
            periodOfRepeat: newTask.periodOfRepeat,
            assignedBy: newTask.assignedBy,
            performedBy: newTask.performedBy,
            isReady: newTask.isReady,
            neededInstruments: newTask.neededInstruments
        }
        response.status(CREATED).json(TaskOut)
    }
});


module.exports = router;
