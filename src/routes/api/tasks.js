const express = require('express');
const mongoose = require('mongoose');
const {deleteTask, updateTask, fetchTasks, fetchTaskById, createTask} = require("../../services/taskService");
const {NO_CONTENT, OK, NOT_FOUND, CREATED} = require("../../constants/HTTPCodes");
const verifyToken = require('../../middleware/tokenValidator')
const {validateTask, taskValidator} = require("../../validator/task");
const {changeStatus, getDailyTasks} = require("../../services/taskService");
const router = express.Router();

router.get('/:role/:userId', verifyToken, async (request, response) => {
    if (!request.user) {
        return;
    }
    const tasks = await fetchTasks(request.params.role, request.params.userId, request.query.assigneeId);
    if (!tasks) {
        response.status(NOT_FOUND).send('no tasks found')
    } else {
        response.status(OK).json(tasks)
    }
});

router.patch('/:taskId', verifyToken, async (request, response) => {
    if(!request.user){
        return;
    }
    const updated = await changeStatus(request.params.taskId).catch(err => {
        console.log(err)
        response.status(500)
    });
    response.status(200).send(updated)
})

router.get('/daily', verifyToken, async (request, response) => {
    if(!request.user){
        return;
    }
    const tasks = await getDailyTasks(request.user.userId);
    if(tasks.length <= 0){
        response.status(NOT_FOUND)
    }
    response.status(OK).json(tasks)
})

router.get(`/:taskId/`, verifyToken, async (request, response) => {
    if (!request.user) {
        return;
    }

    const task = await fetchTaskById(request.params.taskId);
    if (!task) {
        response.status(NOT_FOUND).send('no task found')
    } else {
        const taskOut = {
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
        response.status(OK).json(taskOut)
    }
})

router.delete(`/:taskId`, verifyToken, async (request, response) => {
    if (!request.user) {
        return;
    }

    const isDeleted = await deleteTask(request.params.taskId);
    if (!isDeleted) {
        response.status(NOT_FOUND).send('no task found')
    } else {
        response.status(NO_CONTENT).send('deleted successfully')
    }
})

router.use(express.json());

router.put('/:taskId', verifyToken, taskValidator('updateTask'), async (request, response) => {
    if (!request.user) {
        return;
    }
    if (!validateTask(request, response)) {
        return;
    }

    let updatedTask = await updateTask(request.params.taskId, request.body)
    if (updatedTask === null) {
        response.status(NOT_FOUND).send('no task found')
    } else {
        response.status(OK).json(updatedTask)
    }
})

router.post('/', verifyToken, taskValidator('createTask'), async (request, response) => {
    if (!request.user) {
        return;
    }
    if (!validateTask(request, response)) {
        return;
    }

    const newTask = await createTask(request.body, request.user.userId);
    if (!newTask) {
        response.status(NOT_FOUND).send('no Task created')
    } else {
        response.status(CREATED).json({id: newTask._id})
    }
});


module.exports = router;
