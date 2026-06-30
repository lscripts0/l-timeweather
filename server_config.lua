ServerConfig = {}

-- ESX groups allowed to open /timeweather. Console (src 0) is always allowed.
ServerConfig.AdminGroups = {
    ['admin']      = true,
    ['superadmin'] = true,
}
