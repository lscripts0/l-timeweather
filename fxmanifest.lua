fx_version 'cerulean'
game 'gta5'
lua54 'yes'

name 'l-timeweather'
author 'lscripts'
description 'Server-time based time sync + smooth dynamic weather sync (ESX)'
version '1.3.3'

dependencies {
    'es_extended',
    'ox_lib',
}

shared_scripts {
    '@ox_lib/init.lua',
    'config.lua',
    'locales/en.lua',
    'locales/de.lua',
    'shared/locale.lua',
    'shared/functions.lua',
}

client_scripts {
    'client/client.lua',
}

server_scripts {
    'server_config.lua',
    'server/server.lua',
}

ui_page 'html/index.html'

files {
    'html/index.html',
    'html/style.css',
}
