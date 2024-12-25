// tailwind.config.js
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
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
      keyframes: {
        blink: {
          '0%, 70%': { backgroundSize: '100% 40%' },
          '85%': { backgroundSize: '100% 120%' },
          '100%': { backgroundSize: '100% 40%' },
        },
      },
      animation: {
        blink: 'blink 1.5s infinite alternate ease-in-out',
      },
    },
  },
  plugins: [],
};

export default config;
