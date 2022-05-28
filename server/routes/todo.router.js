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







module.exports = taskListRouter;