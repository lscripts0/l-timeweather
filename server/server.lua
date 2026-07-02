local timeOffset    = 0
local timeFrozen    = false
local frozenMinutes = 0
local simBase       = (Config.Time.StartHour or 0) * 60 + (Config.Time.StartMinute or 0)
local simStart      = os.time()

local currentWeather = Config.Weather.Start
local nextWeather    = nil
local nextChangeAt   = 0
local weatherFrozen  = false
local blackout       = false

local function realServerMinutes()
    local t = os.date('*t')
    return t.hour * 60 + t.min
end

local function rawMinutesFloat()
    if Config.Time.Mode == 'dynamic' then
        local perSec   = 1440.0 / (math.max(1, Config.Time.DayLengthMinutes or 48) * 60.0)
        local elapsed  = os.time() - simStart
        return (simBase + elapsed * perSec) % 1440
    end
    local t = os.date('*t')
    return (t.hour * 60 + t.min + t.sec / 60.0 + timeOffset) % 1440
end

local function currentMinutes()
    if timeFrozen then return frozenMinutes % 1440 end
    return math.floor(rawMinutesFloat()) % 1440
end

local function currentClock()
    if timeFrozen then
        local fm = frozenMinutes % 1440
        return math.floor(fm / 60), fm % 60, 0
    end
    local totalSec = rawMinutesFloat() * 60.0
    return math.floor(totalSec / 3600) % 24, math.floor(totalSec / 60) % 60, math.floor(totalSec) % 60
end

local allowedIdentifiers

local function identifierAllowed(src)
    if not allowedIdentifiers then
        allowedIdentifiers = {}
        for _, id in ipairs(ServerConfig.AllowedIdentifiers or {}) do
            allowedIdentifiers[tostring(id):lower()] = true
        end
    end

    for i = 0, GetNumPlayerIdentifiers(src) - 1 do
        local id = GetPlayerIdentifier(src, i)
        if id and allowedIdentifiers[id:lower()] then return true end
    end

    return false
end

local function isAllowed(src)
    if src == 0 then return true end
    if ServerConfig.PermissionMode == 'identifier' then
        return identifierAllowed(src)
    end
    return IsPlayerAceAllowed(src, ServerConfig.AcePermission)
end

local function broadcastTime(target)
    local h, m, s = currentClock()
    TriggerClientEvent('l-timeweather:setTime', target or -1, h, m, s, timeFrozen)
end

local function publishWeather(fade)
    GlobalState['weather'] = {
        weather  = currentWeather,
        blackout = blackout,
        fade     = fade or Config.Weather.FadeTime,
    }
end

local function pickNextWeather(from)
    local allowed = Config.Weather.Transitions[from]
    local allowedSet
    if allowed then
        allowedSet = {}
        for _, w in ipairs(allowed) do allowedSet[w] = true end
    end

    local candidates, total = {}, 0
    for _, entry in ipairs(Config.Weather.Pool) do
        if (not allowedSet) or allowedSet[entry.name] then
            total = total + entry.weight
            candidates[#candidates + 1] = entry
        end
    end
    if total <= 0 then return from end

    local roll, acc = math.random(total), 0
    for _, entry in ipairs(candidates) do
        acc = acc + entry.weight
        if roll <= acc then return entry.name end
    end
    return candidates[#candidates].name
end

local function intervalSeconds()
    return math.max(1, Config.Weather.IntervalMinutes or 15) * 60
end

local function scheduleNext()
    nextChangeAt = os.time() + intervalSeconds()
end

local function advanceWeather()
    currentWeather = nextWeather or pickNextWeather(currentWeather)
    nextWeather    = pickNextWeather(currentWeather)
    scheduleNext()
    publishWeather()
end

local function buildSnapshot()
    local h, m, s = currentClock()
    local weathers = {}
    for w in pairs(Config.ValidWeather) do weathers[#weathers + 1] = w end
    table.sort(weathers)

    return {
        time = {
            hour   = h,
            minute = m,
            second = s,
            frozen = timeFrozen,
            mode   = Config.Time.Mode,
        },
        weather = {
            current      = currentWeather,
            next         = nextWeather,
            dynamic      = Config.Weather.Dynamic,
            frozen       = weatherFrozen,
            blackout     = blackout,
            interval     = Config.Weather.IntervalMinutes,
            secondsUntil = math.max(0, nextChangeAt - os.time()),
        },
        weathers = weathers,
    }
end

local function pushSnapshot(src)
    TriggerClientEvent('l-timeweather:snapshot', src, buildSnapshot())
end

local function broadcastSnapshot()
    TriggerClientEvent('l-timeweather:snapshot', -1, buildSnapshot())
end

nextWeather = pickNextWeather(currentWeather)
scheduleNext()
publishWeather()

CreateThread(function()
    while true do
        Wait(1000)
        if Config.Weather.Dynamic and not weatherFrozen then
            if os.time() >= nextChangeAt then
                advanceWeather()
                broadcastSnapshot()
            end
        else
            scheduleNext()
        end
    end
end)

RegisterNetEvent('l-timeweather:requestSync', function()
    broadcastTime(source)
end)

local function setClockTo(minutes)
    if Config.Time.Mode == 'dynamic' then
        simBase  = minutes % 1440
        simStart = os.time()
    else
        timeOffset = (minutes - realServerMinutes()) % 1440
    end
end

local function doSetTime(hour, minute)
    local target = (hour * 60 + minute) % 1440
    if timeFrozen then
        frozenMinutes = target
    else
        setClockTo(target)
    end
    broadcastTime(-1)
end

local function doSyncTime()
    timeFrozen = false
    if Config.Time.Mode == 'dynamic' then
        setClockTo((Config.Time.StartHour or 0) * 60 + (Config.Time.StartMinute or 0))
    else
        timeOffset = 0
    end
    broadcastTime(-1)
end

local function doFreezeTime()
    if timeFrozen then
        setClockTo(frozenMinutes)
        timeFrozen = false
    else
        frozenMinutes = currentMinutes()
        timeFrozen = true
    end
    broadcastTime(-1)
    return timeFrozen
end

local function doSetWeather(weather)
    if not Config.ValidWeather[weather] then return false end
    currentWeather = weather
    publishWeather()
    return true
end

local function doSetForecast(weather)
    if not Config.ValidWeather[weather] then return false end
    nextWeather = weather
    return true
end

RegisterNetEvent('l-timeweather:action', function(action, data)
    local src = source
    if not isAllowed(src) then return Func.Feedback(src, L('no_permission'), 'error') end
    data = data or {}

    if action == 'setTime' then
        local h, mnt = tonumber(data.hour), tonumber(data.minute) or 0
        if h and h >= 0 and h <= 23 and mnt >= 0 and mnt <= 59 then doSetTime(h, mnt) end
    elseif action == 'syncTime' then
        doSyncTime()
    elseif action == 'freezeTime' then
        doFreezeTime()
    elseif action == 'setWeather' then
        doSetWeather((data.weather or ''):upper())
    elseif action == 'setForecast' then
        doSetForecast((data.weather or ''):upper())
    elseif action == 'toggleDynamic' then
        Config.Weather.Dynamic = not Config.Weather.Dynamic
        if Config.Weather.Dynamic then scheduleNext() end
    elseif action == 'toggleFreeze' then
        weatherFrozen = not weatherFrozen
        if not weatherFrozen then scheduleNext() end
    elseif action == 'toggleBlackout' then
        blackout = not blackout
        publishWeather()
    end

    pushSnapshot(src)
end)

RegisterCommand('timeweather', function(src)
    if not isAllowed(src) then return Func.Feedback(src, L('no_permission'), 'error') end
    if src == 0 then return print('[l-timeweather] ' .. L('ingame_only')) end
    TriggerClientEvent('l-timeweather:open', src, buildSnapshot())
end, false)

exports('SetWeather', function(weather)
    local ok = doSetWeather(tostring(weather or ''):upper())
    if ok then broadcastSnapshot() end
    return ok
end)

exports('SetForecast', function(weather)
    local ok = doSetForecast(tostring(weather or ''):upper())
    if ok then broadcastSnapshot() end
    return ok
end)

exports('SetTime', function(hour, minute)
    local h, m = tonumber(hour), tonumber(minute) or 0
    if not h or h < 0 or h > 23 or m < 0 or m > 59 then return false end
    doSetTime(h, m)
    broadcastSnapshot()
    return true
end)

exports('SetBlackout', function(state)
    state = state and true or false
    if blackout ~= state then
        blackout = state
        publishWeather()
        broadcastSnapshot()
    end
    return blackout
end)

exports('GetWeather', function()
    return currentWeather
end)

exports('GetNextWeather', function()
    return nextWeather
end)

exports('GetTime', function()
    return currentClock()
end)

exports('GetWeatherState', function()
    return {
        current      = currentWeather,
        next         = nextWeather,
        dynamic      = Config.Weather.Dynamic,
        frozen       = weatherFrozen,
        blackout     = blackout,
        secondsUntil = math.max(0, nextChangeAt - os.time()),
    }
end)

AddEventHandler('onResourceStart', function(res)
    if res ~= GetCurrentResourceName() then return end
    publishWeather()
    TriggerClientEvent('chat:addSuggestion', -1, '/timeweather', L('sug_timeweather'))
    if lib and lib.versionCheck then lib.versionCheck('lscripts0/l-timeweather') end
end)
