import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],

  theme: {
    extend: {
      colors: {
        brand: {
          50: "#F3FAFD",
          100: "#DDEFF8",
          200: "#BDD8E9",
          300: "#9CC6DD",
          400: "#7BBDE8",
          500: "#4E8EA2",
          600: "#49769F",
          700: "#0A4174",
          800: "#07345D",
          900: "#001D39",
        },

        cpm: {
          income: "#6EA2B3",
          expense: "#F07C7C",
          accent: "#7BBDE8",
          card: "#0A4174",
        },

        surface: {
          sidebar: "#06182B",
          main: "#001D39",
          panel: "#0A2B46",
          elevated: "#103956",
          border: "rgba(189, 216, 233, 0.12)",
          borderStrong: "rgba(123, 189, 232, 0.22)",
        },
      },

      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        heading: ["Plus Jakarta Sans", "Inter", "system-ui", "sans-serif"],
      },

      boxShadow: {
        "dashboard-card": "0 12px 40px rgba(0, 13, 30, 0.22)",
        "dashboard-hover": "0 20px 55px rgba(0, 13, 30, 0.34)",
        "dashboard-glow": "0 0 45px rgba(123, 189, 232, 0.10)",
      },

      backgroundImage: {
        "dashboard-grid":
          "linear-gradient(rgba(123,189,232,.035) 1px, transparent 1px), linear-gradient(90deg, rgba(123,189,232,.035) 1px, transparent 1px)",
      },
    },
  },

  plugins: [],
};

export default config;
