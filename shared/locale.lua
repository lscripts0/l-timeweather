function L(key, ...)
    local tbl = (Locales and Locales[Config.Locale]) or {}
    local str = tbl[key]
    if str == nil and Locales then
        str = (Locales['en'] or {})[key]
    end
    if str == nil then
        return key
    end
    if select('#', ...) > 0 then
        local ok, formatted = pcall(string.format, str, ...)
        return ok and formatted or str
    end
    return str
end

function GetUiLocale()
    local out = {}
    local en = (Locales and Locales['en']) or {}
    local cur = (Locales and Locales[Config.Locale]) or {}
    for k, v in pairs(en) do
        if k:sub(1, 3) == 'ui_' then out[k] = v end
    end
    for k, v in pairs(cur) do
        if k:sub(1, 3) == 'ui_' then out[k] = v end
    end
    return out
end
