import { createContext, useState, useEffect } from "react";

// Export context so hooks can use it
// eslint-disable-next-line react-refresh/only-export-components
export const ThemeContext = createContext(null);

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(() => {
    const storedTheme = localStorage.getItem("theme");
    const prefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)"
    ).matches;
    return storedTheme || (prefersDark ? "dark" : "light");
  });

  useEffect(() => {
    const root = document.documentElement;

    if (theme === "dark") {
      root.classList.add("dark");
      root.style.colorScheme = "dark";
      console.log("✅ Dark mode activated");
    } else {
      root.classList.remove("dark");
      root.style.colorScheme = "light";
      console.log("☀️ Light mode activated");
    }

    localStorage.setItem("theme", theme);
    console.log("Current theme:", theme, "| Classes:", root.className);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === "dark" ? "light" : "dark"));
  };

  const value = {
    theme,
    toggleTheme,
    isDark: theme === "dark",
  };

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
};
