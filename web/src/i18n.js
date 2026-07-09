export const DEF = {
  ui_brand: 'Time & Weather', ui_close: 'Close (ESC)',
  ui_nav_home: 'Home', ui_nav_time: 'Time', ui_nav_weather: 'Weather',
  ui_sec_home_title: 'OVERVIEW', ui_sec_home_sub: 'Time and forecast',
  ui_sec_time_title: 'TIME', ui_sec_time_sub: 'Server clock control',
  ui_sec_weather_title: 'WEATHER', ui_sec_weather_sub: 'Cycle and current weather',
  ui_status_servertime: 'Server time', ui_status_dynamic: 'Dynamic cycle', ui_status_timefixed: 'Time fixed',
  ui_status_cycle_on: 'Cycle on', ui_status_cycle_off: 'Cycle off',
  ui_current_weather: 'Current',
  ui_forecast: 'Forecast', ui_now: 'Now', ui_next: 'Next',
  ui_changes_in: 'Changes in {t}', ui_cycle_paused: 'Cycle paused',
  ui_pick_forecast: 'Choose next weather',
  ui_clock_follows: 'Follows server time', ui_clock_frozen: 'Frozen',
  ui_set_time: 'Set time', ui_hour: 'Hour', ui_minute: 'Minute', ui_btn_set: 'Set',
  ui_quickselect: 'Quick select',
  ui_preset_morning: '06:00 Morning', ui_preset_noon: '12:00 Noon',
  ui_preset_evening: '18:00 Evening', ui_preset_night: '00:00 Night',
  ui_freeze: 'Freeze', ui_unfreeze: 'Unfreeze',
  ui_take_servertime: 'Use server time', ui_reset_cycle: 'Reset cycle',
  ui_options: 'Options',
  ui_dynamic_cycle: 'Dynamic cycle', ui_dynamic_hint: 'Changes automatically every {min} min.',
  ui_freeze_cycle: 'Freeze cycle', ui_freeze_cycle_hint: 'Stops the automatic change',
  ui_blackout: 'Blackout', ui_blackout_hint: 'Artificial lights off',
  ui_set_weather: 'Set weather',
}

export function makeT(dict) {
  const d = dict || DEF
  return (key, vars) => {
    let s = (d && d[key]) || DEF[key] || key
    if (vars) for (const k in vars) s = s.split(`{${k}}`).join(vars[k])
    return s
  }
}
