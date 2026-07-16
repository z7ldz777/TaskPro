// src/services/taskService.js
import api from './api';

const USE_MOCK = true; // Switch to false to connect to the real Laravel API!

// Local helper to manage mock tasks in LocalStorage so CRUD works offline!
const getMockTasks = () => {
    const tasks = localStorage.getItem('mock_tasks');
    if (!tasks) {
        const initialTasks = [
            { id: 1, title: 'Resolve ESLint Warnings', description: 'Clear out unused variables in main routing configs.', status: 'completed' },
            { id: 2, title: 'Integrate Tailwind Theme', description: 'Align CSS configurations to fit modern styles.', status: 'in_progress' },
            { id: 3, title: 'Configure Database Seeder', description: 'Set up test data templates inside database tables.', status: 'pending' },
        ];
        localStorage.setItem('mock_tasks', JSON.stringify(initialTasks));
        return initialTasks;
    }
    return JSON.parse(tasks);
};

const saveMockTasks = (tasks) => {
    localStorage.setItem('mock_tasks', JSON.stringify(tasks));
};

export const taskService = {
    // 1. Get Dashboard Stats
    getStats: async () => {
        if (USE_MOCK) {
            const tasks = getMockTasks();
            const total = tasks.length;
            const pending = tasks.filter(t => t.status === 'pending').length;
            const progress = tasks.filter(t => t.status === 'in_progress').length;
            const completed = tasks.filter(t => t.status === 'completed').length;
            const rate = total > 0 ? Math.round((completed / total) * 100) : 0;

            return {
                total_tasks: total,
                pending_tasks: pending,
                in_progress_tasks: progress,
                completed_tasks: completed,
                completion_rate: rate,
                recent_tasks: tasks.slice(-3).reverse() // Last 3 modified tasks
            };
        } else {
            const response = await api.get('/dashboard/stats');
            return response.data.data;
        }
    },

    // 2. Read All Tasks
    getAll: async () => {
        if (USE_MOCK) {
            return getMockTasks();
        } else {
            const response = await api.get('/tasks');
            return response.data.data;
        }
    },

    // 3. Create Task
    create: async (taskData) => {
        if (USE_MOCK) {
            const tasks = getMockTasks();
            const newTask = { id: Date.now(), ...taskData };
            saveMockTasks([newTask, ...tasks]);
            return newTask;
        } else {
            const response = await api.post('/tasks', taskData);
            return response.data.data;
        }
    },

    // 4. Update Task (PUT)
    update: async (id, taskData) => {
        if (USE_MOCK) {
            const tasks = getMockTasks();
            const updatedTasks = tasks.map(t => t.id === id ? { ...t, ...taskData } : t);
            saveMockTasks(updatedTasks);
            return updatedTasks.find(t => t.id === id);
        } else {
            const response = await api.put(`/tasks/${id}`, taskData);
            return response.data.data;
        }
    },

    // 5. Update Status Only (PATCH)
    updateStatus: async (id, status) => {
        if (USE_MOCK) {
            const tasks = getMockTasks();
            const updatedTasks = tasks.map(t => t.id === id ? { ...t, status } : t);
            saveMockTasks(updatedTasks);
            return updatedTasks.find(t => t.id === id);
        } else {
            const response = await api.patch(`/tasks/${id}/status`, { status });
            return response.data.data;
        }
    },

    // 6. Delete Task
    delete: async (id) => {
        if (USE_MOCK) {
            const tasks = getMockTasks();
            const filtered = tasks.filter(t => t.id !== id);
            saveMockTasks(filtered);
            return true;
        } else {
            await api.delete(`/tasks/${id}`);
            return true;
        }
    }
};