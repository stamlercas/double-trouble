<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;

class QuestionController extends Controller
{
    protected $api_url = 'http://www.trivialbuzz.com/api/v1/';
    
    function getQuestion()
    {
        $json = json_decode(file_get_contents($this->api_url . 'questions/random.json'));
        return json_encode($json->question);
    }
}
