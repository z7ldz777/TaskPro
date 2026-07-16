// src/components/StatusBadge.jsx
const StatusBadge = ({ status }) => {
    const styles = {
        pending: 'bg-amber-50 text-amber-700 border-amber-200',
        in_progress: 'bg-sky-50 text-sky-700 border-sky-200',
        completed: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    };

    const labels = {
        pending: 'Pending',
        in_progress: 'In Progress',
        completed: 'Completed',
    };

    return (
        <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold capitalize ${styles[status] || 'bg-slate-50 text-slate-700 border-slate-200'}`}>
            {labels[status] || status}
        </span>
    );
};

export default StatusBadge;