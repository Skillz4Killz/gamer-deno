module.exports = {
    content: ["./app/**/*.{js,ts,jsx,tsx}", "./public/scripts/**/*.js"],
    plugins: [require("daisyui")],
    theme: {
        extend: {
            animation: {
                hide: "hide 10s linear",
                "waving-hand": "wave 2s linear infinite",
            },
            keyframes: {
                hide: {
                    "0%": { opacity: 1 },
                    "100%": { opacity: 0 },
                },
                wave: {
                    "0%": { transform: "rotate(0.0deg)" },
                    "10%": { transform: "rotate(14deg)" },
                    "20%": { transform: "rotate(-8deg)" },
                    "30%": { transform: "rotate(14deg)" },
                    "40%": { transform: "rotate(-4deg)" },
                    "50%": { transform: "rotate(10.0deg)" },
                    "60%": { transform: "rotate(0.0deg)" },
                    "100%": { transform: "rotate(0.0deg)" },
                },
            },
        },
    },
    daisyui: {
        themes: [
            {
                gamerdark: {
                    primary: "#639FFA",
                    secondary: "#75e0ec",
                    accent: "#37CDBE",
                    neutral: "#3D4451",
                    "base-100": "#292524",
                    info: "#9ca3af",
                    success: "#36D399",
                    warning: "#FBBD23",
                    error: "#F87272",
                },
            },
            {
                gamerlight: {
                    primary: "#639FFA",
                    secondary: "#75e0ec",
                    accent: "#37CDBE",
                    neutral: "#3D4451",
                    "base-100": "#FFFFFF",
                    info: "#9ca3af",
                    success: "#36D399",
                    warning: "#FBBD23",
                    error: "#F87272",
                },
            },
            "winter",
            "synthwave",
            "retro",
            "cyberpunk",
            "valentine",
            "aqua",
        ],
    },
};
