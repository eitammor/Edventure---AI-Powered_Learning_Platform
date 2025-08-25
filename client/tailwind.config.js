module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      animation: {
        'spin-slow': 'spin 2s linear infinite',
        'book-open': 'bookOpen 4.5s ease-in-out infinite',
        'book-open-delayed': 'bookOpenDelayed 4.5s ease-in-out infinite',
        'brain-rise': 'brainRise 4.5s ease-in-out infinite',
        'brain-glow': 'brainGlow 2s ease-in-out infinite',
        'bookmark-bounce': 'bookmarkBounce 4.5s ease-in-out infinite',
        'book-scale': 'bookScale 5s ease-in-out infinite',
        'book-left-cover': 'bookLeftCover 5s ease-in-out infinite',
        'book-right-cover': 'bookRightCover 5s ease-in-out infinite',
      },
      keyframes: {
        bookOpen: {
          '0%, 100%': { transform: 'rotateY(0deg)' },
          '10%, 90%': { transform: 'rotateY(-180deg)' },
        },
        bookOpenDelayed: {
          '0%, 100%': { transform: 'rotateY(0deg)' },
          '5%, 85%': { transform: 'rotateY(-160deg)' },
        },
        brainRise: {
          '0%, 100%': { 
            transform: 'translateY(0px) scale(1)',
            opacity: '0'
          },
          '15%, 85%': { 
            transform: 'translateY(-20px) scale(1.1)',
            opacity: '1'
          },
          '25%, 75%': { 
            transform: 'translateY(-30px) scale(1.2)',
            opacity: '1'
          },
        },
        brainGlow: {
          '0%, 100%': { 
            opacity: '0.3',
            transform: 'scale(1)'
          },
          '50%': { 
            opacity: '0.7',
            transform: 'scale(1.1)'
          },
        },
        bookmarkBounce: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '20%, 80%': { transform: 'translateY(-5px)' },
        },
        bookScale: {
          '0%, 100%': { transform: 'scale(0.95)' },
          '20%, 90%': { transform: 'scale(1)' },
        },
        bookLeftCover: {
          '0%, 100%': { transform: 'rotateY(0deg)' },
          '20%, 90%': { transform: 'rotateY(160deg)' },
        },
        bookRightCover: {
          '0%, 100%': { transform: 'rotateY(0deg)' },
          '20%, 90%': { transform: 'rotateY(-160deg)' },
        },
      },
    },
  },
  plugins: [],
}
