module.exports = {
  content: [
    './index.html',
    './src/**/*.{js,jsx,ts,tsx,vue,html}',
    './components/**/*.{js,jsx,ts,tsx,vue,html}',
  ],
  theme: {
    extend: {
      colors: {
        'ua': '#68E713',
        'graph': '#2d3748',
      },
    },
  },
  plugins: [require('daisyui'),],
  daisyui: {
    themes: [
      "dark",
      {mytheme: {"ua": "#68E713"}}
    ]
  }
}
