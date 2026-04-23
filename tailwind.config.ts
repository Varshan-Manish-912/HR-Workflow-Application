import type { Config } from "tailwindcss";

const config: Config = {
    content: [
        "./src/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            colors: {
                canvas: "#0f0f12",
                sidebar: "#16171c",
                panel: "#1c1d22",
                border: "#2a2b31",

                textPrimary: "#ffffff",
                textSecondary: "#9ca3af",
            },
        },
    },
    plugins: [],
};

export default config;