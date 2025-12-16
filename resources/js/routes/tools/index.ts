import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../wayfinder'
import serverStatus from './server-status'
import uuidConverter from './uuid-converter'
/**
* @see routes/web.php:66
* @route '/tools/nether-calculator'
*/
export const netherCalculator = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: netherCalculator.url(options),
    method: 'get',
})

netherCalculator.definition = {
    methods: ["get","head"],
    url: '/tools/nether-calculator',
} satisfies RouteDefinition<["get","head"]>

/**
* @see routes/web.php:66
* @route '/tools/nether-calculator'
*/
netherCalculator.url = (options?: RouteQueryOptions) => {
    return netherCalculator.definition.url + queryParams(options)
}

/**
* @see routes/web.php:66
* @route '/tools/nether-calculator'
*/
netherCalculator.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: netherCalculator.url(options),
    method: 'get',
})

/**
* @see routes/web.php:66
* @route '/tools/nether-calculator'
*/
netherCalculator.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: netherCalculator.url(options),
    method: 'head',
})

/**
* @see routes/web.php:66
* @route '/tools/nether-calculator'
*/
const netherCalculatorForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: netherCalculator.url(options),
    method: 'get',
})

/**
* @see routes/web.php:66
* @route '/tools/nether-calculator'
*/
netherCalculatorForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: netherCalculator.url(options),
    method: 'get',
})

/**
* @see routes/web.php:66
* @route '/tools/nether-calculator'
*/
netherCalculatorForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: netherCalculator.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

netherCalculator.form = netherCalculatorForm

/**
* @see routes/web.php:70
* @route '/tools/banner-creator'
*/
export const bannerCreator = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: bannerCreator.url(options),
    method: 'get',
})

bannerCreator.definition = {
    methods: ["get","head"],
    url: '/tools/banner-creator',
} satisfies RouteDefinition<["get","head"]>

/**
* @see routes/web.php:70
* @route '/tools/banner-creator'
*/
bannerCreator.url = (options?: RouteQueryOptions) => {
    return bannerCreator.definition.url + queryParams(options)
}

/**
* @see routes/web.php:70
* @route '/tools/banner-creator'
*/
bannerCreator.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: bannerCreator.url(options),
    method: 'get',
})

/**
* @see routes/web.php:70
* @route '/tools/banner-creator'
*/
bannerCreator.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: bannerCreator.url(options),
    method: 'head',
})

/**
* @see routes/web.php:70
* @route '/tools/banner-creator'
*/
const bannerCreatorForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: bannerCreator.url(options),
    method: 'get',
})

/**
* @see routes/web.php:70
* @route '/tools/banner-creator'
*/
bannerCreatorForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: bannerCreator.url(options),
    method: 'get',
})

/**
* @see routes/web.php:70
* @route '/tools/banner-creator'
*/
bannerCreatorForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: bannerCreator.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

bannerCreator.form = bannerCreatorForm

/**
* @see routes/web.php:73
* @route '/tools/crafting-recipes'
*/
export const craftingRecipes = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: craftingRecipes.url(options),
    method: 'get',
})

craftingRecipes.definition = {
    methods: ["get","head"],
    url: '/tools/crafting-recipes',
} satisfies RouteDefinition<["get","head"]>

/**
* @see routes/web.php:73
* @route '/tools/crafting-recipes'
*/
craftingRecipes.url = (options?: RouteQueryOptions) => {
    return craftingRecipes.definition.url + queryParams(options)
}

/**
* @see routes/web.php:73
* @route '/tools/crafting-recipes'
*/
craftingRecipes.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: craftingRecipes.url(options),
    method: 'get',
})

/**
* @see routes/web.php:73
* @route '/tools/crafting-recipes'
*/
craftingRecipes.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: craftingRecipes.url(options),
    method: 'head',
})

/**
* @see routes/web.php:73
* @route '/tools/crafting-recipes'
*/
const craftingRecipesForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: craftingRecipes.url(options),
    method: 'get',
})

/**
* @see routes/web.php:73
* @route '/tools/crafting-recipes'
*/
craftingRecipesForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: craftingRecipes.url(options),
    method: 'get',
})

/**
* @see routes/web.php:73
* @route '/tools/crafting-recipes'
*/
craftingRecipesForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: craftingRecipes.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

craftingRecipes.form = craftingRecipesForm

/**
* @see routes/web.php:76
* @route '/tools/enchantment-calculator'
*/
export const enchantmentCalculator = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: enchantmentCalculator.url(options),
    method: 'get',
})

enchantmentCalculator.definition = {
    methods: ["get","head"],
    url: '/tools/enchantment-calculator',
} satisfies RouteDefinition<["get","head"]>

/**
* @see routes/web.php:76
* @route '/tools/enchantment-calculator'
*/
enchantmentCalculator.url = (options?: RouteQueryOptions) => {
    return enchantmentCalculator.definition.url + queryParams(options)
}

/**
* @see routes/web.php:76
* @route '/tools/enchantment-calculator'
*/
enchantmentCalculator.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: enchantmentCalculator.url(options),
    method: 'get',
})

/**
* @see routes/web.php:76
* @route '/tools/enchantment-calculator'
*/
enchantmentCalculator.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: enchantmentCalculator.url(options),
    method: 'head',
})

/**
* @see routes/web.php:76
* @route '/tools/enchantment-calculator'
*/
const enchantmentCalculatorForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: enchantmentCalculator.url(options),
    method: 'get',
})

/**
* @see routes/web.php:76
* @route '/tools/enchantment-calculator'
*/
enchantmentCalculatorForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: enchantmentCalculator.url(options),
    method: 'get',
})

/**
* @see routes/web.php:76
* @route '/tools/enchantment-calculator'
*/
enchantmentCalculatorForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: enchantmentCalculator.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

enchantmentCalculator.form = enchantmentCalculatorForm

/**
* @see routes/web.php:79
* @route '/tools/firework-designer'
*/
export const fireworkDesigner = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: fireworkDesigner.url(options),
    method: 'get',
})

fireworkDesigner.definition = {
    methods: ["get","head"],
    url: '/tools/firework-designer',
} satisfies RouteDefinition<["get","head"]>

/**
* @see routes/web.php:79
* @route '/tools/firework-designer'
*/
fireworkDesigner.url = (options?: RouteQueryOptions) => {
    return fireworkDesigner.definition.url + queryParams(options)
}

/**
* @see routes/web.php:79
* @route '/tools/firework-designer'
*/
fireworkDesigner.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: fireworkDesigner.url(options),
    method: 'get',
})

/**
* @see routes/web.php:79
* @route '/tools/firework-designer'
*/
fireworkDesigner.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: fireworkDesigner.url(options),
    method: 'head',
})

/**
* @see routes/web.php:79
* @route '/tools/firework-designer'
*/
const fireworkDesignerForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: fireworkDesigner.url(options),
    method: 'get',
})

/**
* @see routes/web.php:79
* @route '/tools/firework-designer'
*/
fireworkDesignerForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: fireworkDesigner.url(options),
    method: 'get',
})

/**
* @see routes/web.php:79
* @route '/tools/firework-designer'
*/
fireworkDesignerForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: fireworkDesigner.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

fireworkDesigner.form = fireworkDesignerForm

/**
* @see routes/web.php:82
* @route '/tools/color-codes'
*/
export const colorCodes = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: colorCodes.url(options),
    method: 'get',
})

colorCodes.definition = {
    methods: ["get","head"],
    url: '/tools/color-codes',
} satisfies RouteDefinition<["get","head"]>

/**
* @see routes/web.php:82
* @route '/tools/color-codes'
*/
colorCodes.url = (options?: RouteQueryOptions) => {
    return colorCodes.definition.url + queryParams(options)
}

/**
* @see routes/web.php:82
* @route '/tools/color-codes'
*/
colorCodes.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: colorCodes.url(options),
    method: 'get',
})

/**
* @see routes/web.php:82
* @route '/tools/color-codes'
*/
colorCodes.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: colorCodes.url(options),
    method: 'head',
})

/**
* @see routes/web.php:82
* @route '/tools/color-codes'
*/
const colorCodesForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: colorCodes.url(options),
    method: 'get',
})

/**
* @see routes/web.php:82
* @route '/tools/color-codes'
*/
colorCodesForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: colorCodes.url(options),
    method: 'get',
})

/**
* @see routes/web.php:82
* @route '/tools/color-codes'
*/
colorCodesForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: colorCodes.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

colorCodes.form = colorCodesForm

/**
* @see routes/web.php:85
* @route '/tools/xp-calculator'
*/
export const xpCalculator = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: xpCalculator.url(options),
    method: 'get',
})

xpCalculator.definition = {
    methods: ["get","head"],
    url: '/tools/xp-calculator',
} satisfies RouteDefinition<["get","head"]>

/**
* @see routes/web.php:85
* @route '/tools/xp-calculator'
*/
xpCalculator.url = (options?: RouteQueryOptions) => {
    return xpCalculator.definition.url + queryParams(options)
}

/**
* @see routes/web.php:85
* @route '/tools/xp-calculator'
*/
xpCalculator.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: xpCalculator.url(options),
    method: 'get',
})

/**
* @see routes/web.php:85
* @route '/tools/xp-calculator'
*/
xpCalculator.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: xpCalculator.url(options),
    method: 'head',
})

/**
* @see routes/web.php:85
* @route '/tools/xp-calculator'
*/
const xpCalculatorForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: xpCalculator.url(options),
    method: 'get',
})

/**
* @see routes/web.php:85
* @route '/tools/xp-calculator'
*/
xpCalculatorForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: xpCalculator.url(options),
    method: 'get',
})

/**
* @see routes/web.php:85
* @route '/tools/xp-calculator'
*/
xpCalculatorForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: xpCalculator.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

xpCalculator.form = xpCalculatorForm

/**
* @see routes/web.php:88
* @route '/tools/skin-viewer'
*/
export const skinViewer = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: skinViewer.url(options),
    method: 'get',
})

skinViewer.definition = {
    methods: ["get","head"],
    url: '/tools/skin-viewer',
} satisfies RouteDefinition<["get","head"]>

/**
* @see routes/web.php:88
* @route '/tools/skin-viewer'
*/
skinViewer.url = (options?: RouteQueryOptions) => {
    return skinViewer.definition.url + queryParams(options)
}

/**
* @see routes/web.php:88
* @route '/tools/skin-viewer'
*/
skinViewer.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: skinViewer.url(options),
    method: 'get',
})

/**
* @see routes/web.php:88
* @route '/tools/skin-viewer'
*/
skinViewer.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: skinViewer.url(options),
    method: 'head',
})

/**
* @see routes/web.php:88
* @route '/tools/skin-viewer'
*/
const skinViewerForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: skinViewer.url(options),
    method: 'get',
})

/**
* @see routes/web.php:88
* @route '/tools/skin-viewer'
*/
skinViewerForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: skinViewer.url(options),
    method: 'get',
})

/**
* @see routes/web.php:88
* @route '/tools/skin-viewer'
*/
skinViewerForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: skinViewer.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

skinViewer.form = skinViewerForm

/**
* @see routes/web.php:91
* @route '/tools/redstone-calculator'
*/
export const redstoneCalculator = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: redstoneCalculator.url(options),
    method: 'get',
})

redstoneCalculator.definition = {
    methods: ["get","head"],
    url: '/tools/redstone-calculator',
} satisfies RouteDefinition<["get","head"]>

/**
* @see routes/web.php:91
* @route '/tools/redstone-calculator'
*/
redstoneCalculator.url = (options?: RouteQueryOptions) => {
    return redstoneCalculator.definition.url + queryParams(options)
}

/**
* @see routes/web.php:91
* @route '/tools/redstone-calculator'
*/
redstoneCalculator.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: redstoneCalculator.url(options),
    method: 'get',
})

/**
* @see routes/web.php:91
* @route '/tools/redstone-calculator'
*/
redstoneCalculator.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: redstoneCalculator.url(options),
    method: 'head',
})

/**
* @see routes/web.php:91
* @route '/tools/redstone-calculator'
*/
const redstoneCalculatorForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: redstoneCalculator.url(options),
    method: 'get',
})

/**
* @see routes/web.php:91
* @route '/tools/redstone-calculator'
*/
redstoneCalculatorForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: redstoneCalculator.url(options),
    method: 'get',
})

/**
* @see routes/web.php:91
* @route '/tools/redstone-calculator'
*/
redstoneCalculatorForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: redstoneCalculator.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

redstoneCalculator.form = redstoneCalculatorForm

/**
* @see routes/web.php:94
* @route '/tools/flat-world-generator'
*/
export const flatWorldGenerator = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: flatWorldGenerator.url(options),
    method: 'get',
})

flatWorldGenerator.definition = {
    methods: ["get","head"],
    url: '/tools/flat-world-generator',
} satisfies RouteDefinition<["get","head"]>

/**
* @see routes/web.php:94
* @route '/tools/flat-world-generator'
*/
flatWorldGenerator.url = (options?: RouteQueryOptions) => {
    return flatWorldGenerator.definition.url + queryParams(options)
}

/**
* @see routes/web.php:94
* @route '/tools/flat-world-generator'
*/
flatWorldGenerator.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: flatWorldGenerator.url(options),
    method: 'get',
})

/**
* @see routes/web.php:94
* @route '/tools/flat-world-generator'
*/
flatWorldGenerator.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: flatWorldGenerator.url(options),
    method: 'head',
})

/**
* @see routes/web.php:94
* @route '/tools/flat-world-generator'
*/
const flatWorldGeneratorForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: flatWorldGenerator.url(options),
    method: 'get',
})

/**
* @see routes/web.php:94
* @route '/tools/flat-world-generator'
*/
flatWorldGeneratorForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: flatWorldGenerator.url(options),
    method: 'get',
})

/**
* @see routes/web.php:94
* @route '/tools/flat-world-generator'
*/
flatWorldGeneratorForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: flatWorldGenerator.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

flatWorldGenerator.form = flatWorldGeneratorForm

/**
* @see routes/web.php:97
* @route '/tools/mob-spawning'
*/
export const mobSpawning = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: mobSpawning.url(options),
    method: 'get',
})

mobSpawning.definition = {
    methods: ["get","head"],
    url: '/tools/mob-spawning',
} satisfies RouteDefinition<["get","head"]>

/**
* @see routes/web.php:97
* @route '/tools/mob-spawning'
*/
mobSpawning.url = (options?: RouteQueryOptions) => {
    return mobSpawning.definition.url + queryParams(options)
}

/**
* @see routes/web.php:97
* @route '/tools/mob-spawning'
*/
mobSpawning.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: mobSpawning.url(options),
    method: 'get',
})

/**
* @see routes/web.php:97
* @route '/tools/mob-spawning'
*/
mobSpawning.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: mobSpawning.url(options),
    method: 'head',
})

/**
* @see routes/web.php:97
* @route '/tools/mob-spawning'
*/
const mobSpawningForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: mobSpawning.url(options),
    method: 'get',
})

/**
* @see routes/web.php:97
* @route '/tools/mob-spawning'
*/
mobSpawningForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: mobSpawning.url(options),
    method: 'get',
})

/**
* @see routes/web.php:97
* @route '/tools/mob-spawning'
*/
mobSpawningForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: mobSpawning.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

mobSpawning.form = mobSpawningForm

/**
* @see routes/web.php:100
* @route '/tools/command-generator'
*/
export const commandGenerator = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: commandGenerator.url(options),
    method: 'get',
})

commandGenerator.definition = {
    methods: ["get","head"],
    url: '/tools/command-generator',
} satisfies RouteDefinition<["get","head"]>

/**
* @see routes/web.php:100
* @route '/tools/command-generator'
*/
commandGenerator.url = (options?: RouteQueryOptions) => {
    return commandGenerator.definition.url + queryParams(options)
}

/**
* @see routes/web.php:100
* @route '/tools/command-generator'
*/
commandGenerator.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: commandGenerator.url(options),
    method: 'get',
})

/**
* @see routes/web.php:100
* @route '/tools/command-generator'
*/
commandGenerator.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: commandGenerator.url(options),
    method: 'head',
})

/**
* @see routes/web.php:100
* @route '/tools/command-generator'
*/
const commandGeneratorForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: commandGenerator.url(options),
    method: 'get',
})

/**
* @see routes/web.php:100
* @route '/tools/command-generator'
*/
commandGeneratorForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: commandGenerator.url(options),
    method: 'get',
})

/**
* @see routes/web.php:100
* @route '/tools/command-generator'
*/
commandGeneratorForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: commandGenerator.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

commandGenerator.form = commandGeneratorForm

/**
* @see routes/web.php:103
* @route '/tools/entity-generator'
*/
export const entityGenerator = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: entityGenerator.url(options),
    method: 'get',
})

entityGenerator.definition = {
    methods: ["get","head"],
    url: '/tools/entity-generator',
} satisfies RouteDefinition<["get","head"]>

/**
* @see routes/web.php:103
* @route '/tools/entity-generator'
*/
entityGenerator.url = (options?: RouteQueryOptions) => {
    return entityGenerator.definition.url + queryParams(options)
}

/**
* @see routes/web.php:103
* @route '/tools/entity-generator'
*/
entityGenerator.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: entityGenerator.url(options),
    method: 'get',
})

/**
* @see routes/web.php:103
* @route '/tools/entity-generator'
*/
entityGenerator.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: entityGenerator.url(options),
    method: 'head',
})

/**
* @see routes/web.php:103
* @route '/tools/entity-generator'
*/
const entityGeneratorForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: entityGenerator.url(options),
    method: 'get',
})

/**
* @see routes/web.php:103
* @route '/tools/entity-generator'
*/
entityGeneratorForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: entityGenerator.url(options),
    method: 'get',
})

/**
* @see routes/web.php:103
* @route '/tools/entity-generator'
*/
entityGeneratorForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: entityGenerator.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

entityGenerator.form = entityGeneratorForm

/**
* @see routes/web.php:106
* @route '/tools/advancement-generator'
*/
export const advancementGenerator = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: advancementGenerator.url(options),
    method: 'get',
})

advancementGenerator.definition = {
    methods: ["get","head"],
    url: '/tools/advancement-generator',
} satisfies RouteDefinition<["get","head"]>

/**
* @see routes/web.php:106
* @route '/tools/advancement-generator'
*/
advancementGenerator.url = (options?: RouteQueryOptions) => {
    return advancementGenerator.definition.url + queryParams(options)
}

/**
* @see routes/web.php:106
* @route '/tools/advancement-generator'
*/
advancementGenerator.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: advancementGenerator.url(options),
    method: 'get',
})

/**
* @see routes/web.php:106
* @route '/tools/advancement-generator'
*/
advancementGenerator.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: advancementGenerator.url(options),
    method: 'head',
})

/**
* @see routes/web.php:106
* @route '/tools/advancement-generator'
*/
const advancementGeneratorForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: advancementGenerator.url(options),
    method: 'get',
})

/**
* @see routes/web.php:106
* @route '/tools/advancement-generator'
*/
advancementGeneratorForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: advancementGenerator.url(options),
    method: 'get',
})

/**
* @see routes/web.php:106
* @route '/tools/advancement-generator'
*/
advancementGeneratorForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: advancementGenerator.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

advancementGenerator.form = advancementGeneratorForm

/**
* @see routes/web.php:109
* @route '/tools/armor-stand-editor'
*/
export const armorStandEditor = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: armorStandEditor.url(options),
    method: 'get',
})

armorStandEditor.definition = {
    methods: ["get","head"],
    url: '/tools/armor-stand-editor',
} satisfies RouteDefinition<["get","head"]>

/**
* @see routes/web.php:109
* @route '/tools/armor-stand-editor'
*/
armorStandEditor.url = (options?: RouteQueryOptions) => {
    return armorStandEditor.definition.url + queryParams(options)
}

/**
* @see routes/web.php:109
* @route '/tools/armor-stand-editor'
*/
armorStandEditor.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: armorStandEditor.url(options),
    method: 'get',
})

/**
* @see routes/web.php:109
* @route '/tools/armor-stand-editor'
*/
armorStandEditor.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: armorStandEditor.url(options),
    method: 'head',
})

/**
* @see routes/web.php:109
* @route '/tools/armor-stand-editor'
*/
const armorStandEditorForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: armorStandEditor.url(options),
    method: 'get',
})

/**
* @see routes/web.php:109
* @route '/tools/armor-stand-editor'
*/
armorStandEditorForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: armorStandEditor.url(options),
    method: 'get',
})

/**
* @see routes/web.php:109
* @route '/tools/armor-stand-editor'
*/
armorStandEditorForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: armorStandEditor.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

armorStandEditor.form = armorStandEditorForm

/**
* @see routes/web.php:112
* @route '/tools/potion-brewing'
*/
export const potionBrewing = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: potionBrewing.url(options),
    method: 'get',
})

potionBrewing.definition = {
    methods: ["get","head"],
    url: '/tools/potion-brewing',
} satisfies RouteDefinition<["get","head"]>

/**
* @see routes/web.php:112
* @route '/tools/potion-brewing'
*/
potionBrewing.url = (options?: RouteQueryOptions) => {
    return potionBrewing.definition.url + queryParams(options)
}

/**
* @see routes/web.php:112
* @route '/tools/potion-brewing'
*/
potionBrewing.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: potionBrewing.url(options),
    method: 'get',
})

/**
* @see routes/web.php:112
* @route '/tools/potion-brewing'
*/
potionBrewing.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: potionBrewing.url(options),
    method: 'head',
})

/**
* @see routes/web.php:112
* @route '/tools/potion-brewing'
*/
const potionBrewingForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: potionBrewing.url(options),
    method: 'get',
})

/**
* @see routes/web.php:112
* @route '/tools/potion-brewing'
*/
potionBrewingForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: potionBrewing.url(options),
    method: 'get',
})

/**
* @see routes/web.php:112
* @route '/tools/potion-brewing'
*/
potionBrewingForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: potionBrewing.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

potionBrewing.form = potionBrewingForm

/**
* @see routes/web.php:115
* @route '/tools/loot-table-generator'
*/
export const lootTableGenerator = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: lootTableGenerator.url(options),
    method: 'get',
})

lootTableGenerator.definition = {
    methods: ["get","head"],
    url: '/tools/loot-table-generator',
} satisfies RouteDefinition<["get","head"]>

/**
* @see routes/web.php:115
* @route '/tools/loot-table-generator'
*/
lootTableGenerator.url = (options?: RouteQueryOptions) => {
    return lootTableGenerator.definition.url + queryParams(options)
}

/**
* @see routes/web.php:115
* @route '/tools/loot-table-generator'
*/
lootTableGenerator.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: lootTableGenerator.url(options),
    method: 'get',
})

/**
* @see routes/web.php:115
* @route '/tools/loot-table-generator'
*/
lootTableGenerator.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: lootTableGenerator.url(options),
    method: 'head',
})

/**
* @see routes/web.php:115
* @route '/tools/loot-table-generator'
*/
const lootTableGeneratorForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: lootTableGenerator.url(options),
    method: 'get',
})

/**
* @see routes/web.php:115
* @route '/tools/loot-table-generator'
*/
lootTableGeneratorForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: lootTableGenerator.url(options),
    method: 'get',
})

/**
* @see routes/web.php:115
* @route '/tools/loot-table-generator'
*/
lootTableGeneratorForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: lootTableGenerator.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

lootTableGenerator.form = lootTableGeneratorForm

/**
* @see routes/web.php:118
* @route '/tools/villager-trading'
*/
export const villagerTrading = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: villagerTrading.url(options),
    method: 'get',
})

villagerTrading.definition = {
    methods: ["get","head"],
    url: '/tools/villager-trading',
} satisfies RouteDefinition<["get","head"]>

/**
* @see routes/web.php:118
* @route '/tools/villager-trading'
*/
villagerTrading.url = (options?: RouteQueryOptions) => {
    return villagerTrading.definition.url + queryParams(options)
}

/**
* @see routes/web.php:118
* @route '/tools/villager-trading'
*/
villagerTrading.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: villagerTrading.url(options),
    method: 'get',
})

/**
* @see routes/web.php:118
* @route '/tools/villager-trading'
*/
villagerTrading.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: villagerTrading.url(options),
    method: 'head',
})

/**
* @see routes/web.php:118
* @route '/tools/villager-trading'
*/
const villagerTradingForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: villagerTrading.url(options),
    method: 'get',
})

/**
* @see routes/web.php:118
* @route '/tools/villager-trading'
*/
villagerTradingForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: villagerTrading.url(options),
    method: 'get',
})

/**
* @see routes/web.php:118
* @route '/tools/villager-trading'
*/
villagerTradingForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: villagerTrading.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

villagerTrading.form = villagerTradingForm

/**
* @see routes/web.php:121
* @route '/tools/coordinate-calculator'
*/
export const coordinateCalculator = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: coordinateCalculator.url(options),
    method: 'get',
})

coordinateCalculator.definition = {
    methods: ["get","head"],
    url: '/tools/coordinate-calculator',
} satisfies RouteDefinition<["get","head"]>

/**
* @see routes/web.php:121
* @route '/tools/coordinate-calculator'
*/
coordinateCalculator.url = (options?: RouteQueryOptions) => {
    return coordinateCalculator.definition.url + queryParams(options)
}

/**
* @see routes/web.php:121
* @route '/tools/coordinate-calculator'
*/
coordinateCalculator.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: coordinateCalculator.url(options),
    method: 'get',
})

/**
* @see routes/web.php:121
* @route '/tools/coordinate-calculator'
*/
coordinateCalculator.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: coordinateCalculator.url(options),
    method: 'head',
})

/**
* @see routes/web.php:121
* @route '/tools/coordinate-calculator'
*/
const coordinateCalculatorForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: coordinateCalculator.url(options),
    method: 'get',
})

/**
* @see routes/web.php:121
* @route '/tools/coordinate-calculator'
*/
coordinateCalculatorForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: coordinateCalculator.url(options),
    method: 'get',
})

/**
* @see routes/web.php:121
* @route '/tools/coordinate-calculator'
*/
coordinateCalculatorForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: coordinateCalculator.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

coordinateCalculator.form = coordinateCalculatorForm

/**
* @see routes/web.php:124
* @route '/tools/tellraw-generator'
*/
export const tellrawGenerator = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: tellrawGenerator.url(options),
    method: 'get',
})

tellrawGenerator.definition = {
    methods: ["get","head"],
    url: '/tools/tellraw-generator',
} satisfies RouteDefinition<["get","head"]>

/**
* @see routes/web.php:124
* @route '/tools/tellraw-generator'
*/
tellrawGenerator.url = (options?: RouteQueryOptions) => {
    return tellrawGenerator.definition.url + queryParams(options)
}

/**
* @see routes/web.php:124
* @route '/tools/tellraw-generator'
*/
tellrawGenerator.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: tellrawGenerator.url(options),
    method: 'get',
})

/**
* @see routes/web.php:124
* @route '/tools/tellraw-generator'
*/
tellrawGenerator.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: tellrawGenerator.url(options),
    method: 'head',
})

/**
* @see routes/web.php:124
* @route '/tools/tellraw-generator'
*/
const tellrawGeneratorForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: tellrawGenerator.url(options),
    method: 'get',
})

/**
* @see routes/web.php:124
* @route '/tools/tellraw-generator'
*/
tellrawGeneratorForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: tellrawGenerator.url(options),
    method: 'get',
})

/**
* @see routes/web.php:124
* @route '/tools/tellraw-generator'
*/
tellrawGeneratorForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: tellrawGenerator.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

tellrawGenerator.form = tellrawGeneratorForm

/**
* @see routes/web.php:127
* @route '/tools/sign-book-generator'
*/
export const signBookGenerator = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: signBookGenerator.url(options),
    method: 'get',
})

signBookGenerator.definition = {
    methods: ["get","head"],
    url: '/tools/sign-book-generator',
} satisfies RouteDefinition<["get","head"]>

/**
* @see routes/web.php:127
* @route '/tools/sign-book-generator'
*/
signBookGenerator.url = (options?: RouteQueryOptions) => {
    return signBookGenerator.definition.url + queryParams(options)
}

/**
* @see routes/web.php:127
* @route '/tools/sign-book-generator'
*/
signBookGenerator.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: signBookGenerator.url(options),
    method: 'get',
})

/**
* @see routes/web.php:127
* @route '/tools/sign-book-generator'
*/
signBookGenerator.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: signBookGenerator.url(options),
    method: 'head',
})

/**
* @see routes/web.php:127
* @route '/tools/sign-book-generator'
*/
const signBookGeneratorForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: signBookGenerator.url(options),
    method: 'get',
})

/**
* @see routes/web.php:127
* @route '/tools/sign-book-generator'
*/
signBookGeneratorForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: signBookGenerator.url(options),
    method: 'get',
})

/**
* @see routes/web.php:127
* @route '/tools/sign-book-generator'
*/
signBookGeneratorForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: signBookGenerator.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

signBookGenerator.form = signBookGeneratorForm

/**
* @see routes/web.php:130
* @route '/tools/recipe-generator'
*/
export const recipeGenerator = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: recipeGenerator.url(options),
    method: 'get',
})

recipeGenerator.definition = {
    methods: ["get","head"],
    url: '/tools/recipe-generator',
} satisfies RouteDefinition<["get","head"]>

/**
* @see routes/web.php:130
* @route '/tools/recipe-generator'
*/
recipeGenerator.url = (options?: RouteQueryOptions) => {
    return recipeGenerator.definition.url + queryParams(options)
}

/**
* @see routes/web.php:130
* @route '/tools/recipe-generator'
*/
recipeGenerator.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: recipeGenerator.url(options),
    method: 'get',
})

/**
* @see routes/web.php:130
* @route '/tools/recipe-generator'
*/
recipeGenerator.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: recipeGenerator.url(options),
    method: 'head',
})

/**
* @see routes/web.php:130
* @route '/tools/recipe-generator'
*/
const recipeGeneratorForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: recipeGenerator.url(options),
    method: 'get',
})

/**
* @see routes/web.php:130
* @route '/tools/recipe-generator'
*/
recipeGeneratorForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: recipeGenerator.url(options),
    method: 'get',
})

/**
* @see routes/web.php:130
* @route '/tools/recipe-generator'
*/
recipeGeneratorForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: recipeGenerator.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

recipeGenerator.form = recipeGeneratorForm

/**
* @see routes/web.php:133
* @route '/tools/biome-guide'
*/
export const biomeGuide = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: biomeGuide.url(options),
    method: 'get',
})

biomeGuide.definition = {
    methods: ["get","head"],
    url: '/tools/biome-guide',
} satisfies RouteDefinition<["get","head"]>

/**
* @see routes/web.php:133
* @route '/tools/biome-guide'
*/
biomeGuide.url = (options?: RouteQueryOptions) => {
    return biomeGuide.definition.url + queryParams(options)
}

/**
* @see routes/web.php:133
* @route '/tools/biome-guide'
*/
biomeGuide.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: biomeGuide.url(options),
    method: 'get',
})

/**
* @see routes/web.php:133
* @route '/tools/biome-guide'
*/
biomeGuide.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: biomeGuide.url(options),
    method: 'head',
})

/**
* @see routes/web.php:133
* @route '/tools/biome-guide'
*/
const biomeGuideForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: biomeGuide.url(options),
    method: 'get',
})

/**
* @see routes/web.php:133
* @route '/tools/biome-guide'
*/
biomeGuideForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: biomeGuide.url(options),
    method: 'get',
})

/**
* @see routes/web.php:133
* @route '/tools/biome-guide'
*/
biomeGuideForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: biomeGuide.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

biomeGuide.form = biomeGuideForm

/**
* @see routes/web.php:136
* @route '/tools/particle-generator'
*/
export const particleGenerator = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: particleGenerator.url(options),
    method: 'get',
})

particleGenerator.definition = {
    methods: ["get","head"],
    url: '/tools/particle-generator',
} satisfies RouteDefinition<["get","head"]>

/**
* @see routes/web.php:136
* @route '/tools/particle-generator'
*/
particleGenerator.url = (options?: RouteQueryOptions) => {
    return particleGenerator.definition.url + queryParams(options)
}

/**
* @see routes/web.php:136
* @route '/tools/particle-generator'
*/
particleGenerator.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: particleGenerator.url(options),
    method: 'get',
})

/**
* @see routes/web.php:136
* @route '/tools/particle-generator'
*/
particleGenerator.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: particleGenerator.url(options),
    method: 'head',
})

/**
* @see routes/web.php:136
* @route '/tools/particle-generator'
*/
const particleGeneratorForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: particleGenerator.url(options),
    method: 'get',
})

/**
* @see routes/web.php:136
* @route '/tools/particle-generator'
*/
particleGeneratorForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: particleGenerator.url(options),
    method: 'get',
})

/**
* @see routes/web.php:136
* @route '/tools/particle-generator'
*/
particleGeneratorForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: particleGenerator.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

particleGenerator.form = particleGeneratorForm

/**
* @see routes/web.php:139
* @route '/tools/scoreboard-generator'
*/
export const scoreboardGenerator = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: scoreboardGenerator.url(options),
    method: 'get',
})

scoreboardGenerator.definition = {
    methods: ["get","head"],
    url: '/tools/scoreboard-generator',
} satisfies RouteDefinition<["get","head"]>

/**
* @see routes/web.php:139
* @route '/tools/scoreboard-generator'
*/
scoreboardGenerator.url = (options?: RouteQueryOptions) => {
    return scoreboardGenerator.definition.url + queryParams(options)
}

/**
* @see routes/web.php:139
* @route '/tools/scoreboard-generator'
*/
scoreboardGenerator.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: scoreboardGenerator.url(options),
    method: 'get',
})

/**
* @see routes/web.php:139
* @route '/tools/scoreboard-generator'
*/
scoreboardGenerator.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: scoreboardGenerator.url(options),
    method: 'head',
})

/**
* @see routes/web.php:139
* @route '/tools/scoreboard-generator'
*/
const scoreboardGeneratorForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: scoreboardGenerator.url(options),
    method: 'get',
})

/**
* @see routes/web.php:139
* @route '/tools/scoreboard-generator'
*/
scoreboardGeneratorForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: scoreboardGenerator.url(options),
    method: 'get',
})

/**
* @see routes/web.php:139
* @route '/tools/scoreboard-generator'
*/
scoreboardGeneratorForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: scoreboardGenerator.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

scoreboardGenerator.form = scoreboardGeneratorForm

/**
* @see routes/web.php:142
* @route '/tools/bossbar-generator'
*/
export const bossbarGenerator = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: bossbarGenerator.url(options),
    method: 'get',
})

bossbarGenerator.definition = {
    methods: ["get","head"],
    url: '/tools/bossbar-generator',
} satisfies RouteDefinition<["get","head"]>

/**
* @see routes/web.php:142
* @route '/tools/bossbar-generator'
*/
bossbarGenerator.url = (options?: RouteQueryOptions) => {
    return bossbarGenerator.definition.url + queryParams(options)
}

/**
* @see routes/web.php:142
* @route '/tools/bossbar-generator'
*/
bossbarGenerator.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: bossbarGenerator.url(options),
    method: 'get',
})

/**
* @see routes/web.php:142
* @route '/tools/bossbar-generator'
*/
bossbarGenerator.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: bossbarGenerator.url(options),
    method: 'head',
})

/**
* @see routes/web.php:142
* @route '/tools/bossbar-generator'
*/
const bossbarGeneratorForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: bossbarGenerator.url(options),
    method: 'get',
})

/**
* @see routes/web.php:142
* @route '/tools/bossbar-generator'
*/
bossbarGeneratorForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: bossbarGenerator.url(options),
    method: 'get',
})

/**
* @see routes/web.php:142
* @route '/tools/bossbar-generator'
*/
bossbarGeneratorForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: bossbarGenerator.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

bossbarGenerator.form = bossbarGeneratorForm

/**
* @see routes/web.php:145
* @route '/tools/target-selector'
*/
export const targetSelector = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: targetSelector.url(options),
    method: 'get',
})

targetSelector.definition = {
    methods: ["get","head"],
    url: '/tools/target-selector',
} satisfies RouteDefinition<["get","head"]>

/**
* @see routes/web.php:145
* @route '/tools/target-selector'
*/
targetSelector.url = (options?: RouteQueryOptions) => {
    return targetSelector.definition.url + queryParams(options)
}

/**
* @see routes/web.php:145
* @route '/tools/target-selector'
*/
targetSelector.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: targetSelector.url(options),
    method: 'get',
})

/**
* @see routes/web.php:145
* @route '/tools/target-selector'
*/
targetSelector.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: targetSelector.url(options),
    method: 'head',
})

/**
* @see routes/web.php:145
* @route '/tools/target-selector'
*/
const targetSelectorForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: targetSelector.url(options),
    method: 'get',
})

/**
* @see routes/web.php:145
* @route '/tools/target-selector'
*/
targetSelectorForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: targetSelector.url(options),
    method: 'get',
})

/**
* @see routes/web.php:145
* @route '/tools/target-selector'
*/
targetSelectorForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: targetSelector.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

targetSelector.form = targetSelectorForm

/**
* @see routes/web.php:148
* @route '/tools/effect-generator'
*/
export const effectGenerator = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: effectGenerator.url(options),
    method: 'get',
})

effectGenerator.definition = {
    methods: ["get","head"],
    url: '/tools/effect-generator',
} satisfies RouteDefinition<["get","head"]>

/**
* @see routes/web.php:148
* @route '/tools/effect-generator'
*/
effectGenerator.url = (options?: RouteQueryOptions) => {
    return effectGenerator.definition.url + queryParams(options)
}

/**
* @see routes/web.php:148
* @route '/tools/effect-generator'
*/
effectGenerator.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: effectGenerator.url(options),
    method: 'get',
})

/**
* @see routes/web.php:148
* @route '/tools/effect-generator'
*/
effectGenerator.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: effectGenerator.url(options),
    method: 'head',
})

/**
* @see routes/web.php:148
* @route '/tools/effect-generator'
*/
const effectGeneratorForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: effectGenerator.url(options),
    method: 'get',
})

/**
* @see routes/web.php:148
* @route '/tools/effect-generator'
*/
effectGeneratorForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: effectGenerator.url(options),
    method: 'get',
})

/**
* @see routes/web.php:148
* @route '/tools/effect-generator'
*/
effectGeneratorForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: effectGenerator.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

effectGenerator.form = effectGeneratorForm

/**
* @see routes/web.php:151
* @route '/tools/team-generator'
*/
export const teamGenerator = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: teamGenerator.url(options),
    method: 'get',
})

teamGenerator.definition = {
    methods: ["get","head"],
    url: '/tools/team-generator',
} satisfies RouteDefinition<["get","head"]>

/**
* @see routes/web.php:151
* @route '/tools/team-generator'
*/
teamGenerator.url = (options?: RouteQueryOptions) => {
    return teamGenerator.definition.url + queryParams(options)
}

/**
* @see routes/web.php:151
* @route '/tools/team-generator'
*/
teamGenerator.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: teamGenerator.url(options),
    method: 'get',
})

/**
* @see routes/web.php:151
* @route '/tools/team-generator'
*/
teamGenerator.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: teamGenerator.url(options),
    method: 'head',
})

/**
* @see routes/web.php:151
* @route '/tools/team-generator'
*/
const teamGeneratorForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: teamGenerator.url(options),
    method: 'get',
})

/**
* @see routes/web.php:151
* @route '/tools/team-generator'
*/
teamGeneratorForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: teamGenerator.url(options),
    method: 'get',
})

/**
* @see routes/web.php:151
* @route '/tools/team-generator'
*/
teamGeneratorForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: teamGenerator.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

teamGenerator.form = teamGeneratorForm

/**
* @see routes/web.php:154
* @route '/tools/fill-clone-generator'
*/
export const fillCloneGenerator = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: fillCloneGenerator.url(options),
    method: 'get',
})

fillCloneGenerator.definition = {
    methods: ["get","head"],
    url: '/tools/fill-clone-generator',
} satisfies RouteDefinition<["get","head"]>

/**
* @see routes/web.php:154
* @route '/tools/fill-clone-generator'
*/
fillCloneGenerator.url = (options?: RouteQueryOptions) => {
    return fillCloneGenerator.definition.url + queryParams(options)
}

/**
* @see routes/web.php:154
* @route '/tools/fill-clone-generator'
*/
fillCloneGenerator.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: fillCloneGenerator.url(options),
    method: 'get',
})

/**
* @see routes/web.php:154
* @route '/tools/fill-clone-generator'
*/
fillCloneGenerator.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: fillCloneGenerator.url(options),
    method: 'head',
})

/**
* @see routes/web.php:154
* @route '/tools/fill-clone-generator'
*/
const fillCloneGeneratorForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: fillCloneGenerator.url(options),
    method: 'get',
})

/**
* @see routes/web.php:154
* @route '/tools/fill-clone-generator'
*/
fillCloneGeneratorForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: fillCloneGenerator.url(options),
    method: 'get',
})

/**
* @see routes/web.php:154
* @route '/tools/fill-clone-generator'
*/
fillCloneGeneratorForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: fillCloneGenerator.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

fillCloneGenerator.form = fillCloneGeneratorForm

/**
* @see routes/web.php:157
* @route '/tools/execute-generator'
*/
export const executeGenerator = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: executeGenerator.url(options),
    method: 'get',
})

executeGenerator.definition = {
    methods: ["get","head"],
    url: '/tools/execute-generator',
} satisfies RouteDefinition<["get","head"]>

/**
* @see routes/web.php:157
* @route '/tools/execute-generator'
*/
executeGenerator.url = (options?: RouteQueryOptions) => {
    return executeGenerator.definition.url + queryParams(options)
}

/**
* @see routes/web.php:157
* @route '/tools/execute-generator'
*/
executeGenerator.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: executeGenerator.url(options),
    method: 'get',
})

/**
* @see routes/web.php:157
* @route '/tools/execute-generator'
*/
executeGenerator.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: executeGenerator.url(options),
    method: 'head',
})

/**
* @see routes/web.php:157
* @route '/tools/execute-generator'
*/
const executeGeneratorForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: executeGenerator.url(options),
    method: 'get',
})

/**
* @see routes/web.php:157
* @route '/tools/execute-generator'
*/
executeGeneratorForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: executeGenerator.url(options),
    method: 'get',
})

/**
* @see routes/web.php:157
* @route '/tools/execute-generator'
*/
executeGeneratorForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: executeGenerator.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

executeGenerator.form = executeGeneratorForm

/**
* @see routes/web.php:160
* @route '/tools/item-generator'
*/
export const itemGenerator = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: itemGenerator.url(options),
    method: 'get',
})

itemGenerator.definition = {
    methods: ["get","head"],
    url: '/tools/item-generator',
} satisfies RouteDefinition<["get","head"]>

/**
* @see routes/web.php:160
* @route '/tools/item-generator'
*/
itemGenerator.url = (options?: RouteQueryOptions) => {
    return itemGenerator.definition.url + queryParams(options)
}

/**
* @see routes/web.php:160
* @route '/tools/item-generator'
*/
itemGenerator.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: itemGenerator.url(options),
    method: 'get',
})

/**
* @see routes/web.php:160
* @route '/tools/item-generator'
*/
itemGenerator.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: itemGenerator.url(options),
    method: 'head',
})

/**
* @see routes/web.php:160
* @route '/tools/item-generator'
*/
const itemGeneratorForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: itemGenerator.url(options),
    method: 'get',
})

/**
* @see routes/web.php:160
* @route '/tools/item-generator'
*/
itemGeneratorForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: itemGenerator.url(options),
    method: 'get',
})

/**
* @see routes/web.php:160
* @route '/tools/item-generator'
*/
itemGeneratorForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: itemGenerator.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

itemGenerator.form = itemGeneratorForm

const tools = {
    serverStatus: Object.assign(serverStatus, serverStatus),
    netherCalculator: Object.assign(netherCalculator, netherCalculator),
    uuidConverter: Object.assign(uuidConverter, uuidConverter),
    bannerCreator: Object.assign(bannerCreator, bannerCreator),
    craftingRecipes: Object.assign(craftingRecipes, craftingRecipes),
    enchantmentCalculator: Object.assign(enchantmentCalculator, enchantmentCalculator),
    fireworkDesigner: Object.assign(fireworkDesigner, fireworkDesigner),
    colorCodes: Object.assign(colorCodes, colorCodes),
    xpCalculator: Object.assign(xpCalculator, xpCalculator),
    skinViewer: Object.assign(skinViewer, skinViewer),
    redstoneCalculator: Object.assign(redstoneCalculator, redstoneCalculator),
    flatWorldGenerator: Object.assign(flatWorldGenerator, flatWorldGenerator),
    mobSpawning: Object.assign(mobSpawning, mobSpawning),
    commandGenerator: Object.assign(commandGenerator, commandGenerator),
    entityGenerator: Object.assign(entityGenerator, entityGenerator),
    advancementGenerator: Object.assign(advancementGenerator, advancementGenerator),
    armorStandEditor: Object.assign(armorStandEditor, armorStandEditor),
    potionBrewing: Object.assign(potionBrewing, potionBrewing),
    lootTableGenerator: Object.assign(lootTableGenerator, lootTableGenerator),
    villagerTrading: Object.assign(villagerTrading, villagerTrading),
    coordinateCalculator: Object.assign(coordinateCalculator, coordinateCalculator),
    tellrawGenerator: Object.assign(tellrawGenerator, tellrawGenerator),
    signBookGenerator: Object.assign(signBookGenerator, signBookGenerator),
    recipeGenerator: Object.assign(recipeGenerator, recipeGenerator),
    biomeGuide: Object.assign(biomeGuide, biomeGuide),
    particleGenerator: Object.assign(particleGenerator, particleGenerator),
    scoreboardGenerator: Object.assign(scoreboardGenerator, scoreboardGenerator),
    bossbarGenerator: Object.assign(bossbarGenerator, bossbarGenerator),
    targetSelector: Object.assign(targetSelector, targetSelector),
    effectGenerator: Object.assign(effectGenerator, effectGenerator),
    teamGenerator: Object.assign(teamGenerator, teamGenerator),
    fillCloneGenerator: Object.assign(fillCloneGenerator, fillCloneGenerator),
    executeGenerator: Object.assign(executeGenerator, executeGenerator),
    itemGenerator: Object.assign(itemGenerator, itemGenerator),
}

export default tools