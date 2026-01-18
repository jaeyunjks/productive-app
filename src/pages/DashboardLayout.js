// src/pages/DashboardLayout.js
import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';

const DashboardLayout = () => {
    return (
        <div className="flex flex-col h-screen">
            <Header />  {/* Semua title project + tombol back ada di Header.js sekarang */}

            <div className="flex flex-1 overflow-hidden">
                <Sidebar />
                <main className="flex-1 overflow-y-auto bg-surface p-6 md:p-8">
                    <Outlet /> {/* Board, FocusMode, DailyPlanner, ProgressSummary */}
                </main>
            </div>
        </div>
    );
};

export default DashboardLayout;