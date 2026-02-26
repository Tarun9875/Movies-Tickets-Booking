//frontend/src/components/common/ThemeToggle.tsx
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { toggleTheme } from "../../features/theme/themeSlice";
import { Sun, Moon } from "lucide-react";

export default function ThemeToggle() {
  const dispatch = useAppDispatch();
  const mode = useAppSelector((state) => state.theme.mode);

  const isDark = mode === "dark";

  return (
    <button
      onClick={() => dispatch(toggleTheme())}
      className={`
        relative flex items-center justify-center
        w-10 h-10 rounded-full
        transition-all duration-300
        ${isDark
          ? "bg-gray-800 text-yellow-400 hover:bg-gray-700"
          : "bg-gray-200 text-orange-500 hover:bg-gray-300"}
      `}
    >
      {isDark ? (
        <Sun size={18} className="transition-transform duration-300 rotate-0" />
      ) : (
        <Moon size={18} className="transition-transform duration-300 rotate-0" />
      )}
    </button>
  );
}
