"use client";

import { useTheme } from "next-themes";
import { Button } from "../ui/button";
import { Moon, Sun } from "lucide-react";

export const ToggleTheme = () => {
  const { theme, setTheme } = useTheme();
  return (
    <Button
      onClick={() => setTheme(theme === "light" ? "dark" : "light")}
      size="icon"
      variant="ghost"
    >
      <Moon className="size-5 dark:hidden" />
      <Sun className="size-5 hidden dark:block" />
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
};
