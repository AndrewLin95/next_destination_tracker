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

        dark_primary: '#241633',
        dark_primary2: '#312340',
        dark_primary3: '#3E304D',
        dark_primary4: '#4A3C59',
        dark_primary5: '#574966', // all accents are complementary and 20% lighter
        dark_accent1: '#496666', 
        dark_accent1_lighter: '#638080', // 10% lighter
        dark_accent1_darker: '#304D4D', // 10% darker
        dark_accent2: '#586649',
        dark_accent2_lighter: '#728063',
        dark_accent2_darker: '#3F4D30',
        dark_accent3: '#664949',
        dark_accent3_lighter: '#806363',
        dark_accent3_darker: '4D3030',

        Background: '#241633',
        Background_Lighter: '#704AAB',
        Background_Darker: '#341c5f',
        Text: '#f4ebf4',
        PrimaryButton: '#a760a9',
        SecondaryButton: '#070407',
        Accent: '#b070b2',
        Accent2: '#d280ff',
      }
    },
  },
  plugins: [],
}
