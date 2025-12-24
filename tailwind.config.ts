import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}"
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
      },
      colors: {
        background: "#ffffff",
        foreground: "#1d1d1f",
        card: "rgba(255, 255, 255, 0.8)",
        "card-hover": "rgba(255, 255, 255, 0.9)",
        primary: {
          DEFAULT: "#0066CC", // Apple Blue
          foreground: "#ffffff",
          glow: "rgba(0, 102, 204, 0.3)"
        },
        secondary: {
          DEFAULT: "#f5f5f7", // Apple Light Gray background
          foreground: "#1d1d1f",
          glow: "rgba(0, 0, 0, 0.05)"
        },
        accent: {
          DEFAULT: "#2997ff", // Apple Lighter Blue
          foreground: "#ffffff",
          glow: "rgba(41, 151, 255, 0.4)"
        },
        muted: "#86868b", // Apple Gray text
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "hero-glow": "radial-gradient(circle at 50% 0%, rgba(0, 102, 204, 0.15), transparent 60%)",
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "fade-in": "fadeIn 0.6s ease-out forwards",
        "slide-up": "slideUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
      boxShadow: {
        'apple': '0 4px 6px -1px rgba(0, 0, 0, 0.02), 0 2px 4px -1px rgba(0, 0, 0, 0.02), 0 0 0 1px rgba(0, 0, 0, 0.05)',
        'apple-hover': '0 10px 15px -3px rgba(0, 0, 0, 0.04), 0 4px 6px -2px rgba(0, 0, 0, 0.02), 0 0 0 1px rgba(0, 0, 0, 0.05)',
      }
    },
  },
  plugins: [require("tailwindcss-animate")],
};

export default config;


