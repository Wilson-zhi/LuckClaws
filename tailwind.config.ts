import type { Config } from "tailwindcss";
import forms from "@tailwindcss/forms";

const config: Config = {
  content: [
    "./src/app/**/*.{ts,tsx}",
    "./src/components/**/*.{ts,tsx}",
    "./src/data/**/*.{ts,tsx}",
    "./src/lib/**/*.{ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        background: "#F8F9FB",
        surface: "#F8F9FB",
        "surface-dim": "#D9DADC",
        "surface-bright": "#F8F9FB",
        "surface-container-lowest": "#FFFFFF",
        "surface-container-low": "#F3F4F6",
        "surface-container": "#EDEEF0",
        "surface-container-high": "#E7E8EA",
        "surface-container-highest": "#E1E2E4",
        "on-surface": "#191C1E",
        "on-surface-variant": "#534434",
        "inverse-surface": "#2E3132",
        "inverse-on-surface": "#F0F1F3",
        outline: "#867461",
        "outline-variant": "#D8C3AD",
        primary: "#855300",
        "on-primary": "#FFFFFF",
        "primary-container": "#F59E0B",
        "on-primary-container": "#613B00",
        secondary: "#5E5E5C",
        "secondary-container": "#E1DFDC",
        tertiary: "#555F70",
        error: "#BA1A1A"
      },
      fontFamily: {
        heading: ["var(--font-heading)", "Plus Jakarta Sans", "system-ui", "sans-serif"],
        body: ["var(--font-body)", "Be Vietnam Pro", "system-ui", "sans-serif"]
      },
      borderRadius: {
        sm: "0.5rem",
        DEFAULT: "1rem",
        md: "1.5rem",
        lg: "2rem",
        xl: "3rem"
      },
      boxShadow: {
        ambient: "0 14px 40px rgba(25, 28, 30, 0.06)",
        soft: "0 8px 24px rgba(25, 28, 30, 0.05)",
        lift: "0 20px 60px rgba(25, 28, 30, 0.10)"
      },
      maxWidth: {
        container: "1280px"
      }
    }
  },
  plugins: [forms]
};

export default config;

