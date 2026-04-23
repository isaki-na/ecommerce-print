import defaultTheme from 'tailwindcss/defaultTheme';
import forms from '@tailwindcss/forms';
// import lineClamp from '@tailwindcss/line-clamp';
import colors from 'tailwindcss/colors'

/** @type {import('tailwindcss').Config} */
export default {
    darkMode: 'selector',
    content: [
        './vendor/laravel/framework/src/Illuminate/Pagination/resources/views/*.blade.php',
        './storage/framework/views/*.php',
        './resources/views/**/*.blade.php',
        './resources/js/**/*.jsx',
    ],

    theme: {
        container: {
            center: true,
            padding: {
                DEFAULT: "1.5rem",
                sm: "2rem",
                lg: "2rem",
                xl: "2rem",
                '2xl': '6rem',
            },
        },
        extend: {
            // Custom colors
            colors: {
                   primary: {
                    50: '#ffffff',  // white
                    100: '#f9f9f9',
                    200: '#f0f0f0',
                    300: '#e0e0e0',
                    400: '#c0c0c0',
                    500: '#a0a0a0',
                    600: '#808080',  // middle gray
                    700: '#606060',
                    800: '#404040',
                    900: '#202020',
                    950: '#000000',  // black
                },
            },
            // Font families
            fontFamily: {
                sans: ['Inter var', ...defaultTheme.fontFamily.sans],
            },
            // Accordion search filters
            transitionProperty: {
                'max-height': 'max-height',
            },
            // Animation toast
            animation: {
                enter: 'enter 200ms ease-out',
                'slide-in': 'slide-in 1.2s cubic-bezier(.41,.73,.51,1.02)',
                leave: 'leave 150ms ease-in forwards',
            },
            keyframes: {
                enter: {
                    '0%': { transform: 'scale(0.9)', opacity: 0 },
                    '100%': { transform: 'scale(1)', opacity: 1 },
                },
                leave: {
                    '0%': { transform: 'scale(1)', opacity: 1 },
                    '100%': { transform: 'scale(0.9)', opacity: 0 },
                },
                'slide-in': {
                    '0%': { transform: 'translateY(-100%)' },
                    '100%': { transform: 'translateY(0)' },
                },
            }
        },
    },

    plugins: [forms],
};