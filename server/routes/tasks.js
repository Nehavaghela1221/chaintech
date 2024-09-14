const express = require('express');
const router = express.Router();
const Task = require('../models/Task');

// Create Task
router.post('/', async (req, res) => {
    const { title, description } = req.body;
    
    if (!title) {
        return res.status(400).json({ message: 'Taskhelo title is required' });
    }
    
    
    const task = new Task({ title, description });
    
    try {
        await task.save();
        res.status(201).json(task);
    } catch (err) {
        res.status(500).json({ message: 'Failed to create task' });
    }
});

// Get all Tasks
router.get('/', async (req, res) => {
    try {
        const tasks = await Task.find();
        res.json(tasks);
    } catch (err) {
        res.status(500).json({ message: 'Failed to retrieve tasks' });
    }
});

// Mark Task as Complete
router.put('/:id/complete', async (req, res) => {
    try {
        const task = await Task.findById(req.params.id);
        
        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }

        if (task.completed) {
            return res.status(400).json({ message: 'Task is already completed' });
        }

        task.completed = true;
        await task.save();
        res.json(task);
    } catch (err) {
        res.status(500).json({ message: 'Failed to complete task' });
    }
});

// Edit Task
router.put('/:id', async (req, res) => {
    const { title, description } = req.body;
    
    try {
        const task = await Task.findById(req.params.id);
        
        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }

        task.title = title || task.title;
        task.description = description || task.description;
        
        await task.save();
        res.json(task);
    } catch (err) {
        res.status(500).json({ message: 'Failed to update task' });
    }
});

// Delete Task
router.delete('/:id', async (req, res) => {
    try {
        const task = await Task.findByIdAndDelete(req.params.id);
        
        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }

        res.json({ message: 'Task deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: 'Failed to delete task' });
    }
});

module.exports = router;
