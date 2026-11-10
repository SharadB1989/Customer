/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx}", "./components/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#1F2933",       // charcoal — headers, nav, primary text
        paper: "#FAF7F0",     // warm off-white — page background
        card: "#FFFFFF",      // content surfaces
        brass: "#A8791E",     // primary accent — buttons, focus, links
        "brass-dark": "#8A6216",
        thread: "#A1372E",    // low stock / overdue / destructive
        sage: "#5F7A5A",      // delivered / paid / success
        line: "#E1DACB",      // borders and dividers
        muted: "#6B7280",     // secondary text
      },
      fontFamily: {
        display: ["var(--font-fraunces)", "Georgia", "serif"],
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        mono: ["var(--font-plex-mono)", "ui-monospace", "monospace"],
      },
      borderRadius: {
        sm: "3px",
        DEFAULT: "4px",
      },
    },
  },
  plugins: [],
};
