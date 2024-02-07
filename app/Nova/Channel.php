<?php

namespace App\Nova;

use App\Enums\StatusEnum;
use App\Nova\Actions\AddYoutubeChannelVideos;
use App\Nova\Actions\FilledYoutubeChannel;
use App\Nova\Metrics\ImportExcels;
use App\Traits\NovaGeneralAuthorized;
use Illuminate\Http\Request;
use Laravel\Nova\Fields\Boolean;
use Laravel\Nova\Fields\DateTime;
use Laravel\Nova\Fields\HasMany;
use Laravel\Nova\Fields\ID;
use Laravel\Nova\Fields\Status;
use Laravel\Nova\Fields\Text;
use Laravel\Nova\Fields\Textarea;
use Laravel\Nova\Fields\URL;
use Laravel\Nova\Http\Requests\NovaRequest;
use Laravel\Nova\Notifications\NovaNotification;

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

            URL::make('Featured Video Url')
                ->rules('required', 'max:191')
                ->help('eg. https://www.youtube.com/watch?v=djV11Xbc914'),

            Text::make('Channelid')
                ->rules('max:190')
                ->help('Auto filled after running the action.')
                ->hideWhenCreating(),

            URL::make('Url')
                ->rules('max:191')
                ->hideWhenCreating()
                ->help('eg. https://www.youtube.com/@estellenglish'),

            Text::make('Name')
                ->help('Auto filled after running the action.')
                ->hideWhenCreating(),

            Textarea::make('Description')
                ->help('Auto filled after running the action.')
                ->hideWhenCreating(),

            URL::make('Thumbnail Url')
                ->rules('max:191')
                ->help('Auto filled after running the action.')
                ->hideFromIndex()
                ->hideWhenCreating(),

            URL::make('Medium Thumbnail Url')
                ->rules('max:191')
                ->help('Auto filled after running the action.')
                ->hideFromIndex()
                ->hideWhenCreating(),

            URL::make('Featured Image Url')
                ->rules('max:191')
                ->help('Auto filled after running the action.')
                ->hideFromIndex()
                ->hideWhenCreating(),

            Status::make('Status')
                ->loadingWhen(StatusEnum::loadingWhen())
                ->failedWhen(StatusEnum::failedWhen()),

            DateTime::make('Youtube Published After At')
                ->help('Auto filled after running the action.')
                ->exceptOnForms(),

            DateTime::make('Youtube Published Before At')
                ->help('If it is set, it will be crawling all videos automatically in the past.'),

            Boolean::make('Is Active')
                ->rules('required')
                ->hideWhenCreating(),

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
        return [
            ImportExcels::make(),
        ];
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
            (new FilledYoutubeChannel)->then(function ($models) use ($request) {
                $models->each(function ($model) use ($request) {
                    $request->user()->notify(
                        NovaNotification::make()
                            ->message($model->name.' channel'.' filled.')
                            ->type('info')
                    );
                });
            }),
            (new AddYoutubeChannelVideos)->then(function ($models) use ($request) {
                $models->each(function ($model) use ($request) {
                    $request->user()->notify(
                        NovaNotification::make()
                            ->message($model->name.' channel videos'.' filled.')
                            ->type('info')
                    );
                });
            }),
        ];
    }
}
