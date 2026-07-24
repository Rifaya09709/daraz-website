export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],

  theme: {
    extend: {
      colors: {
        primary: "#F85606",
        secondary: "#FFF6F3",
        dark: "#222222",
        light: "#FFFFFF",
        grayText: "#6B7280",
      },

      fontFamily: {
        sans: ["Inter", "sans-serif"],
      },

      boxShadow: {
        card: "0 2px 12px rgba(0,0,0,.08)",
      },

      keyframes: {
        marquee: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
        fadeInUp: {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        marquee: "marquee 30s linear infinite",
        fadeInUp: "fadeInUp 0.8s ease-out forwards",
      },
    },
  },

  plugins: [],
} satisfies Config;