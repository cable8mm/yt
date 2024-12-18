<?php

namespace App\Nova;

use App\Enums\ImportFileEnum;
use App\Nova\Actions\ImportChannelExcelAction;
use App\Nova\Actions\ImportVideoChannelExcelAction;
use App\Traits\NovaGeneralAuthorized;
use Illuminate\Http\Request;
use Laravel\Nova\Fields\DateTime;
use Laravel\Nova\Fields\File;
use Laravel\Nova\Fields\ID;
use Laravel\Nova\Fields\Select;
use Laravel\Nova\Fields\Status;
use Laravel\Nova\Fields\Text;
use Laravel\Nova\Http\Requests\NovaRequest;

class ImportFile extends Resource
{
    use NovaGeneralAuthorized;

    /**
     * The model the resource corresponds to.
     *
     * @var class-string<\App\Models\ImportFile>
     */
    public static $model = \App\Models\ImportFile::class;

    /**
     * The single value that should be used to represent the resource when being displayed.
     *
     * @var string
     */
    public static $title = 'attachment_name';

    /**
     * The columns that should be searched.
     *
     * @var array
     */
    public static $search = [
        'memo',
        'attachment_name',
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

            Select::make('Type')->options(ImportFileEnum::kvCases())
                ->rules('required')
                ->default(ImportFileEnum::kDefault())
                ->filterable()
                ->displayUsingLabels()
                ->help('Select upload file type between '.implode('and ', ImportFileEnum::vCases())),

            Text::make('Memo')
                ->rules('required', 'max:191')
                ->help('Comment short sentence about upload file.'),

            File::make('Attachment')
                ->creationRules('required', 'file', 'mimes:xlsx,xls,csv')
                ->updateRules('nullable', 'file', 'mimes:xlsx,xls,csv')
                ->help('Upload file. (xlsx, xls, csv)')
                ->disk(config('yt.storage'))
                ->path('nova/import_file')
                ->storeOriginalName('attachment_name')
                ->storeSize('attachment_size')
                ->prunable(),

            Text::make('Attachment Name')
                ->exceptOnForms(),

            Text::make('Attachment Size')
                ->exceptOnForms()
                ->displayUsing(function ($value) {
                    return $value ? number_format($value / 1024, 2).'kb' : '-';
                }),

            Status::make('Status')
                ->loadingWhen(['waiting', 'running'])
                ->failedWhen(['failed']),

            DateTime::make('Created At')
                ->onlyOnIndex(),
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
            (new ImportChannelExcelAction)->showInline(),
            (new ImportVideoChannelExcelAction)->showInline(),
        ];
    }
}
