import type { Config } from 'tailwindcss'

interface DaisyUITheme {
  [key: string]: string;
}

interface DaisyUIConfig {
  themes: Array<string | { [themeName: string]: DaisyUITheme }>;
}

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
    },
  },
  plugins: [
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    require('daisyui')
  ],
  daisyui: {
    themes: [
      {
        light: {
          "primary": "#570df8",
          "secondary": "#f000b8",
          "accent": "#37cdbe",
          "neutral": "#3d4451",
          "base-100": "#ffffff",
          "info": "#3abff8",
          "success": "#36d399",
          "warning": "#fbbd23",
          "error": "#f87272",
        },
      },
      {
        dark: {
          "primary": "#661ae6",
          "secondary": "#d926aa",
          "accent": "#1fb2a5",
          "neutral": "#191d24",
          "base-100": "#2a303c",
          "info": "#3abff8",
          "success": "#36d399",
          "warning": "#fbbd23",
          "error": "#f87272",
        },
      },
    ],
  },
} as Config & { daisyui: DaisyUIConfig }

export default config