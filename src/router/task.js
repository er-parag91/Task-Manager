const express = require('express');
const router = new express.Router();

// Schema
const Task = require('../models/task');

// auth middleware
const auth = require('../middleware/auth');



// -------------------------- Task routes -----------------------//

// Create Task - post request
router.post('/tasks', auth, async (req, res) => {
    const task = new Task({
            ...req.body,
            owner: req.user._id
    });

    try {
        await task.save();
        res.status(201).send(task);
    } catch (e) {
        res.status(400).send(e);
    }
})

// Read task - Get request
router.get('/tasks', auth, async (req, res) => {
    const query = { owner: req.user._id };

    if (req.query.completed) {
        query.completed = req.query.completed === 'true';
    }

    try {

        console.log(query);
        const tasks = await Task.find(query);
        res.send(tasks);


        // second approach - with populate method
        // await req.user.populate('tasks').execPopulate();
        // res.send(req.user.tasks);

    } catch (e) {
        res.status(400).send(e);
    }
});

// Read task by id - Get request
router.get('/tasks/:id', auth, async (req, res) => {
    const _id = req.params.id;

    try {
        const task = await Task.findOne({ _id, owner: req.user._id });

        if (!task) {
            res.status(404).send();
        }
        res.send(task);
    } catch (e) {
        res.status(500).send(e);
    }
});

// Find task by id and update - patch request
router.patch('/tasks/:id', auth, async (req, res) => {
    const updates = Object.keys(req.body);
    const allowedUpdates = ['description', 'completed'];

    const isValidOperation = updates.every(update => allowedUpdates.includes(update));

    if (!isValidOperation) {
        res.status(400).send({
            error: 'Not valid updates'
        });
    }
    try {
        const task = await Task.findOne({ _id: req.params.id, owner: req.user._id });
        if (!task) {
            res.status(404).send();
        }
        updates.forEach(update => task[update] = req.body[update]);
        await task.save();
        res.status(200).send(task);
    } catch (e) {
        res.status(400).send(e);
    }
});

// Find task by id and delete - delete request
router.delete('/tasks/:id', auth, async (req, res) => {

    try {
        const task = await Task.findOneAndDelete({ _id: req.params.id, owner: req.user._id });
        if (!task) {
            res.status(404).send({
                error: 'Invalid delete operation'
            });
        }
        res.send(task)

    } catch (e) {
        res.status(400).send(e);
    }
})


module.exports = router;