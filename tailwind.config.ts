import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        midnight: "#0F0B1F",
        plum: "#151028",
        teal: "#00E5C4",
        gold: "#C8A24A",
      },
    },
  },
  plugins: [],
};

export default config;
