<?php

/*
|--------------------------------------------------------------------------
| Application Routes
|--------------------------------------------------------------------------
|
| Here is where you can register all of the routes for an application.
| It's a breeze. Simply tell Laravel the URIs it should respond to
| and give it the controller to call when that URI is requested.
|
*/

Route::get('/', function () {
    return view('welcome');
});
Route::get('/question', [
    'uses' => 'QuestionController@getQuestion',
    'as' => 'question.get'
]);
Route::get('/categories/', [
    'uses' => 'QuestionController@getCategories',
    'as' => 'categories.get'
]);
Route::get('/categories/{id}', [
    'uses' => 'QuestionController@getCategory',
    'as' => 'category.get'
]);