"use client";

import { createContext, useContext, useState } from "react";

const ThemeContext = createContext({ theme: "light", setTheme: () => {} });

const COOKIE = "theme";
const ATTRIBUTE = "data-theme";

export function ThemeProvider({ children, initialTheme = "light" }) {
  const [theme, setThemeState] = useState(initialTheme);

  function setTheme(next) {
    setThemeState(next);
    document.documentElement.setAttribute(ATTRIBUTE, next);
    // Write cookie so the server can read the preference on the next request
    document.cookie = `${COOKIE}=${next};path=/;max-age=31536000;SameSite=Lax`;
  }

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
