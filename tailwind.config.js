/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",       // ページ配下を対象
    "./components/**/*.{js,ts,jsx,tsx}",  // コンポーネント配下を対象
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
