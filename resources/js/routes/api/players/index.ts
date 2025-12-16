import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../wayfinder'
/**
* @see \App\Http\Controllers\Players\PlayerController::search
* @see app/Http/Controllers/Players/PlayerController.php:76
* @route '/api/players/search'
*/
export const search = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: search.url(options),
    method: 'get',
})

search.definition = {
    methods: ["get","head"],
    url: '/api/players/search',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Players\PlayerController::search
* @see app/Http/Controllers/Players/PlayerController.php:76
* @route '/api/players/search'
*/
search.url = (options?: RouteQueryOptions) => {
    return search.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Players\PlayerController::search
* @see app/Http/Controllers/Players/PlayerController.php:76
* @route '/api/players/search'
*/
search.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: search.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Players\PlayerController::search
* @see app/Http/Controllers/Players/PlayerController.php:76
* @route '/api/players/search'
*/
search.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: search.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Players\PlayerController::search
* @see app/Http/Controllers/Players/PlayerController.php:76
* @route '/api/players/search'
*/
const searchForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: search.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Players\PlayerController::search
* @see app/Http/Controllers/Players/PlayerController.php:76
* @route '/api/players/search'
*/
searchForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: search.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Players\PlayerController::search
* @see app/Http/Controllers/Players/PlayerController.php:76
* @route '/api/players/search'
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

const players = {
    search: Object.assign(search, search),
}

export default players