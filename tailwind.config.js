/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx}", "./components/**/*.{js,jsx}"],
  theme: { extend: {} },
  plugins: [require("daisyui")],
  daisyui: {
    themes: [
      {
        bazar: {
          primary: "#16a34a",
          "primary-content": "#ffffff",
          secondary: "#f59e0b",
          accent: "#0ea5e9",
          neutral: "#1f2937",
          "base-100": "#ffffff",
          "base-200": "#f6faf6",
          "base-300": "#e5ece6",
          success: "#16a34a",
          error: "#dc2626",
        },
      },
    ],
  },
};
