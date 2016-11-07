<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;

class QuestionController extends Controller
{
    protected $api_url = 'http://www.trivialbuzz.com/api/v1/';
    
    function getQuestion()
    {
        //I'm not yet sure how to get vue to display html elements, so I filter out all questions that require html
        //Also filter out all repsonses that have more than one response
        do {
            $json = json_decode(file_get_contents($this->api_url . 'questions/random.json'));
        } while (strpos($json->question->body, '<') || strpos($json->question->response, '(') || strpos($json->question->response, '/'));

        return json_encode($json->question);
    }
}
