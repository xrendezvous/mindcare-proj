/** @type {import('tailwindcss').Config} */
const {nextui} = require("@nextui-org/react");

module.exports = {
    content: [
        "./src/**/*.{html,js,jsx,ts,tsx}",
        "./public/index.html",
        "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {},
    },
    darkMode: "class",
    plugins: [
        nextui({
            themes: {
                light: {
                    colors: {
                        // background: "#fcfec3",
                        // foreground: "#00410a",
                        primary: {
                            // foreground: "#fcfec3",
                        },
                    },
                },
                dark: {
                    colors: {
                        // background: "#00410a",
                        // foreground: "#fcfec3",
                        primary: {
                            // foreground: "#FFFFFF",
                            DEFAULT: "#006FEE",
                        },
                    },
                },
            },
        }),
    ],
}