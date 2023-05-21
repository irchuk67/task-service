const cron = require("node-cron");
const Task = require('../models/Task');

Date.prototype.addHours = function(h) {
    this.setTime(this.getTime() + (h*60*60*1000));
    return this;
}

Date.prototype.addMonths = function(m) {
    this.setMonth(this.getMonth() + m);
    return this;
}

cron.schedule("0 */5 * * * *",async () => {
    console.log(new Date())
    const tasks = await Task.find({needToRepeat: true, isReady: true});
    console.log(tasks)

    tasks.forEach(
        task => {
            const periodSplit = task.periodOfRepeat.split(' ');
            const period = periodSplit[0];
            const periodMeasure = periodSplit[1];
            let date = task.updateDateTime;
            switch (periodMeasure){
                case 'hour':
                    date.addHours(period);
                    break;
                case 'day':
                    date.addHours(period*24);
                    break;
                case 'week':
                    date.addHours(period*7*24);
                    break;
                case 'month':
                    date.addMonths(period)
                    break;
                case 'year':
                    date.addMonths(period*12)
                    break;
            }
            let currentDate = new Date();
            if(date <= currentDate){
                task.isReady = false;
                task.save()
            }
        }
    )


})

