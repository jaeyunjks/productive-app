// src/components/Header.js
import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../contexts/AppContext';

const Header = () => {
    const { state, dispatch } = useContext(AppContext);
    const navigate = useNavigate();

    const activeProject = state.projects.find(p => p.id === state.activeProjectId);
    const projectName = activeProject ? activeProject.name : 'Productive';

    const handleBackToProjects = () => {
        dispatch({ type: 'SET_ACTIVE_PROJECT', payload: null });
        navigate('/');
    };

    return (
        <header className="bg-surface border-b border-border px-6 py-5 md:px-10 md:py-6 flex justify-between items-center shadow-sm">
            {/* Logo atau Title App + Project Name */}
            <div className="flex items-center gap-4">
                <div className="text-2xl md:text-3xl font-light text-primary tracking-tight">
                    {projectName}
                </div>
                {activeProject && (
                    <span className="text-sm md:text-base text-secondary font-light">
                        / {activeProject.type || 'Personal'}
                    </span>
                )}
            </div>

            {/* Tombol Back to Projects (hanya muncul kalau ada project aktif) */}
            {activeProject && (
                <button
                    onClick={handleBackToProjects}
                    className="group flex items-center gap-2 px-5 py-2.5 md:px-6 md:py-3 bg-background border border-border/70 rounded-xl hover:border-accent hover:bg-surface/80 transition-all duration-300 shadow-sm hover:shadow"
                >
                    <svg className="w-4 h-4 md:w-5 md:h-5 text-primary group-hover:text-accent transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                    <span className="text-sm md:text-base font-medium text-primary group-hover:text-accent transition-colors">
                        Back to Homepage
                    </span>
                </button>
            )}
        </header>
    );
};

export default Header;