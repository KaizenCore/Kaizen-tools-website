import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Mods\CategoryController::index
* @see app/Http/Controllers/Mods/CategoryController.php:14
* @route '/mods/categories'
*/
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/mods/categories',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Mods\CategoryController::index
* @see app/Http/Controllers/Mods/CategoryController.php:14
* @route '/mods/categories'
*/
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Mods\CategoryController::index
* @see app/Http/Controllers/Mods/CategoryController.php:14
* @route '/mods/categories'
*/
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Mods\CategoryController::index
* @see app/Http/Controllers/Mods/CategoryController.php:14
* @route '/mods/categories'
*/
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Mods\CategoryController::index
* @see app/Http/Controllers/Mods/CategoryController.php:14
* @route '/mods/categories'
*/
const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Mods\CategoryController::index
* @see app/Http/Controllers/Mods/CategoryController.php:14
* @route '/mods/categories'
*/
indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Mods\CategoryController::index
* @see app/Http/Controllers/Mods/CategoryController.php:14
* @route '/mods/categories'
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
* @see \App\Http\Controllers\Mods\CategoryController::show
* @see app/Http/Controllers/Mods/CategoryController.php:25
* @route '/mods/categories/{category}'
*/
export const show = (args: { category: string | { slug: string } } | [category: string | { slug: string } ] | string | { slug: string }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/mods/categories/{category}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Mods\CategoryController::show
* @see app/Http/Controllers/Mods/CategoryController.php:25
* @route '/mods/categories/{category}'
*/
show.url = (args: { category: string | { slug: string } } | [category: string | { slug: string } ] | string | { slug: string }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { category: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'slug' in args) {
        args = { category: args.slug }
    }

    if (Array.isArray(args)) {
        args = {
            category: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        category: typeof args.category === 'object'
        ? args.category.slug
        : args.category,
    }

    return show.definition.url
            .replace('{category}', parsedArgs.category.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Mods\CategoryController::show
* @see app/Http/Controllers/Mods/CategoryController.php:25
* @route '/mods/categories/{category}'
*/
show.get = (args: { category: string | { slug: string } } | [category: string | { slug: string } ] | string | { slug: string }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Mods\CategoryController::show
* @see app/Http/Controllers/Mods/CategoryController.php:25
* @route '/mods/categories/{category}'
*/
show.head = (args: { category: string | { slug: string } } | [category: string | { slug: string } ] | string | { slug: string }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Mods\CategoryController::show
* @see app/Http/Controllers/Mods/CategoryController.php:25
* @route '/mods/categories/{category}'
*/
const showForm = (args: { category: string | { slug: string } } | [category: string | { slug: string } ] | string | { slug: string }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Mods\CategoryController::show
* @see app/Http/Controllers/Mods/CategoryController.php:25
* @route '/mods/categories/{category}'
*/
showForm.get = (args: { category: string | { slug: string } } | [category: string | { slug: string } ] | string | { slug: string }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Mods\CategoryController::show
* @see app/Http/Controllers/Mods/CategoryController.php:25
* @route '/mods/categories/{category}'
*/
showForm.head = (args: { category: string | { slug: string } } | [category: string | { slug: string } ] | string | { slug: string }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: show.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

show.form = showForm

const CategoryController = { index, show }

export default CategoryController