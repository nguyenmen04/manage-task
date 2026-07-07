export default function TaskItem({ task, onToggle, onDelete }) {
  const date = new Date(task.created_at).toLocaleDateString('vi-VN', {
    day: '2-digit', month: '2-digit', year: 'numeric'
  });

  return (
    <tr className="border-b border-slate-100 hover:bg-slate-50 transition-colors group">
      <td className="py-4 pl-6 pr-4 whitespace-nowrap w-16">
        <button 
          onClick={() => onToggle(task.id, task.status)}
          className={`w-6 h-6 rounded border flex items-center justify-center transition-all ${
            task.status 
              ? 'bg-blue-600 border-blue-600 text-white' 
              : 'bg-white border-slate-300 hover:border-blue-400 text-transparent'
          }`}
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
          </svg>
        </button>
      </td>
      <td className="py-4 px-4 w-full">
        <div className={`text-sm font-medium transition-colors ${
          task.status ? 'text-slate-400 line-through' : 'text-slate-800'
        }`}>
          {task.title}
        </div>
      </td>
      <td className="py-4 px-4 whitespace-nowrap">
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
          task.status 
            ? 'bg-emerald-100 text-emerald-800 border border-emerald-200' 
            : 'bg-amber-100 text-amber-800 border border-amber-200'
        }`}>
          {task.status ? 'Completed' : 'Pending'}
        </span>
      </td>
      <td className="py-4 px-4 whitespace-nowrap text-sm text-slate-500">
        {date}
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
