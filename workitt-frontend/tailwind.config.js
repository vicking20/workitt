import forms from '@tailwindcss/forms';
import containerQueries from '@tailwindcss/container-queries';

/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
        "./pages/**/*.{js,ts,jsx,tsx}",
        "./components/**/*.{js,ts,jsx,tsx}",
        "./*.{js,ts,jsx,tsx}"
    ],
    darkMode: "class",
    theme: {
        extend: {
            colors: {
                primary: "#0F172A", // Deep Space Blue
                "brand-accent": "#E86F3E", // Terracotta/Burnt Orange
                "brand-gold": "#FDBA74", // Soft Gold
                "brand-dark": "#020617",
                "surface-light": "#F8FAFC",
                "lavender-tint": "#EAE6F5",
            },
            fontFamily: {
                sans: ["Outfit", "sans-serif"],
                display: ["Dela Gothic One", "cursive"],
                motif: ["Dela Gothic One", "cursive"],
            },
            backgroundImage: {
                "geo-bold":
                    "url(\"data:image/svg+xml,%3Csvg width='80' height='80' viewBox='0 0 80 80' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%230F172A' fill-opacity='0.08'%3E%3Cpath d='M0 0h40v40H0V0zm40 40h40v40H40V40zm0-40h2l-2 2V0zm0 0l2 2-2-2z'/%3E%3Cpath d='M0 40h40v40H0V40zM40 0h40v40H40V0z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")",
                "afro-pattern":
                    "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 0l30 30-30 30L0 30z' fill='%230F172A' fill-opacity='0.05'/%3E%3C/svg%3E\")",
            },
        },
    },
    plugins: [
        forms,
        containerQueries,
    ],
}
