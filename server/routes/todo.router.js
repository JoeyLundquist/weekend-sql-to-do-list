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





module.exports = taskListRouter;