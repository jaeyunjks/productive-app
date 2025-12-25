// src/components/Column.js
import React, { useState } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import TaskCard from './TaskCard';
import TaskModal from './Modals/TaskModal';  // Import modal

const Column = ({ id, title, tasks }) => {
    const [modalOpen, setModalOpen] = useState(false);
    const [editingTask, setEditingTask] = useState(null);

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

    // Fungsi untuk membuka modal Add Task
    const openAddModal = () => {
        setEditingTask(null);
        setModalOpen(true);
    };

    // Fungsi untuk membuka modal Edit Task (dipanggil dari TaskCard)
    const openEditModal = (task) => {
        setEditingTask(task);
        setModalOpen(true);
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            className="bg-surface rounded-2xl border border-border/50 p-6 min-w-[340px] flex flex-col"
        >
            {/* Column Header (draggable) */}
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

            {/* Task List */}
            <div className="flex-1 min-h-[200px] space-y-4">
                {tasks.map((task) => (
                    <TaskCard
                        key={task.id}
                        task={task}
                        columnId={id}
                        onEdit={() => openEditModal(task)}  // Kirim fungsi edit ke TaskCard
                    />
                ))}
            </div>

            {/* Add Task Button */}
            <button
                onClick={openAddModal}
                className="mt-6 text-secondary hover:text-primary text-left text-sm font-medium py-2 transition-colors flex items-center gap-2"
            >
                <span>+</span> Add a task
            </button>

            {/* Modal Add/Edit Task */}
            <TaskModal
                isOpen={modalOpen}
                onClose={() => {
                    setModalOpen(false);
                    setEditingTask(null);
                }}
                task={editingTask}
                columnId={id}
            />
        </div>
    );
};

export default Column;