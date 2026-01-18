// src/contexts/AppContext.js
import { createContext, useReducer, useEffect } from 'react';
import { loadFromLocalStorage, saveToLocalStorage } from '../utils/localStorage';

// Helper untuk generate ID
const generateId = () => Date.now().toString(36) + Math.random().toString(36).substr(2);

const initialState = {
    projects: [],
    activeProjectId: null,
    boards: {},
    tasks: {},
    focusMode: { active: false, taskId: null },
    dailyPlan: { date: null, taskIds: [] },
    reflections: {},                 // { "YYYY-MM-DD": "reflection text" }
};

const reducer = (state, action) => {
    switch (action.type) {
        case 'LOAD_STATE':
            return { ...initialState, ...action.payload }; // <-- lebih aman, merge dengan initial

        case 'CREATE_PROJECT':
            return {
                ...state,
                projects: [...state.projects, action.payload],
                activeProjectId: action.payload.id,
            };

        case 'SET_ACTIVE_PROJECT':
            return { ...state, activeProjectId: action.payload };

        case 'DELETE_PROJECT':
            const newProjects = state.projects.filter(p => p.id !== action.payload);
            const newActiveId = state.activeProjectId === action.payload ? null : state.activeProjectId;
            return {
                ...state,
                projects: newProjects,
                activeProjectId: newActiveId,
                boards: { ...state.boards, [action.payload]: undefined },
                tasks: { ...state.tasks, [action.payload]: undefined },
            };

        case 'UPDATE_PROJECT':
            return {
                ...state,
                projects: state.projects.map(p => p.id === action.payload.id ? { ...p, ...action.payload.updates } : p),
            };

        case 'ADD_TASK':
            const projectIdAdd = action.payload.projectId || state.activeProjectId;
            const newTaskData = action.payload.taskData || action.payload;
            const newTaskId = newTaskData.id || generateId();

            return {
                ...state,
                tasks: {
                    ...state.tasks,
                    [projectIdAdd]: {
                        ...state.tasks[projectIdAdd],
                        [newTaskId]: {
                            ...newTaskData,
                            id: newTaskId,
                            projectId: projectIdAdd,
                            timeSpent: newTaskData.timeSpent || 0,
                            createdAt: newTaskData.createdAt || new Date().toISOString(),
                        },
                    },
                },
            };

        case 'UPDATE_TASK':
            const projectIdUpdate = action.payload.projectId || state.activeProjectId;
            const taskIdUpdate = action.payload.taskId;
            const updates = action.payload.taskData || action.payload.updates;

            if (!state.tasks[projectIdUpdate]?.[taskIdUpdate]) return state;

            return {
                ...state,
                tasks: {
                    ...state.tasks,
                    [projectIdUpdate]: {
                        ...state.tasks[projectIdUpdate],
                        [taskIdUpdate]: {
                            ...state.tasks[projectIdUpdate][taskIdUpdate],
                            ...updates,
                        },
                    },
                },
            };

        case 'LOG_TIME_SPENT':
            const { taskId, seconds, projectId: pid = state.activeProjectId } = action.payload;
            if (!state.tasks[pid]?.[taskId]) return state;

            return {
                ...state,
                tasks: {
                    ...state.tasks,
                    [pid]: {
                        ...state.tasks[pid],
                        [taskId]: {
                            ...state.tasks[pid][taskId],
                            timeSpent: (state.tasks[pid][taskId].timeSpent || 0) + seconds,
                        },
                    },
                },
            };

        case 'SAVE_REFLECTION':
            const { date, text } = action.payload;
            return {
                ...state,
                reflections: {
                    ...state.reflections,
                    [date]: text,
                },
            };

        case 'MOVE_TASK':
            // nanti diimplementasikan saat drag-drop
            return state;

        case 'SET_FOCUS_MODE':
            return { ...state, focusMode: action.payload };

        case 'SET_DAILY_PLAN':
            return { ...state, dailyPlan: action.payload };

        default:
            return state;
    }
};

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
    const [state, dispatch] = useReducer(reducer, initialState);

    useEffect(() => {
        try {
            const savedState = loadFromLocalStorage('productiveState');
            if (savedState && typeof savedState === 'object' && !Array.isArray(savedState)) {
                dispatch({ type: 'LOAD_STATE', payload: savedState });
            }
        } catch (err) {
            console.warn('Failed to load state from localStorage:', err);
        }
    }, []);

    useEffect(() => {
        try {
            saveToLocalStorage('productiveState', state);
        } catch (err) {
            console.warn('Failed to save state to localStorage:', err);
        }
    }, [state]);

    return (
        <AppContext.Provider value={{ state, dispatch }}>
            {children}
        </AppContext.Provider>
    );
};