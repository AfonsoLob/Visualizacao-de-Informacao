module.exports = {
  content: [
    './index.html',
    './src/**/*.{js,jsx,ts,tsx,vue,html}',
    './components/**/*.{js,jsx,ts,tsx,vue,html}',
  ],
  theme: {
    extend: {},
  },
  plugins: [require('daisyui'),],
  daisyui: {
    themes: [
      "light"
    ]
  }
}
