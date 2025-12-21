import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        primary: "#7C3AED",
        secondary: "#0EA5E9",
        accent: "#22D3EE"
      }
    }
  },
  plugins: [require("tailwindcss-animate")]
};

export default config;


