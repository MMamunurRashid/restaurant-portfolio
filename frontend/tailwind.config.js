export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#2f0020",
        secondary: "#f6bf6c",
        accent: "var(--accent)",
        neutral: "var(--neutral)",
        "neutral-content": "var(--neutralContent)",
        "base-100": "var(--base100)",
      },
    },
  },
  plugins: [],
};
