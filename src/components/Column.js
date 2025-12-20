// src/components/Column.js
import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import TaskCard from './TaskCard';

const Column = ({ id, title, tasks }) => {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            className="bg-surface rounded-2xl border border-border/50 p-6 min-w-[320px] flex flex-col"
        >
            <h3
                {...attributes}
                {...listeners}
                className="text-lg font-medium text-primary mb-6 cursor-grab active:cursor-grabbing select-none"
            >
                {title}
                <span className="ml-3 text-sm text-secondary font-normal">
                    {tasks.length}
                </span>
            </h3>

            <div className="flex-1 min-h-[200px] space-y-4">
                {tasks.map((task) => (
                    <TaskCard key={task.id} task={task} columnId={id} />
                ))}
            </div>

            <button className="mt-6 text-secondary hover:text-primary text-left text-sm font-medium py-2 transition-colors">
                + Add a task
            </button>
        </div>
    );
};

export default Column;