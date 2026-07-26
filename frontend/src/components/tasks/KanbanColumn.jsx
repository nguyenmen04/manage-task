import { Droppable } from '@hello-pangea/dnd';
import KanbanCard from './KanbanCard';

export default function KanbanColumn({ columnId, title, tasks, onUpdate, onDelete }) {
  const columnColors = {
    TODO: 'bg-slate-50 border-slate-200 text-slate-700',
    IN_PROGRESS: 'bg-blue-50/50 border-blue-200 text-blue-700',
    DONE: 'bg-emerald-50/50 border-emerald-200 text-emerald-700'
  };

  const headerColors = {
    TODO: 'bg-slate-200/50',
    IN_PROGRESS: 'bg-blue-200/50',
    DONE: 'bg-emerald-200/50'
  };

  return (
    <div className={`flex flex-col rounded-2xl border ${columnColors[columnId]} min-h-[500px] w-full max-w-sm flex-1 overflow-hidden`}>
      <div className={`px-4 py-3 border-b border-inherit ${headerColors[columnId]} flex items-center justify-between`}>
        <h2 className="font-semibold text-sm uppercase tracking-wider">{title}</h2>
        <span className="bg-white/60 text-inherit text-xs font-bold px-2 py-1 rounded-full">
          {tasks.length}
        </span>
      </div>
      
      <Droppable droppableId={columnId}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className={`flex-1 p-3 transition-colors ${
              snapshot.isDraggingOver ? 'bg-indigo-50/30' : ''
            }`}
          >
            {tasks.map((task, index) => (
              <KanbanCard 
                key={task.id} 
                task={task} 
                index={index} 
                onUpdate={onUpdate} 
                onDelete={onDelete} 
              />
            ))}
            {provided.placeholder}
            
            {tasks.length === 0 && !snapshot.isDraggingOver && (
              <div className="h-full flex flex-col items-center justify-center opacity-50 py-10 border-2 border-dashed border-current rounded-xl mx-2">
                <span className="text-sm font-medium">Drop tasks here</span>
              </div>
            )}
          </div>
        )}
      </Droppable>
    </div>
  );
}
