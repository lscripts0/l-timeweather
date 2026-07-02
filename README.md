# l-timeweather

Server-authoritative time and weather sync. One admin panel controls the in-game clock
and a smooth, dynamic weather cycle for the whole server, with a live forecast of what
the weather will change to next. Framework independent, access is handled via ACE
permission or an identifier allowlist.

## Features

- **Two time modes.** `realtime` follows the real server clock 1:1 (12:00 in real life
  is 12:00 in-game). `dynamic` runs its own day/night cycle independent of real life, so
  it can be night in-game while it is daytime outside. In dynamic mode you set how many
  real minutes a full 24h day takes (for example 48 for the classic GTA pace).
- **Global weather cycle.** One weather for the whole map, picked from a weighted pool
  with optional realistic transitions, so you can make sun common and storms rare.
  Smooth fades between weather stages.
- **Forecast.** The server always knows the single next weather and when it will change.
  The panel shows `current to next` with a live countdown, and you can override the
  upcoming weather by hand.
- **Read-only weather statebag.** The current weather lives in a global statebag that
  clients only read, with a clean change handler and a fresh pull right after the player
  spawns.
- **Blackout** toggle (artificial lights off) for events.
- **Single NUI panel** in a clean HUD style: a Home overview (live clock + forecast with
  weather icons + countdown bar), a Time tab (set time, presets, freeze, reset) and a
  Weather tab (cycle toggles, set current weather).
- **Server exports** so other resources can read or drive time and weather.
- English and German locales.

## Requirements

- `ox_lib`

No database is used, no framework is required.

## Install

1. Download the resource and put the `l-timeweather` folder in your server's `resources`
   directory (rename it to `l-timeweather` if your download added a suffix).
2. Add it to your `server.cfg`, after `ox_lib`:

   ```cfg
   ensure ox_lib
   ensure l-timeweather
   ```

3. Give your admins access. Two modes, picked via `PermissionMode` in
   `server_config.lua`:

   - **`"ace"`** (default): grant the permission in your `server.cfg`:

     ```cfg
     add_ace group.admin "l-timeweather.admin" allow
     ```

     Any ACE target works, for example a single player via
     `add_ace identifier.license:xxxxxxxx "l-timeweather.admin" allow`. The permission
     name can be changed in `server_config.lua`.

   - **`"identifier"`**: list the allowed players in `server_config.lua` under
     `AllowedIdentifiers`, e.g. `"discord:123456789012345678"` or `"fivem:1234567"`
     (any identifier type works, license too).

4. Start the server (or `ensure l-timeweather` / `refresh` from the console).

## Usage

- `/timeweather` opens the admin panel (in-game only). Everything is done from the panel,
  there are no other commands.
- Allowed for everyone with the `l-timeweather.admin` ACE permission, or in
  `identifier` mode for everyone on the allowlist (see Install); the server console is
  always allowed.

Panel sections:

- **Home** shows the live clock and the forecast (current weather, next weather, and a
  countdown to the next change). Click the "next" tile to override the upcoming weather.
- **Time** sets the hour and minute, has quick presets, a freeze toggle, and a reset
  button (back to server time, or back to the configured start time in dynamic mode).
- **Weather** toggles the dynamic cycle, freezes the cycle, toggles blackout, and lets
  you set the current weather directly.

## Configuration

- `config.lua` (shared): language, time mode and day length, the weather start, cycle
  interval, fade time, the weighted weather pool and the optional transition table.
- `server_config.lua` (server only, never sent to clients): the permission mode
  (`ace` or `identifier`), the ACE permission name and the identifier allowlist.

## Exports (server)

Call from any server script as `exports['l-timeweather']:Name(...)`.

| Export | Args | Returns | Effect |
|--------|------|---------|--------|
| `SetWeather` | `weather` | `bool` | set the current weather now (for example `'RAIN'`). The forecast and countdown keep running |
| `SetForecast` | `weather` | `bool` | override only the upcoming weather |
| `SetTime` | `hour, minute?` | `bool` | set the in-game time (minute defaults to 0) |
| `SetBlackout` | `state` | `bool` | turn blackout on or off, returns the new state |
| `GetWeather` | none | `string` | current weather type |
| `GetNextWeather` | none | `string` | the forecast (next) weather type |
| `GetTime` | none | `hour, minute, second` | current in-game clock |
| `GetWeatherState` | none | `table` | `{ current, next, dynamic, frozen, blackout, secondsUntil }` |

Example:

```lua
exports['l-timeweather']:SetWeather('THUNDER')
exports['l-timeweather']:SetForecast('CLEAR')
exports['l-timeweather']:SetTime(8, 30)

local current = exports['l-timeweather']:GetWeather()
local next    = exports['l-timeweather']:GetNextWeather()
```

## Updates

On start the resource checks this GitHub repo's latest release against its own version
and prints a short note in the server console if an update is available.

## Notes

This repository ships only the runtime files (built UI included). The UI source is not
required to run the resource.

## Support

If you find this resource useful, you can support development on Ko-fi:

[![ko-fi](https://ko-fi.com/img/githubbutton_sm.svg)](https://ko-fi.com/lscripts)
