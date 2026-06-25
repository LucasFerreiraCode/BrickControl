/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: "#2563EB",
        success: "#22C55E",
        warning: "#F59E0B",
        danger: "#EF4444",
        background: "#0F172A",
        card: "#1E293B",
        "card-foreground": "#F8FAFC",
        border: "#334155",
        input: "#1E293B",
        ring: "#2563EB",
        foreground: "#F8FAFC",
        muted: "#94A3B8",
        "muted-foreground": "#94A3B8",
        accent: "#1E293B",
        "accent-foreground": "#F8FAFC",
      },
      borderRadius: {
        lg: "0.75rem",
        md: "0.5rem",
        sm: "0.25rem",
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
