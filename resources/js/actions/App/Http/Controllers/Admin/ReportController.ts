import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Admin\ReportController::index
* @see app/Http/Controllers/Admin/ReportController.php:20
* @route '/admin/reports'
*/
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/admin/reports',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\ReportController::index
* @see app/Http/Controllers/Admin/ReportController.php:20
* @route '/admin/reports'
*/
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\ReportController::index
* @see app/Http/Controllers/Admin/ReportController.php:20
* @route '/admin/reports'
*/
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Admin\ReportController::index
* @see app/Http/Controllers/Admin/ReportController.php:20
* @route '/admin/reports'
*/
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Admin\ReportController::index
* @see app/Http/Controllers/Admin/ReportController.php:20
* @route '/admin/reports'
*/
const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Admin\ReportController::index
* @see app/Http/Controllers/Admin/ReportController.php:20
* @route '/admin/reports'
*/
indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Admin\ReportController::index
* @see app/Http/Controllers/Admin/ReportController.php:20
* @route '/admin/reports'
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
* @see \App\Http\Controllers\Admin\ReportController::review
* @see app/Http/Controllers/Admin/ReportController.php:78
* @route '/admin/reports/{report}/review'
*/
export const review = (args: { report: number | { id: number } } | [report: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: review.url(args, options),
    method: 'post',
})

review.definition = {
    methods: ["post"],
    url: '/admin/reports/{report}/review',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Admin\ReportController::review
* @see app/Http/Controllers/Admin/ReportController.php:78
* @route '/admin/reports/{report}/review'
*/
review.url = (args: { report: number | { id: number } } | [report: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { report: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { report: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            report: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        report: typeof args.report === 'object'
        ? args.report.id
        : args.report,
    }

    return review.definition.url
            .replace('{report}', parsedArgs.report.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\ReportController::review
* @see app/Http/Controllers/Admin/ReportController.php:78
* @route '/admin/reports/{report}/review'
*/
review.post = (args: { report: number | { id: number } } | [report: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: review.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Admin\ReportController::review
* @see app/Http/Controllers/Admin/ReportController.php:78
* @route '/admin/reports/{report}/review'
*/
const reviewForm = (args: { report: number | { id: number } } | [report: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: review.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Admin\ReportController::review
* @see app/Http/Controllers/Admin/ReportController.php:78
* @route '/admin/reports/{report}/review'
*/
reviewForm.post = (args: { report: number | { id: number } } | [report: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: review.url(args, options),
    method: 'post',
})

review.form = reviewForm

/**
* @see \App\Http\Controllers\Admin\ReportController::bulkReview
* @see app/Http/Controllers/Admin/ReportController.php:103
* @route '/admin/reports/bulk-review'
*/
export const bulkReview = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: bulkReview.url(options),
    method: 'post',
})

bulkReview.definition = {
    methods: ["post"],
    url: '/admin/reports/bulk-review',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Admin\ReportController::bulkReview
* @see app/Http/Controllers/Admin/ReportController.php:103
* @route '/admin/reports/bulk-review'
*/
bulkReview.url = (options?: RouteQueryOptions) => {
    return bulkReview.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\ReportController::bulkReview
* @see app/Http/Controllers/Admin/ReportController.php:103
* @route '/admin/reports/bulk-review'
*/
bulkReview.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: bulkReview.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Admin\ReportController::bulkReview
* @see app/Http/Controllers/Admin/ReportController.php:103
* @route '/admin/reports/bulk-review'
*/
const bulkReviewForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: bulkReview.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Admin\ReportController::bulkReview
* @see app/Http/Controllers/Admin/ReportController.php:103
* @route '/admin/reports/bulk-review'
*/
bulkReviewForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: bulkReview.url(options),
    method: 'post',
})

bulkReview.form = bulkReviewForm

const ReportController = { index, review, bulkReview }

export default ReportController