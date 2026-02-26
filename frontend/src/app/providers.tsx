import { useEffect } from "react";
import { useAppSelector } from "./hooks";

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const mode = useAppSelector((state) => state.theme.mode);

  useEffect(() => {
    const root = document.documentElement;

    if (mode === "dark") {
      root.classList.add("dark");
      console.log("Theme mode:", mode);

    } else {
      root.classList.remove("dark");
      console.log("Theme mode:", mode);

    }
  }, [mode]);

  return <>{children}</>;
}
