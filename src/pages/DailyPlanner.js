// src/pages/DailyPlanner.js
import React, { useContext } from 'react';
import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
} from '@dnd-kit/core';
import {
    SortableContext,
    verticalListSortingStrategy,
    arrayMove,
} from '@dnd-kit/sortable';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { AppContext } from '../contexts/AppContext';
import { useNavigate } from 'react-router-dom';

const SortableTaskItem = ({ task, isPlanned, onToggleComplete }) => {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id: task.id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            {...attributes}
            {...listeners}
            className={`bg-surface rounded-2xl p-6 border-2 transition-all cursor-grab active:cursor-grabbing group ${isPlanned ? 'border-accent/30 shadow-md' : 'border-transparent hover:border-accent/20'
                } ${isDragging ? 'shadow-2xl' : ''}`}
        >
            <div className="flex items-start gap-5">
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        onToggleComplete(task.id);
                    }}
                    className={`mt-1.5 w-7 h-7 rounded-full border-2 flex items-center justify-center transition-all ${task.status === 'Done'
                        ? 'bg-accent border-accent'
                        : 'border-border/50 hover:border-accent'
                        }`}
                >
                    {task.status === 'Done' && (
                        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                        </svg>
                    )}
                </button>

                <div className={`flex-1 ${task.status === 'Done' ? 'opacity-60' : ''}`}>
                    <h3 className={`text-xl font-medium transition-colors ${task.status === 'Done' ? 'line-through text-secondary' : 'text-primary group-hover:text-accent'
                        }`}>
                        {task.title}
                    </h3>
                    {task.description && <p className="text-secondary mt-1">{task.description}</p>}
                    <div className="flex flex-wrap gap-3 mt-4">
                        {task.priority && (
                            <span className={`text-xs px-3 py-1 rounded-full font-medium ${task.priority === 'High' ? 'bg-red-100 text-red-700' :
                                task.priority === 'Medium' ? 'bg-yellow-100 text-yellow-700' :
                                    'bg-green-100 text-green-700'
                                }`}>
                                {task.priority}
                            </span>
                        )}
                        {task.estimatedTime && <span className="text-xs text-secondary">Est. {task.estimatedTime}</span>}
                        {task.tags && task.tags.map(tag => (
                            <span key={tag} className="text-xs px-3 py-1 bg-background text-secondary rounded-full">
                                {tag}
                            </span>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

const DailyPlanner = () => {
    const { state, dispatch } = useContext(AppContext);
    const navigate = useNavigate();
    const activeProjectId = state.activeProjectId;
    const tasks = Object.values(state.tasks[activeProjectId] || {});
    const today = new Date().toISOString().split('T')[0];
    const dailyPlan = state.dailyPlan && state.dailyPlan.date === today ? state.dailyPlan : { date: today, taskIds: [] };
    const plannedTaskIds = dailyPlan.taskIds;

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor)
    );

    const plannedTasks = tasks.filter(t => plannedTaskIds.includes(t.id));
    const availableTasks = tasks.filter(t => !plannedTaskIds.includes(t.id));

    const totalEstTime = plannedTasks.reduce((acc, t) => {
        const match = t.estimatedTime?.match(/(\d+)h?/i);
        return acc + (match ? parseInt(match[1]) : 0);
    }, 0);

    const highPriorityCount = plannedTasks.filter(t => t.priority === 'High').length;

    const handleDragEnd = (event) => {
        const { active, over } = event;

        if (!over) return;

        const activeId = active.id;
        const overId = over.id;

        if (plannedTaskIds.includes(activeId)) {
            // Reorder in planned
            const oldIndex = plannedTaskIds.indexOf(activeId);
            const newIndex = plannedTaskIds.indexOf(overId);
            const newOrder = arrayMove(plannedTaskIds, oldIndex, newIndex);

            dispatch({
                type: 'SET_DAILY_PLAN',
                payload: { date: today, taskIds: newOrder },
            });
        } else {
            // Drag from available to planned
            dispatch({
                type: 'SET_DAILY_PLAN',
                payload: { date: today, taskIds: [...plannedTaskIds, activeId] },
            });
        }
    };

    const toggleComplete = (taskId) => {
        const task = tasks.find(t => t.id === taskId);
        dispatch({
            type: 'UPDATE_TASK',
            payload: {
                projectId: activeProjectId,
                taskId,
                updates: { status: task.status === 'Done' ? 'In Progress' : 'Done' },
            },
        });
    };

    const startFocusing = () => {
        if (plannedTasks.length > 0) {
            navigate('/dashboard/focus');
        }
    };

    return (
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
            <div className="min-h-screen bg-background p-8 md:p-16">
                <div className="max-w-5xl mx-auto">
                    {/* Header */}
                    <header className="mb-12">
                        <h1 className="text-5xl md:text-6xl font-light text-primary mb-4">
                            Daily Planner
                        </h1>
                        <p className="text-xl text-secondary mb-6">
                            {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                        </p>
                        {plannedTasks.length > 0 && (
                            <div className="flex gap-8 text-secondary">
                                <span>{plannedTasks.length} tasks planned</span>
                                <span>{totalEstTime}h estimated</span>
                                <span>{highPriorityCount} high priority</span>
                            </div>
                        )}
                    </header>

                    {/* Today's Focus */}
                    <section className="mb-16">
                        <div className="flex items-center justify-between mb-8">
                            <h2 className="text-3xl font-medium text-primary">Today's Focus</h2>
                            {plannedTasks.length > 0 && (
                                <button
                                    onClick={startFocusing}
                                    className="px-6 py-3 bg-accent text-white font-medium rounded-2xl hover:bg-accent/90 transition-all"
                                >
                                    Start Focusing
                                </button>
                            )}
                        </div>

                        {plannedTasks.length === 0 ? (
                            <div className="bg-surface/50 border-2 border-dashed border-border/30 rounded-3xl p-20 text-center">
                                <p className="text-3xl text-secondary mb-4">Start your day with intention</p>
                                <p className="text-lg text-secondary">Drag tasks below to build your focus</p>
                            </div>
                        ) : (
                            <SortableContext items={plannedTaskIds} strategy={verticalListSortingStrategy}>
                                <div className="space-y-4">
                                    {plannedTasks.map(task => (
                                        <SortableTaskItem
                                            key={task.id}
                                            task={task}
                                            isPlanned={true}
                                            onToggleComplete={toggleComplete}
                                        />
                                    ))}
                                </div>
                            </SortableContext>
                        )}
                    </section>

                    {/* Available Tasks */}
                    <section>
                        <h2 className="text-2xl font-medium text-primary mb-8">Available Tasks</h2>
                        {availableTasks.length === 0 ? (
                            <p className="text-secondary text-lg">All tasks planned — you're ready for the day!</p>
                        ) : (
                            <div className="space-y-4">
                                {availableTasks.map(task => (
                                    <SortableTaskItem
                                        key={task.id}
                                        task={task}
                                        isPlanned={false}
                                        onToggleComplete={toggleComplete}
                                    />
                                ))}
                            </div>
                        )}
                    </section>

                    {/* Reflection */}
                    {plannedTasks.length > 0 && (
                        <section className="mt-20">
                            <h2 className="text-2xl font-medium text-primary mb-6">End-of-Day Reflection</h2>
                            <textarea
                                placeholder="What went well? What could be improved tomorrow?"
                                className="w-full h-40 px-8 py-6 bg-surface border border-border/50 rounded-3xl text-primary placeholder-secondary/70 focus:outline-none focus:border-accent transition-all resize-none"
                            />
                        </section>
                    )}
                </div>
            </div>
        </DndContext>
    );
};

export default DailyPlanner;