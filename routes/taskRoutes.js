const express = require('express');
const router = express.Router();
const TaskController = require('../controllers/task.controller');
const authenticateToken = require('../middlware/authMiddleware')
const authorizeRoles = require('../middlware/authorizeRoles');


// Route to create a new task
router.post('/tasks',authenticateToken, TaskController.createTask);

// Route to get all tasks for a user
router.get('/tasks',authenticateToken, TaskController.getTasks);

// Route to get a task by ID
router.get('/tasks/:id',authenticateToken, TaskController.getTaskById);

// Route to update a task
router.put('/tasks/:id',authenticateToken, TaskController.updateTask);

// Route to delete a task
router.delete('/tasks/:id', authenticateToken,authorizeRoles('admin'), TaskController.deleteTask);

module.exports = router;
