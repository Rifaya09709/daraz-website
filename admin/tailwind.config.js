import type { Config } from "tailwindcss";

export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],

  theme: {
    extend: {
      colors: {
        primary: "#F85606",
        secondary: "#FFF6F3",
        dark: "#1F2937",
        sidebar: "#111827",
        light: "#FFFFFF",
        grayText: "#6B7280",
      },

      fontFamily: {
        sans: ["Inter", "sans-serif"],
      },

      boxShadow: {
        card: "0 2px 12px rgba(0,0,0,.08)",
      },
    },
  },

  plugins: [],
} satisfies Config;