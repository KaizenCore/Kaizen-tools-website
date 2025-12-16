export interface ExecuteSubcommand {
    id: string;
    category: 'position' | 'context' | 'condition' | 'store';
    label: string;
    syntax: string;
    description: string;
}

export const executeSubcommands: ExecuteSubcommand[] = [
    // Position & Rotation
    {
        id: 'as',
        category: 'position',
        label: 'as (Change executor)',
        syntax: 'as <targets>',
        description: 'Change the executor of the command',
    },
    {
        id: 'at',
        category: 'position',
        label: 'at (Change position to target)',
        syntax: 'at <targets>',
        description: 'Change position, rotation, and dimension to match target',
    },
    {
        id: 'positioned',
        category: 'position',
        label: 'positioned (Set position)',
        syntax: 'positioned <pos>',
        description: 'Change the execution position',
    },
    {
        id: 'positioned_as',
        category: 'position',
        label: 'positioned as (Position as entity)',
        syntax: 'positioned as <targets>',
        description: 'Change position to match entity',
    },
    {
        id: 'positioned_over',
        category: 'position',
        label: 'positioned over (Position over heightmap)',
        syntax: 'positioned over <heightmap>',
        description: 'Change position to be over a heightmap',
    },
    {
        id: 'rotated',
        category: 'position',
        label: 'rotated (Set rotation)',
        syntax: 'rotated <rot>',
        description: 'Change the execution rotation',
    },
    {
        id: 'rotated_as',
        category: 'position',
        label: 'rotated as (Rotation as entity)',
        syntax: 'rotated as <targets>',
        description: 'Change rotation to match entity',
    },
    {
        id: 'facing',
        category: 'position',
        label: 'facing (Face position)',
        syntax: 'facing <pos>',
        description: 'Rotate to face a position',
    },
    {
        id: 'facing_entity',
        category: 'position',
        label: 'facing entity (Face entity)',
        syntax: 'facing entity <targets> <anchor>',
        description: 'Rotate to face an entity',
    },
    {
        id: 'align',
        category: 'position',
        label: 'align (Align to block grid)',
        syntax: 'align <axes>',
        description: 'Align position to block grid',
    },
    {
        id: 'anchored',
        category: 'position',
        label: 'anchored (Change anchor)',
        syntax: 'anchored <anchor>',
        description: 'Change execution anchor point',
    },

    // Context
    {
        id: 'in',
        category: 'context',
        label: 'in (Change dimension)',
        syntax: 'in <dimension>',
        description: 'Change the execution dimension',
    },
    {
        id: 'summon',
        category: 'context',
        label: 'summon (Summon and execute)',
        syntax: 'summon <entity>',
        description: 'Summon entity and execute as it',
    },
    {
        id: 'on',
        category: 'context',
        label: 'on (Execute on relation)',
        syntax: 'on <relation>',
        description: 'Execute on related entities',
    },

    // Conditions
    {
        id: 'if_block',
        category: 'condition',
        label: 'if block (Test block)',
        syntax: 'if block <pos> <block>',
        description: 'Test if a block matches',
    },
    {
        id: 'unless_block',
        category: 'condition',
        label: 'unless block (Test block negative)',
        syntax: 'unless block <pos> <block>',
        description: 'Test if a block does not match',
    },
    {
        id: 'if_blocks',
        category: 'condition',
        label: 'if blocks (Compare blocks)',
        syntax: 'if blocks <start> <end> <destination> <scan_mode>',
        description: 'Test if blocks match in region',
    },
    {
        id: 'unless_blocks',
        category: 'condition',
        label: 'unless blocks (Compare blocks negative)',
        syntax: 'unless blocks <start> <end> <destination> <scan_mode>',
        description: 'Test if blocks do not match in region',
    },
    {
        id: 'if_entity',
        category: 'condition',
        label: 'if entity (Test entity exists)',
        syntax: 'if entity <targets>',
        description: 'Test if entity exists',
    },
    {
        id: 'unless_entity',
        category: 'condition',
        label: 'unless entity (Test entity negative)',
        syntax: 'unless entity <targets>',
        description: 'Test if entity does not exist',
    },
    {
        id: 'if_predicate',
        category: 'condition',
        label: 'if predicate (Test predicate)',
        syntax: 'if predicate <predicate>',
        description: 'Test if predicate is true',
    },
    {
        id: 'unless_predicate',
        category: 'condition',
        label: 'unless predicate (Test predicate negative)',
        syntax: 'unless predicate <predicate>',
        description: 'Test if predicate is false',
    },
    {
        id: 'if_score',
        category: 'condition',
        label: 'if score (Compare scores)',
        syntax: 'if score <target> <objective> <comparison> <source> <objective>',
        description: 'Compare scoreboard values',
    },
    {
        id: 'unless_score',
        category: 'condition',
        label: 'unless score (Compare scores negative)',
        syntax: 'unless score <target> <objective> <comparison> <source> <objective>',
        description: 'Compare scoreboard values (negative)',
    },
    {
        id: 'if_biome',
        category: 'condition',
        label: 'if biome (Test biome)',
        syntax: 'if biome <pos> <biome>',
        description: 'Test if position is in biome',
    },
    {
        id: 'unless_biome',
        category: 'condition',
        label: 'unless biome (Test biome negative)',
        syntax: 'unless biome <pos> <biome>',
        description: 'Test if position is not in biome',
    },
    {
        id: 'if_dimension',
        category: 'condition',
        label: 'if dimension (Test dimension)',
        syntax: 'if dimension <dimension>',
        description: 'Test if in dimension',
    },
    {
        id: 'unless_dimension',
        category: 'condition',
        label: 'unless dimension (Test dimension negative)',
        syntax: 'unless dimension <dimension>',
        description: 'Test if not in dimension',
    },
    {
        id: 'if_loaded',
        category: 'condition',
        label: 'if loaded (Test chunk loaded)',
        syntax: 'if loaded <pos>',
        description: 'Test if chunk is loaded',
    },
    {
        id: 'unless_loaded',
        category: 'condition',
        label: 'unless loaded (Test chunk negative)',
        syntax: 'unless loaded <pos>',
        description: 'Test if chunk is not loaded',
    },

    // Store
    {
        id: 'store_result_score',
        category: 'store',
        label: 'store result score',
        syntax: 'store result score <targets> <objective>',
        description: 'Store command result in scoreboard',
    },
    {
        id: 'store_success_score',
        category: 'store',
        label: 'store success score',
        syntax: 'store success score <targets> <objective>',
        description: 'Store command success in scoreboard',
    },
    {
        id: 'store_result_block',
        category: 'store',
        label: 'store result block',
        syntax: 'store result block <pos> <path> <type> <scale>',
        description: 'Store result in block NBT',
    },
    {
        id: 'store_success_block',
        category: 'store',
        label: 'store success block',
        syntax: 'store success block <pos> <path> <type> <scale>',
        description: 'Store success in block NBT',
    },
    {
        id: 'store_result_bossbar',
        category: 'store',
        label: 'store result bossbar',
        syntax: 'store result bossbar <id> <value/max>',
        description: 'Store result in bossbar',
    },
    {
        id: 'store_success_bossbar',
        category: 'store',
        label: 'store success bossbar',
        syntax: 'store success bossbar <id> <value/max>',
        description: 'Store success in bossbar',
    },
    {
        id: 'store_result_entity',
        category: 'store',
        label: 'store result entity',
        syntax: 'store result entity <target> <path> <type> <scale>',
        description: 'Store result in entity NBT',
    },
    {
        id: 'store_success_entity',
        category: 'store',
        label: 'store success entity',
        syntax: 'store success entity <target> <path> <type> <scale>',
        description: 'Store success in entity NBT',
    },
    {
        id: 'store_result_storage',
        category: 'store',
        label: 'store result storage',
        syntax: 'store result storage <target> <path> <type> <scale>',
        description: 'Store result in data storage',
    },
    {
        id: 'store_success_storage',
        category: 'store',
        label: 'store success storage',
        syntax: 'store success storage <target> <path> <type> <scale>',
        description: 'Store success in data storage',
    },
];

export const dimensions = [
    'minecraft:overworld',
    'minecraft:the_nether',
    'minecraft:the_end',
];

export const heightmaps = [
    'world_surface',
    'motion_blocking',
    'motion_blocking_no_leaves',
    'ocean_floor',
];

export const entityAnchors = ['eyes', 'feet'];

export const axes = ['x', 'y', 'z', 'xy', 'xz', 'yz', 'xyz'];

export const entityRelations = [
    'attacker',
    'controller',
    'leasher',
    'origin',
    'owner',
    'passengers',
    'target',
    'vehicle',
];

export const scoreComparisons = [
    { value: '<', label: '< (less than)' },
    { value: '<=', label: '<= (less than or equal)' },
    { value: '=', label: '= (equal)' },
    { value: '>=', label: '>= (greater than or equal)' },
    { value: '>', label: '> (greater than)' },
    { value: 'matches', label: 'matches (range)' },
];

export const scanModes = ['all', 'masked'];

export const nbtDataTypes = ['byte', 'short', 'int', 'long', 'float', 'double'];

export const bossbarProperties = ['value', 'max'];

export interface CommandPreset {
    name: string;
    description: string;
    chain: Array<{
        subcommandId: string;
        config: Record<string, string>;
    }>;
    runCommand: string;
}

export const commandPresets: CommandPreset[] = [
    {
        name: 'Kill nearest enemy',
        description: 'Kill the nearest zombie within 5 blocks',
        chain: [
            { subcommandId: 'as', config: { targets: '@p' } },
            { subcommandId: 'at', config: { targets: '@s' } },
            {
                subcommandId: 'if_entity',
                config: { targets: '@e[type=zombie,distance=..5]' },
            },
        ],
        runCommand: 'kill @e[type=zombie,sort=nearest,limit=1]',
    },
    {
        name: 'Teleport all players to executor',
        description: 'Teleport all players to the executor position',
        chain: [{ subcommandId: 'as', config: { targets: '@a' } }],
        runCommand: 'tp @s ~ ~ ~',
    },
    {
        name: 'Give item if score matches',
        description: 'Give diamond if score is 10 or higher',
        chain: [
            { subcommandId: 'as', config: { targets: '@a' } },
            {
                subcommandId: 'if_score',
                config: {
                    target: '@s',
                    objective: 'points',
                    comparison: '>=',
                    sourceScore: '10',
                },
            },
        ],
        runCommand: 'give @s minecraft:diamond 1',
    },
    {
        name: 'Store command result in scoreboard',
        description: 'Count entities and store in scoreboard',
        chain: [
            {
                subcommandId: 'store_result_score',
                config: { targets: '@a', objective: 'entity_count' },
            },
        ],
        runCommand: 'execute if entity @e[type=zombie]',
    },
    {
        name: 'Execute in Nether at same coords',
        description: 'Run command in the Nether at current position',
        chain: [
            { subcommandId: 'in', config: { dimension: 'minecraft:the_nether' } },
            { subcommandId: 'positioned', config: { x: '~', y: '~', z: '~' } },
        ],
        runCommand: 'setblock ~ ~ ~ minecraft:netherrack',
    },
];
