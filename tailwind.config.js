/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./views/**/*.{html,js,pug}"],
  theme: {
    extend: {},
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
}
