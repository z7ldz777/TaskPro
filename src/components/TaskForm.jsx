// src/components/TaskForm.jsx
import { useState } from 'react';
import { X, AlertCircle } from 'lucide-react';

const TaskForm = ({ isOpen, onClose, onSave, taskToEdit }) => {
    // We initialize the state directly from the props! No useEffect required.
    const [title, setTitle] = useState(taskToEdit ? taskToEdit.title : '');
    const [description, setDescription] = useState(taskToEdit ? (taskToEdit.description || '') : '');
    const [status, setStatus] = useState(taskToEdit ? taskToEdit.status : 'pending');
    const [error, setError] = useState('');

    if (!isOpen) return null;

    const handleSubmit = (e) => {
        e.preventDefault();
        setError('');

        if (!title.trim()) {
            setError('Task title is required.');
            return;
        }

        const payload = {
            title: title.trim(),
            description: description.trim(),
            status,
        };

        onSave(payload);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
            <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl border border-slate-100">

                {/* Modal Header */}
                <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                    <h3 className="text-lg font-bold text-slate-900">
                        {taskToEdit ? 'Edit Task' : 'Create New Task'}
                    </h3>
                    <button onClick={onClose} className="rounded-lg p-1 text-slate-400 hover:bg-slate-50 hover:text-slate-600">
                        <X className="h-5 w-5" />
                    </button>
                </div>

                {/* Form Body */}
                <form onSubmit={handleSubmit} className="mt-4 space-y-4">

                    {error && (
                        <div className="p-3 rounded-lg flex items-center gap-2 text-sm bg-rose-50 text-rose-800 border border-rose-100">
                            <AlertCircle className="h-4 w-4 text-rose-500 shrink-0" />
                            <span>{error}</span>
                        </div>
                    )}

                    {/* Title Field */}
                    <div>
                        <label className="block text-sm font-medium text-slate-700">Title</label>
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="e.g. Design API architecture"
                            className="mt-1 block w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 placeholder-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                        />
                    </div>

                    {/* Description Field */}
                    <div>
                        <label className="block text-sm font-medium text-slate-700">Description (Optional)</label>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Provide a short breakdown of this task..."
                            rows="3"
                            className="mt-1 block w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 placeholder-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                        />
                    </div>

                    {/* Status Selection */}
                    <div>
                        <label className="block text-sm font-medium text-slate-700">Status</label>
                        <select
                            value={status}
                            onChange={(e) => setStatus(e.target.value)}
                            className="mt-1 block w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                        >
                            <option value="pending">Pending</option>
                            <option value="in_progress">In Progress</option>
                            <option value="completed">Completed</option>
                        </select>
                    </div>

                    {/* Footer Actions */}
                    <div className="flex justify-end gap-3 border-t border-slate-100 pt-4 mt-6">
                        <button
                            type="button"
                            onClick={onClose}
                            className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-500"
                        >
                            {taskToEdit ? 'Update Task' : 'Add Task'}
                        </button>
                    </div>

                </form>
            </div>
        </div>
    );
};

export default TaskForm;