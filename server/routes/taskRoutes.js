const express = require('express');
const { createTask, getAllTasks, updateTask, deleteTask ,completeTask} = require('../controllers/taskController');
const router = express.Router();

router.post('/', createTask);
router.get('/', getAllTasks);
router.put('/:id', updateTask);
router.delete('/:id', deleteTask);

// New route to complete a task
router.put('/:id/complete', completeTask);
module.exports = router;
