//Importing express
const express = require('express');
//Importing pool for DB communication
const pool = require('../module/pool');
//Setting router name
const taskListRouter = express.Router();

//Route to sort my rows by certain columns
taskListRouter.post('/sort/:sort', (req, res) => {
    let sortBy = req.params.sort;
    console.log('this is my params', sortBy)
    //Setting empty var for sqlQuery
    let sqlQuery;
    //Using a switch statement to check how we want to order our rows and setting 
    //sqlQuery to that receive the correct row order
    switch(sortBy){
        case 'category':
            sqlQuery = `
                SELECT * FROM to_do_list
                ORDER BY category ASC;
            `;
            break;
        case 'project':
            sqlQuery = `
            SELECT * FROM to_do_list
            ORDER BY project ASC;
        `;
            break;
         case 'priority':
            sqlQuery = `
            SELECT * FROM to_do_list
            ORDER BY priority ASC;
        `;
            break;
         case 'dueDate':
            sqlQuery = `
            SELECT * FROM to_do_list
            ORDER BY "dueDate" ASC;
        `;
            break;
         case 'dateCompleted':
            sqlQuery = `
            SELECT * FROM to_do_list
            ORDER BY "dateCompleted" ASC;
        `;
            break;
        default:
            console.log('something broke')
    }
    //sending the query to DB
    pool.query(sqlQuery)
        //Once DB responds it takes the new ordered rows and sends it to server to package up and send to client
        .then((dbRes) => {
            res.send(dbRes.rows)
        })
        .catch((err) => {
            console.log('sort failed', err)
        })

})
//Rout to GET my task list and send it to Server to send to client.
//My default is sorting my category
taskListRouter.get('/', (req, res) => {
    const sqlQuery = `
        SELECT * FROM to_do_list
        ORDER BY category ASC
        LIMIT 100;
    `
    //Sends the sqlQuery to DB 
    pool.query(sqlQuery)
        //Once DB sends response it sends the task list to the server to send to client
        .then((dbRes) => {
            console.log('success on GET', dbRes.rows)
            res.send(dbRes.rows.reverse())
        })
        .catch((err) => {
            console.log('Failed to GET', err)
        })
})
//Route to add a new task to task list in DB
taskListRouter.post('/', (req, res) => {
    //Setting var newTask to be equal to the object sent by client
    let newTask = req.body;
    //This will set the default category to Personal if nothing was typed in
    let category = newTask.category
    if(newTask.category === ''){
        category = 'Personal'
    }
    console.log('new task', newTask)
    //The Query statement sent to the DB
    const sqlQuery = `
        INSERT INTO to_do_list
        ("category", "project", "task", "priority", "dueDate", "notes")
        VALUES
        ($1, $2, $3, $4, $5, $6);
    `
    //Specific params set to ensure someone doesn't wipe out database with a malicious input
    const sqlParams = [
        category,
        newTask.project,
        newTask.task,
        newTask.priority,
        newTask.dueDate,
        newTask.notes,
    ];
    //sending the new tasks to be added to our database
    pool.query(sqlQuery, sqlParams)
        .then((dbRes) => {
            res.sendStatus(201);
        })
        .catch((err) => {
            console.log('POST to DB failed', err);
            res.sendStatus(500)
        })



})

//Route to DELETE a task from database when it is no longer needed
taskListRouter.delete(`/:id`, (req, res) => {
    //We're checking the request param to receive our task id for the DB table
    let taskId = req.params.id;
    console.log(`tasks id Is ${taskId}`);
    //Setting up the query to DELETE specific task
    const sqlQuery = `
        DELETE FROM to_do_list
        WHERE id = $1;
    `
    //Setting the params to ensure our entire DB doesn't get Deleted
    const sqlParams = [
        taskId
    ];
    //Sending the delete request to DB
    pool.query(sqlQuery, sqlParams)
    //Then we're just status update to server so it knows its job is done
    .then(() => {
        res.sendStatus(204);
    })
    .catch((err) => {
        console.log(`DELETE didnt work ${err}`)
        res.sendStatus(500);
    })
})
//Route to update the inProgress status to my DB so we can track when the task is complete
taskListRouter.put('/:id', (req, res) => {
    //Getting the request params which will have our DB table id for what we want to update
    let taskId = req.params.id;
    console.log('task id should be', taskId);
    //Setting a var to the value of the request body property inProgress to make less typing in a couple lines
    let inProgress = req.body.inProgress;
    console.log('inProgress status', inProgress);
    //Setting variable to give us a date of when the task was updated to complete
    let dateCompleted = new Date().toLocaleDateString().toString();
    console.log('new date?', dateCompleted)
    //This is just switching our inProgress to false so its marked as complete
    if(inProgress){
        inProgress = false;
    }
    //sql query to update the inProgress and also send the date to DB so we have a Date completed
    let sqlQuery = `
        UPDATE to_do_list
        SET "inProgress" = $1,
         "dateCompleted" = $2
        WHERE id = $3;
    `
    //Sql params to ensure something or one doesn't have an easy time wiping our database table maliciously
    let sqlParams = [
        inProgress, 
        dateCompleted,
        taskId
    ];
    //Sending the query to DB
    pool.query(sqlQuery, sqlParams)
        //Once DB gives us response that its job is done send the client a status update to continue its function
        .then(() => {
            res.sendStatus(200)
        })
        .catch((err) => {
            console.log('PUT failed', err);
            res.sendStatus(500);
        })
})

//Exporting our router to server
module.exports = taskListRouter;