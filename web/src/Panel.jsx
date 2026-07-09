import { useEffect, useMemo, useState } from 'react'
import { Box, ButtonBase } from '@mui/material'
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined'
import ScheduleOutlinedIcon from '@mui/icons-material/ScheduleOutlined'
import CloudOutlinedIcon from '@mui/icons-material/CloudOutlined'
import CloseRoundedIcon from '@mui/icons-material/CloseRounded'
import CheckIcon from '@mui/icons-material/Check'
import PauseRoundedIcon from '@mui/icons-material/PauseRounded'
import PlayArrowRoundedIcon from '@mui/icons-material/PlayArrowRounded'
import RestartAltRoundedIcon from '@mui/icons-material/RestartAltRounded'
import ArrowForwardRoundedIcon from '@mui/icons-material/ArrowForwardRounded'
import WbSunnyOutlinedIcon from '@mui/icons-material/WbSunnyOutlined'
import FilterDramaOutlinedIcon from '@mui/icons-material/FilterDramaOutlined'
import ThunderstormOutlinedIcon from '@mui/icons-material/ThunderstormOutlined'
import GrainOutlinedIcon from '@mui/icons-material/GrainOutlined'
import BlurOnOutlinedIcon from '@mui/icons-material/BlurOnOutlined'
import AcUnitOutlinedIcon from '@mui/icons-material/AcUnitOutlined'
import { tokens } from './theme'
import { Overlay, panelIn, NavBtn, GhostButton, SectionLabel, Mono, HudTooltip } from './ui'
import { makeT } from './i18n'
import { action } from './nui'
import { useEsc } from './nui'

const pad = (n) => String(n || 0).padStart(2, '0')
const mmss = (s) => `${pad(Math.floor(s / 60))}:${pad(s % 60)}`
const clampPct = (n) => Math.max(0, Math.min(100, n))

const WICON = {
  EXTRASUNNY: WbSunnyOutlinedIcon, CLEAR: WbSunnyOutlinedIcon,
  CLOUDS: CloudOutlinedIcon, OVERCAST: FilterDramaOutlinedIcon, CLEARING: FilterDramaOutlinedIcon,
  NEUTRAL: CloudOutlinedIcon, HALLOWEEN: FilterDramaOutlinedIcon,
  RAIN: GrainOutlinedIcon, THUNDER: ThunderstormOutlinedIcon,
  FOGGY: BlurOnOutlinedIcon, SMOG: BlurOnOutlinedIcon,
  SNOW: AcUnitOutlinedIcon, BLIZZARD: AcUnitOutlinedIcon, SNOWLIGHT: AcUnitOutlinedIcon, XMAS: AcUnitOutlinedIcon,
}
const wIcon = (name) => WICON[name] || CloudOutlinedIcon

const NAV = [
  { sec: 'home', Icon: HomeOutlinedIcon, title: 'ui_nav_home', tt: 'ui_sec_home_title', ts: 'ui_sec_home_sub' },
  { sec: 'time', Icon: ScheduleOutlinedIcon, title: 'ui_nav_time', tt: 'ui_sec_time_title', ts: 'ui_sec_time_sub' },
  { sec: 'weather', Icon: CloudOutlinedIcon, title: 'ui_nav_weather', tt: 'ui_sec_weather_title', ts: 'ui_sec_weather_sub' },
]

export default function Panel({ data, i18n, tab, setTab, onClose }) {
  const t = useMemo(() => makeT(i18n), [i18n])
  useEsc(onClose)
  const meta = NAV.find((n) => n.sec === tab) || NAV[0]
  const time = data.time || {}
  const w = data.weather || {}
  const weathers = data.weathers || []

  const cycleOn = !!w.dynamic && !w.frozen
  const [left, setLeft] = useState(w.secondsUntil || 0)
  useEffect(() => { setLeft(w.secondsUntil || 0) }, [w.secondsUntil, w.current, w.next])
  useEffect(() => {
    if (!cycleOn) return
    const id = setInterval(() => setLeft((s) => Math.max(0, s - 1)), 1000)
    return () => clearInterval(id)
  }, [cycleOn])

  return (
    <Overlay>
      <Box
        sx={{
          display: 'flex', width: 'min(48rem, 92vw)', height: 'min(32rem, 88vh)',
          background: tokens.panel, border: `1px solid ${tokens.border}`,
          boxShadow: '0 0 18px rgba(255,255,255,0.15) inset', borderRadius: '6px', overflow: 'hidden', ...panelIn,
        }}
      >
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.4rem', width: '3.8rem', py: '1rem', background: tokens.cardBg, borderRight: '1px solid rgba(255,255,255,0.08)' }}>
          {NAV.map((n) => (
            <NavBtn key={n.sec} active={tab === n.sec} title={t(n.title)} onClick={() => setTab(n.sec)}>
              <n.Icon sx={{ fontSize: '1.35rem' }} />
            </NavBtn>
          ))}
          <NavBtn title={t('ui_close')} variant="danger" sx={{ mt: 'auto' }} onClick={onClose}>
            <CloseRoundedIcon sx={{ fontSize: '1.35rem' }} />
          </NavBtn>
        </Box>

        <Box sx={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', p: '1.4rem 1.6rem' }}>
          <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '1.5rem', pb: '1rem', mb: '1.2rem', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
            <Box>
              <Box sx={{ fontSize: '0.66rem', letterSpacing: '0.28em', textTransform: 'uppercase', color: tokens.accent, textShadow: `0 0 0.7rem ${tokens.glow(0.5)}` }}>LSCRIPTS</Box>
              <Box sx={{ fontSize: '1.7rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em', lineHeight: 1.05, mt: '0.1rem' }}>{t(meta.tt)}</Box>
              <Box sx={{ fontSize: '0.85rem', color: tokens.dimmer, mt: '0.2rem' }}>{t(meta.ts)}</Box>
            </Box>
            {tab !== 'home' && <HeaderMeta time={time} w={w} left={left} cycleOn={cycleOn} t={t} />}
          </Box>

          <Box sx={bodySx}>
            {tab === 'home' && <HomeSection time={time} w={w} weathers={weathers} left={left} cycleOn={cycleOn} t={t} />}
            {tab === 'time' && <TimeSection time={time} t={t} />}
            {tab === 'weather' && <WeatherSection w={w} weathers={weathers} t={t} />}
          </Box>
        </Box>
      </Box>
    </Overlay>
  )
}

function HeaderMeta({ time, w, left, cycleOn, t }) {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.25rem', flexShrink: 0, textAlign: 'right' }}>
      <Mono sx={{ fontSize: '1.45rem', lineHeight: 1, color: tokens.accentSoft, textShadow: `0 0 1rem ${tokens.glow(0.5)}` }}>
        {pad(time.hour)}:{pad(time.minute)}
      </Mono>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.82rem' }}>
        <Mono sx={{ color: tokens.accentSoft }}>{w.current || '—'}</Mono>
        <ArrowForwardRoundedIcon sx={{ fontSize: '0.85rem', color: tokens.dim }} />
        <Mono sx={{ color: 'rgba(255,255,255,0.55)' }}>{w.next || '—'}</Mono>
      </Box>
      <Box sx={{ fontSize: '0.72rem', color: tokens.dim, letterSpacing: '0.04em' }}>
        {cycleOn ? t('ui_changes_in', { t: mmss(left) }) : t('ui_cycle_paused')}
      </Box>
    </Box>
  )
}

function HomeSection({ time, w, weathers, left, cycleOn, t }) {
  const [picking, setPicking] = useState(false)
  const total = (w.interval || 1) * 60
  const fill = clampPct(((total - left) / total) * 100)

  return (
    <>
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: '1.5rem' }}>
        <Mono sx={{ fontSize: '4rem', lineHeight: 1, color: tokens.accentSoft, textShadow: `0 0 1.8rem ${tokens.glow(0.5)}` }}>
          {pad(time.hour)}:{pad(time.minute)}<Box component="span" sx={{ fontSize: '2rem', color: tokens.dim }}>:{pad(time.second)}</Box>
        </Mono>
        <Box sx={{ fontSize: '0.85rem', color: tokens.dim, mt: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
          {time.frozen ? t('ui_clock_frozen') : t('ui_clock_follows')}
        </Box>
      </Box>

      <SectionLabel>{t('ui_forecast')}</SectionLabel>
      <Box sx={{ background: tokens.cardBg, border: `1px solid ${tokens.cardBorder}`, borderRadius: '5px', p: '1.2rem 1.3rem' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <WeatherFace label={t('ui_now')} value={w.current} />
          <ArrowForwardRoundedIcon sx={{ fontSize: '1.6rem', color: tokens.dim, flexShrink: 0 }} />
          <WeatherFace label={t('ui_next')} value={w.next} active={picking} onClick={() => setPicking((p) => !p)} />
        </Box>

        <Box sx={{ mt: '1.2rem', display: 'flex', alignItems: 'center', gap: '0.9rem' }}>
          <Box sx={{ flex: 1, height: '0.45rem', borderRadius: '1rem', background: 'rgba(255,255,255,0.08)', overflow: 'hidden' }}>
            <Box sx={{ height: '100%', width: `${cycleOn ? fill : 0}%`, borderRadius: '1rem', background: `linear-gradient(90deg, ${tokens.glow(0.6)}, ${tokens.accent})`, boxShadow: `0 0 0.7rem ${tokens.glow(0.5)}`, transition: 'width 0.9s linear' }} />
          </Box>
          <Box sx={{ fontSize: '0.82rem', color: cycleOn ? 'rgba(255,255,255,0.8)' : tokens.dim, whiteSpace: 'nowrap' }}>
            {cycleOn ? <>{t('ui_changes_in', { t: '' })}<Mono sx={{ color: tokens.accentSoft }}>{mmss(left)}</Mono></> : t('ui_cycle_paused')}
          </Box>
        </Box>

        {picking && (
          <Box sx={{ mt: '1.1rem', pt: '1.1rem', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
            <SectionLabel>{t('ui_pick_forecast')}</SectionLabel>
            <Box sx={chipGrid}>
              {weathers.map((name) => (
                <Chip key={name} active={name === w.next} onClick={() => { action('setForecast', { weather: name }); setPicking(false) }}>{name}</Chip>
              ))}
            </Box>
          </Box>
        )}
      </Box>
    </>
  )
}

function WeatherFace({ label, value, active, onClick }) {
  const Icon = wIcon(value)
  const clickable = !!onClick
  return (
    <ButtonBase
      onClick={onClick} disableRipple={!clickable} component={clickable ? 'button' : 'div'}
      sx={{
        flex: 1, minWidth: 0, display: 'flex', alignItems: 'center', gap: '0.8rem', textAlign: 'left',
        p: '0.7rem 0.9rem', borderRadius: '4px', cursor: clickable ? 'pointer' : 'default', transition: 'all 0.12s',
        background: active ? tokens.glow(0.1) : 'rgba(255,255,255,0.03)',
        border: `1px solid ${active ? tokens.accent : 'rgba(255,255,255,0.08)'}`,
        '&:hover': clickable ? { borderColor: tokens.accent } : {},
      }}
    >
      <Box sx={{ width: '2.6rem', height: '2.6rem', flexShrink: 0, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: tokens.glow(0.12), border: `1px solid ${tokens.glow(0.3)}` }}>
        <Icon sx={{ fontSize: '1.5rem', color: tokens.accent }} />
      </Box>
      <Box sx={{ minWidth: 0 }}>
        <Box sx={{ fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.12em', color: tokens.dim }}>{label}</Box>
        <Mono sx={{ fontSize: '1.25rem', color: tokens.accentSoft, display: 'block', mt: '0.15rem', overflow: 'hidden', textOverflow: 'ellipsis' }}>{value || '—'}</Mono>
      </Box>
    </ButtonBase>
  )
}

function TimeSection({ time, t }) {
  const [h, setH] = useState(time.hour)
  const [m, setM] = useState(time.minute)
  useEffect(() => { setH(time.hour); setM(time.minute) }, [time.hour, time.minute])

  const clampH = (v) => Math.max(0, Math.min(23, parseInt(v, 10) || 0))
  const clampM = (v) => Math.max(0, Math.min(59, parseInt(v, 10) || 0))

  return (
    <>
      <SectionLabel>{t('ui_set_time')}</SectionLabel>
      <Box sx={{ display: 'flex', alignItems: 'flex-end', gap: '0.6rem', flexWrap: 'wrap' }}>
        <Field label={t('ui_hour')}><NumInput value={h} onChange={(e) => setH(clampH(e.target.value))} max={23} /></Field>
        <Field label={t('ui_minute')}><NumInput value={m} onChange={(e) => setM(clampM(e.target.value))} max={59} /></Field>
        <IconBtn title={t('ui_btn_set')} onClick={() => action('setTime', { hour: h, minute: m })}>
          <CheckIcon sx={{ fontSize: '1.3rem' }} />
        </IconBtn>
        <IconBtn title={time.frozen ? t('ui_unfreeze') : t('ui_freeze')} variant={time.frozen ? 'danger' : undefined} onClick={() => action('freezeTime')}>
          {time.frozen ? <PlayArrowRoundedIcon sx={{ fontSize: '1.4rem' }} /> : <PauseRoundedIcon sx={{ fontSize: '1.4rem' }} />}
        </IconBtn>
        <IconBtn title={t(time.mode === 'dynamic' ? 'ui_reset_cycle' : 'ui_take_servertime')} onClick={() => action('syncTime')}>
          <RestartAltRoundedIcon sx={{ fontSize: '1.4rem' }} />
        </IconBtn>
      </Box>

      <SectionLabel sx={{ mt: '1.6rem' }}>{t('ui_quickselect')}</SectionLabel>
      <Box sx={grid2}>
        {[['ui_preset_morning', 6], ['ui_preset_noon', 12], ['ui_preset_evening', 18], ['ui_preset_night', 0]].map(([k, hr]) => (
          <GhostButton key={k} onClick={() => action('setTime', { hour: hr, minute: 0 })}>{t(k)}</GhostButton>
        ))}
      </Box>
    </>
  )
}

function WeatherSection({ w, weathers, t }) {
  return (
    <>
      <SectionLabel>{t('ui_options')}</SectionLabel>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', mb: '1.6rem' }}>
        <ToggleRow label={t('ui_dynamic_cycle')} hint={t('ui_dynamic_hint', { min: w.interval })} on={!!w.dynamic} onClick={() => action('toggleDynamic')} />
        <ToggleRow label={t('ui_freeze_cycle')} hint={t('ui_freeze_cycle_hint')} on={!!w.frozen} onClick={() => action('toggleFreeze')} />
        <ToggleRow label={t('ui_blackout')} hint={t('ui_blackout_hint')} on={!!w.blackout} onClick={() => action('toggleBlackout')} />
      </Box>

      <Box sx={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', mb: '0.7rem' }}>
        <SectionLabel sx={{ mb: 0 }}>{t('ui_set_weather')}</SectionLabel>
        <Box sx={{ fontSize: '0.8rem', color: tokens.dim }}>
          {t('ui_current_weather')}: <Mono sx={{ color: tokens.accentSoft }}>{w.current}</Mono>
        </Box>
      </Box>
      <Box sx={chipGrid}>
        {weathers.map((name) => (
          <Chip key={name} active={name === w.current} onClick={() => action('setWeather', { weather: name })}>{name}</Chip>
        ))}
      </Box>
    </>
  )
}

function IconBtn({ onClick, title, children, variant }) {
  const danger = variant === 'danger'
  const col = danger ? tokens.dangerSoft : tokens.accent
  const brd = danger ? tokens.danger : tokens.accent
  return (
    <HudTooltip title={title}>
      <ButtonBase
        onClick={onClick}
        sx={{
          height: '2.55rem', minWidth: '3.4rem', px: '1rem', flexShrink: 0, borderRadius: '3px',
          border: `1px solid ${brd}`, color: col, boxShadow: tokens.insetGlow, transition: 'all 0.12s',
          '&:hover': {
            background: danger ? 'rgba(255,70,70,0.1)' : tokens.glow(0.1),
            boxShadow: `0 0 0.9rem ${danger ? 'rgba(255,70,70,0.4)' : tokens.glow(0.4)}, ${tokens.insetGlow}`,
          },
        }}
      >
        {children}
      </ButtonBase>
    </HudTooltip>
  )
}

function Field({ label, children }) {
  return (
    <Box sx={{ flexShrink: 0, display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
      <Box sx={{ fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: tokens.dim }}>{label}</Box>
      {children}
    </Box>
  )
}

function NumInput({ value, onChange, max }) {
  return (
    <Box
      component="input" type="number" min={0} max={max} value={value} onChange={onChange}
      sx={{
        width: '4.6rem', boxSizing: 'border-box', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.14)', borderRadius: '3px',
        color: '#fff', fontFamily: tokens.mono, fontSize: '1.1rem', padding: '0.55rem 0.6rem', outline: 'none', textAlign: 'center',
        '&:focus': { borderColor: tokens.accent },
        '&::-webkit-inner-spin-button, &::-webkit-outer-spin-button': { WebkitAppearance: 'none', margin: 0 },
      }}
    />
  )
}

function ToggleRow({ label, hint, on, onClick }) {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', background: tokens.cardBg, border: `1px solid ${tokens.cardBorder}`, borderRadius: '4px', p: '0.7rem 1rem' }}>
      <Box>
        <Box sx={{ fontSize: '0.98rem', fontWeight: 600 }}>{label}</Box>
        <Box sx={{ fontSize: '0.78rem', color: tokens.dim, mt: '0.1rem' }}>{hint}</Box>
      </Box>
      <Switch on={on} onClick={onClick} />
    </Box>
  )
}

function Switch({ on, onClick }) {
  return (
    <ButtonBase
      onClick={onClick}
      sx={{
        width: '2.8rem', height: '1.5rem', borderRadius: '1rem', flexShrink: 0, position: 'relative', transition: 'all 0.15s',
        border: `1px solid ${on ? tokens.accent : 'rgba(255,255,255,0.18)'}`,
        background: on ? tokens.glow(0.2) : 'rgba(255,255,255,0.05)',
        boxShadow: on ? `0 0 0.8rem ${tokens.glow(0.3)} inset` : 'none',
      }}
    >
      <Box sx={{ position: 'absolute', top: '0.15rem', left: on ? '1.45rem' : '0.18rem', width: '1rem', height: '1rem', borderRadius: '50%', background: on ? tokens.accentSoft : 'rgba(255,255,255,0.6)', transition: 'left 0.15s' }} />
    </ButtonBase>
  )
}

function Chip({ active, onClick, children }) {
  return (
    <ButtonBase
      onClick={onClick}
      sx={{
        py: '0.6rem', px: '0.5rem', borderRadius: '3px', fontFamily: "'Rajdhani', sans-serif", fontWeight: 600,
        fontSize: '0.82rem', textTransform: 'uppercase', letterSpacing: '0.03em', transition: 'all 0.12s',
        border: `1px solid ${active ? tokens.accent : 'rgba(255,255,255,0.12)'}`,
        color: active ? tokens.accentSoft : 'rgba(255,255,255,0.7)',
        background: active ? tokens.glow(0.12) : 'rgba(255,255,255,0.02)',
        boxShadow: active ? `0 0 0.7rem ${tokens.glow(0.25)} inset` : 'none',
        '&:hover': { borderColor: tokens.accent, color: '#fff' },
      }}
    >
      {children}
    </ButtonBase>
  )
}

const grid2 = { display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.6rem' }
const chipGrid = { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(7rem, 1fr))', gap: '0.5rem' }

const bodySx = {
  flex: 1, overflowY: 'auto', overflowX: 'hidden', pr: '0.3rem', scrollbarGutter: 'stable',
  '&::-webkit-scrollbar': { width: '0.5rem' },
  '&::-webkit-scrollbar-track': { background: 'transparent' },
  '&::-webkit-scrollbar-thumb': { background: 'rgba(255,255,255,0.15)', borderRadius: '4px' },
  '&::-webkit-scrollbar-thumb:hover': { background: tokens.accent },
}
