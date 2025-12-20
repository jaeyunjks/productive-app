// src/pages/StartProjectPage.js
import React, { useState } from 'react';
import { useContext } from 'react';
import { AppContext } from '../contexts/AppContext';
import { useNavigate } from 'react-router-dom';

const StartProjectPage = () => {
    const { dispatch } = useContext(AppContext);
    const navigate = useNavigate();

    const [quickName, setQuickName] = useState('');

    const generateId = () => Date.now().toString(36) + Math.random().toString(36).substr(2);

    const handleQuickStart = () => {
        if (!quickName.trim()) return;

        const defaultColumns = ['Backlog', 'To Do', 'In Progress', 'Done'];

        const newProject = {
            id: generateId(),
            name: quickName,
            type: 'Personal',
            goal: '',
            deadline: null,
            columns: defaultColumns,
        };

        dispatch({ type: 'CREATE_PROJECT', payload: newProject });
        navigate('/dashboard');
    };

    const handleGuidedSetup = () => {
        alert('Guided Setup Wizard coming soon – stay tuned!');
    };

    const handleTemplateStart = () => {
        alert('Template Gallery with previews coming soon!');
    };

    return (
        <div className="min-h-screen bg-background flex flex-col justify-center px-8 py-16">
            <div className="max-w-7xl mx-auto w-full">
                {/* Hero Section */}
                <header className="text-center mb-20">
                    <h1 className="text-6xl md:text-8xl font-light text-primary tracking-tight mb-6">
                        Start a New Project
                    </h1>
                    <p className="text-xl md:text-2xl text-secondary max-w-3xl mx-auto leading-relaxed">
                        Organize your ideas, set clear goals, and move forward with intention and calm focus.
                    </p>
                </header>

                {/* Option Cards – Elegant & Spacious */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-12">

                    {/* Quick Start */}
                    <div
                        className="bg-surface rounded-3xl border border-border/50 p-12 shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer group"
                        onClick={() => document.getElementById('quick-input')?.focus()}
                    >
                        <h3 className="text-3xl font-medium text-primary mb-4">Quick Start</h3>
                        <p className="text-lg text-secondary leading-relaxed mb-10">
                            Instantly create a project with a name and a clean default workflow.
                        </p>

                        <input
                            id="quick-input"
                            type="text"
                            placeholder="Enter project name..."
                            value={quickName}
                            onChange={(e) => setQuickName(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleQuickStart()}
                            className="w-full px-6 py-4 text-lg bg-background border border-border/70 rounded-2xl focus:outline-none focus:border-accent focus:ring-4 focus:ring-accent/10 transition-all"
                        />

                        <button
                            onClick={(e) => { e.stopPropagation(); handleQuickStart(); }}
                            disabled={!quickName.trim()}
                            className="mt-8 w-full py-4 bg-accent text-white text-lg font-medium rounded-2xl hover:bg-accent/90 disabled:bg-muted disabled:text-secondary/60 transition-all duration-300"
                        >
                            Create Project
                        </button>
                    </div>

                    {/* Guided Setup */}
                    <div
                        onClick={handleGuidedSetup}
                        className="bg-surface rounded-3xl border border-border/50 p-12 shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer group"
                    >
                        <h3 className="text-3xl font-medium text-primary mb-4">Guided Setup</h3>
                        <p className="text-lg text-secondary leading-relaxed mb-10">
                            Define your main goal, deadline, project type, and customize the workflow step by step.
                        </p>
                        <div className="mt-16 text-accent text-lg font-medium group-hover:underline">
                            Begin Guided Setup →
                        </div>
                    </div>

                    {/* From Template */}
                    <div
                        onClick={handleTemplateStart}
                        className="bg-surface rounded-3xl border border-border/50 p-12 shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer group"
                    >
                        <h3 className="text-3xl font-medium text-primary mb-4">From Template</h3>
                        <p className="text-lg text-secondary leading-relaxed mb-10">
                            Start from curated templates for study, fitness, work sprints, or personal growth.
                        </p>
                        <div className="mt-16 text-accent text-lg font-medium group-hover:underline">
                            Browse Templates →
                        </div>
                    </div>

                </div>

                {/* Footer Note */}
                <footer className="text-center mt-24">
                    <p className="text-sm text-muted">
                        All projects are saved locally in your browser — no account required.
                    </p>
                </footer>
            </div>
        </div>
    );
};

export default StartProjectPage;