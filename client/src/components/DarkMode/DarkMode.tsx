"use client";
import { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSun, faMoon } from "@fortawesome/free-regular-svg-icons";
import { DEFAULT_BUTTON } from "@/util/constants";

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
      className={`${DEFAULT_BUTTON} h-10 absolute left-4 bottom-4 bg-dark_primary dark:bg-primary`}
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
