<div class="container">
    <div class="row">
        <form method="get">
        <div class="col-lg-6 col-lg-offset-3 col-xs-10 col-xs-offset-1 text-right">
            <div class="form-group">
                <input type="text" class="form-control" name="q" value="{{$q}}" placeholder="Search">
                <select class="form-control" name="channel_id">
                    <option value="">{{ __('All Channels') }}</option>
                    @foreach($partners as $partner)
                    <option value="{{ $partner->id }}" @if($partner->id == $channel_id)
                        selected
                        @endif
                        >{{ $partner->name }}</option>
                    @endforeach
                </select>
            </div>
            <button type="submit" class="btn btn-default">Filtering</button>
        </div>
        </form>
    </div>
</div>
