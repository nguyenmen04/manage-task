import { DragDropContext } from '@hello-pangea/dnd';
import KanbanColumn from './KanbanColumn';

export default function TaskList({ tasks, onUpdate, onDelete }) {
  if (tasks.length === 0) {
    return (
      <div className="glass-card rounded-2xl p-12 text-center relative overflow-hidden mt-6">
        <div className="w-20 h-20 bg-indigo-50/50 rounded-full flex items-center justify-center mx-auto mb-5 shadow-inner">
          <svg className="w-8 h-8 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-slate-800 mb-1">No tasks found</h3>
        <p className="text-slate-500 text-sm">Get started by creating a new task above.</p>
      </div>
    );
  }

  // Group tasks by status
  const columns = {
    TODO: {
      id: 'TODO',
      title: 'To Do',
      tasks: tasks.filter(t => !t.status || t.status === 'TODO' || t.status === false)
    },
    IN_PROGRESS: {
      id: 'IN_PROGRESS',
      title: 'In Progress',
      tasks: tasks.filter(t => t.status === 'IN_PROGRESS')
    },
    DONE: {
      id: 'DONE',
      title: 'Done',
      tasks: tasks.filter(t => t.status === 'DONE' || t.status === true)
    }
  };

  const onDragEnd = (result) => {
    const { destination, source, draggableId } = result;

    // Dropped outside a valid column
    if (!destination) return;

    // Dropped in the exact same place
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    const taskId = parseInt(draggableId, 10);
    const newStatus = destination.droppableId;

    // If moving to a new column, trigger update API
    if (source.droppableId !== destination.droppableId) {
      // Optimistic update would go here if managed in parent state, 
      // but onUpdate makes the API call and re-fetches.
      onUpdate(taskId, { status: newStatus });
    }
  };

  return (
    <div className="mt-8">
      <DragDropContext onDragEnd={onDragEnd}>
        <div className="flex flex-col md:flex-row gap-6 items-start overflow-x-auto pb-4">
          {Object.values(columns).map((column) => (
            <KanbanColumn
              key={column.id}
              columnId={column.id}
              title={column.title}
              tasks={column.tasks}
              onUpdate={onUpdate}
              onDelete={onDelete}
            />
          ))}
        </div>
      </DragDropContext>
    </div>
  );
}
