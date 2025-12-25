// src/pages/FocusMode.js
import React, { useContext, useState, useEffect } from 'react';
import { AppContext } from '../contexts/AppContext';
import { useNavigate } from 'react-router-dom';

const FocusMode = () => {
    const { state, dispatch } = useContext(AppContext);
    const navigate = useNavigate();
    const [currentTaskId, setCurrentTaskId] = useState(null);

    const tasks = state.tasks[state.activeProjectId] || {};
    const allTasks = Object.values(tasks);
    const inProgressTasks = allTasks.filter(t => t.status === 'In Progress');
    const currentTask = allTasks.find(t => t.id === currentTaskId) || inProgressTasks[0];

    useEffect(() => {
        if (!currentTask && inProgressTasks.length > 0) {
            setCurrentTaskId(inProgressTasks[0].id);
        }
    }, [currentTask, inProgressTasks]);

    const completeTask = () => {
        if (currentTask) {
            dispatch({
                type: 'UPDATE_TASK',
                payload: {
                    projectId: state.activeProjectId,
                    taskId: currentTask.id,
                    updates: { status: 'Done' },
                },
            });
            setCurrentTaskId(null);
        }
    };

    if (!currentTask) {
        return (
            <div className="h-screen bg-background flex items-center justify-center">
                <div className="text-center">
                    <p className="text-3xl text-secondary mb-8">No task in progress</p>
                    <button onClick={() => navigate('/dashboard')} className="text-accent text-lg underline">
                        Back to Board
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="h-screen bg-background flex flex-col justify-center items-center px-12">
            <div className="max-w-4xl w-full text-center">
                <h1 className="text-6xl md:text-8xl font-light text-primary mb-12">
                    {currentTask.title}
                </h1>
                {currentTask.description && (
                    <p className="text-2xl text-secondary mb-16 leading-relaxed">
                        {currentTask.description}
                    </p>
                )}
                <div className="flex justify-center gap-12 mt-24">
                    <button
                        onClick={completeTask}
                        className="px-12 py-6 bg-accent text-white text-2xl font-medium rounded-2xl hover:bg-accent/90 transition-all"
                    >
                        Complete Task
                    </button>
                    <button
                        onClick={() => navigate('/dashboard')}
                        className="px-12 py-6 border-2 border-border text-primary text-2xl font-medium rounded-2xl hover:bg-surface transition-all"
                    >
                        Exit Focus Mode
                    </button>
                </div>
            </div>
        </div>
    );
};

export default FocusMode;