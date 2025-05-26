import type { Config } from "tailwindcss"
const config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
    "*.{js,ts,jsx,tsx,mdx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
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
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        // Chart colors using your specified values
        "chart-1": "12 76% 61%", // orange-red
        "chart-2": "173 58% 39%", // teal
        "chart-3": "197 37% 24%", // dark blue
        "chart-4": "43 74% 66%", // yellow
        "chart-5": "27 87% 67%", // orange
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        "fade-in": {
          from: { opacity: "0", transform: "translateY(10px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        "pure-fade": {
          from: { opacity: "0" },
          to: { opacity: "1" },
        },
        "slide-in-from-top": {
          from: { transform: "translateY(-10px)", opacity: "0" },
          to: { transform: "translateY(0)", opacity: "1" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "fade-in": "pure-fade 0.15s ease-out",
        "fade-out": "pure-fade 0.15s ease-out reverse",
        "pure-fade": "pure-fade 0.15s ease-out",
        "in": "pure-fade 0.15s ease-out",
        "out": "pure-fade 0.15s ease-out reverse",
        "zoom-in": "pure-fade 0.15s ease-out",
        "zoom-out": "pure-fade 0.15s ease-out reverse",
        "slide-in": "pure-fade 0.15s ease-out",
        "slide-out": "pure-fade 0.15s ease-out reverse",
        // Override all directional animations
        "slide-in-from-top": "pure-fade 0.15s ease-out",
        "slide-in-from-bottom": "pure-fade 0.15s ease-out",
        "slide-in-from-left": "pure-fade 0.15s ease-out",
        "slide-in-from-right": "pure-fade 0.15s ease-out",
        "slide-out-to-top": "pure-fade 0.15s ease-out reverse",
        "slide-out-to-bottom": "pure-fade 0.15s ease-out reverse",
        "slide-out-to-left": "pure-fade 0.15s ease-out reverse",
        "slide-out-to-right": "pure-fade 0.15s ease-out reverse",
      },
      boxShadow: {
        soft: "0 2px 15px -3px rgba(0, 0, 0, 0.07), 0 10px 20px -2px rgba(0, 0, 0, 0.04)",
        medium: "0 4px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
        large: "0 10px 40px -10px rgba(0, 0, 0, 0.15), 0 20px 25px -5px rgba(0, 0, 0, 0.1)",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config

export default config
