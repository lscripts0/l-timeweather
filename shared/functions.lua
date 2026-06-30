Func = {}

if IsDuplicityVersion() then
    function Func.Notify(src, message, msgType)
        TriggerClientEvent('l-timeweather:notify', src, message, msgType)
    end

    function Func.Feedback(src, message, msgType)
        if src == 0 then
            print(('[l-timeweather] %s'):format(message))
        else
            Func.Notify(src, message, msgType)
        end
    end
else
    function Func.Notify(message, msgType)
        lib.notify({
            id          = 'l-timeweather',
            title       = L('notify_title'),
            description = message,
            type        = msgType or 'inform',
            position    = 'top-right',
            duration    = 5000,
        })
    end

    RegisterNetEvent('l-timeweather:notify', function(message, msgType)
        Func.Notify(message, msgType)
    end)

    local shownText

    function Func.ShowText(text)
        if shownText == text then return end
        shownText = text
        lib.showTextUI(text, { position = 'left-center' })
    end

    function Func.HideText()
        if not shownText then return end
        shownText = nil
        lib.hideTextUI()
    end
end
