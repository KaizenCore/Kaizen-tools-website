import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Tools\ServerStatusController::index
* @see app/Http/Controllers/Tools/ServerStatusController.php:18
* @route '/tools/server-status'
*/
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/tools/server-status',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Tools\ServerStatusController::index
* @see app/Http/Controllers/Tools/ServerStatusController.php:18
* @route '/tools/server-status'
*/
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Tools\ServerStatusController::index
* @see app/Http/Controllers/Tools/ServerStatusController.php:18
* @route '/tools/server-status'
*/
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Tools\ServerStatusController::index
* @see app/Http/Controllers/Tools/ServerStatusController.php:18
* @route '/tools/server-status'
*/
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Tools\ServerStatusController::index
* @see app/Http/Controllers/Tools/ServerStatusController.php:18
* @route '/tools/server-status'
*/
const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Tools\ServerStatusController::index
* @see app/Http/Controllers/Tools/ServerStatusController.php:18
* @route '/tools/server-status'
*/
indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Tools\ServerStatusController::index
* @see app/Http/Controllers/Tools/ServerStatusController.php:18
* @route '/tools/server-status'
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
* @see \App\Http\Controllers\Tools\ServerStatusController::check
* @see app/Http/Controllers/Tools/ServerStatusController.php:23
* @route '/api/tools/server-status/check'
*/
export const check = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: check.url(options),
    method: 'post',
})

check.definition = {
    methods: ["post"],
    url: '/api/tools/server-status/check',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Tools\ServerStatusController::check
* @see app/Http/Controllers/Tools/ServerStatusController.php:23
* @route '/api/tools/server-status/check'
*/
check.url = (options?: RouteQueryOptions) => {
    return check.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Tools\ServerStatusController::check
* @see app/Http/Controllers/Tools/ServerStatusController.php:23
* @route '/api/tools/server-status/check'
*/
check.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: check.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Tools\ServerStatusController::check
* @see app/Http/Controllers/Tools/ServerStatusController.php:23
* @route '/api/tools/server-status/check'
*/
const checkForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: check.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Tools\ServerStatusController::check
* @see app/Http/Controllers/Tools/ServerStatusController.php:23
* @route '/api/tools/server-status/check'
*/
checkForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: check.url(options),
    method: 'post',
})

check.form = checkForm

const ServerStatusController = { index, check }

export default ServerStatusController