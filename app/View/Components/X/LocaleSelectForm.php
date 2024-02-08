<?php

namespace App\View\Components\X;

use App\Enums\LocaleEnum;
use Closure;
use Illuminate\Contracts\View\View;
use Illuminate\View\Component;

class LocaleSelectForm extends Component
{
    private array $options;

    private $name;

    private $value;

    /**
     * Create a new component instance.
     */
    public function __construct()
    {
        $this->options = LocaleEnum::kvCases();
    }

    /**
     * Get the view / contents that represent the component.
     */
    public function render(): View|Closure|string
    {
        return view('components.x.locale-select-form', [
            'options' => $this->options,
            'name' => $this->name,
            'value' => $this->value,
        ]);
    }
}
