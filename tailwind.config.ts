import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          green: {
            DEFAULT: "#087A43",
            50: "#eaf6ee",
            100: "#cbe9d6",
            200: "#99d3b0",
            300: "#60b884",
            400: "#329b5f",
            500: "#18874c",
            600: "#087A43", // Official Primary Green
            700: "#066236",
            800: "#064e2c",
            900: "#054025",
            950: "#022413",
          },
          red: {
            DEFAULT: "#C62828",
            50: "#fdf2f2",
            100: "#fde3e3",
            200: "#fccacc",
            300: "#f8a2a5",
            400: "#f06b70",
            500: "#e23f46",
            600: "#C62828", // Official Primary Red
            700: "#a61e1e",
            800: "#891c1c",
            900: "#731c1c",
            950: "#400a0a",
          },
          black: "#171717",
          dark: "#121212",
          surface: "#FBFBFA",
          card: "#FFFFFF",
          cream: "#F7F5F0",
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        serif: ["var(--font-cinzel)", "Georgia", "serif"],
        urdu: ["var(--font-nastaliq)", "Noto Nastaliq Urdu", "serif"],
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "geometric-pattern": "radial-gradient(#087A43 0.75px, transparent 0.75px), radial-gradient(#C62828 0.75px, #ffffff 0.75px)",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0", transform: "translateY(10px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        pulseSlow: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.85" },
        },
      },
      animation: {
        fadeIn: "fadeIn 0.5s ease-out forwards",
        pulseSlow: "pulseSlow 4s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};
export default config;
