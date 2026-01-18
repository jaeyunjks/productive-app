// src/utils/localStorage.js
const STATE_KEY = 'productiveState';

export const loadFromLocalStorage = () => {
    try {
        const serialized = localStorage.getItem(STATE_KEY);
        if (serialized === null) return undefined;
        return JSON.parse(serialized);
    } catch (err) {
        console.error('Error loading state from localStorage:', err);
        return undefined;
    }
};

export const saveToLocalStorage = (state) => {
    try {
        const serialized = JSON.stringify(state);
        localStorage.setItem(STATE_KEY, serialized);
    } catch (err) {
        console.error('Error saving state to localStorage:', err);
    }
};