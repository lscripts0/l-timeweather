Config = {}

-- Language for all user-facing text. Locale tables in locales/<code>.lua; falls back to 'en'.
Config.Locale = 'en'

Config.Time = {
    -- 'realtime' = follow the real server clock 1:1. 'dynamic' = own day/night cycle,
    -- independent of real life (can be night in-game while it's day IRL).
    Mode = 'realtime',

    -- (dynamic) real minutes for one full in-game day. 48 = classic GTA pace.
    DayLengthMinutes = 48,

    -- (dynamic) in-game time the cycle starts at on boot / on panel "reset".
    StartHour   = 8,
    StartMinute = 0,

    -- Fade (ms) when a freshly connected player receives the current weather.
    JoinWeatherFade = 5000,
}

Config.Weather = {
    -- Weather active when the resource boots.
    Start = 'EXTRASUNNY',

    -- Auto-cycle the weather over time (toggle in the panel at runtime).
    Dynamic = true,

    -- Real minutes until the next weather change (drives the forecast countdown).
    IntervalMinutes = 60,

    -- Smooth fade duration (ms) from the old weather to the new one.
    FadeTime = 30000,

    -- Weighting: the next weather is rolled from this pool, higher weight = more likely.
    Pool = {
        { name = 'EXTRASUNNY', weight = 22 },
        { name = 'CLEAR',      weight = 22 },
        { name = 'CLOUDS',     weight = 18 },
        { name = 'OVERCAST',   weight = 14 },
        { name = 'CLEARING',   weight = 8  },
        { name = 'RAIN',       weight = 6  },
        { name = 'THUNDER',    weight = 3  },
        { name = 'FOGGY',      weight = 4  },
        { name = 'SMOG',       weight = 3  },
    },

    -- Optional: from a given weather only roll a next from this list (still Pool-weighted).
    -- Not listed = full Pool. Keeps storms from snapping straight back to sunny.
    Transitions = {
        EXTRASUNNY = { 'EXTRASUNNY', 'CLEAR', 'CLOUDS' },
        CLEAR      = { 'CLEAR', 'EXTRASUNNY', 'CLOUDS', 'FOGGY' },
        CLOUDS     = { 'CLOUDS', 'OVERCAST', 'CLEAR', 'CLEARING' },
        OVERCAST   = { 'OVERCAST', 'RAIN', 'CLOUDS', 'FOGGY' },
        RAIN       = { 'RAIN', 'THUNDER', 'CLEARING' },
        THUNDER    = { 'THUNDER', 'RAIN', 'CLEARING' },
        CLEARING   = { 'CLEARING', 'CLOUDS', 'CLEAR' },
        FOGGY      = { 'FOGGY', 'CLOUDS', 'CLEAR' },
        SMOG       = { 'SMOG', 'CLOUDS', 'CLEAR' },
    },
}

-- Valid weather types (whitelist for set/forecast).
Config.ValidWeather = {
    EXTRASUNNY = true, CLEAR = true, CLOUDS = true, SMOG = true, FOGGY = true,
    OVERCAST = true, RAIN = true, THUNDER = true, CLEARING = true, NEUTRAL = true,
    SNOW = true, BLIZZARD = true, SNOWLIGHT = true, XMAS = true, HALLOWEEN = true,
}
