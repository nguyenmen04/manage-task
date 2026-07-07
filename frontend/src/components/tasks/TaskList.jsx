import TaskItem from './TaskItem';

export default function TaskList({ tasks, onUpdate, onDelete }) {
  if (tasks.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-12 text-center">
        <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-slate-800 mb-1">No tasks found</h3>
        <p className="text-slate-500 text-sm">Get started by creating a new task above.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200">
              <th className="py-3 pl-6 pr-4 font-semibold text-xs text-slate-500 uppercase tracking-wider w-16">
                Status
              </th>
              <th className="py-3 px-4 font-semibold text-xs text-slate-500 uppercase tracking-wider w-full">
                Task Name
              </th>
              <th className="py-3 px-4 font-semibold text-xs text-slate-500 uppercase tracking-wider">
                Priority
              </th>
              <th className="py-3 px-4 font-semibold text-xs text-slate-500 uppercase tracking-wider">
                Due Date
              </th>
              <th className="py-3 pl-4 pr-6 font-semibold text-xs text-slate-500 uppercase tracking-wider text-right">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {tasks.map((task) => (
              <TaskItem 
                key={task.id} 
                task={task} 
                onUpdate={onUpdate} 
                onDelete={onDelete} 
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
