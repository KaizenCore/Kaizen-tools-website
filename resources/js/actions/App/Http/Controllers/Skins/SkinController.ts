import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Skins\SkinController::index
* @see app/Http/Controllers/Skins/SkinController.php:20
* @route '/skins'
*/
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/skins',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Skins\SkinController::index
* @see app/Http/Controllers/Skins/SkinController.php:20
* @route '/skins'
*/
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Skins\SkinController::index
* @see app/Http/Controllers/Skins/SkinController.php:20
* @route '/skins'
*/
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Skins\SkinController::index
* @see app/Http/Controllers/Skins/SkinController.php:20
* @route '/skins'
*/
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Skins\SkinController::index
* @see app/Http/Controllers/Skins/SkinController.php:20
* @route '/skins'
*/
const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Skins\SkinController::index
* @see app/Http/Controllers/Skins/SkinController.php:20
* @route '/skins'
*/
indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Skins\SkinController::index
* @see app/Http/Controllers/Skins/SkinController.php:20
* @route '/skins'
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
* @see \App\Http\Controllers\Skins\SkinController::show
* @see app/Http/Controllers/Skins/SkinController.php:35
* @route '/skins/{username}'
*/
export const show = (args: { username: string | number } | [username: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/skins/{username}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Skins\SkinController::show
* @see app/Http/Controllers/Skins/SkinController.php:35
* @route '/skins/{username}'
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
* @see \App\Http\Controllers\Skins\SkinController::show
* @see app/Http/Controllers/Skins/SkinController.php:35
* @route '/skins/{username}'
*/
show.get = (args: { username: string | number } | [username: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Skins\SkinController::show
* @see app/Http/Controllers/Skins/SkinController.php:35
* @route '/skins/{username}'
*/
show.head = (args: { username: string | number } | [username: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Skins\SkinController::show
* @see app/Http/Controllers/Skins/SkinController.php:35
* @route '/skins/{username}'
*/
const showForm = (args: { username: string | number } | [username: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Skins\SkinController::show
* @see app/Http/Controllers/Skins/SkinController.php:35
* @route '/skins/{username}'
*/
showForm.get = (args: { username: string | number } | [username: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Skins\SkinController::show
* @see app/Http/Controllers/Skins/SkinController.php:35
* @route '/skins/{username}'
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

/**
* @see \App\Http\Controllers\Skins\SkinController::search
* @see app/Http/Controllers/Skins/SkinController.php:59
* @route '/api/skins/search'
*/
export const search = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: search.url(options),
    method: 'get',
})

search.definition = {
    methods: ["get","head"],
    url: '/api/skins/search',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Skins\SkinController::search
* @see app/Http/Controllers/Skins/SkinController.php:59
* @route '/api/skins/search'
*/
search.url = (options?: RouteQueryOptions) => {
    return search.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Skins\SkinController::search
* @see app/Http/Controllers/Skins/SkinController.php:59
* @route '/api/skins/search'
*/
search.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: search.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Skins\SkinController::search
* @see app/Http/Controllers/Skins/SkinController.php:59
* @route '/api/skins/search'
*/
search.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: search.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Skins\SkinController::search
* @see app/Http/Controllers/Skins/SkinController.php:59
* @route '/api/skins/search'
*/
const searchForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: search.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Skins\SkinController::search
* @see app/Http/Controllers/Skins/SkinController.php:59
* @route '/api/skins/search'
*/
searchForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: search.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Skins\SkinController::search
* @see app/Http/Controllers/Skins/SkinController.php:59
* @route '/api/skins/search'
*/
searchForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: search.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

search.form = searchForm

const SkinController = { index, show, search }

export default SkinController