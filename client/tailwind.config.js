/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
    },
    colors: {
      Background: '#1a0e1b',
      Background_Lighter: '#361e38',
      Background_Darker: '#160d17',
      Text: '#f4ebf4',
      PrimaryButton: '#a760a9',
      SecondaryButton: '#070407',
      Accent: '#b070b2'
    }
  },
  plugins: [],
}
