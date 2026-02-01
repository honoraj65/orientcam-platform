import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // RIASEC colors
        riasec: {
          realistic: "#2563EB",      // Bleu
          investigative: "#7C3AED",  // Violet
          artistic: "#EC4899",       // Rose
          social: "#10B981",         // Vert
          enterprising: "#F59E0B",   // Orange
          conventional: "#6B7280",   // Gris
        },
        // Brand colors - Université de Bertoua
        primary: {
          50: '#e6e9f5',
          100: '#b3bcdf',
          200: '#8094cc',
          300: '#4d6bb9',
          400: '#2649a6',
          500: '#001f8d',  // Couleur officielle UBertoua
          600: '#001b7d',
          700: '#001561',
          800: '#001049',
          900: '#000a31',
        },
        // Couleurs UBertoua
        ubertoua: {
          blue: '#001f8d',
          gold: '#D4AF37',
          silver: '#C0C0C0',
        },
      },
      fontFamily: {
        sans: ['var(--font-geist-sans)', 'system-ui', 'sans-serif'],
        mono: ['var(--font-geist-mono)', 'monospace'],
      },
      // Mobile-first breakpoints
      screens: {
        'xs': '375px',
        'sm': '640px',
        'md': '768px',
        'lg': '1024px',
        'xl': '1280px',
        '2xl': '1536px',
      },
    },
  },
  plugins: [],
};

export default config;
