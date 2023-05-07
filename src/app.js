const express = require('express');
const cors = require("cors");
const mongoose = require('mongoose');

const app = express();
mongoose.connect(process.env.MONGODB_URI || 'mongodb://tasks:tasks@localhost:27018/tasks');
const PORT = process.env.PORT || 8000;

app.use(cors({
    origin: '*'
}));

require('./models/Task');
app.use(require('./routes'))

app.listen(PORT, (error) => {
    if(!error) {
        console.log(`Server side is running on port ${PORT}`)
    } else {
        console.log("Error: ", error)
    }
})

module.exports = app;