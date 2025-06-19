
import type { Config } from "tailwindcss";

export default {
	darkMode: ["class"],
	content: [
		"./pages/**/*.{ts,tsx}",
		"./components/**/*.{ts,tsx}",
		"./app/**/*.{ts,tsx}",
		"./src/**/*.{ts,tsx}",
	],
	prefix: "",
	theme: {
		container: {
			center: true,
			padding: '2rem',
			screens: {
				'2xl': '1400px'
			}
		},
		extend: {
			fontFamily: {
				sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
			},
			colors: {
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				primary: {
					DEFAULT: 'hsl(var(--primary))',
					foreground: 'hsl(var(--primary-foreground))'
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))'
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))'
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))'
				},
				accent: {
					DEFAULT: 'hsl(var(--accent))',
					foreground: 'hsl(var(--accent-foreground))'
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))'
				},
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))'
				},
				sidebar: {
					DEFAULT: 'hsl(var(--sidebar-background))',
					foreground: 'hsl(var(--sidebar-foreground))',
					primary: 'hsl(var(--sidebar-primary))',
					'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
					accent: 'hsl(var(--sidebar-accent))',
					'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
					border: 'hsl(var(--sidebar-border))',
					ring: 'hsl(var(--sidebar-ring))'
				},
				// Enhanced semantic color system
				'semantic': {
					'trust': {
						50: '#eff6ff',
						500: '#3b82f6',
						600: '#2563eb',
						700: '#1d4ed8',
						900: '#1e3a8a',
					},
					'success': {
						50: '#ecfdf5',
						500: '#10b981',
						600: '#059669',
						700: '#047857',
						900: '#064e3b',
					},
					'warning': {
						50: '#fffbeb',
						500: '#f59e0b',
						600: '#d97706',
						700: '#b45309',
						900: '#78350f',
					},
					'error': {
						50: '#fef2f2',
						500: '#ef4444',
						600: '#dc2626',
						700: '#b91c1c',
						900: '#7f1d1d',
					},
					'neutral': {
						50: '#f9fafb',
						100: '#f3f4f6',
						200: '#e5e7eb',
						400: '#9ca3af',
						500: '#6b7280',
						600: '#4b5563',
						700: '#374151',
						800: '#1f2937',
						900: '#111827',
					}
				},
				'ocean-blue': {
					50: '#f0f9ff',
					500: '#0ea5e9',
					600: '#0284c7',
					700: '#0369a1',
				},
				'teal': {
					50: '#f0fdfa',
					500: '#14b8a6',
					600: '#0d9488',
					700: '#0f766e',
				}
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			},
			keyframes: {
				'accordion-down': {
					from: {
						height: '0'
					},
					to: {
						height: 'var(--radix-accordion-content-height)'
					}
				},
				'accordion-up': {
					from: {
						height: 'var(--radix-accordion-content-height)'
					},
					to: {
						height: '0'
					}
				},
				'pulse-ring': {
					'0%': {
						transform: 'scale(0.33)',
					},
					'40%, 50%': {
						opacity: '1',
					},
					'100%': {
						opacity: '0',
						transform: 'scale(1.03)',
					},
				},
				// Enhanced animation keyframes
				'fade-in-up': {
					'0%': {
						opacity: '0',
						transform: 'translateY(10px)'
					},
					'100%': {
						opacity: '1',
						transform: 'translateY(0)'
					}
				},
				'fade-in-down': {
					'0%': {
						opacity: '0',
						transform: 'translateY(-10px)'
					},
					'100%': {
						opacity: '1',
						transform: 'translateY(0)'
					}
				},
				'scale-in': {
					'0%': {
						opacity: '0',
						transform: 'scale(0.95)'
					},
					'100%': {
						opacity: '1',
						transform: 'scale(1)'
					}
				},
				'slide-in-right': {
					'0%': {
						opacity: '0',
						transform: 'translateX(10px)'
					},
					'100%': {
						opacity: '1',
						transform: 'translateX(0)'
					}
				},
				'bounce-subtle': {
					'0%, 100%': {
						transform: 'translateY(0)',
						animationTimingFunction: 'cubic-bezier(0.8, 0, 1, 1)'
					},
					'50%': {
						transform: 'translateY(-2px)',
						animationTimingFunction: 'cubic-bezier(0, 0, 0.2, 1)'
					}
				},
				'shake': {
					'0%, 100%': { transform: 'translateX(0)' },
					'10%, 30%, 50%, 70%, 90%': { transform: 'translateX(-2px)' },
					'20%, 40%, 60%, 80%': { transform: 'translateX(2px)' }
				},
				'glow': {
					'0%, 100%': { 
						boxShadow: '0 0 5px rgba(59, 130, 246, 0.5)' 
					},
					'50%': { 
						boxShadow: '0 0 20px rgba(59, 130, 246, 0.8)' 
					}
				},
				'stagger-item': {
					'0%': {
						opacity: '0',
						transform: 'translateY(8px)'
					},
					'100%': {
						opacity: '1',
						transform: 'translateY(0)'
					}
				}
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
				'pulse-ring': 'pulse-ring 1.25s cubic-bezier(0.215, 0.61, 0.355, 1) infinite',
				// Enhanced animations
				'fade-in-up': 'fade-in-up 0.3s ease-out',
				'fade-in-down': 'fade-in-down 0.3s ease-out',
				'scale-in': 'scale-in 0.2s ease-out',
				'slide-in-right': 'slide-in-right 0.3s ease-out',
				'bounce-subtle': 'bounce-subtle 1s infinite',
				'shake': 'shake 0.5s ease-in-out',
				'glow': 'glow 2s ease-in-out infinite',
				'stagger-item': 'stagger-item 0.4s ease-out'
			},
			transitionTimingFunction: {
				'bounce-out': 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
				'ease-out-quart': 'cubic-bezier(0.25, 1, 0.5, 1)',
			},
			transitionDuration: {
				'micro': '100ms',
				'fast': '200ms',
				'smooth': '300ms',
			}
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;
