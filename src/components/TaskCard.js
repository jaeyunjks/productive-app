// src/components/TaskCard.js
import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useContext } from 'react';
import { AppContext } from '../contexts/AppContext';

const TaskCard = ({ task, columnId, onEdit }) => {
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
    const { state } = useContext(AppContext);
    const isPlannedToday = state.dailyPlan?.date === new Date().toISOString().split('T')[0] && state.dailyPlan?.taskIds.includes(task.id);

    return (
        <div
            ref={setNodeRef}
            style={style}
            {...attributes}
            {...listeners}
            onClick={onEdit}  // Klik task buka modal edit
            className={`bg-background rounded-xl border-2 p-5 shadow-sm hover:shadow-md transition-all cursor-pointer ${isPlannedToday ? 'border-accent shadow-lg' : 'border-border/70'
                } ${isDragging ? 'shadow-2xl rotate-3 scale-105' : ''}`}
        >
            <h4 className="font-medium text-primary mb-2">
                {task.title || 'Untitled Task'}
            </h4>

            {task.description && (
                <p className="text-sm text-secondary leading-relaxed mb-4">
                    {task.description}
                </p>
            )}

            {/* Priority Badge */}
            {task.priority && (
                <span
                    className={`inline-block text-xs px-3 py-1 rounded-full font-medium mr-2 ${task.priority === 'High'
                        ? 'bg-red-100 text-red-700'
                        : task.priority === 'Medium'
                            ? 'bg-yellow-100 text-yellow-700'
                            : 'bg-green-100 text-green-700'
                        }`}
                >
                    {task.priority}
                </span>
            )}

            {/* Due Date */}
            {task.dueDate && (
                <span className="text-xs text-secondary">
                    Due {new Date(task.dueDate).toLocaleDateString()}
                </span>
            )}

            {/* Tags */}
            {task.tags && task.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-3">
                    {task.tags.map((tag, idx) => (
                        <span key={idx} className="text-xs px-3 py-1 bg-surface text-secondary rounded-full">
                            {tag}
                        </span>
                    ))}
                </div>
            )}

            {/* Estimated Time */}
            {task.estimatedTime && (
                <span className="text-xs text-secondary block mt-2">
                    Est. {task.estimatedTime}
                </span>
            )}
        </div>
    );
};

export default TaskCard;  