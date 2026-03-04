import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-sans)", "sans-serif"],
        serif: ["var(--font-serif)", "serif"],
        yeongwol: ["var(--font-yeongwol)", "sans-serif"]
      },
      colors: {
        palette: {
          background: "#f3f3f2",
          surface: "#e9f1ff",
          surfaceSoft: "#dbe8ff",
          ink: "#10213f",
          cedar: "#2a4f8f",
          moss: "#2f6f9e",
          clay: "#3f74c7",
          gold: "#6ca6f0",
          themeBlue: "#1c2f48"
        },
        // Legacy aliases kept for existing classNames.
        ivory: "#e9f1ff",
        ink: "#10213f",
        cedar: "#2a4f8f",
        moss: "#2f6f9e",
        clay: "#3f74c7",
        gold: "#6ca6f0",
        themeBlue: "#1c2f48"
      },
      boxShadow: {
        soft: "0 12px 40px rgba(16, 33, 63, 0.14)"
      }
    }
  },
  plugins: []
};

export default config;
