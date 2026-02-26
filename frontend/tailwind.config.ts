// tailwind.config.ts
import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],

  theme: {
    extend: {
      colors: {
        ocean: {
          dark: "#003B5C",
          tealDark: "#005B77",
          teal: "#007A8E",
          sea: "#009DA5",
          aqua: "#00B2B2",
        },
      },
    },
  },

  plugins: [],
};

export default config;
