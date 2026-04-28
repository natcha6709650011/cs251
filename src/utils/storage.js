import { initialDB } from "../data/mockData";

const DB_KEY = "cs_restaurant_frontend_db";

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

export function loadDB() {
  const saved = localStorage.getItem(DB_KEY);
  if (!saved) {
    localStorage.setItem(DB_KEY, JSON.stringify(initialDB));
    return clone(initialDB);
  }
  try {
    return JSON.parse(saved);
  } catch (error) {
    console.error("Cannot parse localStorage DB:", error);
    localStorage.setItem(DB_KEY, JSON.stringify(initialDB));
    return clone(initialDB);
  }
}

export function saveDB(db) {
  localStorage.setItem(DB_KEY, JSON.stringify(db));
}

export function resetDB() {
  localStorage.removeItem(DB_KEY);
  localStorage.setItem(DB_KEY, JSON.stringify(initialDB));
  return clone(initialDB);
}
