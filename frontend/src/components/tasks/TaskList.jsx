import { useState } from 'react';
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
  closestCorners,
} from '@dnd-kit/core';
import KanbanColumn from './KanbanColumn';

export default function TaskList({ tasks, onUpdate, onDelete }) {
  const [activeId, setActiveId] = useState(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5, // Phải kéo ít nhất 5px mới kích hoạt kéo thả, tránh click nhầm
      },
    })
  );

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

  // Tìm task đang được kéo
  const activeTask = activeId ? tasks.find(t => t.id.toString() === activeId) : null;

  // Tìm column chứa task theo ID
  const findColumnOfTask = (taskId) => {
    for (const [colId, col] of Object.entries(columns)) {
      if (col.tasks.some(t => t.id.toString() === taskId)) {
        return colId;
      }
    }
    return null;
  };

  const handleDragStart = (event) => {
    setActiveId(event.active.id);
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;
    setActiveId(null);

    if (!over) return;

    const activeTaskId = active.id;
    const overId = over.id;

    // Xác định column đích: nếu thả vào column thì overId là columnId, 
    // nếu thả vào card khác thì tìm column chứa card đó
    let destinationColumn;
    if (['TODO', 'IN_PROGRESS', 'DONE'].includes(overId)) {
      destinationColumn = overId;
    } else {
      destinationColumn = findColumnOfTask(overId);
    }

    const sourceColumn = findColumnOfTask(activeTaskId);

    if (!destinationColumn || !sourceColumn) return;
    if (sourceColumn === destinationColumn) return;

    const taskId = parseInt(activeTaskId, 10);
    onUpdate(taskId, { status: destinationColumn });
  };

  return (
    <div className="mt-8">
      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
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

        <DragOverlay>
          {activeTask ? (
            <div className="bg-white rounded-xl p-4 shadow-2xl border-2 border-indigo-400 w-72 rotate-3">
              <span className="text-[10px] font-semibold uppercase text-indigo-600">
                {activeTask.priority || 'Medium'}
              </span>
              <h3 className="text-sm font-medium text-slate-800 mt-1">
                {activeTask.title}
              </h3>
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>
    </div>
  );
}
