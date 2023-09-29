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

  // TODO: update position of button
  return (
    <button
      className={`${DEFAULT_BUTTON} h-10 absolute right-4 bottom-4 bg-primary4 dark:bg-dark_accent2`}
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
