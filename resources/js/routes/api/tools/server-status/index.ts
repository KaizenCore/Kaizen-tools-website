import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../../wayfinder'
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

const serverStatus = {
    check: Object.assign(check, check),
}

export default serverStatus