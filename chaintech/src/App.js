import React, { useState, useEffect } from 'react';
import axios from 'axios';

function App() {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState({ title: '', description: '' });

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const response = await axios.get('/api/tasks');
      setTasks(response.data);
    } catch (error) {
      console.error('Failed to fetch tasks', error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewTask((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const createTask = async () => {
    if (newTask.title.trim() === '' || newTask.description.trim() === '') {
      alert('Title and description are required');
      return;
  }
   
    try {
      const response = await axios.post('/api/tasks', newTask);
      setTasks([...tasks, response.data]);
      setNewTask({ title: '', description: '' });
    } catch (error) {
      console.error('Failed to create task', error);
    }
  };

  const completeTask = async (id) => {
    try {
      await axios.put(`/api/tasks/${id}/complete`);
      fetchTasks();
    } catch (error) {
      console.error('Failed to complete task', error);
    }
  };

  const editTask = async (id, updatedTask) => {
    try {
      await axios.put(`/api/tasks/${id}`, updatedTask);
      fetchTasks();
    } catch (error) {
      console.error('Failed to update task', error);
    }
  };

  const deleteTask = async (id) => {
    try {
      await axios.delete(`/api/tasks/${id}`);
      setTasks(tasks.filter((task) => task._id !== id));
    } catch (error) {
      console.error('Failed to delete task', error);
    }
  };

  return (
    <div className="App">
      <h1>Task Manager</h1>

      {/* Task creation form */}
      <div>
        <input
          type="text"
          name="title"
          placeholder="Task Title"
          value={newTask.title}
          onChange={handleChange}
        />
        <input
          type="text"
          name="description"
          placeholder="Task Description"
          value={newTask.description}
          onChange={handleChange}
        />
        <button onClick={createTask}>Create Task</button>
      </div>

      {/* Task List */}
      <ul>
        {tasks.map((task) => (
          <li key={task._id}>
            <h3>
              {task.title} {task.completed ? '(Completed)' : ''}
            </h3>
            <p>{task.description}</p>
            <button
              onClick={() => completeTask(task._id)}
              disabled={task.completed}
            >
              Mark Complete
            </button>
            <button
              onClick={() =>
                editTask(task._id, {
                  ...task,
                  title: prompt('Enter new title', task.title) || task.title,
                  description:
                    prompt('Enter new description', task.description) ||
                    task.description,
                })
              }
            >
              Edit
            </button>
            <button onClick={() => deleteTask(task._id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
