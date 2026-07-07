import { useState, useRef, useEffect } from 'react';

export default function TaskItem({ task, onUpdate, onDelete }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(task.title);
  const inputRef = useRef(null);

  const dateStr = new Date(task.created_at).toLocaleDateString('vi-VN', {
    day: '2-digit', month: '2-digit', year: 'numeric'
  });

  let dueDateStr = null;
  let isOverdue = false;
  if (task.due_date) {
    const due = new Date(task.due_date);
    dueDateStr = due.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' });
    if (due < new Date() && !task.status) {
      isOverdue = true;
    }
  }

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isEditing]);

  const handleSaveEdit = () => {
    if (editTitle.trim() && editTitle !== task.title) {
      onUpdate(task.id, { title: editTitle });
    } else {
      setEditTitle(task.title);
    }
    setIsEditing(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleSaveEdit();
    if (e.key === 'Escape') {
      setEditTitle(task.title);
      setIsEditing(false);
    }
  };

  const priorityColors = {
    High: 'bg-red-50 text-red-700 border-red-200',
    Medium: 'bg-yellow-50 text-yellow-700 border-yellow-200',
    Low: 'bg-slate-50 text-slate-700 border-slate-200',
  };

  return (
    <tr className="border-b border-white/20 hover:bg-white/40 transition-colors group">
      <td className="py-4 pl-6 pr-4 whitespace-nowrap w-16">
        <button 
          onClick={() => onUpdate(task.id, { status: !task.status })}
          className={`w-6 h-6 rounded border flex items-center justify-center transition-all ${
            task.status 
              ? 'bg-indigo-600 border-indigo-600 text-white' 
              : 'bg-white border-slate-300 hover:border-indigo-400 text-transparent'
          }`}
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
          </svg>
        </button>
      </td>
      <td className="py-4 px-4 w-full">
        {isEditing ? (
          <input
            ref={inputRef}
            type="text"
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
            onBlur={handleSaveEdit}
            onKeyDown={handleKeyDown}
            className="w-full px-2 py-1 text-sm border-b-2 border-indigo-500 focus:outline-none bg-white"
          />
        ) : (
          <div 
            onClick={() => setIsEditing(true)}
            className={`text-sm font-medium cursor-text transition-colors ${
              task.status ? 'text-slate-400 line-through' : 'text-slate-800 hover:text-indigo-600'
            }`}
            title="Click to edit"
          >
            {task.title}
          </div>
        )}
      </td>
      <td className="py-4 px-4 whitespace-nowrap">
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${priorityColors[task.priority || 'Medium']}`}>
          {task.priority || 'Medium'}
        </span>
      </td>
      <td className="py-4 px-4 whitespace-nowrap">
        {dueDateStr ? (
          <span className={`text-xs font-medium ${isOverdue ? 'text-red-500' : 'text-slate-500'}`}>
            {dueDateStr}
          </span>
        ) : (
          <span className="text-xs text-slate-400">-</span>
        )}
      </td>
      <td className="py-4 pl-4 pr-6 whitespace-nowrap text-right">
        <button 
          onClick={() => onDelete(task.id)}
          className="text-slate-400 hover:text-red-500 transition-colors p-1 rounded-md hover:bg-red-50 opacity-0 group-hover:opacity-100 focus:opacity-100"
          title="Delete Task"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>
      </td>
    </tr>
  );
}
