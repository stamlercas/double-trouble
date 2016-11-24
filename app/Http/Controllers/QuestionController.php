<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;

class QuestionController extends Controller
{
    protected $api_url = 'http://www.trivialbuzz.com/api/v1/';
    
    function getCategories()
    {
        $number = 100;   // number of categories to retrieve and return
        $categories = array();
        $pages = $number / 10;  // paginated in 10s
        if ($number % 10 != 0)  // grab the remainder if the number of categories is not divisible by 10
        {
            $pages++;
        }
        // grab categories
        for ($i = 1; $i <= $pages; $i++) {
                $json = json_decode(file_get_contents($this->api_url . 'categories.json?popular=' . $number . '&page=' . $i));
                for ($j = 0; $j < count($json->categories); $j++)   // needs to grab individual elements, or it returns array of arrays
                {
                    array_push($categories, $json->categories[$j]);  // adding categories to list
                }
                
        }
        return json_encode($categories);
    }
    
    function getCategory($id)
    {
        $json = json_decode(file_get_contents($this->api_url . "categories/" . $id . ".json"));
        return json_encode($json);
    }

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
