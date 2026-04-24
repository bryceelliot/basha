/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./*.html', './js/**/*.js'],
  theme: {
    extend: {
      colors: {
        // Basha brand red (Rausch role)
        basha: {
          red:        '#CC1122',
          'red-dark': '#9B0D1A',
          'red-light':'#E8192E',
          dark:       '#222222',   // remapped to Airbnb Ink Black
          cream:      '#FFF8F0',
          gold:       '#D4AF37',
          gray:       '#F5F5F5',
        },
        // Airbnb-inspired neutrals
        ink:      '#222222',       // primary text
        charcoal: '#3f3f3f',       // focused
        ash:      '#6a6a6a',       // secondary text
        mute:     '#929292',       // disabled
        stone:    '#c1c1c1',       // tertiary divider
        hairline: '#dddddd',       // 1px border
        cloud:    '#f7f7f7',       // subsurface bg
        canvas:   '#ffffff',
      },
      fontFamily: {
        display: ['Inter', '-apple-system', 'system-ui', 'sans-serif'],
        sans:    ['Inter', '-apple-system', 'system-ui', 'sans-serif'],
        script:  ['"Dancing Script"', 'cursive'],
      },
      borderRadius: {
        'abnb-sm':  '8px',
        'abnb':     '14px',
        'abnb-lg':  '20px',
        'abnb-xl':  '32px',
      },
      boxShadow: {
        'abnb-1': 'rgba(0,0,0,0.08) 0 4px 12px',
        'abnb-2': 'rgba(0,0,0,0.02) 0 0 0 1px, rgba(0,0,0,0.04) 0 2px 6px 0, rgba(0,0,0,0.10) 0 4px 8px 0',
        'abnb-hover': 'rgba(0,0,0,0.02) 0 0 0 1px, rgba(0,0,0,0.04) 0 8px 16px 0, rgba(0,0,0,0.10) 0 16px 32px 0',
      },
      letterSpacing: {
        'tight-abnb': '-0.018em',
        'tighter-abnb': '-0.02em',
      },
    },
  },
  plugins: [],
};
