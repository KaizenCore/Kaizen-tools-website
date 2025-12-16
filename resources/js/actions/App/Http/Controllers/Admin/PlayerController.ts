import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Admin\PlayerController::index
* @see app/Http/Controllers/Admin/PlayerController.php:21
* @route '/admin/players'
*/
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/admin/players',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\PlayerController::index
* @see app/Http/Controllers/Admin/PlayerController.php:21
* @route '/admin/players'
*/
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\PlayerController::index
* @see app/Http/Controllers/Admin/PlayerController.php:21
* @route '/admin/players'
*/
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Admin\PlayerController::index
* @see app/Http/Controllers/Admin/PlayerController.php:21
* @route '/admin/players'
*/
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Admin\PlayerController::index
* @see app/Http/Controllers/Admin/PlayerController.php:21
* @route '/admin/players'
*/
const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Admin\PlayerController::index
* @see app/Http/Controllers/Admin/PlayerController.php:21
* @route '/admin/players'
*/
indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Admin\PlayerController::index
* @see app/Http/Controllers/Admin/PlayerController.php:21
* @route '/admin/players'
*/
indexForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

index.form = indexForm

/**
* @see \App\Http\Controllers\Admin\PlayerController::show
* @see app/Http/Controllers/Admin/PlayerController.php:52
* @route '/admin/players/{player}'
*/
export const show = (args: { player: number | { id: number } } | [player: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/admin/players/{player}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\PlayerController::show
* @see app/Http/Controllers/Admin/PlayerController.php:52
* @route '/admin/players/{player}'
*/
show.url = (args: { player: number | { id: number } } | [player: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
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

    return show.definition.url
            .replace('{player}', parsedArgs.player.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\PlayerController::show
* @see app/Http/Controllers/Admin/PlayerController.php:52
* @route '/admin/players/{player}'
*/
show.get = (args: { player: number | { id: number } } | [player: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Admin\PlayerController::show
* @see app/Http/Controllers/Admin/PlayerController.php:52
* @route '/admin/players/{player}'
*/
show.head = (args: { player: number | { id: number } } | [player: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Admin\PlayerController::show
* @see app/Http/Controllers/Admin/PlayerController.php:52
* @route '/admin/players/{player}'
*/
const showForm = (args: { player: number | { id: number } } | [player: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Admin\PlayerController::show
* @see app/Http/Controllers/Admin/PlayerController.php:52
* @route '/admin/players/{player}'
*/
showForm.get = (args: { player: number | { id: number } } | [player: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Admin\PlayerController::show
* @see app/Http/Controllers/Admin/PlayerController.php:52
* @route '/admin/players/{player}'
*/
showForm.head = (args: { player: number | { id: number } } | [player: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: show.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

show.form = showForm

/**
* @see \App\Http\Controllers\Admin\PlayerController::override
* @see app/Http/Controllers/Admin/PlayerController.php:76
* @route '/admin/players/{player}/override'
*/
export const override = (args: { player: number | { id: number } } | [player: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: override.url(args, options),
    method: 'post',
})

override.definition = {
    methods: ["post"],
    url: '/admin/players/{player}/override',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Admin\PlayerController::override
* @see app/Http/Controllers/Admin/PlayerController.php:76
* @route '/admin/players/{player}/override'
*/
override.url = (args: { player: number | { id: number } } | [player: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
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

    return override.definition.url
            .replace('{player}', parsedArgs.player.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\PlayerController::override
* @see app/Http/Controllers/Admin/PlayerController.php:76
* @route '/admin/players/{player}/override'
*/
override.post = (args: { player: number | { id: number } } | [player: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: override.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Admin\PlayerController::override
* @see app/Http/Controllers/Admin/PlayerController.php:76
* @route '/admin/players/{player}/override'
*/
const overrideForm = (args: { player: number | { id: number } } | [player: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: override.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Admin\PlayerController::override
* @see app/Http/Controllers/Admin/PlayerController.php:76
* @route '/admin/players/{player}/override'
*/
overrideForm.post = (args: { player: number | { id: number } } | [player: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: override.url(args, options),
    method: 'post',
})

override.form = overrideForm

/**
* @see \App\Http\Controllers\Admin\PlayerController::removeOverride
* @see app/Http/Controllers/Admin/PlayerController.php:98
* @route '/admin/players/{player}/override'
*/
export const removeOverride = (args: { player: number | { id: number } } | [player: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: removeOverride.url(args, options),
    method: 'delete',
})

removeOverride.definition = {
    methods: ["delete"],
    url: '/admin/players/{player}/override',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\Admin\PlayerController::removeOverride
* @see app/Http/Controllers/Admin/PlayerController.php:98
* @route '/admin/players/{player}/override'
*/
removeOverride.url = (args: { player: number | { id: number } } | [player: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
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

    return removeOverride.definition.url
            .replace('{player}', parsedArgs.player.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\PlayerController::removeOverride
* @see app/Http/Controllers/Admin/PlayerController.php:98
* @route '/admin/players/{player}/override'
*/
removeOverride.delete = (args: { player: number | { id: number } } | [player: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: removeOverride.url(args, options),
    method: 'delete',
})

/**
* @see \App\Http\Controllers\Admin\PlayerController::removeOverride
* @see app/Http/Controllers/Admin/PlayerController.php:98
* @route '/admin/players/{player}/override'
*/
const removeOverrideForm = (args: { player: number | { id: number } } | [player: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: removeOverride.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'DELETE',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Admin\PlayerController::removeOverride
* @see app/Http/Controllers/Admin/PlayerController.php:98
* @route '/admin/players/{player}/override'
*/
removeOverrideForm.delete = (args: { player: number | { id: number } } | [player: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: removeOverride.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'DELETE',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

removeOverride.form = removeOverrideForm

/**
* @see \App\Http\Controllers\Admin\PlayerController::recalculateAll
* @see app/Http/Controllers/Admin/PlayerController.php:108
* @route '/admin/players/recalculate-all'
*/
export const recalculateAll = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: recalculateAll.url(options),
    method: 'post',
})

recalculateAll.definition = {
    methods: ["post"],
    url: '/admin/players/recalculate-all',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Admin\PlayerController::recalculateAll
* @see app/Http/Controllers/Admin/PlayerController.php:108
* @route '/admin/players/recalculate-all'
*/
recalculateAll.url = (options?: RouteQueryOptions) => {
    return recalculateAll.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\PlayerController::recalculateAll
* @see app/Http/Controllers/Admin/PlayerController.php:108
* @route '/admin/players/recalculate-all'
*/
recalculateAll.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: recalculateAll.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Admin\PlayerController::recalculateAll
* @see app/Http/Controllers/Admin/PlayerController.php:108
* @route '/admin/players/recalculate-all'
*/
const recalculateAllForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: recalculateAll.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Admin\PlayerController::recalculateAll
* @see app/Http/Controllers/Admin/PlayerController.php:108
* @route '/admin/players/recalculate-all'
*/
recalculateAllForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: recalculateAll.url(options),
    method: 'post',
})

recalculateAll.form = recalculateAllForm

const PlayerController = { index, show, override, removeOverride, recalculateAll }

export default PlayerController