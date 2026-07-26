export default function TaskStats({ tasks }) {
  const total = tasks.length;
  const todo = tasks.filter(t => !t.status || t.status === 'TODO' || t.status === false).length;
  const inProgress = tasks.filter(t => t.status === 'IN_PROGRESS').length;
  const done = tasks.filter(t => t.status === 'DONE' || t.status === true).length;

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
      <div className="bg-white/80 backdrop-blur border border-white/50 rounded-2xl p-5 flex items-center gap-4 shadow-sm">
        <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-600">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
        </div>
        <div>
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Total Tasks</p>
          <p className="text-2xl font-bold text-slate-800 leading-tight">{total}</p>
        </div>
      </div>

      <div className="bg-white/80 backdrop-blur border border-white/50 rounded-2xl p-5 flex items-center gap-4 shadow-sm">
        <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-600">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <div>
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">To Do</p>
          <p className="text-2xl font-bold text-slate-800 leading-tight">{todo}</p>
        </div>
      </div>

      <div className="bg-white/80 backdrop-blur border border-white/50 rounded-2xl p-5 flex items-center gap-4 shadow-sm">
        <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        </div>
        <div>
          <p className="text-xs font-semibold text-blue-600 uppercase tracking-wide">In Progress</p>
          <p className="text-2xl font-bold text-slate-800 leading-tight">{inProgress}</p>
        </div>
      </div>

      <div className="bg-white/80 backdrop-blur border border-white/50 rounded-2xl p-5 flex items-center gap-4 shadow-sm">
        <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <div>
          <p className="text-xs font-semibold text-emerald-600 uppercase tracking-wide">Done</p>
          <p className="text-2xl font-bold text-slate-800 leading-tight">{done}</p>
        </div>
      </div>
    </div>
  );
}
