<?php

namespace App\Nova;

use App\Enums\LocaleEnum;
use App\Enums\MindRuleEnum;
use App\Traits\NovaGeneralAuthorized;
use Illuminate\Http\Request;
use Laravel\Nova\Fields\BelongsToMany;
use Laravel\Nova\Fields\Boolean;
use Laravel\Nova\Fields\DateTime;
use Laravel\Nova\Fields\ID;
use Laravel\Nova\Fields\Markdown;
use Laravel\Nova\Fields\Number;
use Laravel\Nova\Fields\Select;
use Laravel\Nova\Fields\Text;
use Laravel\Nova\Http\Requests\NovaRequest;

class Mind extends Resource
{
    use NovaGeneralAuthorized;

    /**
     * The model the resource corresponds to.
     *
     * @var class-string<\App\Models\Mind>
     */
    public static $model = \App\Models\Mind::class;

    /**
     * The single value that should be used to represent the resource when being displayed.
     *
     * @var string
     */
    public static $title = 'id';

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

            Select::make('Locale')
                ->options(LocaleEnum::kvCases())
                ->rules('required')
                ->default(LocaleEnum::kDefault()),

            Text::make('Title')
                ->rules('required', 'max:191'),

            Number::make('Videos Count', function () {
                return $this->videos_count ?? 0;
            })->exceptOnForms(),

            Markdown::make('Content'),

            Select::make('Matching Rule')
                ->options(MindRuleEnum::kvCases())
                ->rules('required')
                ->default(MindRuleEnum::kDefault()),

            DateTime::make('Opened At'),

            DateTime::make('Closed At'),

            Boolean::make('Is Active')
                ->rules('required')
                ->filterable()
                ->default(true),

            BelongsToMany::make('Videos')
                ->searchable(),
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

    public static function detailQuery(NovaRequest $request, $query)
    {
        $query->withCount('videos');

        return parent::detailQuery($request, $query);
    }
}
