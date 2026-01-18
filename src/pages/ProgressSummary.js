// src/pages/ProgressSummary.js
import React, { useContext, useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { AppContext } from '../contexts/AppContext';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';

const ProgressSummary = () => {
    const { state, dispatch } = useContext(AppContext);
    const { tasks: allTasksByProject, reflections } = state;
    const activeProjectId = state.activeProjectId;
    const tasks = Object.values(allTasksByProject[activeProjectId] || {});

    const [selectedDate, setSelectedDate] = useState(new Date());

    const dateStr = selectedDate.toISOString().split('T')[0];

    const dailyTasks = tasks.filter((t) => t.date === dateStr);
    const dailyDone = dailyTasks.filter((t) => t.status === 'Done').length;
    const dailyTotal = dailyTasks.length;
    const dailyTimeMin = (dailyTasks.reduce((sum, t) => sum + (t.timeSpent || 0), 0) / 60).toFixed(1);

    const pieData = [
        { name: 'Done', value: dailyDone },
        { name: 'Pending', value: dailyTotal - dailyDone },
    ];

    const COLORS = ['#00C49F', '#FF8042'];

    const total = tasks.length;
    const done = tasks.filter((t) => t.status === 'Done').length;
    const percentage = total > 0 ? Math.round((done / total) * 100) : 0;

    const tasksByColumn = state.projects
        .find((p) => p.id === activeProjectId)
        ?.columns?.reduce((acc, col) => {
            acc[col] = tasks.filter((t) => t.status === col).length;
            return acc;
        }, {}) || {};

    const calculateStreak = () => {
        let streak = 0;
        let currentDate = new Date();
        currentDate.setDate(currentDate.getDate() - 1);

        const maxDays = 365;
        let checked = 0;

        while (checked < maxDays) {
            const checkDate = currentDate.toISOString().split('T')[0];
            const dayTasks = tasks.filter((t) => t.date === checkDate);
            const dayDone = dayTasks.filter((t) => t.status === 'Done').length;

            if (dayDone > 0) {
                streak++;
            } else if (dayTasks.length === 0) {
                currentDate.setDate(currentDate.getDate() - 1);
                checked++;
                continue;
            } else {
                break;
            }

            currentDate.setDate(currentDate.getDate() - 1);
            checked++;
        }
        return streak;
    };

    const streak = calculateStreak();

    return (
        <div className="p-6 md:p-12 min-h-screen bg-background">
            <h1 className="text-4xl md:text-5xl font-light text-primary mb-10">Progress Summary</h1>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16 max-w-6xl">
                <div className="bg-surface rounded-3xl p-8 text-center shadow-lg">
                    <p className="text-7xl md:text-8xl font-light text-accent mb-4">{percentage}%</p>
                    <p className="text-2xl text-primary">Project Complete</p>
                    <p className="text-secondary mt-3">
                        {done} of {total} tasks done
                    </p>
                </div>

                <div className="bg-surface rounded-3xl p-8 text-center shadow-lg">
                    <p className="text-7xl md:text-8xl font-light text-green-400 mb-4">{streak}</p>
                    <p className="text-2xl text-primary">Day Streak</p>
                    <p className="text-secondary mt-3">Keep it going!</p>
                </div>

                <div className="bg-surface rounded-3xl p-8 flex flex-col justify-center shadow-lg">
                    <h3 className="text-2xl font-medium text-primary mb-6 text-center">Tasks by Column</h3>
                    <div className="space-y-4">
                        {Object.entries(tasksByColumn).map(([column, count]) => (
                            <div key={column} className="flex justify-between items-center px-4">
                                <h4 className="text-lg text-primary">{column}</h4>
                                <span className="text-2xl font-bold text-secondary">{count}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className="max-w-5xl mx-auto">
                <h2 className="text-3xl font-light text-primary mb-8">Daily Progress</h2>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    <div className="bg-surface rounded-3xl p-6 shadow-2xl">
                        <Calendar
                            onChange={setSelectedDate}
                            value={selectedDate}
                            tileClassName={({ date, view }) => {
                                if (view === 'month') {
                                    const dStr = date.toISOString().split('T')[0];
                                    const dayTasks = tasks.filter((t) => t.date === dStr);
                                    if (dayTasks.some((t) => t.status === 'Done')) {
                                        return 'highlight-done';
                                    }
                                }
                                return null;
                            }}
                        />
                    </div>

                    <div className="bg-surface rounded-3xl p-8 shadow-lg">
                        <h3 className="text-2xl font-medium text-primary mb-6">
                            {selectedDate.toLocaleDateString('en-AU', {
                                weekday: 'long',
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric',
                            })}
                        </h3>

                        <div className="space-y-6">
                            <div className="text-center">
                                <p className="text-5xl font-light text-accent">{dailyDone}/{dailyTotal}</p>
                                <p className="text-xl text-secondary mt-2">Tasks Done Today</p>
                            </div>

                            <div className="text-center">
                                <p className="text-4xl font-light text-primary">{dailyTimeMin}</p>
                                <p className="text-xl text-secondary mt-2">Minutes Focused</p>
                            </div>

                            {dailyTotal > 0 && (
                                <div className="h-48">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <PieChart>
                                            <Pie
                                                data={pieData}
                                                cx="50%"
                                                cy="50%"
                                                innerRadius={60}
                                                outerRadius={80}
                                                fill="#8884d8"
                                                dataKey="value"
                                                label
                                            >
                                                {pieData.map((entry, index) => (
                                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                                ))}
                                            </Pie>
                                            <Tooltip />
                                        </PieChart>
                                    </ResponsiveContainer>
                                </div>
                            )}

                            <div className="mt-8">
                                <label className="block text-lg text-primary mb-3">End-of-Day Reflection</label>
                                <textarea
                                    placeholder="What went well today? What could be better? Any gratitude?"
                                    value={reflections[dateStr] || ''}
                                    onChange={(e) =>
                                        dispatch({
                                            type: 'SAVE_REFLECTION',
                                            payload: { date: dateStr, text: e.target.value },
                                        })
                                    }
                                    className="w-full h-40 px-6 py-4 bg-background border border-border/50 rounded-2xl text-lg text-primary placeholder-secondary/70 focus:outline-none focus:border-accent transition-all resize-none"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProgressSummary;