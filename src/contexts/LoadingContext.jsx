import React, { createContext, useContext, useEffect, useMemo, useState } from "react";

// Simple global loading manager
class LoadingManager {
  constructor() {
    this.activeRequests = 0;
    this.listeners = new Set();
  }

  increment() {
    this.activeRequests += 1;
    this.notify();
  }

  decrement() {
    this.activeRequests = Math.max(0, this.activeRequests - 1);
    this.notify();
  }

  isLoading() {
    return this.activeRequests > 0;
  }

  subscribe(listener) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  notify() {
    for (const listener of this.listeners) {
      try {
        listener(this.isLoading());
      } catch (err) {
        // ignore listener errors
      }
    }
  }
}

export const loadingManager = new LoadingManager();

const LoadingContext = createContext({ isLoading: false });

export const LoadingProvider = ({ children }) => {
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const unsubscribe = loadingManager.subscribe(setIsLoading);
    return unsubscribe;
  }, []);

  const value = useMemo(() => ({ isLoading }), [isLoading]);

  return <LoadingContext.Provider value={value}>{children}</LoadingContext.Provider>;
};

export const useLoading = () => useContext(LoadingContext);


