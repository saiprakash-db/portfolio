export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        canvas: "var(--bg)",
        ink: "var(--text)",
        accent: "var(--accent)",
      },
    },
  },
  plugins: [],
};
