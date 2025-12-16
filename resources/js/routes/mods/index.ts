import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../wayfinder'
import categories from './categories'
/**
* @see \App\Http\Controllers\Mods\ModController::index
* @see app/Http/Controllers/Mods/ModController.php:30
* @route '/mods'
*/
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/mods',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Mods\ModController::index
* @see app/Http/Controllers/Mods/ModController.php:30
* @route '/mods'
*/
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Mods\ModController::index
* @see app/Http/Controllers/Mods/ModController.php:30
* @route '/mods'
*/
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Mods\ModController::index
* @see app/Http/Controllers/Mods/ModController.php:30
* @route '/mods'
*/
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Mods\ModController::index
* @see app/Http/Controllers/Mods/ModController.php:30
* @route '/mods'
*/
const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Mods\ModController::index
* @see app/Http/Controllers/Mods/ModController.php:30
* @route '/mods'
*/
indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Mods\ModController::index
* @see app/Http/Controllers/Mods/ModController.php:30
* @route '/mods'
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
* @see \App\Http\Controllers\Mods\ModController::show
* @see app/Http/Controllers/Mods/ModController.php:130
* @route '/mods/{mod}'
*/
export const show = (args: { mod: string | number | { slug: string | number } } | [mod: string | number | { slug: string | number } ] | string | number | { slug: string | number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/mods/{mod}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Mods\ModController::show
* @see app/Http/Controllers/Mods/ModController.php:130
* @route '/mods/{mod}'
*/
show.url = (args: { mod: string | number | { slug: string | number } } | [mod: string | number | { slug: string | number } ] | string | number | { slug: string | number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { mod: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'slug' in args) {
        args = { mod: args.slug }
    }

    if (Array.isArray(args)) {
        args = {
            mod: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        mod: typeof args.mod === 'object'
        ? args.mod.slug
        : args.mod,
    }

    return show.definition.url
            .replace('{mod}', parsedArgs.mod.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Mods\ModController::show
* @see app/Http/Controllers/Mods/ModController.php:130
* @route '/mods/{mod}'
*/
show.get = (args: { mod: string | number | { slug: string | number } } | [mod: string | number | { slug: string | number } ] | string | number | { slug: string | number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Mods\ModController::show
* @see app/Http/Controllers/Mods/ModController.php:130
* @route '/mods/{mod}'
*/
show.head = (args: { mod: string | number | { slug: string | number } } | [mod: string | number | { slug: string | number } ] | string | number | { slug: string | number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Mods\ModController::show
* @see app/Http/Controllers/Mods/ModController.php:130
* @route '/mods/{mod}'
*/
const showForm = (args: { mod: string | number | { slug: string | number } } | [mod: string | number | { slug: string | number } ] | string | number | { slug: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Mods\ModController::show
* @see app/Http/Controllers/Mods/ModController.php:130
* @route '/mods/{mod}'
*/
showForm.get = (args: { mod: string | number | { slug: string | number } } | [mod: string | number | { slug: string | number } ] | string | number | { slug: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Mods\ModController::show
* @see app/Http/Controllers/Mods/ModController.php:130
* @route '/mods/{mod}'
*/
showForm.head = (args: { mod: string | number | { slug: string | number } } | [mod: string | number | { slug: string | number } ] | string | number | { slug: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: show.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

show.form = showForm

const mods = {
    index: Object.assign(index, index),
    categories: Object.assign(categories, categories),
    show: Object.assign(show, show),
}

export default mods