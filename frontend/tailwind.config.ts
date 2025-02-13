import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        dark: "#000000",
        eksiContent: "#f5f5f5",
        eksiCodeLight: "#D6F9DD",
        eksiCode: "#82BD4E",
        eksiCodeMedium: "#7cb24c",
        eksiCodeDark: "#60695C",
        DarkLightGrey: "#353b43",
        DarkGrey: "#2d2d2d",
        DarkerGrey: "#262626",
      },
      fontFamily: {
        eksifont: ["Montserrat", "sans-serif"],
      },
      fontSize: {
        "2xs": ".65rem",
        xs: ".75rem",
        sm: ".875rem",
        base: "1rem",
        lg: "1.125rem",
        xl: "1.25rem",
        "2xl": "1.5rem",
        "3xl": "1.875rem",
        "4xl": "2.25rem",
        "5xl": "3rem",
        "6xl": "4rem",
        "7xl": "5rem",
      },
      backgroundSize: {
        auto: "auto",
        cover: "cover",
        contain: "contain",
        "90%": "90%",
        "50%": "50%",
        "16": "4rem",
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
};
export default config;
