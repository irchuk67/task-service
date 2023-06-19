const Task = require('../models/Task')
const {deleteTask, updateTask, fetchTasks, fetchTaskById, createTask} = require("../services/TaskService");
const mockingoose = require("mockingoose");
const {changeStatus, getDailyTasks} = require("../services/taskService");

describe('Task management tests', () => {
    beforeAll(() => {
        mockingoose(Task).toReturn([
            {
                _id: '645e419604d7f6896bf9863a',
                title: "prescription",
                startDate: "2012-04-20T18:25:43.511+00:00",
                createdBy: "2",
                assigneeId: "1"
            },
            {
                _id: '645e419604d7f6896bf9863n',
                title: "prescription2",
                startDate: "2012-04-20T18:25:43.511+00:00",
                createdBy: "2",
                assigneeId: "1"
            }
        ], 'find')
            .toReturn({
                    _id: '645e419604d7f6896bf9863a',
                    title: "prescription",
                    startDate: "2012-04-20T18:25:43.511+00:00",
                    createdBy: "2",
                    assigneeId: "1"
                }, "findOne")
            .toReturn({
                _id: '645e419604d7f6896bf9863a',
                title: "prescription",
                startDate: "2012-04-20T18:25:43.511+00:00",
                createdBy: "2",
                assigneeId: "1"
            }, "deleteOne")
            .toReturn({
                _id: '645e419604d7f6896bf9863a',
                title: "prescription456",
                startDate: "2012-04-20T18:25:43.511+00:00",
                createdBy: "2",
                assigneeId: "1"
            }, "save")
            .toReturn({
                _id: '645e419604d7f6896bf9863a',
                title: "prescription456",
                startDate: "2012-04-20T18:25:43.511+00:00",
                createdBy: "2",
                assigneeId: "1"
            }, "save")

    });

    afterAll(() => {
        mockingoose.resetAll();
    })

    describe('fetch all tasks',  () => {
        it('user role creator', async() => {
            const result = await fetchTasks('creator', '2','1')
            expect(result).toBeDefined();
            expect(result[0].createdBy).toBe('2');
        });
        it('user role assignee', async() => {
            const result = await fetchTasks('assignee', '1')
            expect(result).toBeDefined();
            expect(result[0].createdBy).toBe('2');
        });
    });

    it('fetch task by id', async () => {
        const result = await fetchTaskById('645e419604d7f6896bf9863a');
        expect(result).not.toBeUndefined();
        expect(result.createdBy).toBe("2")
    })

    it('delete task by id', async () => {
        const result = await deleteTask('645e419604d7f6896bf9863a');
        expect(result).not.toBeFalsy();
    })

    it('update task by id', async () => {
        const updated = {
            _id: '645e419604d7f6896bf9863a',
            title: "prescription456",
            startDate: "2012-04-20T18:25:43.511+00:00",
            createdBy: "2",
            assigneeId: "1"
        }
        const result = await updateTask('645e419604d7f6896bf9863a', updated);
        console.log(result);
        expect(result.title).toBe(updated.title)
    })

    it('create task', async () => {
        const toCreate = {
            _id: '645e419604d7f6896bf9863a',
            title: "prescription456",
            startDate: "2012-04-20T18:25:43.511+00:00",
            createdBy: "2",
            assigneeId: "1"
        }
        const result = await createTask(toCreate, '2');
        expect(result.title).toBe(toCreate.title)
    })

    it('change task status', async () => {
           const result = await changeStatus('645e419604d7f6896bf9863a');
        expect(result.isReady).toBeFalsy()
    })

    it('daily task get', async () => {
        const result = await getDailyTasks('1');
        expect(result[0].startDate < new Date()).toBeTruthy()
    })
})