import Mods from './Mods'
import ResourcePacks from './ResourcePacks'
import Skins from './Skins'
import Players from './Players'
import Tools from './Tools'
import Admin from './Admin'
import Settings from './Settings'

const Controllers = {
    Mods: Object.assign(Mods, Mods),
    ResourcePacks: Object.assign(ResourcePacks, ResourcePacks),
    Skins: Object.assign(Skins, Skins),
    Players: Object.assign(Players, Players),
    Tools: Object.assign(Tools, Tools),
    Admin: Object.assign(Admin, Admin),
    Settings: Object.assign(Settings, Settings),
}

export default Controllers