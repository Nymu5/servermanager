/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./views/**/*.{html,js,pug}"],
  theme: {
    extend: {
      screens: {
        standalone: { raw: "(display-mode: standalone)" },
      },
      spacing: {
        "safe-top": "env(safe-area-inset-top)",
        "safe-top-negative": "calc(-1 * env(safe-area-inset-top))",
        "safe-bottom": "env(safe-area-inset-bottom)",
        "safe-left": "env(safe-area-inset-left)",
        "safe-right": "env(safe-area-inset-right)",
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
}
