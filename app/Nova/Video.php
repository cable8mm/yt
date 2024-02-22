<?php

namespace App\Nova;

use App\Nova\Actions\ActiveSwitchAction;
use App\Traits\NovaGeneralAuthorized;
use App\Traits\NovaOutOfControlAuthorized;
use Chaseconey\ExternalImage\ExternalImage;
use Illuminate\Http\Request;
use Laravel\Nova\Fields\BelongsTo;
use Laravel\Nova\Fields\BelongsToMany;
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
    use NovaOutOfControlAuthorized;

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
        'videoid',
        'channel.name',
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

            BelongsTo::make('Channel')->filterable(),

            Text::make('Videoid'),

            ExternalImage::make('Thumbnail Url')
                ->rules('max:191')
                ->radius(4)
                ->width(128),

            Text::make('Title')
                ->rules('max:191'),

            Trix::make('Description')->alwaysShow(),

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

            Text::make('License')
                ->hideFromIndex(),

            Boolean::make('Has Caption')
                ->hideFromIndex(),

            DateTime::make('Published At')
                ->rules('nullable')
                ->filterable(),

            Boolean::make('Is Active')
                ->filterable()
                ->default(false),

            BelongsToMany::make('Minds'),
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
        return [
            (new ActiveSwitchAction)->showInline(),
        ];
    }
}
