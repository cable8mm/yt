<?php

namespace App\Nova;

use App\Traits\NovaGeneralAuthorized;
use Illuminate\Http\Request;
use Laravel\Nova\Fields\BelongsTo;
use Laravel\Nova\Fields\Boolean;
use Laravel\Nova\Fields\DateTime;
use Laravel\Nova\Fields\HasMany;
use Laravel\Nova\Fields\ID;
use Laravel\Nova\Fields\Text;
use Laravel\Nova\Fields\Trix;
use Laravel\Nova\Fields\URL;
use Laravel\Nova\Http\Requests\NovaRequest;

class Channel extends Resource
{
    use NovaGeneralAuthorized;

    /**
     * The model the resource corresponds to.
     *
     * @var class-string<\App\Models\Channel>
     */
    public static $model = \App\Models\Channel::class;

    /**
     * The single value that should be used to represent the resource when being displayed.
     *
     * @var string
     */
    public static $title = 'name';

    /**
     * The columns that should be searched.
     *
     * @var array
     */
    public static $search = [
        'id',
        'name',
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

            BelongsTo::make('Service'),

            Text::make('Channelid'),

            Text::make('Name'),

            Trix::make('Description'),

            URL::make('Url')
                ->rules('max:191')
                ->hideFromIndex(),

            URL::make('Thumbnail Url')
                ->rules('max:191')
                ->hideFromIndex(),

            URL::make('Medium Thumbnail Url')
                ->rules('max:191')
                ->hideFromIndex(),

            URL::make('Featured Image Url')
                ->rules('max:191')
                ->hideFromIndex(),

            DateTime::make('Last Updated'),

            Boolean::make('Is Auto Active'),

            Boolean::make('Is Active'),

            HasMany::make('Videos'),
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
