<?php

namespace App\Nova;

use App\Traits\NovaGeneralAuthorized;
use App\Traits\NovaOutOfControlAuthorized;
use Illuminate\Http\Request;
use Laravel\Nova\Fields\BelongsTo;
use Laravel\Nova\Fields\Boolean;
use Laravel\Nova\Fields\DateTime;
use Laravel\Nova\Fields\ID;
use Laravel\Nova\Fields\Text;
use Laravel\Nova\Fields\Textarea;
use Laravel\Nova\Fields\Trix;
use Laravel\Nova\Http\Requests\NovaRequest;

class LiveVideo extends Resource
{
    use NovaGeneralAuthorized;
    use NovaOutOfControlAuthorized;

    /**
     * The model the resource corresponds to.
     *
     * @var class-string<\App\Models\LiveVideo>
     */
    public static $model = \App\Models\LiveVideo::class;

    /**
     * The single value that should be used to represent the resource when being displayed.
     *
     * @var string
     */
    public static $title = 'title';

    /**
     * The columns that should be searched.
     *
     * @var array
     */
    public static $search = [
        'id',
    ];

    /**
     * Get the fields displayed by the resource.
     *
     * @return array
     */
    public function fields(NovaRequest $request)
    {
        return [
            ID::make()->sortable(),

            BelongsTo::make('Channel'),

            Text::make('Videoid'),

            Text::make('Title'),

            Trix::make('Description')->alwaysShow(),

            Text::make('Thumbnail Url'),

            Text::make('Medium Thumbnail Url'),

            Text::make('Featured Image Url'),

            Textarea::make('Embed Html'),

            Text::make('Tag'),

            Text::make('Duration'),

            Text::make('License'),

            Boolean::make('Has Caption'),

            Boolean::make('Is Live Broadcasting'),

            DateTime::make('Scheduled Start Time'),

            DateTime::make('Scheduled End Time'),

            DateTime::make('Published At'),

            Boolean::make('Is Active'),

            Boolean::make('Is Podcast Active'),
        ];
    }

    /**
     * Get the cards available for the request.
     *
     * @return array
     */
    public function cards(NovaRequest $request)
    {
        return [];
    }

    /**
     * Get the filters available for the resource.
     *
     * @return array
     */
    public function filters(NovaRequest $request)
    {
        return [];
    }

    /**
     * Get the lenses available for the resource.
     *
     * @return array
     */
    public function lenses(NovaRequest $request)
    {
        return [];
    }

    /**
     * Get the actions available for the resource.
     *
     * @return array
     */
    public function actions(NovaRequest $request)
    {
        return [];
    }
}
