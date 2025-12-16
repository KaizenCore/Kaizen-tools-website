export interface TeamColor {
    id: string;
    name: string;
    hex: string;
}

export interface TeamOption {
    id: string;
    name: string;
    description: string;
    type: 'boolean' | 'select';
    values?: { value: string; label: string }[];
}

export interface TeamCommand {
    id: string;
    name: string;
    description: string;
    syntax: string;
}

export const teamColors: TeamColor[] = [
    { id: 'black', name: 'Black', hex: '#000000' },
    { id: 'dark_blue', name: 'Dark Blue', hex: '#0000AA' },
    { id: 'dark_green', name: 'Dark Green', hex: '#00AA00' },
    { id: 'dark_aqua', name: 'Dark Aqua', hex: '#00AAAA' },
    { id: 'dark_red', name: 'Dark Red', hex: '#AA0000' },
    { id: 'dark_purple', name: 'Dark Purple', hex: '#AA00AA' },
    { id: 'gold', name: 'Gold', hex: '#FFAA00' },
    { id: 'gray', name: 'Gray', hex: '#AAAAAA' },
    { id: 'dark_gray', name: 'Dark Gray', hex: '#555555' },
    { id: 'blue', name: 'Blue', hex: '#5555FF' },
    { id: 'green', name: 'Green', hex: '#55FF55' },
    { id: 'aqua', name: 'Aqua', hex: '#55FFFF' },
    { id: 'red', name: 'Red', hex: '#FF5555' },
    { id: 'light_purple', name: 'Light Purple', hex: '#FF55FF' },
    { id: 'yellow', name: 'Yellow', hex: '#FFFF55' },
    { id: 'white', name: 'White', hex: '#FFFFFF' },
];

export const teamOptions: TeamOption[] = [
    {
        id: 'friendlyFire',
        name: 'Friendly Fire',
        description: 'Allow team members to damage each other',
        type: 'boolean',
    },
    {
        id: 'seeFriendlyInvisibles',
        name: 'See Friendly Invisibles',
        description: 'Team members can see invisible teammates',
        type: 'boolean',
    },
    {
        id: 'nametagVisibility',
        name: 'Nametag Visibility',
        description: 'Control when player nametags are visible',
        type: 'select',
        values: [
            { value: 'always', label: 'Always' },
            { value: 'never', label: 'Never' },
            { value: 'hideForOtherTeams', label: 'Hide for Other Teams' },
            { value: 'hideForOwnTeam', label: 'Hide for Own Team' },
        ],
    },
    {
        id: 'deathMessageVisibility',
        name: 'Death Message Visibility',
        description: 'Control who can see death messages',
        type: 'select',
        values: [
            { value: 'always', label: 'Always' },
            { value: 'never', label: 'Never' },
            { value: 'hideForOtherTeams', label: 'Hide for Other Teams' },
            { value: 'hideForOwnTeam', label: 'Hide for Own Team' },
        ],
    },
    {
        id: 'collisionRule',
        name: 'Collision Rule',
        description: 'Control entity collision behavior',
        type: 'select',
        values: [
            { value: 'always', label: 'Always' },
            { value: 'never', label: 'Never' },
            { value: 'pushOtherTeams', label: 'Push Other Teams' },
            { value: 'pushOwnTeam', label: 'Push Own Team' },
        ],
    },
];

export const formattingCodes = [
    { code: '&0', name: 'Black', color: '#000000' },
    { code: '&1', name: 'Dark Blue', color: '#0000AA' },
    { code: '&2', name: 'Dark Green', color: '#00AA00' },
    { code: '&3', name: 'Dark Aqua', color: '#00AAAA' },
    { code: '&4', name: 'Dark Red', color: '#AA0000' },
    { code: '&5', name: 'Dark Purple', color: '#AA00AA' },
    { code: '&6', name: 'Gold', color: '#FFAA00' },
    { code: '&7', name: 'Gray', color: '#AAAAAA' },
    { code: '&8', name: 'Dark Gray', color: '#555555' },
    { code: '&9', name: 'Blue', color: '#5555FF' },
    { code: '&a', name: 'Green', color: '#55FF55' },
    { code: '&b', name: 'Aqua', color: '#55FFFF' },
    { code: '&c', name: 'Red', color: '#FF5555' },
    { code: '&d', name: 'Light Purple', color: '#FF55FF' },
    { code: '&e', name: 'Yellow', color: '#FFFF55' },
    { code: '&f', name: 'White', color: '#FFFFFF' },
    { code: '&l', name: 'Bold', color: '#FFFFFF' },
    { code: '&o', name: 'Italic', color: '#FFFFFF' },
    { code: '&n', name: 'Underline', color: '#FFFFFF' },
    { code: '&m', name: 'Strikethrough', color: '#FFFFFF' },
    { code: '&k', name: 'Obfuscated', color: '#FFFFFF' },
    { code: '&r', name: 'Reset', color: '#FFFFFF' },
];

export const teamCommands: TeamCommand[] = [
    {
        id: 'add',
        name: 'Add Team',
        description: 'Create a new team',
        syntax: '/team add <team>',
    },
    {
        id: 'remove',
        name: 'Remove Team',
        description: 'Delete a team',
        syntax: '/team remove <team>',
    },
    {
        id: 'empty',
        name: 'Empty Team',
        description: 'Remove all members from a team',
        syntax: '/team empty <team>',
    },
    {
        id: 'list',
        name: 'List Teams',
        description: 'List all teams or team members',
        syntax: '/team list [<team>]',
    },
    {
        id: 'join',
        name: 'Join Team',
        description: 'Add a player to a team',
        syntax: '/team join <team> <members>',
    },
    {
        id: 'leave',
        name: 'Leave Team',
        description: 'Remove a player from their team',
        syntax: '/team leave <members>',
    },
    {
        id: 'modify',
        name: 'Modify Team',
        description: 'Modify team properties',
        syntax: '/team modify <team> <option> <value>',
    },
];

export interface TeamPreset {
    id: string;
    name: string;
    description: string;
    teams: {
        name: string;
        displayName: string;
        color: string;
        prefix?: string;
        suffix?: string;
        friendlyFire: boolean;
        seeFriendlyInvisibles: boolean;
        nametagVisibility: string;
        deathMessageVisibility: string;
        collisionRule: string;
    }[];
}

export const teamPresets: TeamPreset[] = [
    {
        id: 'red-vs-blue',
        name: 'Red Team vs Blue Team',
        description: 'Classic PvP setup with two opposing teams',
        teams: [
            {
                name: 'red',
                displayName: 'Red Team',
                color: 'red',
                prefix: '&c[RED] ',
                suffix: '',
                friendlyFire: false,
                seeFriendlyInvisibles: true,
                nametagVisibility: 'always',
                deathMessageVisibility: 'always',
                collisionRule: 'always',
            },
            {
                name: 'blue',
                displayName: 'Blue Team',
                color: 'blue',
                prefix: '&9[BLUE] ',
                suffix: '',
                friendlyFire: false,
                seeFriendlyInvisibles: true,
                nametagVisibility: 'always',
                deathMessageVisibility: 'always',
                collisionRule: 'always',
            },
        ],
    },
    {
        id: 'spectator',
        name: 'Spectator Team',
        description: 'Team for spectators with no collision',
        teams: [
            {
                name: 'spectator',
                displayName: 'Spectator',
                color: 'gray',
                prefix: '&7[SPEC] ',
                suffix: '',
                friendlyFire: false,
                seeFriendlyInvisibles: true,
                nametagVisibility: 'hideForOtherTeams',
                deathMessageVisibility: 'hideForOtherTeams',
                collisionRule: 'never',
            },
        ],
    },
    {
        id: 'pvp',
        name: 'PvP Team',
        description: 'Team with friendly fire enabled',
        teams: [
            {
                name: 'pvp',
                displayName: 'PvP',
                color: 'red',
                prefix: '',
                suffix: '',
                friendlyFire: true,
                seeFriendlyInvisibles: false,
                nametagVisibility: 'always',
                deathMessageVisibility: 'always',
                collisionRule: 'always',
            },
        ],
    },
    {
        id: 'coop',
        name: 'Coop Team',
        description: 'Cooperative team with friendly fire disabled',
        teams: [
            {
                name: 'coop',
                displayName: 'Co-op',
                color: 'green',
                prefix: '&a[TEAM] ',
                suffix: '',
                friendlyFire: false,
                seeFriendlyInvisibles: true,
                nametagVisibility: 'always',
                deathMessageVisibility: 'always',
                collisionRule: 'pushOtherTeams',
            },
        ],
    },
];
