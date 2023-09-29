"use client";
import { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSun, faMoon } from "@fortawesome/free-regular-svg-icons";

const DarkModeButton = () => {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <button
      className="absolute right-4 bottom-4 bg-accent2 border-dark_accent2 dark:bg-dark_accent2 dark:border-accent2"
      onClick={(e) => (theme === "dark" ? setTheme("light") : setTheme("dark"))}
    >
      {theme === "dark" ? (
        <FontAwesomeIcon
          icon={faMoon}
          style={{ color: "#b070b2" }}
          className="pr-1"
        />
      ) : (
        <FontAwesomeIcon
          icon={faSun}
          style={{ color: "#b070b2" }}
          className="pr-1"
        />
      )}
    </button>
  );
};

export default DarkModeButton;
