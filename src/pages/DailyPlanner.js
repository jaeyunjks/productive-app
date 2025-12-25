// src/pages/DailyPlanner.js
import React, { useContext, useState } from 'react';
import { AppContext } from '../contexts/AppContext';

const DailyPlanner = () => {
    const { state, dispatch } = useContext(AppContext);
    const tasks = Object.values(state.tasks[state.activeProjectId] || {});
    const today = new Date().toISOString().split('T')[0];
    const plannedTasks = state.dailyPlan?.date === today ? state.dailyPlan.taskIds : [];

    const [selected, setSelected] = useState(plannedTasks);
    const [locked, setLocked] = useState(state.dailyPlan?.date === today);

    const toggleTask = (taskId) => {
        if (!locked) {
            setSelected(prev =>
                prev.includes(taskId) ? prev.filter(id => id !== taskId) : [...prev, taskId]
            );
        }
    };

    const savePlan = () => {
        dispatch({
            type: 'SET_DAILY_PLAN',
            payload: { date: today, taskIds: selected },
        });
        setLocked(true);
    };

    return (
        <div className="p-12">
            <h1 className="text-5xl font-light text-primary mb-4">Daily Planner</h1>
            <p className="text-xl text-secondary mb-12">Plan your focus for today</p>

            <div className="max-w-4xl">
                {tasks.length === 0 ? (
                    <p className="text-secondary text-lg">No tasks yet. Create some on the board!</p>
                ) : (
                    <div className="space-y-4">
                        {tasks.map(task => (
                            <div
                                key={task.id}
                                onClick={() => toggleTask(task.id)}
                                className={`bg-surface rounded-2xl p-6 border-2 transition-all cursor-pointer ${selected.includes(task.id)
                                        ? 'border-accent shadow-lg'
                                        : 'border-transparent hover:border-border'
                                    } ${locked ? 'cursor-not-allowed opacity-80' : ''}`}
                            >
                                <h3 className="text-xl font-medium text-primary">{task.title}</h3>
                                {task.description && <p className="text-secondary mt-2">{task.description}</p>}
                                <div className="flex gap-4 mt-4">
                                    {task.priority && <span className="text-sm text-secondary">{task.priority} Priority</span>}
                                    {selected.includes(task.id) && <span className="text-accent font-medium">Planned for today</span>}
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {!locked && (
                    <button
                        onClick={savePlan}
                        className="mt-12 px-8 py-4 bg-accent text-white text-lg font-medium rounded-2xl hover:bg-accent/90 transition-all"
                    >
                        Lock Today's Plan
                    </button>
                )}
                {locked && (
                    <p className="mt-12 text-accent text-xl font-medium">Today's plan is locked ✓</p>
                )}
            </div>
        </div>
    );
};

export default DailyPlanner;