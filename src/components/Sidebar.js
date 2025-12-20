import React from 'react';
import { NavLink } from 'react-router-dom';

const Sidebar = () => {
    const navItems = [
        { to: '/dashboard', label: 'Board', icon: '📋' },
        { to: '/dashboard/daily', label: 'Daily Planner', icon: '📅' },
        { to: '/dashboard/progress', label: 'Progress', icon: '📊' },
        { to: '/dashboard/focus', label: 'Focus Mode', icon: '🎯' },
    ];

    return (
        <aside className="w-64 bg-background border-r border-border p-6">
            <nav className="space-y-2">
                {navItems.map(item => (
                    <NavLink
                        key={item.to}
                        to={item.to}
                        end
                        className={({ isActive }) =>
                            `flex items-center space-x-3 px-4 py-3 rounded-lg text-lg transition-colors ${isActive
                                ? 'bg-accent text-white'
                                : 'text-secondary hover:bg-surface hover:text-primary'
                            }`
                        }
                    >
                        <span>{item.icon}</span>
                        <span>{item.label}</span>
                    </NavLink>
                ))}
            </nav>
        </aside>
    );
};

export default Sidebar;