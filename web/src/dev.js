export function devOpen() {
  const tab = location.hash ? location.hash.slice(1) : 'home'
  window.postMessage({
    action: 'open',
    state: {
      time: { hour: 14, minute: 30, second: 0, frozen: false, mode: 'realtime' },
      weather: { current: 'RAIN', next: 'CLEARING', dynamic: true, frozen: false, blackout: false, interval: 15, secondsUntil: 372 },
      weathers: ['BLIZZARD', 'CLEAR', 'CLEARING', 'CLOUDS', 'EXTRASUNNY', 'FOGGY', 'HALLOWEEN', 'NEUTRAL', 'OVERCAST', 'RAIN', 'SMOG', 'SNOW', 'SNOWLIGHT', 'THUNDER', 'XMAS'],
    },
    i18n: null,
    devTab: tab,
  }, '*')
}
