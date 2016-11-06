<!DOCTYPE html>
<html>
    <head>
        <title>Double-Trouble</title>
        
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <meta name="theme-color" content="#1f1b1d" />
        
        <link href="https://fonts.googleapis.com/css?family=Lato:100" rel="stylesheet" type="text/css">
        <link href="{{ asset('css/app.css') }}" rel="stylesheet">
        
        <script src="{{ asset('js/jquery-2.1.3.js') }}"></script>
        <script src="{{ asset('js/bootstrap.min.js') }}"></script>
        
        <script src="{{ asset('js/vue.js') }}"></script>
        <script src="{{ asset('js/vue-resource.js') }}"></script>
        <script src="{{ asset('js/app.js') }}"></script>
        
    </head>
    <body>
        <div id="app">
            <header>
                <nav class="navbar navbar-default navbar-static-top" id="navbar">
                    <div class="container">
                      <div class="navbar-header">
                          <!--
                        <button type="button" class="navbar-toggle collapsed" data-toggle="collapse" data-target="#navbar" aria-expanded="false" aria-controls="navbar">
                          <span class="sr-only">Toggle navigation</span>
                          <span class="icon-bar"></span>
                          <span class="icon-bar"></span>
                          <span class="icon-bar"></span>
                        </button>
                          -->
                          <a class="navbar-brand header" href="#">Double Trouble</a>
                      </div>
                        <ul id='navbar-right' class="nav navbar-nav navbar-right">
                            <li><a>Passes: @{{ passes }}</a></li>
                            <li><a>Score: @{{ score }}</a></li>
                        </ul>
                        <div id="navbar" class="navbar-collapse collapse">
                        
                      </div><!--/.nav-collapse -->
                    </div>
                </nav>      
            </header>
            <div class="container main-content" id="question">
                <div class="row">
                    <div class="col-md-6 col-md-offset-3">
                        <div class="category">
                            Category: @{{ question.category.name }}
                        </div>
                        <div class="question" id="body">
                            @{{question.body}}
                        </div>
                        <div class="answer-form" id="answer-form">
                            <!--
                            <span class="input-group-addon" id="basic-addon1">Answer:</span>
                            -->
                            <input type="text" class="form-control" placeholder="Answer"
                                   id='response'
                                   v-model="response"
                                   v-on:keyup.13="answerQuestion(response)"
                                   autofocus>
                        </div>
                        <div class='btn-container'>
                            <div class='row'>
                                <div class="form-group col-sm-6 hidden-sm hidden-md hidden-lg">
                                <button class="form-control btn" v-on:click='pass()'>Submit Answer</button>
                                </div>
                                <div class="form-group col-sm-6">
                                    <button class="form-control btn" v-on:click='pass()'>Pass</button>
                                </div>
                                <div class="form-group col-sm-6">
                                    <button class="form-control btn" v-on:click='answerQuestion("")'>I don't know</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <loading v-if='loading'></loading>
            <!-- use the modal component, pass in the prop -->
            <modal v-if="showModal" @close="showModal = false">
              <!--
                you can use custom content here to overwrite
                default content
              -->
              <div slot='body'>I'm sorry, the correct was @{{correctAnswer}}.</div>
            </modal>
        </div>
            <script type="text/x-template" id="modal-template">
                transition name="modal">
                  <div class="modal-mask">
                    <div class="modal-wrapper">
                      <div class="modal-container">

                        <div class="modal-header">
                          <slot name="header">
                          </slot>
                        </div><transition name="modal">
                  <div class="modal-mask">
                    <div class="modal-wrapper">
                      <div class="modal-container">

                        <div class="modal-header">
                          <slot name="header">
                          </slot>
                        </div>

                        <div class="modal-body">
                          <slot name="body">
                            default body
                          </slot>
                        </div>

                        <div class="modal-footer">
                          <slot name="footer">
                            <button class="modal-default-button form-control btn" @click="$emit('close')">
                              OK
                            </button>
                          </slot>
                        </div>
                      </div>
                    </div>
                  </div>
                </transition>
            </script>
            <script type="text/x-template" id="loading-modal">
                    <div class='loader-container'>
                        <svg class="loader">
                          <filter id="blur">
                            <fegaussianblur in="SourceGraphic" stddeviation="2"></fegaussianblur>
                          </filter>
                          <circle cx="75" cy="75" r="60" fill="transparent" stroke="#F4F519" stroke-width="6" stroke-linecap="round" stroke-dasharray="385" stroke-dashoffset="385" filter="url(#blur)"></circle>
                        </svg>
                        <svg class="loader loader-2">
                          <circle cx="75" cy="75" r="60" fill="transparent" stroke="#DE2FFF" stroke-width="6" stroke-linecap="round" stroke-dasharray="385" stroke-dashoffset="385" filter="url(#blur)"></circle>
                        </svg>
                        <svg class="loader loader-3">
                          <circle cx="75" cy="75" r="60" fill="transparent" stroke="#FF5932" stroke-width="6" stroke-linecap="round" stroke-dasharray="385" stroke-dashoffset="385" filter="url(#blur)"></circle>
                        </svg>
                        <svg class="loader loader-4">
                          <circle cx="75" cy="75" r="60" fill="transparent" stroke="#E97E42" stroke-width="6" stroke-linecap="round" stroke-dasharray="385" stroke-dashoffset="385" filter="url(#blur)"></circle>
                        </svg>
                        <svg class="loader loader-5">
                          <circle cx="75" cy="75" r="60" fill="transparent" stroke="white" stroke-width="6" stroke-linecap="round" filter="url(#blur)"></circle>
                        </svg>
                        <svg class="loader loader-6">
                          <circle cx="75" cy="75" r="60" fill="transparent" stroke="#00DCA3" stroke-width="6" stroke-linecap="round" stroke-dasharray="385" stroke-dashoffset="385" filter="url(#blur)"></circle>
                        </svg>
                        <svg class="loader loader-7">
                          <circle cx="75" cy="75" r="60" fill="transparent" stroke="purple" stroke-width="6" stroke-linecap="round" stroke-dasharray="385" stroke-dashoffset="385" filter="url(#blur)"></circle>
                        </svg>
                        <svg class="loader loader-8">
                          <circle cx="75" cy="75" r="60" fill="transparent" stroke="#AAEA33" stroke-width="6" stroke-linecap="round" stroke-dasharray="385" stroke-dashoffset="385" filter="url(#blur)"></circle>
                        </svg>
                    </div>
            </script>

    </body>
</html>
