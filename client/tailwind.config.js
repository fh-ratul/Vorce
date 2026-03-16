export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        obsidian: '#050505',
        charcoal: '#111111',
        graphite: '#1a1a1a',
        ivory: '#f5f1e8',
        gold: '#c8a96b',
        bronze: '#8b6b37',
      },
      fontFamily: {
        display: ['Oswald', 'sans-serif'],
        sans: ['Space Grotesk', 'sans-serif'],
      },
      boxShadow: {
        glow: '0 0 40px rgba(200, 169, 107, 0.18)',
      },
      backgroundImage: {
        grid: 'linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)',
      },
    },
  },
  plugins: [],
};
