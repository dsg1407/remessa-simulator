import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        nunito: ['var(--font-nunito)'],
        poppins: ['var(--font-poppins)'],
      },
    },
  },
  plugins: [
    function ({ addUtilities }: any) {
      const newUtilities = {
        '.no-scrollbar': {
          scrollbarWidth: 'none',
          '&::-webkit-scrollbar': {
            display: 'none',
          },
        },
        '.custom-scrollbar': {
          scrollbarWidth: 'auto',
          scrollbarColor: '#f5f5f5',
          '&::-webkit-scrollbar': {
            width: 'auto',
          },
          '&::-webkit-scrollbar-track': {
            background: 'transparent',
          },
          '&::-webkit-scrollbar-thumb': {
            backgroundColor: '#f5f5f5',
            borderRadius: '20px',
            border: '4px solid #e4e4e7',
          },
          '&::-webkit-scrollbar-thumb:hover': {
            background: '#d4d4d8',
          },
        },
      }

      addUtilities(newUtilities, ['responsive', 'hover'])
    },
  ],
}
export default config
