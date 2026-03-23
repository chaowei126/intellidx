import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: 'class',
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-inter)", "sans-serif"],
        space: ["var(--font-space-grotesk)", "sans-serif"],
      },
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        // Custom Neon accents for Neo-Brutalist design
        "neon-lime": "#bef264",
        "neon-indigo": "#6366f1",
      },

      backgroundImage: {
        'grain': "url('/noise.png')", // Optional, we can add a noise class later via pure CSS
      }
    },
  },
  plugins: [],
};
export default config;
