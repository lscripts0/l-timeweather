ServerConfig = {}

-- How access to /timeweather is checked. Console (src 0) is always allowed.
--   "ace"        = players need the ACE permission below.
--   "identifier" = players listed in AllowedIdentifiers below are allowed.
ServerConfig.PermissionMode = "ace"

-- Mode "ace": ACE permission required to open the panel.
-- Grant it in your server.cfg, e.g.:
--   add_ace group.admin "l-timeweather.admin" allow
-- or for a single player:
--   add_ace identifier.license:xxxxxxxx "l-timeweather.admin" allow
ServerConfig.AcePermission = "l-timeweather.admin"

-- Mode "identifier": these players are allowed. Any FiveM identifier type works,
-- e.g. "discord:123456789012345678", "fivem:1234567", "license:xxxxxxxx".
ServerConfig.AllowedIdentifiers = {
    -- "discord:123456789012345678",
    -- "fivem:1234567",
}
