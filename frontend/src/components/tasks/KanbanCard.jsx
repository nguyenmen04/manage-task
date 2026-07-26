import { useState, useRef, useEffect } from 'react';
import { Draggable } from '@hello-pangea/dnd';

export default function KanbanCard({ task, index, onUpdate, onDelete }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(task.title);
  const inputRef = useRef(null);

  let dueDateStr = null;
  let isOverdue = false;
  if (task.due_date) {
    const due = new Date(task.due_date);
    dueDateStr = due.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' });
    if (due < new Date() && task.status !== 'DONE') {
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
    <Draggable draggableId={task.id.toString()} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className={`bg-white rounded-xl p-4 shadow-sm border border-slate-200 group transition-all duration-200 ${
            snapshot.isDragging ? 'shadow-xl ring-2 ring-indigo-500/50 scale-[1.02] z-50' : 'hover:shadow-md hover:border-indigo-300'
          } mb-3`}
        >
          <div className="flex justify-between items-start mb-2">
            <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wide border ${priorityColors[task.priority || 'Medium']}`}>
              {task.priority || 'Medium'}
            </span>
            <button 
              onClick={() => onDelete(task.id)}
              className="text-slate-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all focus:opacity-100"
              title="Delete Task"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>

          <div className="mb-3">
            {isEditing ? (
              <input
                ref={inputRef}
                type="text"
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                onBlur={handleSaveEdit}
                onKeyDown={handleKeyDown}
                className="w-full px-2 py-1 text-sm border-b-2 border-indigo-500 focus:outline-none bg-slate-50 rounded-t"
              />
            ) : (
              <h3 
                onClick={() => setIsEditing(true)}
                className={`text-sm font-medium leading-snug cursor-text transition-colors ${
                  task.status === 'DONE' ? 'text-slate-400 line-through' : 'text-slate-800 hover:text-indigo-600'
                }`}
                title="Click to edit"
              >
                {task.title}
              </h3>
            )}
          </div>

          {dueDateStr && (
            <div className="flex items-center mt-3 pt-3 border-t border-slate-100">
              <svg className={`w-3.5 h-3.5 mr-1.5 ${isOverdue ? 'text-red-500' : 'text-slate-400'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span className={`text-[11px] font-medium ${isOverdue ? 'text-red-600' : 'text-slate-500'}`}>
                {dueDateStr}
              </span>
            </div>
          )}
        </div>
      )}
    </Draggable>
  );
}
