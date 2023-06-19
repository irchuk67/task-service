const express = require('express');
const cors = require("cors");
const mongoose = require('mongoose');
const swaggerUi = require("swagger-ui-express");
const swaggerFile = require('../swagger_output.json');
const dotenv = require('dotenv');

dotenv.config();
const app = express();
mongoose.connect('mongodb+srv://receipts:receipts@cluster0.kkfjbu2.mongodb.net/tasks?retryWrites=true&w=majority'/*process.env.MONGODB_URI_TASKS || 'mongodb://tasks:tasks@localhost:27018/tasks'*/);
const PORT = process.env.PORT || 8000;


app.use(cors({
    origin: '*'
}));

require('./models/Task');
app.use(require('./routes'))
app.use('/doc', swaggerUi.serve, swaggerUi.setup(swaggerFile))

app.use((err, req, res, next) => {
    console.error(err.stack)
    res.status(500).send('Something broke!')
})

require('./services/taskUpdateScheduleJob')

app.listen(PORT, (error) => {
    if(!error) {
        console.log(`Server side is running on port ${PORT}`)
    } else {
        console.log("Error: ", error)
    }
})

module.exports = app;