<?php

namespace App\Services\ModAggregator;

use Inertia\ProvidesScrollMetadata;

class LiveSearchScrollMetadata implements ProvidesScrollMetadata
{
    /**
     * @param  array{current_page: int, has_more: bool}  $paginationInfo
     */
    public function __construct(
        protected array $paginationInfo
    ) {}

    public function getPageName(): string
    {
        return 'page';
    }

    public function getPreviousPage(): int|string|null
    {
        $currentPage = $this->paginationInfo['current_page'];

        return $currentPage > 1 ? $currentPage - 1 : null;
    }

    public function getNextPage(): int|string|null
    {
        if ($this->paginationInfo['has_more']) {
            return $this->paginationInfo['current_page'] + 1;
        }

        return null;
    }

    public function getCurrentPage(): int|string|null
    {
        return $this->paginationInfo['current_page'];
    }
}
