// src/pages/FocusMode.js
import React, { useContext, useState, useEffect, useCallback } from 'react';
import { AppContext } from '../contexts/AppContext';
import { useNavigate } from 'react-router-dom';

const FocusMode = () => {
    const { state, dispatch } = useContext(AppContext);
    const navigate = useNavigate();

    const projectId = state.activeProjectId;
    const tasks = state.tasks[projectId] || {};
    const allTasks = Object.values(tasks);

    const focusableTasks = allTasks.filter(t => t.status === 'In Progress' || t.status === 'To Do');

    const [selectedTaskId, setSelectedTaskId] = useState(null);
    const [workDuration, setWorkDuration] = useState(25);
    const [breakDuration, setBreakDuration] = useState(5);
    const [timeLeft, setTimeLeft] = useState(25 * 60);
    const [isRunning, setIsRunning] = useState(false);
    const [isBreak, setIsBreak] = useState(false);
    const [sessionStartTime, setSessionStartTime] = useState(null);

    const currentTask = allTasks.find(t => t.id === selectedTaskId) || null;

    // Auto-select first task
    useEffect(() => {
        if (!selectedTaskId && focusableTasks.length > 0) {
            setSelectedTaskId(focusableTasks[0].id);
        }
    }, [selectedTaskId, focusableTasks]);

    // Define simple functions first (no dependencies on later ones)
    const formatTime = useCallback((seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }, []);

    const pauseSession = useCallback(() => {
        setIsRunning(false);
    }, []);

    const resumeSession = useCallback(() => {
        setIsRunning(true);
    }, []);

    // startBreak depends only on breakDuration & setters
    const startBreak = useCallback(() => {
        const breakSeconds = breakDuration * 60;
        setTimeLeft(breakSeconds);
        setIsRunning(true);
        setIsBreak(true);
        setSessionStartTime(Date.now());
    }, [breakDuration]);

    // startSession depends on workDuration & currentTask
    const startSession = useCallback(() => {
        if (!currentTask) return;
        const durationSeconds = workDuration * 60;
        setTimeLeft(durationSeconds);
        setSessionStartTime(Date.now());
        setIsRunning(true);
        setIsBreak(false);
    }, [workDuration, currentTask]);

    // handleStop sekarang aman, depend on stable functions
    const handleStop = useCallback((auto = false) => {
        if ((!currentTask && !isBreak) || !sessionStartTime) return;

        const elapsedSeconds = Math.floor((Date.now() - sessionStartTime) / 1000);

        if (!isBreak) {
            dispatch({
                type: 'LOG_TIME_SPENT',
                payload: {
                    taskId: currentTask.id,
                    seconds: elapsedSeconds,
                },
            });
        }

        setIsRunning(false);
        setSessionStartTime(null);

        if (auto) {
            if (isBreak) {
                alert('Break time is over! Ready for the next focus session?');
                setIsBreak(false);
            } else {
                alert('Focus session completed! Take a break now.');
                startBreak(); // sekarang startBreak stabil
            }
        } else {
            alert(`Session stopped. ${Math.floor(elapsedSeconds / 60)} minutes logged.`);
        }
    }, [currentTask, isBreak, sessionStartTime, dispatch, startBreak]);

    // Timer effect
    useEffect(() => {
        let interval = null;

        if (isRunning && timeLeft > 0) {
            interval = setInterval(() => {
                setTimeLeft((prev) => prev - 1);
            }, 1000);
        } else if (timeLeft === 0 && isRunning) {
            handleStop(true);
        }

        return () => clearInterval(interval);
    }, [isRunning, timeLeft, handleStop]);

    const completeTask = useCallback(() => {
        if (!currentTask) return;

        if (isRunning) {
            handleStop();
        }

        dispatch({
            type: 'UPDATE_TASK',
            payload: {
                projectId,
                taskId: currentTask.id,
                updates: { status: 'Done' },
            },
        });

        const remaining = focusableTasks.filter((t) => t.id !== currentTask.id);
        if (remaining.length > 0) {
            setSelectedTaskId(remaining[0].id);
            setTimeLeft(workDuration * 60);
            setIsRunning(false);
        } else {
            navigate('/dashboard');
        }
    }, [currentTask, isRunning, handleStop, dispatch, projectId, focusableTasks, workDuration, navigate]);

    // Render logic sama seperti sebelumnya, tapi lebih clean
    if (focusableTasks.length === 0) {
        return (
            <div className="h-screen bg-background flex items-center justify-center">
                <div className="text-center">
                    <p className="text-3xl text-secondary mb-8">No tasks available for focus mode</p>
                    <p className="text-lg text-secondary mb-12">Add some tasks to 'To Do' or 'In Progress' first.</p>
                    <button
                        onClick={() => navigate('/dashboard')}
                        className="px-10 py-5 bg-accent text-white text-xl rounded-xl hover:bg-accent/90 transition-all"
                    >
                        Back to Board
                    </button>
                </div>
            </div>
        );
    }

    if (!currentTask) {
        return <div className="h-screen bg-background flex items-center justify-center text-2xl">Loading...</div>;
    }

    return (
        <div className="h-screen bg-background flex flex-col items-center justify-center px-4 md:px-8 lg:px-12 overflow-auto">
            {/* Custom durations - hide saat running */}
            {!isRunning && (
                <div className="flex gap-6 mb-6 md:mb-8 text-center">
                    <div>
                        <label className="block text-sm text-secondary mb-1">Work (min)</label>
                        <input
                            type="number"
                            value={workDuration}
                            onChange={(e) => setWorkDuration(Math.max(1, Number(e.target.value) || 25))}
                            className="w-20 px-3 py-2 bg-surface border border-border rounded-md text-primary text-center focus:outline-none focus:ring-2 focus:ring-accent"
                            min="1"
                        />
                    </div>
                    <div>
                        <label className="block text-sm text-secondary mb-1">Break (min)</label>
                        <input
                            type="number"
                            value={breakDuration}
                            onChange={(e) => setBreakDuration(Math.max(1, Number(e.target.value) || 5))}
                            className="w-20 px-3 py-2 bg-surface border border-border rounded-md text-primary text-center focus:outline-none focus:ring-2 focus:ring-accent"
                            min="1"
                        />
                    </div>
                </div>
            )}

            {/* Title */}
            <div className="text-center max-w-3xl w-full mb-6 md:mb-10">
                <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-light text-primary mb-4">
                    {isBreak ? 'Break Time' : currentTask.title}
                </h1>
                {!isBreak && currentTask.description && (
                    <p className="text-base md:text-lg lg:text-xl text-secondary opacity-90 leading-relaxed">
                        {currentTask.description}
                    </p>
                )}
            </div>

            {/* Timer - responsif & tidak terlalu besar */}
            <div className="text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-mono font-bold text-accent mb-10 md:mb-14 tracking-wide">
                {formatTime(timeLeft)}
            </div>

            {/* Controls */}
            <div className="flex flex-wrap justify-center gap-4 sm:gap-6 md:gap-8">
                {!isRunning ? (
                    <button
                        onClick={isBreak ? startBreak : (timeLeft < workDuration * 60 ? resumeSession : startSession)}
                        className="px-10 sm:px-12 md:px-16 py-4 md:py-6 bg-accent text-white text-lg sm:text-xl md:text-2xl font-medium rounded-xl hover:bg-accent/90 transition-all shadow-lg min-w-[140px]"
                    >
                        {timeLeft < workDuration * 60 && !isBreak ? 'Resume' : 'Start'}
                    </button>
                ) : (
                    <>
                        <button
                            onClick={pauseSession}
                            className="px-8 sm:px-10 md:px-14 py-4 md:py-6 border-2 border-border text-primary text-lg sm:text-xl md:text-2xl font-medium rounded-xl hover:bg-surface transition-all min-w-[140px]"
                        >
                            Pause
                        </button>
                        <button
                            onClick={() => handleStop(false)}
                            className="px-8 sm:px-10 md:px-14 py-4 md:py-6 bg-red-600/80 text-white text-lg sm:text-xl md:text-2xl font-medium rounded-xl hover:bg-red-600 transition-all min-w-[140px]"
                        >
                            Stop
                        </button>
                    </>
                )}

                {!isBreak && (
                    <button
                        onClick={completeTask}
                        className="px-8 sm:px-10 md:px-14 py-4 md:py-6 bg-green-600/80 text-white text-lg sm:text-xl md:text-2xl font-medium rounded-xl hover:bg-green-600 transition-all min-w-[140px]"
                    >
                        Complete
                    </button>
                )}

                <button
                    onClick={() => navigate('/dashboard')}
                    className="px-8 sm:px-10 md:px-14 py-4 md:py-6 border-2 border-border text-primary text-lg sm:text-xl md:text-2xl rounded-xl hover:bg-surface transition-all min-w-[140px]"
                >
                    Exit
                </button>
            </div>

            {!isBreak && currentTask.timeSpent > 0 && (
                <p className="mt-8 text-sm sm:text-base text-secondary">
                    Logged: {Math.floor(currentTask.timeSpent / 60)} min {currentTask.timeSpent % 60} sec
                </p>
            )}
        </div>
    );
};

export default FocusMode;