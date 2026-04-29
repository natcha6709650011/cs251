import { mockData } from "../data/mockData";

const STORAGE_KEY = "cs-restaurant-db";

export function loadDB() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);

    if (!saved) {
      return mockData;
    }

    const parsed = JSON.parse(saved);

    return {
      ...mockData,
      ...parsed,
      employees: parsed.employees || mockData.employees,
      members: parsed.members || mockData.members,
      tables: parsed.tables || mockData.tables,
      menus: parsed.menus && parsed.menus.length > 0 ? parsed.menus : mockData.menus,
      reservations: parsed.reservations || [],
      orders: parsed.orders || [],
      payments: parsed.payments || [],
      reviewSessions: parsed.reviewSessions || [],
      reviews: parsed.reviews || [],
      experienceTopics: parsed.experienceTopics || mockData.experienceTopics,
    };
  } catch (error) {
    console.error("Load DB error:", error);
    return mockData;
  }
}

export function saveDB(db) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(db));
}