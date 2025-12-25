// src/pages/ProgressSummary.js
import React, { useContext } from 'react';
import { AppContext } from '../contexts/AppContext';

const ProgressSummary = () => {
    const { state } = useContext(AppContext);
    const tasks = Object.values(state.tasks[state.activeProjectId] || {});
    const total = tasks.length;
    const done = tasks.filter(t => t.status === 'Done').length;
    const percentage = total > 0 ? Math.round((done / total) * 100) : 0;

    const tasksByColumn = state.projects.find(p => p.id === state.activeProjectId)?.columns?.reduce((acc, col) => {
        acc[col] = tasks.filter(t => t.status === col).length;
        return acc;
    }, {}) || {};

    return (
        <div className="p-12">
            <h1 className="text-5xl font-light text-primary mb-12">Progress Summary</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-5xl">
                <div className="bg-surface rounded-3xl p-12 text-center">
                    <p className="text-8xl font-light text-accent mb-4">{percentage}%</p>
                    <p className="text-2xl text-primary">Complete</p>
                    <p className="text-secondary mt-4">{done} of {total} tasks done</p>
                </div>

                <div className="space-y-6">
                    {Object.entries(tasksByColumn).map(([column, count]) => (
                        <div key={column} className="bg-surface rounded-2xl p-6 flex justify-between items-center">
                            <h3 className="text-xl font-medium text-primary">{column}</h3>
                            <span className="text-3xl text-secondary">{count}</span>
                        </div>
                    ))}
                </div>
            </div>

            <div className="mt-16 max-w-2xl">
                <h2 className="text-3xl font-light text-primary mb-6">End-of-Day Reflection</h2>
                <textarea
                    placeholder="What went well today? What could be better?"
                    className="w-full h-48 px-8 py-6 bg-surface border border-border/50 rounded-2xl text-lg text-primary placeholder-secondary/70 focus:outline-none focus:border-accent transition-all"
                />
            </div>
        </div>
    );
};

export default ProgressSummary;