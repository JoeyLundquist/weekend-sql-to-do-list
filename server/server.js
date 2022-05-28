//Import express
const express = require('express');
//Set up express app
const app = express();

//Importing my router
const taskListRouter = require('./routes/todo.router')

//Import body-parser to be able to read objects being sent to server
const bodyParser = require('body-parser');

//Set PORT to be dynamic for host site or on 5000 for localhost
const PORT = process.env.PORT || 5000;

//Set up body parser
app.use(bodyParser.urlencoded({extended: true}));

//Set up files to be sent to client
app.use(express.static('server/public'));

//Setting up my route for task-list
app.use('/todo-list', taskListRouter)

//Set up the listener for HTTP requests
app.listen(PORT, () => {
    console.log('listening on PORT', PORT)
})