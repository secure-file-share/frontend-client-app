"use client";

export function saveToLocalStorage(key, value) {
  if (typeof window !== "undefined") {
    localStorage.setItem(key, JSON.stringify(value));
  }
}

export function loadFromLocalStorage(key) {
  if (typeof window !== "undefined") {
    let value = localStorage.getItem(key);

    try {
      return JSON.parse(value);
    } catch {
      return value;
    }
  }
}
