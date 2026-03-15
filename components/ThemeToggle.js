"use client";

import * as React from "react";
import { MoonIcon, SunIcon } from "@radix-ui/react-icons";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  // Prevent hydration mismatch
  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return <Button variant="ghost" size="icon" disabled />;

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleTheme}
      className="relative rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
    >
      {/* When theme is LIGHT: Moon is visible (scale-100), Sun is hidden (scale-0)
        When theme is DARK: Sun is visible (scale-100), Moon is hidden (scale-0)
      */}
      <SunIcon className="h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
      <MoonIcon className="absolute h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:rotate-90 dark:scale-0" />

      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}
