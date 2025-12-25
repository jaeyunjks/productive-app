// src/components/Modals/TaskModal.js
import React, { useState, useContext, useEffect } from 'react';
import { AppContext } from '../../contexts/AppContext';

const TaskModal = ({ isOpen, onClose, task = null, columnId }) => {
    const { dispatch, state } = useContext(AppContext);
    const isEdit = !!task;

    const [title, setTitle] = useState(task?.title || '');
    const [description, setDescription] = useState(task?.description || '');
    const [priority, setPriority] = useState(task?.priority || 'Medium');
    const [dueDate, setDueDate] = useState(task?.dueDate || '');
    const [estimatedTime, setEstimatedTime] = useState(task?.estimatedTime || '');
    const [tags, setTags] = useState(task?.tags?.join(', ') || '');

    useEffect(() => {
        if (isOpen && task) {
            setTitle(task.title || '');
            setDescription(task.description || '');
            setPriority(task.priority || 'Medium');
            setDueDate(task.dueDate || '');
            setEstimatedTime(task.estimatedTime || '');
            setTags(task.tags?.join(', ') || '');
        }
    }, [isOpen, task]);

    if (!isOpen) return null;

    const generateId = () => Date.now().toString(36) + Math.random().toString(36).substr(2);

    const handleSubmit = () => {
        if (!title.trim()) return;

        const taskData = {
            id: isEdit ? task.id : generateId(),
            title,
            description,
            priority,
            dueDate: dueDate || null,
            estimatedTime,
            tags: tags.split(',').map(t => t.trim()).filter(t => t),
            status: isEdit ? task.status : columnId,
        };

        dispatch({
            type: isEdit ? 'UPDATE_TASK' : 'ADD_TASK',
            payload: {
                projectId: state.activeProjectId,
                taskId: isEdit ? task.id : undefined,
                taskData,
            },
        });

        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
            <div className="bg-background rounded-3xl shadow-2xl border border-border w-full max-w-2xl p-10">
                <h2 className="text-3xl font-medium text-primary mb-8">
                    {isEdit ? 'Edit Task' : 'New Task'}
                </h2>

                <div className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-secondary mb-2">Title</label>
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="w-full px-5 py-4 bg-surface border border-border rounded-2xl text-primary focus:outline-none focus:border-accent focus:ring-4 focus:ring-accent/10 transition-all"
                            placeholder="Enter task title..."
                            autoFocus
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-secondary mb-2">Description</label>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            rows="4"
                            className="w-full px-5 py-4 bg-surface border border-border rounded-2xl text-primary focus:outline-none focus:border-accent focus:ring-4 focus:ring-accent/10 transition-all resize-none"
                            placeholder="Add details..."
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-secondary mb-2">Priority</label>
                            <select
                                value={priority}
                                onChange={(e) => setPriority(e.target.value)}
                                className="w-full px-5 py-4 bg-surface border border-border rounded-2xl text-primary focus:outline-none focus:border-accent transition-all"
                            >
                                <option value="Low">Low</option>
                                <option value="Medium">Medium</option>
                                <option value="High">High</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-secondary mb-2">Due Date</label>
                            <input
                                type="date"
                                value={dueDate}
                                onChange={(e) => setDueDate(e.target.value)}
                                className="w-full px-5 py-4 bg-surface border border-border rounded-2xl text-primary focus:outline-none focus:border-accent transition-all"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-secondary mb-2">Estimated Time</label>
                            <input
                                type="text"
                                value={estimatedTime}
                                onChange={(e) => setEstimatedTime(e.target.value)}
                                placeholder="e.g. 2h, 30m"
                                className="w-full px-5 py-4 bg-surface border border-border rounded-2xl text-primary focus:outline-none focus:border-accent transition-all"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-secondary mb-2">Tags</label>
                            <input
                                type="text"
                                value={tags}
                                onChange={(e) => setTags(e.target.value)}
                                placeholder="design, urgent, review"
                                className="w-full px-5 py-4 bg-surface border border-border rounded-2xl text-primary focus:outline-none focus:border-accent transition-all"
                            />
                        </div>
                    </div>
                </div>

                <div className="flex justify-end gap-4 mt-10">
                    <button
                        onClick={onClose}
                        className="px-8 py-4 text-primary font-medium hover:bg-surface rounded-2xl transition-all"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSubmit}
                        disabled={!title.trim()}
                        className="px-8 py-4 bg-accent text-white font-medium rounded-2xl hover:bg-accent/90 disabled:bg-muted disabled:text-secondary/60 transition-all"
                    >
                        {isEdit ? 'Save Changes' : 'Create Task'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default TaskModal;