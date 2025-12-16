import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../wayfinder'
import reports from './reports'
/**
* @see \App\Http\Controllers\Players\PlayerController::index
* @see app/Http/Controllers/Players/PlayerController.php:22
* @route '/players'
*/
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/players',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Players\PlayerController::index
* @see app/Http/Controllers/Players/PlayerController.php:22
* @route '/players'
*/
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Players\PlayerController::index
* @see app/Http/Controllers/Players/PlayerController.php:22
* @route '/players'
*/
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Players\PlayerController::index
* @see app/Http/Controllers/Players/PlayerController.php:22
* @route '/players'
*/
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Players\PlayerController::index
* @see app/Http/Controllers/Players/PlayerController.php:22
* @route '/players'
*/
const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Players\PlayerController::index
* @see app/Http/Controllers/Players/PlayerController.php:22
* @route '/players'
*/
indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Players\PlayerController::index
* @see app/Http/Controllers/Players/PlayerController.php:22
* @route '/players'
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
* @see \App\Http\Controllers\Players\PlayerController::show
* @see app/Http/Controllers/Players/PlayerController.php:35
* @route '/players/{username}'
*/
export const show = (args: { username: string | number } | [username: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/players/{username}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Players\PlayerController::show
* @see app/Http/Controllers/Players/PlayerController.php:35
* @route '/players/{username}'
*/
show.url = (args: { username: string | number } | [username: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { username: args }
    }

    if (Array.isArray(args)) {
        args = {
            username: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        username: args.username,
    }

    return show.definition.url
            .replace('{username}', parsedArgs.username.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Players\PlayerController::show
* @see app/Http/Controllers/Players/PlayerController.php:35
* @route '/players/{username}'
*/
show.get = (args: { username: string | number } | [username: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Players\PlayerController::show
* @see app/Http/Controllers/Players/PlayerController.php:35
* @route '/players/{username}'
*/
show.head = (args: { username: string | number } | [username: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Players\PlayerController::show
* @see app/Http/Controllers/Players/PlayerController.php:35
* @route '/players/{username}'
*/
const showForm = (args: { username: string | number } | [username: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Players\PlayerController::show
* @see app/Http/Controllers/Players/PlayerController.php:35
* @route '/players/{username}'
*/
showForm.get = (args: { username: string | number } | [username: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Players\PlayerController::show
* @see app/Http/Controllers/Players/PlayerController.php:35
* @route '/players/{username}'
*/
showForm.head = (args: { username: string | number } | [username: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: show.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

show.form = showForm

const players = {
    index: Object.assign(index, index),
    show: Object.assign(show, show),
    reports: Object.assign(reports, reports),
}

export default players