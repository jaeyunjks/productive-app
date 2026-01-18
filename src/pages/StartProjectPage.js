// src/pages/StartProjectPage.js
import React, { useState, useContext } from 'react';
import { AppContext } from '../contexts/AppContext';
import { useNavigate } from 'react-router-dom';

const StartProjectPage = () => {
    const { state, dispatch } = useContext(AppContext);
    const { projects } = state;
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

        // Sample tasks otomatis
        const sampleTasks = [
            { id: generateId(), title: 'Design homepage mockup', description: 'Create high-fidelity designs in Figma', priority: 'High', dueDate: null, estimatedTime: '4h', tags: ['design'], status: 'To Do' },
            { id: generateId(), title: 'Set up React project', description: 'Initialize with Tailwind and routing', priority: 'Medium', dueDate: null, estimatedTime: '2h', tags: ['development'], status: 'In Progress' },
            { id: generateId(), title: 'Research competitors', description: 'Analyze top 5 productivity apps', priority: 'Low', dueDate: null, estimatedTime: '3h', tags: ['research'], status: 'Backlog' },
            { id: generateId(), title: 'Write user stories', description: 'Define core features from user perspective', priority: 'High', dueDate: null, estimatedTime: '2h', tags: ['planning'], status: 'To Do' },
            { id: generateId(), title: 'Deploy to Vercel', description: 'Set up CI/CD pipeline', priority: 'Medium', dueDate: null, estimatedTime: '1h', tags: ['deployment'], status: 'Done' },
        ];

        sampleTasks.forEach(task => {
            dispatch({
                type: 'ADD_TASK',
                payload: { ...task, projectId: newProject.id },
            });
        });

        navigate('/dashboard');
    };

    const handleGuidedSetup = () => {
        alert('Guided Setup Wizard coming soon – stay tuned!');
    };

    const handleTemplateStart = () => {
        alert('Template Gallery with previews coming soon!');
    };

    const handleSelectProject = (projectId) => {
        dispatch({ type: 'SET_ACTIVE_PROJECT', payload: projectId });
        navigate('/dashboard');
    };

    return (
        <div className="min-h-screen bg-background animated-background flex flex-col justify-center px-4 py-8 sm:py-12 md:py-16 lg:py-20 xl:py-24">
            {/* Floating Orbs */}
            <div className="orb orb-1"></div>
            <div className="orb orb-2"></div>
            <div className="orb orb-3"></div>
            <div className="orb orb-4"></div>

            <div className="max-w-4xl sm:max-w-5xl md:max-w-6xl lg:max-w-7xl mx-auto w-full px-4 sm:px-6 md:px-8 lg:px-0 relative z-10">
                {/* Hero Section */}
                <header className="text-center mb-12 sm:mb-16 md:mb-20 lg:mb-24 xl:mb-32">
                    <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-7xl font-light text-primary tracking-tight mb-4 md:mb-6">
                        Start a New Project
                    </h1>
                    <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-secondary max-w-md sm:max-w-lg md:max-w-xl lg:max-w-3xl mx-auto leading-relaxed">
                        Organize your ideas, set clear goals, and move forward with intention and calm focus.
                    </p>
                </header>

                {/* Option Cards */}
                <div className="grid grid-cols-1 gap-8 md:gap-10 lg:gap-12 md:grid-cols-3">
                    {/* Quick Start */}
                    <div
                        className="group bg-surface rounded-3xl border border-border/50 p-6 sm:p-8 md:p-10 lg:p-12 shadow-sm hover:shadow-2xl transition-all duration-500 cursor-pointer"
                        onClick={() => document.getElementById('quick-input')?.focus()}
                    >
                        <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 mb-6 sm:mb-8 text-accent/80">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                <path d="M13 10V3L4 14h7v7l9-11h-7z" />
                            </svg>
                        </div>
                        <h3 className="text-2xl sm:text-2xl md:text-3xl font-medium text-primary mb-4">Quick Start</h3>
                        <p className="text-base sm:text-base md:text-lg text-secondary leading-relaxed mb-6 sm:mb-8 md:mb-10">
                            Instantly create a project with a name and a clean default workflow.
                        </p>

                        <input
                            id="quick-input"
                            type="text"
                            placeholder="Enter project name..."
                            value={quickName}
                            onChange={(e) => setQuickName(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleQuickStart()}
                            className="w-full px-4 sm:px-5 md:px-6 py-3 sm:py-3 md:py-4 text-base md:text-lg bg-background border border-border/70 rounded-2xl focus:outline-none focus:border-accent focus:ring-4 focus:ring-accent/10 transition-all"
                        />

                        <button
                            onClick={(e) => { e.stopPropagation(); handleQuickStart(); }}
                            disabled={!quickName.trim()}
                            className="mt-6 sm:mt-6 md:mt-8 w-full py-3 sm:py-3 md:py-4 bg-accent text-white text-base md:text-lg font-medium rounded-2xl hover:bg-accent/90 disabled:bg-muted disabled:text-secondary/60 transition-all duration-300"
                        >
                            Create Project
                        </button>
                    </div>

                    {/* Guided Setup */}
                    <div
                        onClick={handleGuidedSetup}
                        className="group bg-surface rounded-3xl border border-border/50 p-6 sm:p-8 md:p-10 lg:p-12 shadow-sm hover:shadow-2xl transition-all duration-500 cursor-pointer"
                    >
                        <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 mb-6 sm:mb-8 text-accent/80">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                <path d="M12 2L2 12h3v8h14v-8h3L12 2z" />
                                <path d="M9 22V12h6v10" />
                            </svg>
                        </div>
                        <h3 className="text-2xl sm:text-2xl md:text-3xl font-medium text-primary mb-4">Guided Setup</h3>
                        <p className="text-base sm:text-base md:text-lg text-secondary leading-relaxed mb-6 sm:mb-8 md:mb-10">
                            Define your main goal, deadline, project type, and customize the workflow step by step.
                        </p>
                        <div className="mt-6 sm:mt-8 md:mt-16 text-accent text-base md:text-lg font-medium group-hover:underline">
                            Begin Guided Setup →
                        </div>
                    </div>

                    {/* From Template */}
                    <div
                        onClick={handleTemplateStart}
                        className="group bg-surface rounded-3xl border border-border/50 p-6 sm:p-8 md:p-10 lg:p-12 shadow-sm hover:shadow-2xl transition-all duration-500 cursor-pointer"
                    >
                        <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 mb-6 sm:mb-8 text-accent/80">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                <rect x="3" y="3" width="7" height="7" rx="1" />
                                <rect x="14" y="3" width="7" height="7" rx="1" />
                                <rect x="3" y="14" width="7" height="7" rx="1" />
                                <rect x="14" y="14" width="7" height="7" rx="1" />
                            </svg>
                        </div>
                        <h3 className="text-2xl sm:text-2xl md:text-3xl font-medium text-primary mb-4">From Template</h3>
                        <p className="text-base sm:text-base md:text-lg text-secondary leading-relaxed mb-6 sm:mb-8 md:mb-10">
                            Start from curated templates for study, fitness, work sprints, or personal growth.
                        </p>
                        <div className="mt-6 sm:mt-8 md:mt-16 text-accent text-base md:text-lg font-medium group-hover:underline">
                            Browse Templates →
                        </div>
                    </div>
                </div>

                {/* List Existing Projects */}
                {projects.length > 0 && (
                    <div className="mt-16 bg-surface rounded-3xl p-10 shadow-xl">
                        <h2 className="text-3xl font-light text-primary mb-8 text-center">
                            Your Projects
                        </h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                            {projects.map((project) => (
                                <button
                                    key={project.id}
                                    onClick={() => handleSelectProject(project.id)}
                                    className="bg-background border border-border hover:border-accent rounded-2xl p-6 text-left transition-all shadow-sm hover:shadow-md group"
                                >
                                    <h3 className="text-2xl font-medium text-primary mb-2 group-hover:text-accent transition-colors">
                                        {project.name}
                                    </h3>
                                    <p className="text-secondary text-sm">
                                        Created: {new Date(parseInt(project.id.substring(0, 13))).toLocaleDateString()}
                                    </p>
                                    <p className="text-sm text-secondary mt-1">
                                        Columns: {project.columns?.join(', ') || 'Default'}
                                    </p>
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                <footer className="text-center mt-12 sm:mt-16 md:mt-24 lg:mt-32 xl:mt-40 text-sm text-muted">
                    <p className="text-sm md:text-base">
                        All projects are saved locally in your browser — no account required.
                    </p>
                </footer>
            </div>
        </div>
    );
};

export default StartProjectPage;