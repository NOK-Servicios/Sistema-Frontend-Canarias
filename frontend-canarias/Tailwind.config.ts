import type { Config } from "tailwindcss";

/*
  Configuración de Tailwind con los colores de Canarias.

  Uso en componentes:
    className="bg-canarias-blue text-white"
    className="text-canarias-orange"
    className="border-canarias-blue-light"
*/

const config: Config = {
  darkMode: "class",
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
    "./hooks/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        canarias: {
          blue: {
            DEFAULT: "#1B4F8A",
            dark: "#0F3060",
            light: "#2E6DB4",
            subtle: "#E8F0FA",
          },
          orange: {
            DEFAULT: "#F5A623",
            dark: "#D4881A",
            light: "#F7BC56",
            subtle: "#FEF6E4",
          },
        },
      },
      fontFamily: {
        sans: ["var(--font-geist)", "system-ui", "sans-serif"],
        mono: ["var(--font-geist-mono)", "monospace"],
      },
      // Sidebar fijo de 240px
      spacing: {
        sidebar: "240px",
      },
    },
  },
  plugins: [],
};

export default config;
