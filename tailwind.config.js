module.exports = {
  content: ["./app/**/*.{js,ts,jsx,tsx}", "./components/**/*.{js,ts,jsx,tsx}", "./pages/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        luxury: {
          gold: '#D4AF37',
          'dark-gold': '#B8860B',
          cream: '#F5F3E8',
          'deep-gray': '#2C2C2C',
          'light-gray': '#E8E6E0',
          'sage': '#A89968',
          'deep-brown': '#4A3F35',
          'soft-cream': '#FFFBF5',
          black: '#1A1A1A',
        },
      },
      fontFamily: {
        sans: ['Montserrat', 'ui-sans-serif', 'system-ui'],
        serif: ['Playfair Display', 'Georgia', 'serif'],
        display: ['Playfair Display', 'serif'],
      },
      spacing: {
        'luxury-section': '5rem',
      },
      boxShadow: {
        luxury: '0 10px 40px rgba(0, 0, 0, 0.1)',
        'luxury-hover': '0 20px 60px rgba(212, 175, 55, 0.15)',
      },
    },
  },
  plugins: [],
}
