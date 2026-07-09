import { createTheme } from '@mui/material/styles'

export const rem = (px) => `${px / 16}rem`

export const tokens = {
  accent: 'var(--accent, #2CB0FD)',
  accentSoft: 'var(--accent-soft, #6cc5fd)',
  accentRgb: 'var(--accent-rgb, 44,176,253)',
  glow: (a) => `rgba(var(--accent-rgb, 44,176,253),${a})`,
  panel: 'rgba(7,7,7,0.93)',
  border: 'rgba(255,255,255,0.14)',
  borderDashed: 'rgba(255,255,255,0.15)',
  insetGlow: '0 0 1.7vh rgba(255,255,255,0.15) inset',
  cardBg: 'rgba(255,255,255,0.03)',
  cardBorder: 'rgba(255,255,255,0.1)',
  dim: 'rgba(255,255,255,0.5)',
  dimmer: 'rgba(255,255,255,0.45)',
  good: '#43ff36',
  danger: 'rgb(255,70,70)',
  dangerSoft: 'rgb(255,120,120)',
  warn: 'rgb(255,170,60)',
  mono: "'Share Tech Mono', monospace",
}

const theme = createTheme({
  spacing: (factor) => `${factor * 0.5}rem`,
  palette: {
    mode: 'dark',
    primary: { main: '#2CB0FD' },
    secondary: { main: '#6cc5fd' },
    background: { default: 'transparent', paper: tokens.panel },
    text: { primary: '#ffffff', secondary: 'rgba(255,255,255,0.5)' },
  },
  shape: { borderRadius: 4 },
  typography: {
    fontFamily: "'Rajdhani', system-ui, sans-serif",
    button: { fontWeight: 600, textTransform: 'uppercase', letterSpacing: 'normal' },
    overline: { letterSpacing: '0.28em', fontWeight: 700, textTransform: 'uppercase' },
  },
})

export default theme
