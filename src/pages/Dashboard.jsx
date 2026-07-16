// src/pages/Dashboard.jsx
import { useState, useEffect } from 'react';
import { ClipboardList, Clock, RefreshCw, CheckCircle, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom'; // Used below in the "See all" link
import { taskService } from '../services/taskService';
import StatusBadge from '../components/StatusBadge';

const Dashboard = () => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const data = await taskService.getStats();
                setStats(data);
            } catch (err) {
                setError('Could not retrieve dashboard statistics.');
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    if (loading) {
        return (
            <div className="flex h-[60vh] items-center justify-center">
                <div className="h-10 w-10 animate-spin rounded-full border-4 border-indigo-500 border-t-transparent"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex h-[60vh] flex-col items-center justify-center text-center">
                <p className="text-rose-600 font-semibold">{error}</p>
            </div>
        );
    }

    const cardConfig = [
        { title: 'Total Tasks', value: stats.total_tasks, icon: ClipboardList, color: 'bg-indigo-500 text-white' },
        { title: 'Pending', value: stats.pending_tasks, icon: Clock, color: 'bg-amber-500 text-white' },
        { title: 'In Progress', value: stats.in_progress_tasks, icon: RefreshCw, color: 'bg-sky-500 text-white' },
        { title: 'Completed', value: stats.completed_tasks, icon: CheckCircle, color: 'bg-emerald-500 text-white' },
    ];

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-2xl font-bold tracking-tight text-slate-900">Dashboard Overview</h1>
                <p className="mt-1 text-sm text-slate-500">Monitor and manage your active project workloads.</p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {cardConfig.map((card, idx) => {
                    const Icon = card.icon;
                    return (
                        <div key={idx} className="flex items-center justify-between rounded-xl border border-slate-100 bg-white p-6 shadow-sm">
                            <div className="space-y-2">
                                <p className="text-sm font-medium text-slate-500">{card.title}</p>
                                <p className="text-3xl font-bold text-slate-900">{card.value}</p>
                            </div>
                            <div className={`rounded-lg p-3 ${card.color}`}>
                                <Icon className="h-6 w-6" />
                            </div>
                        </div>
                    );
                })}
            </div>

            <div className="grid gap-6 lg:grid-cols-3">
                <div className="rounded-xl border border-slate-100 bg-white p-6 shadow-sm">
                    <h2 className="text-lg font-semibold text-slate-900">Task Completion Rate</h2>
                    <p className="text-sm text-slate-500 mt-1">Percentage of tasks finalized successfully.</p>

                    <div className="mt-8 space-y-4">
                        <div className="relative flex items-center justify-center">
                            <div className="text-4xl font-extrabold text-indigo-600">{stats.completion_rate}%</div>
                        </div>
                        <div className="w-full bg-slate-100 rounded-full h-3 mt-4 overflow-hidden">
                            <div
                                // Fix 2: Changed raw string style to style object
                                className="bg-indigo-600 h-3 rounded-full transition-all duration-500"
                                style={{ width: `${stats.completion_rate}%` }}
                            />
                        </div>
                    </div>
                </div>

                <div className="lg:col-span-2 rounded-xl border border-slate-100 bg-white p-6 shadow-sm flex flex-col">
                    <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                        <div>
                            <h2 className="text-lg font-semibold text-slate-900">Recently Updated Tasks</h2>
                            <p className="text-sm text-slate-500">Your latest workspace activity tracks.</p>
                        </div>
                        {/* Fix 1: Properly using Link to route to task manager */}
                        <Link to="/tasks" className="flex items-center gap-1.5 text-sm font-semibold text-indigo-600 hover:text-indigo-500">
                            See all <ArrowRight className="h-4 w-4" />
                        </Link>
                    </div>

                    <div className="divide-y divide-slate-100 flex-1">
                        {stats.recent_tasks.map((task) => (
                            // Fix 3: Added critical key property to the mapped wrapper
                            <div key={task.id} className="flex items-center justify-between py-4">
                                <div className="space-y-1">
                                    <p className="font-semibold text-slate-900">{task.title}</p>
                                    <p className="text-sm text-slate-500 line-clamp-1">{task.description || 'No description provided.'}</p>
                                </div>
                                <span className="capitalize">
                                    <StatusBadge status={task.status} />
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;