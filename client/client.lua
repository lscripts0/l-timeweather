local frozen = false
local panelOpen = false

local function timeScale()
    if Config.Time.Mode == 'dynamic' then
        return 1440.0 / math.max(1, Config.Time.DayLengthMinutes or 48)
    end
    return 1.0
end

local function applyClockRate()
    if frozen then
        NetworkOverrideClockMillisecondsPerGameMinute(2147483647)
    else
        NetworkOverrideClockMillisecondsPerGameMinute(math.max(1, math.floor(60000.0 / timeScale() + 0.5)))
    end
end

RegisterNetEvent('l-timeweather:setTime', function(hour, minute, second, isFrozen)
    frozen = isFrozen == true
    NetworkOverrideClockTime(hour, minute, math.floor(tonumber(second) or 0))
    applyClockRate()
end)

CreateThread(function()
    while true do
        applyClockRate()
        Wait(2000)
    end
end)

local appliedWeather  = nil
local weatherGen      = 0

local function applyWeather(weather, fade)
    appliedWeather = weather
    weatherGen = weatherGen + 1
    local myGen = weatherGen
    fade = fade or 0

    ClearOverrideWeather()
    ClearWeatherTypePersist()
    SetWeatherTypeOvertimePersist(weather, fade / 1000.0 + 0.0)

    local snow = (weather == 'XMAS' or weather == 'SNOW' or weather == 'BLIZZARD' or weather == 'SNOWLIGHT')
    SetForceVehicleTrails(snow)
    SetForcePedFootstepsTracks(snow)

    CreateThread(function()
        Wait(fade + 250)
        if myGen ~= weatherGen then return end
        ClearOverrideWeather()
        ClearWeatherTypePersist()
        SetWeatherTypePersist(weather)
        SetWeatherTypeNow(weather)
        SetWeatherTypeNowPersist(weather)
    end)
end

local function applyState(value, fade)
    if not value then return end
    SetArtificialLightsState(value.blackout == true)
    if value.weather and value.weather ~= appliedWeather then
        applyWeather(value.weather, fade or value.fade or Config.Weather.FadeTime)
    end
end

AddStateBagChangeHandler('weather', 'global', function(_, _, value)
    applyState(value)
end)

local function openPanel(snapshot)
    local wasOpen = panelOpen
    panelOpen = true
    SetNuiFocus(true, true)
    SendNUIMessage({ action = 'open', state = snapshot, i18n = GetUiLocale() })
    if not wasOpen then
        CreateThread(function()
            while panelOpen do
                SendNUIMessage({ action = 'tick', hour = GetClockHours(), minute = GetClockMinutes(), second = GetClockSeconds() })
                Wait(1000)
            end
        end)
    end
end

local function closePanel()
    panelOpen = false
    SetNuiFocus(false, false)
    SendNUIMessage({ action = 'close' })
end

RegisterNetEvent('l-timeweather:open', function(snapshot)
    openPanel(snapshot)
end)

RegisterNetEvent('l-timeweather:snapshot', function(snapshot)
    if panelOpen then
        SendNUIMessage({ action = 'state', state = snapshot })
    end
end)

RegisterNUICallback('action', function(data, cb)
    TriggerServerEvent('l-timeweather:action', data.action, data.payload)
    cb('ok')
end)

RegisterNUICallback('close', function(_, cb)
    closePanel()
    cb('ok')
end)

local function pullState(fade)
    TriggerServerEvent('l-timeweather:requestSync')
    applyState(GlobalState['weather'], fade or Config.Time.JoinWeatherFade)
end

AddEventHandler('playerSpawned', function()
    pullState()
end)

AddEventHandler('onClientResourceStart', function(res)
    if res == GetCurrentResourceName() then SetTimeout(1500, pullState) end
end)
