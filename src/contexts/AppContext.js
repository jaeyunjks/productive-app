// src/contexts/AppContext.js
import { createContext, useReducer, useEffect } from 'react';
import { loadFromLocalStorage, saveToLocalStorage } from '../utils/localStorage';

// Helper sederhana untuk generate ID (tanpa library eksternal)
const generateId = () => Date.now().toString(36) + Math.random().toString(36).substr(2);

const initialState = {
    projects: [],                    // [{ id, name, type, goal, deadline, columns: [...] }, ...]
    activeProjectId: null,           // ID proyek yang sedang dibuka
    boards: {},                      // { projectId: { columns: [...], columnOrder: [...] } }
    tasks: {},                       // { projectId: { taskId: { ...task data } } }
    focusMode: { active: false, taskId: null },
    dailyPlan: { date: null, taskIds: [] },  // Task ID yang dipilih untuk hari ini
};

const reducer = (state, action) => {
    switch (action.type) {
        case 'LOAD_STATE':
            return { ...state, ...action.payload };

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
            const projectId = state.activeProjectId;
            const newTask = { id: generateId(), ...action.payload };
            return {
                ...state,
                tasks: {
                    ...state.tasks,
                    [projectId]: { ...state.tasks[projectId], [newTask.id]: newTask },
                },
            };

        case 'UPDATE_TASK':
            return {
                ...state,
                tasks: {
                    ...state.tasks,
                    [action.payload.projectId]: {
                        ...state.tasks[action.payload.projectId],
                        [action.payload.taskId]: {
                            ...state.tasks[action.payload.projectId][action.payload.taskId],
                            ...action.payload.updates,
                        },
                    },
                },
            };

        case 'MOVE_TASK':
            // Untuk drag & drop nanti
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

    // Load dari LocalStorage saat app pertama kali jalan
    useEffect(() => {
        const savedState = loadFromLocalStorage('productiveState');
        if (savedState) {
            dispatch({ type: 'LOAD_STATE', payload: savedState });
        }
    }, []);

    // Simpan ke LocalStorage setiap state berubah
    useEffect(() => {
        saveToLocalStorage('productiveState', state);
    }, [state]);

    return (
        <AppContext.Provider value={{ state, dispatch }}>
            {children}
        </AppContext.Provider>
    );
};