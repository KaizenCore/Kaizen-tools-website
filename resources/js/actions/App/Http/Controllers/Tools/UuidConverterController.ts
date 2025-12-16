import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Tools\UuidConverterController::index
* @see app/Http/Controllers/Tools/UuidConverterController.php:18
* @route '/tools/uuid-converter'
*/
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/tools/uuid-converter',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Tools\UuidConverterController::index
* @see app/Http/Controllers/Tools/UuidConverterController.php:18
* @route '/tools/uuid-converter'
*/
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Tools\UuidConverterController::index
* @see app/Http/Controllers/Tools/UuidConverterController.php:18
* @route '/tools/uuid-converter'
*/
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Tools\UuidConverterController::index
* @see app/Http/Controllers/Tools/UuidConverterController.php:18
* @route '/tools/uuid-converter'
*/
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Tools\UuidConverterController::index
* @see app/Http/Controllers/Tools/UuidConverterController.php:18
* @route '/tools/uuid-converter'
*/
const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Tools\UuidConverterController::index
* @see app/Http/Controllers/Tools/UuidConverterController.php:18
* @route '/tools/uuid-converter'
*/
indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Tools\UuidConverterController::index
* @see app/Http/Controllers/Tools/UuidConverterController.php:18
* @route '/tools/uuid-converter'
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
* @see \App\Http\Controllers\Tools\UuidConverterController::convert
* @see app/Http/Controllers/Tools/UuidConverterController.php:23
* @route '/api/tools/uuid-converter'
*/
export const convert = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: convert.url(options),
    method: 'post',
})

convert.definition = {
    methods: ["post"],
    url: '/api/tools/uuid-converter',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Tools\UuidConverterController::convert
* @see app/Http/Controllers/Tools/UuidConverterController.php:23
* @route '/api/tools/uuid-converter'
*/
convert.url = (options?: RouteQueryOptions) => {
    return convert.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Tools\UuidConverterController::convert
* @see app/Http/Controllers/Tools/UuidConverterController.php:23
* @route '/api/tools/uuid-converter'
*/
convert.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: convert.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Tools\UuidConverterController::convert
* @see app/Http/Controllers/Tools/UuidConverterController.php:23
* @route '/api/tools/uuid-converter'
*/
const convertForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: convert.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Tools\UuidConverterController::convert
* @see app/Http/Controllers/Tools/UuidConverterController.php:23
* @route '/api/tools/uuid-converter'
*/
convertForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: convert.url(options),
    method: 'post',
})

convert.form = convertForm

const UuidConverterController = { index, convert }

export default UuidConverterController