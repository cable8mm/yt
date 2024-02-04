<footer class="main-footer">
    <div id="footer">
        <div class="container">
            <div class="row">
                <div class="col col-xs-12 col-sm-4 col-md-3 col-lg-3 hidden-phone">
                    <h4 id="footer-logo">Open Curation</h4>
                </div>
                <div class="col col-xs-12 col-sm-8 col-md-3 col-lg-3" style="padding-top:10px">
                    <h3>Open Curation / YT</h3>
                    <p>What are you think about us?</p>
                    <ul>
                        <li style="display:list-item">{{ __('Curation Channels') }} {{count($partners)}}</li>
                        <li style="display:list-item">{{ __('Videos') }} {{number_format($videoCount)}}</li>
                    </ul>
                </div>
                <x-layout.footer.partner-channels :partners="$partners"/>
            </div>
        </div>
    </div>
    <div id="copyright">
        &copy; {{ date('Y') }} made by samgu.lee ❤️ Laravel
    </div>
</footer>
