/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        forest: {
          50: '#f0f9f1',
          100: '#dcf2df',
          200: '#bbe4c2',
          300: '#8ecc99',
          400: '#5cae6d',
          500: '#38924b',
          600: '#2a753b',
          700: '#235d31',
          800: '#1f4a2a',
          900: '#1a3d24',
          950: '#0b2112',
        },
        harvest: {
          50: '#fefce8',
          100: '#fef9c3',
          200: '#fef08a',
          300: '#fde047',
          400: '#facc15',
          500: '#eab308',
          600: '#ca8a04',
          700: '#a16207',
          800: '#854d0e',
          900: '#713f12',
        },
        earth: {
          50: '#fbf8f4',
          100: '#f5eee6',
          200: '#e9dacb',
          300: '#d7bfab',
          400: '#c19f87',
          500: '#ab8266',
          600: '#976e54',
          700: '#7d5844',
          800: '#674a3b',
          900: '#553e34',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      }
    },
  },
  plugins: [],
}

