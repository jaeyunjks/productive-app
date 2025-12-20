export const loadFromLocalStorage = (key) => {
    try { return JSON.parse(localStorage.getItem(key)); } catch { return null; }
};

export const saveToLocalStorage = (key, data) => {
    localStorage.setItem(key, JSON.stringify(data));
};