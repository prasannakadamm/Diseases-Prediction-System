/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                primary: "#0ea5e9", // Sky 500 / Neon Blue
                secondary: "#d946ef", // Fuchsia 500 / Neon Pink
                tertiary: "#8b5cf6", // Vibrant Purple
                darkBg: "#050814", // Deep Space / Cyberpunk Dark
                lightBg: "#f8fafc", // Keep for light mode just in case
                cardDark: "rgba(15, 23, 42, 0.7)", // Transparent Dark for glassmorphism
                cardLight: "rgba(255, 255, 255, 0.9)", // For light glass
                neonCyan: "#00f0ff",
                neonPink: "#ff003c",
            },
            animation: {
                'blob': 'blob 10s infinite',
                'fade-in': 'fadeIn 0.5s ease-out',
                'slide-up': 'slideUp 0.5s ease-out forwards',
                'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
                'float': 'float 6s ease-in-out infinite',
                'glow': 'glow 2s ease-in-out infinite alternate',
                'scanline': 'scanline 8s linear infinite',
            },
            keyframes: {
                blob: {
                    '0%': { transform: 'translate(0px, 0px) scale(1)' },
                    '33%': { transform: 'translate(30px, -50px) scale(1.1)' },
                    '66%': { transform: 'translate(-20px, 20px) scale(0.9)' },
                    '100%': { transform: 'translate(0px, 0px) scale(1)' },
                },
                fadeIn: {
                    '0%': { opacity: '0' },
                    '100%': { opacity: '1' },
                },
                slideUp: {
                    '0%': { opacity: '0', transform: 'translateY(20px)' },
                    '100%': { opacity: '1', transform: 'translateY(0)' },
                },
                float: {
                    '0%, 100%': { transform: 'translateY(0)' },
                    '50%': { transform: 'translateY(-20px)' },
                },
                glow: {
                    '0%': { filter: 'drop-shadow(0 0 2px rgba(14, 165, 233, 0.5))' },
                    '100%': { filter: 'drop-shadow(0 0 10px rgba(14, 165, 233, 0.8)) drop-shadow(0 0 20px rgba(14, 165, 233, 0.6))' },
                },
                scanline: {
                    '0%': { transform: 'translateY(-100%)' },
                    '100%': { transform: 'translateY(100vh)' }
                }
            }
        },
    },
    plugins: [],
}
