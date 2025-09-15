export default {
  content: ["./*.html", "./*.js"],
  theme: {
    fontFamily: {
      sans: ["Poppins", "ui-sans-serif", "system-ui", "sans-serif"],
    },
    extend: {
      colors: {
        brand: {
          100: "#FFE3DC",
          500: "#FFA69E",
          600: "#E76F51",
        },
      },
      borderRadius: {
        DEFAULT: "0.5rem",
      },
    },
  },
  plugins: [],
};
