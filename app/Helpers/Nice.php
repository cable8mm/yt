<?php

function duration($duration)
{
    $hours = preg_match('/.+[0-9]+H.+/', $duration) ? preg_replace('/.+T([0-9]+)H.+/', '\\1', $duration).'시간 ' : '';
    $minutes = preg_match('/.+[0-9]+M.+/', $duration) ? preg_replace('/.+?([0-9]+)M.+/', '\\1', $duration).'분 ' : '';
    $seconds = preg_match('/.+[0-9]+S/', $duration) ? preg_replace('/.+?([0-9]+)S/', '\\1', $duration).'초' : '';

    return $hours.$minutes.$seconds;
}
