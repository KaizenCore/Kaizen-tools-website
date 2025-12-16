import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../../wayfinder'
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

const uuidConverter = {
    convert: Object.assign(convert, convert),
}

export default uuidConverter