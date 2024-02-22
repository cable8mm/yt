<?php

namespace App\Nova;

use App\Enums\StatusEnum;
use App\Nova\Actions\ActiveSwitchAction;
use App\Nova\Actions\AddYoutubeChannelVideos;
use App\Nova\Actions\FilledYoutubeChannel;
use App\Nova\Metrics\ImportExcels;
use App\Traits\NovaGeneralAuthorized;
use Chaseconey\ExternalImage\ExternalImage;
use Illuminate\Http\Request;
use Laravel\Nova\Fields\Boolean;
use Laravel\Nova\Fields\HasMany;
use Laravel\Nova\Fields\ID;
use Laravel\Nova\Fields\Number;
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
                ->help('eg. https://www.youtube.com/watch?v=djV11Xbc914')
                ->hideFromIndex(),

            Text::make('Channelid')
                ->rules('max:190')
                ->help('Auto filled after running the action.')
                ->hideWhenCreating()
                ->hideFromIndex(),

            URL::make('Url')
                ->rules('max:191')
                ->hideWhenCreating()
                ->help('eg. https://www.youtube.com/@estellenglish'),

            Text::make('Subscribers', function () {
                $channelid = $this->channelid;

                return '<img class="mt-2" alt="YouTube Channel Subscribers"
                    src="https://img.shields.io/youtube/channel/subscribers/'.$channelid.'">';
            })->asHtml(),

            Text::make('Name')
                ->help('Auto filled after running the action.')
                ->hideWhenCreating(),

            ExternalImage::make('Thumbnail Url')
                ->rules('max:191')
                ->help('Auto filled after running the action.')
                ->hideWhenCreating()
                ->radius(8)
                ->width(48)
                ->height(48),

            Number::make('Videos Count', function () {
                return $this->videos_count ?? 0;
            })->exceptOnForms(),

            Textarea::make('Description')
                ->help('Auto filled after running the action.')
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
                ->failedWhen(StatusEnum::failedWhen())
                ->filterable(function ($request, $query, $value, $attribute) {
                    $query->where($attribute, "{$value}%");
                }),

            Text::make('Prev Page Token')
                ->help('If it is set, it will be crawling all videos automatically in the past.')
                ->exceptOnForms(),

            Boolean::make('Is Past Crawling Done')
                ->rules('required')
                ->hideWhenCreating()
                ->exceptOnForms()
                ->filterable(),

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
            (new ActiveSwitchAction)->showInline(),
        ];
    }

    public static function indexQuery(NovaRequest $request, $query)
    {
        // Give relationship name as alias else Laravel will name it as comments_count
        return $query->withCount('videos');
    }

    public static function detailQuery(NovaRequest $request, $query)
    {
        $query->withCount('videos');

        return parent::detailQuery($request, $query);
    }
}
