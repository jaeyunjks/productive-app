import React, { useContext } from 'react';
import { AppContext } from '../contexts/AppContext';

const Header = () => {
    const { state } = useContext(AppContext);
    const activeProject = state.projects.find(p => p.id === state.activeProjectId);

    return (
        <header className="bg-background border-b border-border px-8 py-6">
            <h1 className="text-3xl font-bold">
                {activeProject ? activeProject.name : 'Productive'}
            </h1>
        </header>
    );
};

export default Header;