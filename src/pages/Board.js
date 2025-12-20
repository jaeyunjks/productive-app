// src/pages/Board.js
import React, { useContext, useMemo } from 'react';
import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
} from '@dnd-kit/core';
import {
    SortableContext,
    horizontalListSortingStrategy,
    sortableKeyboardCoordinates,
} from '@dnd-kit/sortable';

import { AppContext } from '../contexts/AppContext';
import Column from '../components/Column';

const Board = () => {
    const { state, dispatch } = useContext(AppContext);
    const activeProject = state.projects.find(p => p.id === state.activeProjectId);

    // SEMUA HOOKS WAJIB DI ATAS SINI — SEBELUM ADA RETURN APAPUN
    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    // Early return — SEKARANG AMAN karena semua Hooks sudah dipanggil
    if (!activeProject) {
        return (
            <div className="flex items-center justify-center h-full">
                <p className="text-secondary text-lg">No active project</p>
            </div>
        );
    }

    // Data preparation — Hooks lagi
    const columns = activeProject.columns || [];
    const tasks = state.tasks[state.activeProjectId] || {};

    const columnTasks = useMemo(() => {
        return columns.map(col => ({
            id: col,
            title: col,
            tasks: Object.values(tasks).filter(t => t.status === col),
        }));
    }, [columns, tasks]);

    // handleDragEnd tanpa TypeScript annotation
    const handleDragEnd = (event) => {
        const { active, over } = event;

        if (!over) return;

        const activeTask = Object.values(tasks).find(t => t.id === active.id);
        if (!activeTask) return;

        const destinationColumnId = columnTasks.find(col => col.id === over.id)?.id || over.id;

        if (activeTask.status !== destinationColumnId) {
            dispatch({
                type: 'UPDATE_TASK',
                payload: {
                    projectId: state.activeProjectId,
                    taskId: active.id,
                    updates: { status: destinationColumnId },
                },
            });
        }
    };

    // Render utama
    return (
        <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
        >
            <SortableContext items={columns} strategy={horizontalListSortingStrategy}>
                <div className="h-full overflow-x-auto pb-8">
                    <div className="flex gap-8 items-start min-w-fit">
                        {columnTasks.map(col => (
                            <Column key={col.id} id={col.id} title={col.title} tasks={col.tasks} />
                        ))}

                        {/* Add Column Placeholder */}
                        <div className="bg-surface/50 rounded-2xl border border-border/30 border-dashed w-80 p-6 flex items-center justify-center min-h-[200px]">
                            <button className="text-secondary hover:text-primary font-medium">
                                + Add another column
                            </button>
                        </div>
                    </div>
                </div>
            </SortableContext>
        </DndContext>
    );
};

export default Board;