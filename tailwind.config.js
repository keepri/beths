import * as typography from "@tailwindcss/typography";

/** @type {import("tailwindcss").Config} */
export default {
    content: ["./src/**/*.{html,tsx}"],
    darkMode: "class",
    theme: {
        extend: {
            container: {
                center: true,
                padding: {
                    DEFAULT: "1rem",
                    sm: "1.5rem",
                    md: "2rem",
                    lg: "3rem",
                    xl: "4rem",
                    "2xl": "5rem",
                },
                screens: {
                    sm: "100%",
                    md: "100%",
                    lg: "1024px",
                    xl: "1280px",
                    "2xl": "1536px",
                },
            },
            spacing: {
                "0.5": "0.125rem",
                "1": "0.25rem",
                "1.5": "0.375rem",
                "2": "0.5rem",
                "2.5": "0.625rem",
                "3": "0.75rem",
                "4": "1rem",
                "5": "1.25rem",
                "6": "1.5rem",
                "7": "1.75rem",
                "8": "2rem",
                "9": "2.25rem",
                "10": "2.5rem",
            },
            fontFamily: {
                sans: ["sans-serif"],
                serif: ["serif"],
            },
        },
    },
    plugins: [typography],
};
