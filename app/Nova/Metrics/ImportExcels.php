<?php

namespace App\Nova\Metrics;

use Laravel\Nova\Http\Requests\NovaRequest;
use Laravel\Nova\Menu\MenuItem;
use Laravel\Nova\Metrics\MetricTableRow;
use Laravel\Nova\Metrics\Table;

class ImportExcels extends Table
{
    /**
     * Calculate the value of the metric.
     *
     * @return mixed
     */
    public function calculate(NovaRequest $request)
    {
        return [
            MetricTableRow::make()
                ->icon('check-circle')
                ->iconClass('text-green-500')
                ->title('Import Excel Template for Channel')
                ->subtitle('only channel id needed')
                ->actions(function () {
                    return [
                        MenuItem::externalLink('Channels Excel For Importing', '/assets/channels_excel_for_importing.xlsx'),
                    ];
                }),

            MetricTableRow::make()
                ->icon('check-circle')
                ->iconClass('text-green-500')
                ->title('Import Excel Template for any Channel Video')
                ->subtitle('only video url needed for searching channel id')
                ->actions(function () {
                    return [
                        MenuItem::externalLink('Channel Videls Excel For Importing', '/assets/channel_videos_excel_for_importing.xlsx'),
                    ];
                }),
        ];
    }

    /**
     * Determine the amount of time the results of the metric should be cached.
     *
     * @return \DateTimeInterface|\DateInterval|float|int|null
     */
    public function cacheFor()
    {
        // return now()->addMinutes(5);
    }
}
