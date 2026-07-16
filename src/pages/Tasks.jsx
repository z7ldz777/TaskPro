// src/pages/Tasks.jsx
import { useState, useEffect } from 'react';
import { Plus, Search, Edit3, Trash2, CheckCircle2 } from 'lucide-react';
import StatusBadge from '../components/StatusBadge';
import TaskForm from '../components/TaskForm';
import { taskService } from '../services/taskService'; // Import the service!

const Tasks = () => {
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [filter, setFilter] = useState('all');

    // Modal Control States
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [selectedTask, setSelectedTask] = useState(null);

    // 1. Fetch all tasks on load
    const fetchTasks = async () => {
        try {
            const data = await taskService.getAll();
            setTasks(data);
        } catch (err) {
            console.error('Error loading tasks:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTasks();
    }, []);

    // 2. Create or Update Task
    const handleCreateOrUpdate = async (formData) => {
        try {
            if (selectedTask) {
                // Edit Mode
                const updated = await taskService.update(selectedTask.id, formData);
                setTasks((prev) => prev.map((t) => (t.id === selectedTask.id ? updated : t)));
            } else {
                // Create Mode
                const created = await taskService.create(formData);
                setTasks((prev) => [created, ...prev]);
            }
            setIsFormOpen(false);
            setSelectedTask(null);
        } catch (err) {
            alert('Error saving task.');
        }
    };

    // 3. Delete Task
    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this task?')) {
            try {
                await taskService.delete(id);
                setTasks((prev) => prev.filter((t) => t.id !== id));
            } catch (err) {
                alert('Could not delete the task.');
            }
        }
    };

    // 4. Quick Cycle Status (pending -> in_progress -> completed)
    const handleToggleStatus = async (task) => {
        const statusCycle = { pending: 'in_progress', in_progress: 'completed', completed: 'pending' };
        const nextStatus = statusCycle[task.status];

        try {
            const updated = await taskService.updateStatus(task.id, nextStatus);
            setTasks((prev) => prev.map((t) => (t.id === task.id ? updated : t)));
        } catch (err) {
            alert('Could not update task status.');
        }
    };

    // Search & Filter Actions
    const filteredTasks = tasks.filter((task) => {
        const matchesSearch =
            task.title.toLowerCase().includes(search.toLowerCase()) ||
            (task.description && task.description.toLowerCase().includes(search.toLowerCase()));
        const matchesFilter = filter === 'all' || task.status === filter;
        return matchesSearch && matchesFilter;
    });

    if (loading) {
        return (
            <div className="flex h-[60vh] items-center justify-center">
                <div className="h-10 w-10 animate-spin rounded-full border-4 border-indigo-500 border-t-transparent"></div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header Panel */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-slate-900">Task Workspace</h1>
                    <p className="text-sm text-slate-500">Add, monitor, edit, or adjust your development assignments.</p>
                </div>
                <button
                    onClick={() => {
                        setSelectedTask(null);
                        setIsFormOpen(true);
                    }}
                    className="flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-indigo-500 transition-colors self-start sm:self-auto"
                >
                    <Plus className="h-4 w-4" /> Add Task
                </button>
            </div>

            {/* Control Actions Bar */}
            <div className="flex flex-col gap-4 rounded-xl border border-slate-100 bg-white p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between">
                <div className="relative flex-1 max-w-md">
                    <Search className="absolute top-3 left-3 h-4 w-4 text-slate-400" />
                    <input
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search tasks..."
                        className="w-full rounded-lg border border-slate-200 py-2 pl-9 pr-4 text-sm text-slate-900 placeholder-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    />
                </div>

                <div className="flex gap-1.5 rounded-lg bg-slate-100 p-1 self-start sm:self-auto">
                    {['all', 'pending', 'in_progress', 'completed'].map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setFilter(tab)}
                            className={`rounded-md px-3 py-1.5 text-xs font-semibold capitalize transition-all ${filter === tab
                                    ? 'bg-white text-slate-900 shadow-sm'
                                    : 'text-slate-500 hover:text-slate-900'
                                }`}
                        >
                            {tab.replace('_', ' ')}
                        </button>
                    ))}
                </div>
            </div>

            {/* Main Grid View */}
            {filteredTasks.length > 0 ? (
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {filteredTasks.map((task) => (
                        <div key={task.id} className="flex flex-col justify-between rounded-xl border border-slate-200 bg-white p-5 shadow-sm hover:border-slate-300 transition-all">
                            <div className="space-y-3">
                                <div className="flex items-start justify-between gap-4">
                                    <h3 className="font-semibold text-slate-900 line-clamp-1">{task.title}</h3>
                                    <button onClick={() => handleToggleStatus(task)} title="Click to cycle status" className="shrink-0">
                                        <StatusBadge status={task.status} />
                                    </button>
                                </div>
                                <p className="text-sm text-slate-500 line-clamp-3 min-h-[3.75rem]">
                                    {task.description || 'No description provided.'}
                                </p>
                            </div>

                            {/* Bottom Actions */}
                            <div className="flex items-center justify-between border-t border-slate-100 pt-4 mt-5">
                                <button
                                    onClick={() => handleToggleStatus(task)}
                                    className="flex items-center gap-1.5 text-xs font-semibold text-indigo-600 hover:text-indigo-500"
                                >
                                    <CheckCircle2 className="h-4 w-4" /> Cycle Status
                                </button>
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={() => {
                                            setSelectedTask(task);
                                            setIsFormOpen(true);
                                        }}
                                        className="rounded p-1.5 text-slate-400 hover:bg-slate-50 hover:text-slate-600"
                                    >
                                        <Edit3 className="h-4 w-4" />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(task.id)}
                                        className="rounded p-1.5 text-slate-400 hover:bg-rose-50 hover:text-rose-600"
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-slate-200 bg-white py-12 px-4 text-center">
                    <p className="text-sm font-semibold text-slate-950">No tasks found</p>
                    <p className="text-xs text-slate-500 mt-1">Try resetting filters or start creating tasks.</p>
                </div>
            )}

            {/* Create / Edit Form Modal */}
            {isFormOpen && (
                <TaskForm
                    key={selectedTask ? selectedTask.id : 'new-task'}
                    isOpen={isFormOpen}
                    onClose={() => {
                        setIsFormOpen(false);
                        setSelectedTask(null);
                    }}
                    onSave={handleCreateOrUpdate}
                    taskToEdit={selectedTask}
                />
            )}
        </div>
    );
};

export default Tasks;