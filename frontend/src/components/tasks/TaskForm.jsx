import { useState } from 'react';

export default function TaskForm({ onAdd }) {
  const [title, setTitle] = useState('');
  const [priority, setPriority] = useState('Medium');
  const [dueDate, setDueDate] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    onAdd({ title, priority, due_date: dueDate || null });
    setTitle('');
    setPriority('Medium');
    setDueDate('');
  };

  return (
    <div className="glass-card rounded-2xl p-6 mb-8 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-2xl -mr-10 -mt-10"></div>
      <h2 className="text-xl font-bold text-slate-800 mb-5 relative z-10">Create New Task</h2>
      <form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-4 relative z-10">
        <div className="flex-1">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="What needs to be done?"
            className="w-full px-5 py-3 glass-input rounded-xl text-sm outline-none text-slate-800 placeholder-slate-400 font-medium"
          />
        </div>
        <div className="w-full md:w-40">
          <select 
            value={priority} 
            onChange={(e) => setPriority(e.target.value)}
            className="w-full px-5 py-3 glass-input rounded-xl text-sm outline-none cursor-pointer text-slate-700 font-medium appearance-none"
          >
            <option value="Low">Low Priority</option>
            <option value="Medium">Medium Priority</option>
            <option value="High">High Priority</option>
          </select>
        </div>
        <div className="w-full md:w-48">
          <input
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            className="w-full px-5 py-3 glass-input rounded-xl text-sm outline-none cursor-pointer text-slate-700 font-medium"
          />
        </div>
        <button
          type="submit"
          className="px-8 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-semibold text-sm rounded-xl shadow-lg shadow-indigo-500/30 transition-all transform hover:-translate-y-0.5 flex items-center justify-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          Add Task
        </button>
      </form>
    </div>
  );
}
