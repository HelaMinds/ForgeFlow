/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,jsx}',
    './components/**/*.{js,jsx}',
  ],
  theme: {
    extend: {
      colors: {
        riso: {
          paper: '#FAF9F6',
          card: '#FFFFFF',
          sidebar: '#F0EDE6',
          border: '#DDD9CF',
          ink: '#1C1B22',
          muted: '#74717F',
          faint: '#A8A4B2',
          coral: '#D95B2A',
          'coral-light': '#FDF0EA',
          'coral-mid': '#F4A07A',
          blue: '#2860A0',
          'blue-light': '#EBF2FB',
          green: '#2A7A52',
          'green-light': '#E8F5EF',
          yellow: '#C47F00',
          'yellow-light': '#FDF5DE',
          lavender: '#6558B5',
          'lavender-light': '#EFEDFC',
        },
      },
      fontFamily: {
        sans: ['"Space Grotesk"', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'Menlo', 'monospace'],
      },
      boxShadow: {
        'riso': '2px 3px 0 rgba(217, 91, 42, 0.14)',
        'riso-md': '3px 4px 0 rgba(217, 91, 42, 0.18)',
        'riso-active': '2px 2px 0 rgba(40, 96, 160, 0.35)',
        'riso-btn': '3px 3px 0 #1C1B22',
      },
    },
  },
  plugins: [],
};
