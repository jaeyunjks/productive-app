// src/components/TaskCard.js
import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

const TaskCard = ({ task, columnId }) => {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({
        id: task.id,
        data: { columnId },
    });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            {...attributes}
            {...listeners}
            className={`bg-background rounded-xl border border-border/70 p-5 shadow-sm hover:shadow-md transition-all cursor-grab active:cursor-grabbing ${isDragging ? 'shadow-2xl rotate-3 scale-105' : ''
                }`}
        >
            <h4 className="font-medium text-primary mb-2">
                {task.title || 'Untitled Task'}
            </h4>
            {task.description && (
                <p className="text-sm text-secondary leading-relaxed mb-4">
                    {task.description}
                </p>
            )}
        </div>
    );
};

export default TaskCard;