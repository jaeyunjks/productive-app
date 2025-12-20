// src/pages/DashboardLayout.js
import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';

const DashboardLayout = () => {
    return (
        <div className="flex flex-col h-screen">
            <Header />
            <div className="flex flex-1 overflow-hidden">
                <Sidebar />
                <main className="flex-1 overflow-y-auto bg-surface p-8">
                    <Outlet /> {/* Ini akan render Board, FocusMode, dll. */}
                </main>
            </div>
        </div>
    );
};

export default DashboardLayout;