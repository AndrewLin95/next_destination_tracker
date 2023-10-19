/** @type {import('tailwindcss').Config} */
module.exports = {
  mode: 'jit',
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}'
  ],
  darkMode: 'class',
  theme: {
    extend: {
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
      colors: {
        primary: '#F0E2FF',
        primary2: '#E3D5F2',
        primary3: '#D7C9E6',
        primary4: '#CABCD9',
        primary5: '#BDAFCC', // all accents are complementary
        accent1: '#E3FFFF',
        accent1_lighter: '#F0FFFF', // 5% lighter
        accent1_darker: '#D6F2F2', // 5% darker
        accent2: '#F1FFE3',
        accent2_lighter: '#FEFFF0',
        accent2_darker: '#E4F2D6',
        accent3: '#FFE3E3',
        accent3_lighter: '#FFF0F0',
        accent3_darker: 'F2D6D6',

        dark_primary: '#404764',
        dark_primary2: '#4D5471',
        dark_primary3: '#5A617E',
        dark_primary4: '#666D8A',
        dark_primary5: '#737A97', // all accents are complementary and 20% lighter
        dark_accent1: '#40634A', 
        dark_accent1_lighter: '#4D7057', // 10% lighter
        dark_accent1_darker: '#33563D', // 10% darker
        dark_accent2: '#635C40',
        dark_accent2_lighter: '#70694D',
        dark_accent2_darker: '#564F33',
        dark_accent3: '#634059',
        dark_accent3_lighter: '#704D66',
        dark_accent3_darker: '56334C',
      }
    },
  },
  plugins: [],
}
