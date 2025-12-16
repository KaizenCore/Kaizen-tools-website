import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Players\PlayerReportController::store
* @see app/Http/Controllers/Players/PlayerReportController.php:19
* @route '/players/{player}/reports'
*/
export const store = (args: { player: number | { id: number } } | [player: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(args, options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/players/{player}/reports',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Players\PlayerReportController::store
* @see app/Http/Controllers/Players/PlayerReportController.php:19
* @route '/players/{player}/reports'
*/
store.url = (args: { player: number | { id: number } } | [player: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { player: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { player: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            player: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        player: typeof args.player === 'object'
        ? args.player.id
        : args.player,
    }

    return store.definition.url
            .replace('{player}', parsedArgs.player.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Players\PlayerReportController::store
* @see app/Http/Controllers/Players/PlayerReportController.php:19
* @route '/players/{player}/reports'
*/
store.post = (args: { player: number | { id: number } } | [player: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Players\PlayerReportController::store
* @see app/Http/Controllers/Players/PlayerReportController.php:19
* @route '/players/{player}/reports'
*/
const storeForm = (args: { player: number | { id: number } } | [player: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Players\PlayerReportController::store
* @see app/Http/Controllers/Players/PlayerReportController.php:19
* @route '/players/{player}/reports'
*/
storeForm.post = (args: { player: number | { id: number } } | [player: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(args, options),
    method: 'post',
})

store.form = storeForm

const PlayerReportController = { store }

export default PlayerReportController