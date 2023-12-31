/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Poppins", "sans-serif"],
      },
      colors: {
        background: "#252525",
        text: {
          DEFAULT: "#FEFDFE",
          secondary: "#838383",
        },
        surface: "#3B3B3B",
        brand: "#F8C342",
      },
      typography: {
        DEFAULT: {
          css: {
            "h1 + ": {
              marginTop: "0",
            },
            "ul +": {
              marginTop: "0",
            },
            "ol + *": {
              marginTop: "0",
            },
          },
        },
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
};
