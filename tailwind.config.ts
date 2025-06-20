
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
				brand: ['TT Commons Pro', 'Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
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
				// LangVoice Brand Color System
				'electric-blue': {
					50: '#eff8ff',
					100: '#dbeafe',
					200: '#bfdbfe', 
					300: '#93c5fd',
					400: '#60a5fa',
					500: '#3b82f6', // Primary electric blue
					600: '#2563eb',
					700: '#1d4ed8',
					800: '#1e40af',
					900: '#1e3a8a',
					950: '#172554'
				},
				'highlighter-yellow': {
					50: '#fefce8',
					100: '#fef9c3',
					200: '#fef08a',
					300: '#fde047',
					400: '#facc15', // Primary highlighter yellow
					500: '#eab308',
					600: '#ca8a04',
					700: '#a16207',
					800: '#854d0e',
					900: '#713f12',
					950: '#422006'
				},
				'punchy-magenta': {
					50: '#fdf2f8',
					100: '#fce7f6',
					200: '#fbcfe8',
					300: '#f9a8d4',
					400: '#f472b6',
					500: '#ec4899', // Primary punchy magenta
					600: '#db2777',
					700: '#be185d',
					800: '#9d174d',
					900: '#831843',
					950: '#500724'
				},
				'soft-lilac': {
					50: '#faf5ff',
					100: '#f3e8ff',
					200: '#e9d5ff',
					300: '#d8b4fe',
					400: '#c084fc',
					500: '#a855f7', // Primary soft lilac
					600: '#9333ea',
					700: '#7c2d12',
					800: '#6b21a8',
					900: '#581c87',
					950: '#3b0764'
				},
				// Enhanced semantic colors with brand integration
				'brand': {
					'electric': '#3b82f6',
					'yellow': '#facc15',
					'magenta': '#ec4899',
					'lilac': '#a855f7',
					'dark': '#1e1b4b',
					'light': '#f8fafc'
				},
				// Semantic color system for consistent UI
				'semantic': {
					'neutral': {
						50: '#f8fafc',
						100: '#f1f5f9',
						200: '#e2e8f0',
						300: '#cbd5e1',
						400: '#94a3b8',
						500: '#64748b',
						600: '#475569',
						700: '#334155',
						800: '#1e293b',
						900: '#0f172a'
					},
					'trust': {
						50: '#eff8ff',
						100: '#dbeafe',
						200: '#bfdbfe',
						300: '#93c5fd',
						400: '#60a5fa',
						500: '#3b82f6',
						600: '#2563eb',
						700: '#1d4ed8',
						800: '#1e40af',
						900: '#1e3a8a'
					},
					'success': {
						50: '#f0fdf4',
						100: '#dcfce7',
						200: '#bbf7d0',
						300: '#86efac',
						400: '#4ade80',
						500: '#22c55e',
						600: '#16a34a',
						700: '#15803d',
						800: '#166534',
						900: '#14532d'
					},
					'warning': {
						50: '#fefce8',
						100: '#fef9c3',
						200: '#fef08a',
						300: '#fde047',
						400: '#facc15',
						500: '#eab308',
						600: '#ca8a04',
						700: '#a16207',
						800: '#854d0e',
						900: '#713f12'
					},
					'error': {
						50: '#fef2f2',
						100: '#fee2e2',
						200: '#fecaca',
						300: '#fca5a5',
						400: '#f87171',
						500: '#ef4444',
						600: '#dc2626',
						700: '#b91c1c',
						800: '#991b1b',
						900: '#7f1d1d'
					}
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
				// Brand-inspired animations
				'brand-bounce': {
					'0%, 100%': {
						transform: 'translateY(-5%)',
						animationTimingFunction: 'cubic-bezier(0.8, 0, 1, 1)'
					},
					'50%': {
						transform: 'translateY(0)',
						animationTimingFunction: 'cubic-bezier(0, 0, 0.2, 1)'
					}
				},
				'squiggle': {
					'0%': { transform: 'translateX(0px) rotate(0deg)' },
					'25%': { transform: 'translateX(3px) rotate(1deg)' },
					'50%': { transform: 'translateX(-2px) rotate(-1deg)' },
					'75%': { transform: 'translateX(2px) rotate(0.5deg)' },
					'100%': { transform: 'translateX(0px) rotate(0deg)' }
				},
				'color-shift': {
					'0%': { background: 'linear-gradient(45deg, #3b82f6, #facc15)' },
					'33%': { background: 'linear-gradient(45deg, #facc15, #ec4899)' },
					'66%': { background: 'linear-gradient(45deg, #ec4899, #a855f7)' },
					'100%': { background: 'linear-gradient(45deg, #a855f7, #3b82f6)' }
				},
				'playful-scale': {
					'0%': { transform: 'scale(1) rotate(0deg)' },
					'50%': { transform: 'scale(1.05) rotate(1deg)' },
					'100%': { transform: 'scale(1) rotate(0deg)' }
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
				// Brand animations
				'brand-bounce': 'brand-bounce 1s infinite',
				'squiggle': 'squiggle 2s ease-in-out infinite',
				'color-shift': 'color-shift 4s ease-in-out infinite',
				'playful-scale': 'playful-scale 3s ease-in-out infinite',
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
