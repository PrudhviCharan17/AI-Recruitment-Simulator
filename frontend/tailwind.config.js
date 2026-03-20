/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        display: ["'Playfair Display'", "serif"],
        body: ["'DM Sans'", "sans-serif"],
        mono: ["'JetBrains Mono'", "monospace"],
      },
      colors: {
        primary: {
          50: "#f0f4ff",
          100: "#e0e9ff",
          200: "#c7d7fe",
          300: "#a5b8fc",
          400: "#818cf8",
          500: "#1a1a2e",
          600: "#16213e",
          700: "#0f3460",
          800: "#0a1628",
          900: "#050d1a",
        },
        accent: {
          DEFAULT: "#e94560",
          light: "#ff6b8a",
          dark: "#c73652",
        },
        surface: {
          DEFAULT: "#ffffff",
          50: "#fafafa",
          100: "#f5f7fa",
          200: "#eef1f7",
          300: "#e2e8f0",
        },
        success: "#10b981",
        warning: "#f59e0b",
        danger: "#ef4444",
      },
      boxShadow: {
        card: "0 4px 24px rgba(0,0,0,0.07)",
        "card-hover": "0 8px 40px rgba(0,0,0,0.12)",
        glow: "0 0 30px rgba(233,69,96,0.15)",
      },
      borderRadius: {
        xl: "1rem",
        "2xl": "1.5rem",
        "3xl": "2rem",
      },
    },
  },
  plugins: [],
}
