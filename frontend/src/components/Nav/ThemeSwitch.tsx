"use client";
import React from "react";
import { useEffect, useState, useCallback } from "react";
import { FaMoon } from "react-icons/fa";
import { BsSunFill } from "react-icons/bs";

function ThemeSwitch() {
  const [darkMode, setdarkMode] = useState(true);
  const [mounted, setMounted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Safe localStorage getter
  const getStoredTheme = useCallback((): string | null => {
    try {
      if (typeof window !== "undefined" && window.localStorage) {
        return localStorage.getItem("theme");
      }
    } catch (error) {
      if (process.env.NODE_ENV === "development") {
        console.warn("Failed to read theme from localStorage:", error);
      }
      setError("Tema tercihi okunamadı. Varsayılan tema kullanılıyor.");
    }
    return null;
  }, []);

  // Safe localStorage setter
  const setStoredTheme = useCallback((theme: string): void => {
    try {
      if (typeof window !== "undefined" && window.localStorage) {
        localStorage.setItem("theme", theme);
        setError(null);
      }
    } catch (error) {
      console.warn("Failed to save theme to localStorage:", error);
      setError("Tema tercihi kaydedilemedi");
      // Still apply the theme even if localStorage fails
    }
  }, []);

  // Initialize theme from localStorage or system preference
  useEffect(() => {
    try {
      const storedTheme = getStoredTheme();
      
      if (storedTheme === "dark" || storedTheme === "light") {
        setdarkMode(storedTheme === "dark");
      } else {
        // Check system preference if no stored theme
        if (typeof window !== "undefined" && window.matchMedia) {
          const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
          setdarkMode(prefersDark);
        }
      }
      setMounted(true);
    } catch (error) {
      console.error("Error initializing theme:", error);
      setError("Tema başlatılamadı");
      setMounted(true);
    }
  }, [getStoredTheme]);

  // Apply theme changes
  useEffect(() => {
    if (!mounted) return;

    try {
      if (darkMode) {
        document.documentElement.classList.add("dark");
        setStoredTheme("dark");
      } else {
        document.documentElement.classList.remove("dark");
        setStoredTheme("light");
      }
    } catch (error) {
      console.error("Error applying theme:", error);
      setError("Tema uygulanamadı");
    }
  }, [darkMode, mounted, setStoredTheme]);

  const toggleTheme = useCallback(() => {
    try {
      setdarkMode((prev) => !prev);
      setError(null);
    } catch (error) {
      console.error("Error toggling theme:", error);
      setError("Tema değiştirilemedi");
    }
  }, []);

  // Don't render until mounted to avoid hydration mismatch
  if (!mounted) {
    return (
      <div className="w-12 h-6 rounded-full mt-0.5 p-1 bg-gray-200 dark:bg-gray-600 animate-pulse" />
    );
  }

  return (
    <div className="relative">
      {error && (
        <div 
          className="absolute -top-8 left-1/2 transform -translate-x-1/2 text-xs text-red-500 bg-red-50 dark:bg-red-900/20 px-2 py-1 rounded whitespace-nowrap z-50"
          role="alert"
        >
          {error}
        </div>
      )}
      <button
        title={darkMode ? "Açık temaya geç" : "Koyu temaya geç"}
        onClick={toggleTheme}
        disabled={!mounted}
        className="
          w-12 
          h-6 
          rounded-full
          mt-0.5
          p-1 
          bg-gray-200 
          dark:bg-gray-600 
          relative 
          transition-colors 
          duration-500 
          ease-in
          focus:ring-gray-700 
          dark:focus:ring-gray-600 
          focus:border-transparent
          disabled:opacity-50
          disabled:cursor-not-allowed
        "
        aria-label={darkMode ? "Switch to light theme" : "Switch to dark theme"}
        aria-pressed={darkMode}
      >
        <FaMoon className="block absolute mt-0.5 text-white" size={12} aria-hidden="true" />
        <div
          id="toggle"
          className="
            rounded-full 
            w-4 
            h-4
            z-50
            bg-gray-600 
            dark:bg-gray-500 
            relative 
            ml-0 
            dark:ml-6 
            pointer-events-none 
            transition-all 
            duration-300 
            ease-out
          "
          aria-hidden="true"
        ></div>
        <BsSunFill
          className="block absolute z-10 mt-1.5 mr-1 text-yellow-400 right-0 top-0"
          size={12}
          aria-hidden="true"
        />
      </button>
    </div>
  );
}

export default ThemeSwitch;
