<?php

namespace App\Nova;

use App\Traits\NovaGeneralAuthorized;
use Illuminate\Http\Request;
use Laravel\Nova\Fields\BelongsTo;
use Laravel\Nova\Fields\Boolean;
use Laravel\Nova\Fields\DateTime;
use Laravel\Nova\Fields\ID;
use Laravel\Nova\Fields\Text;
use Laravel\Nova\Fields\Textarea;
use Laravel\Nova\Fields\Trix;
use Laravel\Nova\Fields\URL;
use Laravel\Nova\Http\Requests\NovaRequest;

class Video extends Resource
{
    use NovaGeneralAuthorized;

    /**
     * The model the resource corresponds to.
     *
     * @var class-string<\App\Models\Video>
     */
    public static $model = \App\Models\Video::class;

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
        'title',
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

            Text::make('Title')
                ->rules('max:191'),

            Trix::make('Description')->alwaysShow(),

            URL::make('Thumbnail Url')
                ->rules('max:191')
                ->hideFromIndex(),

            URL::make('Medium Thumbnail Url')
                ->rules('max:191')
                ->hideFromIndex(),

            URL::make('Featured Image Url')
                ->rules('max:191')
                ->hideFromIndex(),

            Textarea::make('Embed Html'),

            Text::make('Tag')
                ->hideFromIndex(),

            Text::make('Duration'),

            Text::make('License'),

            Boolean::make('Has Caption'),

            Boolean::make('Is Live Broadcasting'),

            DateTime::make('Scheduled Start Time'),

            DateTime::make('Scheduled End Time'),

            DateTime::make('Published')
                ->rules('nullable')
                ->filterable(),

            Boolean::make('Is Active')
                ->filterable()
                ->default(false),

            Boolean::make('Is Podcast Active')
                ->filterable()
                ->default(false),
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
