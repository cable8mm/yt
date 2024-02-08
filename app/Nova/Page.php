<?php

namespace App\Nova;

use App\Enums\LocaleEnum;
use Illuminate\Http\Request;
use Laravel\Nova\Fields\Boolean;
use Laravel\Nova\Fields\ID;
use Laravel\Nova\Fields\Markdown;
use Laravel\Nova\Fields\Select;
use Laravel\Nova\Fields\Slug;
use Laravel\Nova\Fields\Text;
use Laravel\Nova\Http\Requests\NovaRequest;

class Page extends Resource
{
    /**
     * The model the resource corresponds to.
     *
     * @var class-string<\App\Models\Page>
     */
    public static $model = \App\Models\Page::class;

    public static $globallySearchable = false;

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
        'slug',
        'content',
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

            Select::make('Locale')
                ->sortable()
                ->options(LocaleEnum::kvCases())
                ->rules('required')
                ->default(LocaleEnum::kDefault())
                ->displayUsingLabels()
                ->filterable(),

            Text::make('Title')
                ->rules('required', 'max:191'),

            Slug::make('Slug')
                ->sortable()
                ->rules('required')
                ->from('Title')
                ->help('It can use as URL. For example, if you would input the path of "/help-me", "/pages/help-me" is visited.'),

            Markdown::make('Content')
                ->rules('required'),

            Boolean::make('Cansee In Menu')
                ->rules('required')
                ->default(true),

            Boolean::make('Is Active')
                ->rules('required')
                ->default(true),
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
