import typography from "@tailwindcss/typography";
import containerQueries from "@tailwindcss/container-queries";
import animate from "tailwindcss-animate";

/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class"],
  content: ["index.html", "src/**/*.{js,ts,jsx,tsx,html,css}"],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: { "2xl": "1400px" },
    },
    extend: {
      fontFamily: {
        jakarta: ["'Plus Jakarta Sans'", "sans-serif"],
        playfair: ["'Playfair Display'", "serif"],
      },
      colors: {
        brand: {
          DEFAULT: "oklch(var(--brand))",
          dark:    "oklch(var(--brand-dark))",
          light:   "oklch(var(--brand-light))",
        },
        navy:  "oklch(var(--navy))",
        border: "oklch(var(--border))",
        input:  "oklch(var(--input))",
        ring:   "oklch(var(--ring) / <alpha-value>)",
        background: "oklch(var(--background))",
        foreground:  "oklch(var(--foreground))",
        primary: {
          DEFAULT:    "oklch(var(--primary) / <alpha-value>)",
          foreground: "oklch(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT:    "oklch(var(--secondary) / <alpha-value>)",
          foreground: "oklch(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT:    "oklch(var(--destructive) / <alpha-value>)",
          foreground: "oklch(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT:    "oklch(var(--muted) / <alpha-value>)",
          foreground: "oklch(var(--muted-foreground) / <alpha-value>)",
        },
        accent: {
          DEFAULT:    "oklch(var(--accent) / <alpha-value>)",
          foreground: "oklch(var(--accent-foreground))",
        },
        popover: {
          DEFAULT:    "oklch(var(--popover))",
          foreground: "oklch(var(--popover-foreground))",
        },
        card: {
          DEFAULT:    "oklch(var(--card))",
          foreground: "oklch(var(--card-foreground))",
        },
        chart: {
          1: "oklch(var(--chart-1))",
          2: "oklch(var(--chart-2))",
          3: "oklch(var(--chart-3))",
          4: "oklch(var(--chart-4))",
          5: "oklch(var(--chart-5))",
        },
        sidebar: {
          DEFAULT:              "oklch(var(--sidebar))",
          foreground:           "oklch(var(--sidebar-foreground))",
          primary:              "oklch(var(--sidebar-primary))",
          "primary-foreground": "oklch(var(--sidebar-primary-foreground))",
          accent:               "oklch(var(--sidebar-accent))",
          "accent-foreground":  "oklch(var(--sidebar-accent-foreground))",
          border:               "oklch(var(--sidebar-border))",
          ring:                 "oklch(var(--sidebar-ring))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
        xl: "1rem",
        "2xl": "1.5rem",
        "3xl": "2rem",
      },
      boxShadow: {
        card:    "0 1px 3px 0 rgba(0,0,0,0.06), 0 4px 16px 0 rgba(0,0,0,0.06)",
        "card-hover": "0 4px 24px 0 rgba(0,0,0,0.10), 0 1px 4px 0 rgba(0,0,0,0.06)",
        premium: "0 8px 32px 0 rgba(0,0,0,0.10), 0 1px 4px 0 rgba(0,0,0,0.06)",
        brand:   "0 4px 24px oklch(0.38 0.14 12 / 0.28)",
        xs:      "0 1px 2px 0 rgba(0,0,0,0.05)",
        modal:   "0 24px 80px -8px rgba(0,0,0,0.22), 0 0 0 1px rgba(0,0,0,0.04)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to:   { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to:   { height: "0" },
        },
        "fade-up": {
          from: { opacity: "0", transform: "translateY(20px)" },
          to:   { opacity: "1", transform: "translateY(0)" },
        },
        "spin-slow": {
          from: { transform: "rotate(0deg)" },
          to:   { transform: "rotate(360deg)" },
        },
        "shimmer": {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up":   "accordion-up 0.2s ease-out",
        "fade-up":        "fade-up 0.5s ease-out forwards",
        "spin-slow":      "spin-slow 1.2s linear infinite",
        "shimmer":        "shimmer 2.4s linear infinite",
      },
    },
  },
  plugins: [typography, containerQueries, animate],
};
