// src/components/Sidebar.js
import React from 'react';
import { NavLink } from 'react-router-dom';

const Sidebar = () => {
    const navItems = [
        { to: '/dashboard', label: 'Board', icon: 'board' },
        { to: '/dashboard/daily', label: 'Daily Planner', icon: 'calendar' },
        { to: '/dashboard/progress', label: 'Progress', icon: 'chart' },
        { to: '/dashboard/focus', label: 'Focus Mode', icon: 'target' },
    ];

    const icons = {
        board: (
            <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                <rect x="3" y="3" width="7" height="18" rx="2" />
                <rect x="10.5" y="3" width="7" height="18" rx="2" />
                <rect x="18" y="3" width="7" height="18" rx="2" />
            </svg>
        ),
        calendar: (
            <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                <path d="M16 2v4M8 2v4M3 10h18" />
            </svg>
        ),
        chart: (
            <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                <path d="M3 12l6-6 4 4 8-8" />
                <path d="M17 8h4v4" />
                <path d="M3 18h18" />
            </svg>
        ),
        target: (
            <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                <circle cx="12" cy="12" r="10" />
                <circle cx="12" cy="12" r="6" />
                <circle cx="12" cy="12" r="2" />
            </svg>
        ),
    };

    return (
        <aside className="w-72 bg-background border-r border-border p-8">
            <nav className="space-y-3">
                {navItems.map(item => (
                    <NavLink
                        key={item.to}
                        to={item.to}
                        end
                        className={({ isActive }) =>
                            `flex items-center space-x-4 px-6 py-5 rounded-2xl text-lg font-medium transition-all duration-300 ${isActive
                                ? 'bg-accent text-white shadow-md'
                                : 'text-secondary hover:bg-surface hover:text-primary'
                            }`
                        }
                    >
                        <span className={item.label === 'Board' ? '' : 'opacity-90'}>
                            {icons[item.icon]}
                        </span>
                        <span>{item.label}</span>
                    </NavLink>
                ))}
            </nav>
        </aside>
    );
};

export default Sidebar;