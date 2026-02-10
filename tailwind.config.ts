import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        // Discord color palette
        discord: {
          // Backgrounds (dark → lighter)
          'bg-tertiary': '#202225',      // Server list
          'bg-secondary': '#2f3136',     // Channel sidebar
          'bg-primary': '#36393f',       // Main chat area
          'bg-secondary-alt': '#292b2f', // Hover states
          'bg-floating': '#18191c',      // Modals, popups
          
          // Input & Interactive
          'input': '#40444b',
          'hover': '#32353b',
          'active': '#393c43',
          
          // Brand - "Blurple"
          'blurple': '#5865f2',
          'blurple-hover': '#4752c4',
          'blurple-active': '#3c45a5',
          
          // Status
          'green': '#3ba55c',
          'yellow': '#faa61a',
          'red': '#ed4245',
          
          // Text
          'text': '#dcddde',
          'text-muted': '#72767d',
          'text-link': '#00aff4',
          'header': '#ffffff',
          'header-secondary': '#b9bbbe',
        },
      },
      fontFamily: {
        discord: ['Whitney', 'Helvetica Neue', 'Helvetica', 'Arial', 'sans-serif'],
      },
      spacing: {
        'sidebar': '240px',
        'server-list': '72px',
      },
      borderRadius: {
        'discord': '8px',
        'discord-lg': '16px',
      },
    },
  },
  plugins: [],
};

export default config;
