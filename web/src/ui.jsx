import { Box, Typography, ButtonBase, Tooltip } from '@mui/material'
import CloseRoundedIcon from '@mui/icons-material/CloseRounded'
import { tokens } from './theme'

export function HudTooltip({ title, placement = 'top', children }) {
  if (!title) return children
  return (
    <Tooltip
      title={title} placement={placement} arrow enterDelay={200} disableInteractive
      slotProps={{
        tooltip: {
          sx: {
            background: 'rgba(10,10,10,0.96)', border: `1px solid ${tokens.borderDashed}`,
            color: '#fff', fontFamily: "'Rajdhani', sans-serif", fontWeight: 600,
            fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.04em',
            px: '0.6rem', py: '0.35rem', boxShadow: '0 0 1.4vh rgba(0,0,0,0.55)',
          },
        },
        arrow: { sx: { color: 'rgba(10,10,10,0.96)', '&::before': { border: `1px solid ${tokens.borderDashed}` } } },
      }}
    >
      {children}
    </Tooltip>
  )
}

export const panelIn = {
  '@keyframes panelIn': {
    from: { opacity: 0, transform: 'scale(0.96)' },
    to: { opacity: 1, transform: 'scale(1)' },
  },
  animation: 'panelIn 0.18s ease-out',
}

export function Overlay({ children, zIndex = 1, sx }) {
  return (
    <Box
      sx={{
        position: 'fixed', inset: 0, zIndex,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: 'rgba(0,0,0,0.45)', ...sx,
      }}
    >
      {children}
    </Box>
  )
}

export function Mono({ children, sx, ...rest }) {
  return (
    <Box component="span" sx={{ fontFamily: tokens.mono, ...sx }} {...rest}>
      {children}
    </Box>
  )
}

export function CloseX({ onClick, size = '1.4rem' }) {
  return (
    <ButtonBase
      onClick={onClick}
      sx={{
        color: tokens.dim, borderRadius: '2px', transition: 'color 0.12s',
        '&:hover': { color: tokens.danger },
      }}
    >
      <CloseRoundedIcon sx={{ fontSize: size }} />
    </ButtonBase>
  )
}

export function NavBtn({ children, active, title, onClick, variant, sx }) {
  const danger = variant === 'danger'
  return (
    <ButtonBase
      onClick={onClick}
      sx={{
        width: '2.5rem', height: '2.5rem', borderRadius: '4px',
        border: `1px solid ${active ? tokens.accent : 'transparent'}`,
        color: active ? tokens.accentSoft : (danger ? 'rgba(255,255,255,0.4)' : tokens.dim),
        boxShadow: active ? `0 0 1.3vh ${tokens.glow(0.28)} inset` : 'none', transition: 'all 0.12s',
        '&:hover': danger
          ? { color: tokens.danger, background: 'rgba(255,70,70,0.08)' }
          : { color: '#fff', background: 'rgba(255,255,255,0.05)' },
        ...sx,
      }}
    >
      {children}
    </ButtonBase>
  )
}

export function GhostButton({ children, onClick, disabled, variant, sx, startIcon }) {
  const colors =
    variant === 'danger'
      ? { c: tokens.dangerSoft, b: tokens.danger, hov: 'rgba(255,70,70,0.1)', hovShadow: 'rgba(255,70,70,0.4)' }
      : { c: tokens.accent, b: tokens.accent, hov: tokens.glow(0.1), hovShadow: tokens.glow(0.4) }
  return (
    <ButtonBase
      onClick={disabled ? undefined : onClick}
      disabled={disabled}
      sx={{
        width: '100%', padding: '0.8rem', borderRadius: '3px',
        border: `1px solid ${colors.b}`, color: colors.c,
        fontFamily: "'Rajdhani', sans-serif", fontSize: '1.05rem', fontWeight: 600,
        textTransform: 'uppercase', letterSpacing: '0.06em',
        boxShadow: tokens.insetGlow, transition: 'all 0.12s',
        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
        opacity: disabled ? 0.4 : 1, pointerEvents: disabled ? 'none' : 'auto',
        '&:hover': { background: colors.hov, boxShadow: `0 0 0.9rem ${colors.hovShadow}, ${tokens.insetGlow}` },
        ...sx,
      }}
    >
      {startIcon}
      {children}
    </ButtonBase>
  )
}

export function Label({ children, sx }) {
  return (
    <Box
      component="span"
      sx={{
        fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.12em',
        color: tokens.dim, ...sx,
      }}
    >
      {children}
    </Box>
  )
}

export function PanelHeader({ title, sub, right }) {
  return (
    <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '1rem', pb: '1rem', mb: '1.2rem', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
      <Box>
        <Box sx={{ fontSize: '0.66rem', letterSpacing: '0.28em', textTransform: 'uppercase', color: tokens.accent, textShadow: `0 0 0.7rem ${tokens.glow(0.5)}` }}>LSCRIPTS</Box>
        <Box sx={{ fontSize: '1.7rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em', lineHeight: 1.05, mt: '0.1rem' }}>{title}</Box>
        <Box sx={{ fontSize: '0.85rem', color: tokens.dimmer, mt: '0.2rem' }}>{sub}</Box>
      </Box>
      <Box sx={{ display: 'flex', gap: '1.3rem', alignItems: 'center', flexShrink: 0 }}>{right}</Box>
    </Box>
  )
}

export function SectionLabel({ children, sx }) {
  return (
    <Box sx={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.14em', color: tokens.dim, mb: '0.7rem', ...sx }}>
      {children}
    </Box>
  )
}

export function Card({ children, sx }) {
  return (
    <Box sx={{ background: tokens.cardBg, border: `1px solid ${tokens.cardBorder}`, borderRadius: '4px', p: '1rem 1.1rem', ...sx }}>
      {children}
    </Box>
  )
}
