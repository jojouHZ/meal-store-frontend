/** @type {import('tailwindcss').Config} */
export const content = [
  "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
  "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
  "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
];
export const theme = {
  extend: {
    animation: {
      "pulse-slow": "pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
    },
  },
};
export const plugins = [];
