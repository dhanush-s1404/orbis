/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx}",
    "./src/components/**/*.{js,ts,jsx,tsx}",
    "./src/app/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-geist-sans)", "system-ui", "sans-serif"],
        mono: ["var(--font-geist-mono)", "ui-monospace", "mono"],
      },
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          violet: "hsl(var(--accent-violet))",
          indigo: "hsl(var(--accent-indigo))",
          cyan: "hsl(var(--accent-cyan))",
          magenta: "hsl(var(--accent-magenta))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        gradient: {
          aurora: "aurora(var(--aurora-start), var(--aurora-end))",
          bubble: "bubble(var(--bubble-start), var(--bubble-end))",
        },
      },
      borderRadius: {
        lg: "var(--radius-lg, 0.5rem)",
        md: "var(--radius-md, 0.375rem)",
        sm: "var(--radius-sm, 0.25rem)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-height)" },
          to: { height: "0" },
        },
        "fade-in-up": {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "fade-in": {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        "fade-in-slow": {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        "float": {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-20px)" },
        },
        "float-slow": {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-30px)" },
        },
        "shine": {
          "0%": { "background-position": "0% 50%" },
          "50%": { "background-position": "100% 50%" },
          "100%": { "background-position": "0% 50%" },
        },
        "gradient-x": {
          "0%": { "background-position": "0% 50%" },
          "50%": { "background-position": "100% 50%" },
          "100%": { "background-position": "0% 50%" },
        },
        "orbit": {
          "0%": { transform: "rotate(0deg) translateY(-10px)" },
          "100%": { transform: "rotate(360deg) translateY(-10px)" },
        },
        "gradient-orb": {
          "0%": {
            background: `radial-gradient(at 20% 20%, hsl(270 80% 30% / 0.3), transparent 50%),
                         radial-gradient(at 80% 80%, hsl(290 70% 30% / 0.2), transparent 50%)`,
          },
          "50%": {
            background: `radial-gradient(at 30% 80%, hsl(280 65% 40% / 0.4), transparent 50%),
                         radial-gradient(at 70% 20%, hsl(260 75% 35% / 0.3), transparent 50%)`,
          },
          "100%": {
            background: `radial-gradient(at 20% 20%, hsl(270 80% 30% / 0.3), transparent 50%),
                         radial-gradient(at 80% 80%, hsl(290 70% 30% / 0.2), transparent 50%)`,
          },
        },
        "blob": {
          "0%": { transform: "translate(0, 0) scale(1)" },
          "33%": { transform: "translate(30px, -30px) scale(1.1)" },
          "66%": { transform: "translate(-30px, 30px) scale(0.9)" },
          "100%": { transform: "translate(0, 0) scale(1)" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "fade-in-up": "fade-in-up 0.5s ease-out",
        "fade-in": "fade-in 0.4s ease-out",
        "fade-in-slow": "fade-in 0.8s ease-out",
        "float": "float 6s ease-in-out infinite",
        "float-slow": "float-slow 8s ease-in-out infinite",
        "shine": "shine 3s ease-in-out infinite",
        "gradient-orb": "gradient-orb 15s ease infinite",
        "blob": "blob 20s ease-in-out infinite",
      },
      backgroundImage: {
        "aurora": "aurora(var(--aurora-start), var(--aurora-end))",
        "bubble": "bubble(var(--bubble-start), var(--bubble-end))",
      },
    },
  },
  plugins: [],
}