import type { Config } from 'tailwindcss'

const config: Config = {
    content: [
        './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
        './src/components/**/*.{js,ts,jsx,tsx,mdx}',
        './src/app/**/*.{js,ts,jsx,tsx,mdx}',
        './src/styles/**/*.css',
    ],
    theme: {
        extend: {
            colors: {
                'header-bg': 'var(--header-bg)',
                'foreground': 'var(--foreground)',
                'background': 'var(--background)',
                'card': 'var(--card)',
                'border': 'var(--border)',
                'primary': 'var(--primary)',
            },
        },
    },
    plugins: [],
}
export default config
