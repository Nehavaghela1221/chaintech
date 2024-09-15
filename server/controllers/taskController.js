const Task = require('../models/Task');

// Create Task
exports.createTask = async (req, res) => {
    try {
        const { title, description, category } = req.body;
        const newTask = new Task({
            title,
            description,
            // Include category field
        });
        await newTask.save();
        res.status(201).json(newTask);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get All Tasks
exports.getAllTasks = async (req, res) => {
    try {
        const tasks = await Task.find();
        res.status(200).json(tasks);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Update Task
exports.updateTask = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, description, completed, category } = req.body;
        const updatedTask = await Task.findByIdAndUpdate(id, { title, description, completed, category }, { new: true });
        if (!updatedTask) {
            return res.status(404).json({ error: 'Task not found' });
        }
        res.status(200).json(updatedTask);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Delete Task
exports.deleteTask = async (req, res) => {
    try {
        const { id } = req.params;
        const task = await Task.findByIdAndDelete(id);
        if (!task) return res.status(404).json({ error: 'Task not found' });
        res.status(200).json({ message: 'Task deleted' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Mark Task as Completed
exports.completeTask = async (req, res) => {
    try {
        const { id } = req.params;
        let task = await Task.findById(id);

        if (!task) {
            return res.status(404).json({ error: 'Task not found' });
        }

        if (task.completed) {
            return res.status(400).json({ error: 'Task is already completed' });
        }

        task.completed = true;
        await task.save();
        res.status(200).json(task);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
