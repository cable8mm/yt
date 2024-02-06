<?php

namespace App\Nova\Actions;

use App\Enums\StatusEnum;
use App\Imports\ChannelImport;
use Exception;
use Illuminate\Bus\Queueable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Support\Collection;
use Laravel\Nova\Actions\Action;
use Laravel\Nova\Fields\ActionFields;
use Laravel\Nova\Http\Requests\NovaRequest;
use Maatwebsite\Excel\Facades\Excel;

class ImportChannelExcelAction extends Action
{
    use InteractsWithQueue, Queueable;

    /**
     * Perform the action on the given models.
     *
     * @return mixed
     */
    public function handle(ActionFields $fields, Collection $models)
    {
        foreach ($models as $model) {
            try {
                Excel::import(new ChannelImport(), $model->attachment, config('yt.storage'));

                $model->status = StatusEnum::finished();
                $model->save();
            } catch (Exception $e) {
                $model->status = StatusEnum::failed();
                $model->save();

                return Action::danger('It failed '.$e->getMessage());
            }
        }

        return $models;
    }

    /**
     * Get the fields available on the action.
     *
     * @return array
     */
    public function fields(NovaRequest $request)
    {
        return [];
    }

    public function name()
    {
        return __('Upload channel excel');
    }
}
