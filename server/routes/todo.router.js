const express = require('express');
const pool = require('../module/pool')
const taskListRouter = express.Router();


taskListRouter.get('/', (req, res) => {
    const sqlQuery = `
        SELECT * FROM to_do_list
        ORDER BY category ASC
    `

    pool.query(sqlQuery)
        .then((dbRes) => {
            console.log('success on GET', dbRes.rows)
            res.send(dbRes.rows)
        })
        .catch((err) => {
            console.log('Failed to GET', err)
        })





})

taskListRouter.post('/', (req, res) => {
    let newTask = req.body;
    let category = newTask.category
    if(newTask.category === ''){
        category = 'Personal'
    }
    console.log('new task', newTask)

    const sqlQuery = `
        INSERT INTO to_do_list
        ("category", "project", "task", "priority", "dueDate", "notes")
        VALUES
        ($1, $2, $3, $4, $5, $6);
    `

    const sqlParams = [
        category,
        newTask.project,
        newTask.task,
        newTask.priority,
        newTask.dueDate,
        newTask.notes,
    ];

    pool.query(sqlQuery, sqlParams)
        .then((dbRes) => {
            res.sendStatus(201);
        })
        .catch((err) => {
            console.log('POST to DB failed', err);
            res.sendStatus(500)
        })



})


taskListRouter.delete(`/:id`, (req, res) => {
    let taskId = req.params.id;
    console.log(`tasks id Is ${taskId}`);

    const sqlQuery = `
        DELETE FROM to_do_list
        WHERE id = $1;
    `
    const sqlParams = [
        taskId
    ];

    pool.query(sqlQuery, sqlParams)
    .then(() => {
        res.sendStatus(204);
    })
    .catch((err) => {
        console.log(`DELETE didnt work ${err}`)
        res.sendStatus(500);
    })
})

taskListRouter.put('/:id', (req, res) => {
    let taskId = req.params.id;
    console.log('task id should be', taskId);
    let inProgress = req.body.inProgress;
    console.log('inProgress status', inProgress);
    let dateCompleted = new Date().toLocaleDateString().toString();
    console.log('new date?', dateCompleted)

    if(inProgress){
        inProgress = false;
    }
    else {
        inProgress = true;
    }

    let sqlQuery = `
        UPDATE to_do_list
        SET "inProgress" = $1,
         "dateCompleted" = $2
        WHERE id = $3;
    `

    let sqlParams = [
        inProgress, 
        dateCompleted,
        taskId
    ];

    pool.query(sqlQuery, sqlParams)
        .then(() => {
            res.sendStatus(200)
        })
        .catch((err) => {
            console.log('PUT failed', err);
            res.sendStatus(500);
        })
})


module.exports = taskListRouter;