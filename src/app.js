// this file will be used for testing and everything will be exported to main index.js file where routes will be listened

const express = require('express');
require('./db/mongoose');

//Routers 
const userRouter = require('./router/user');
const taskRouter = require('./router/task');


// express port config
const app = express();


app.use(express.json());
app.use(userRouter);
app.use(taskRouter);

module.exports = app;