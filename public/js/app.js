/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */



$(document).ready(function() {
    
    Vue.component('modal', {
        props: ['message'],
        template: '#modal-template'
    })

    Vue.component('question-container', {
        props: ['question'],
        template: '#question-container'
    })
    
    Vue.component('loading', {
        template: '#loading-modal'
    })



    var vm = new Vue({
        //whatever div we want to target
        el: '#app',

        // Here we can register any values or collections that hold data
        // for the application
        data: {
            steps: [
                'select categories',
                'answer questions'
            ],
            question: {
                body: '',
                response: '',
                category: {
                    name: ''
                }
            },
            score: 0,
            passes: 3,
            showModal: false,
            loading: true,
            correctAnswer: '',
            response: ''
        },

        // Anything within the ready function will run when the application loads
        created: function() {
            this.fetchRandomQuestion();
        },

        // Methods we want to use in our application are registered here
        methods: {
            fetchRandomQuestion: function() {
                this.loading = true;
                this.question.body = 'Loading...';
                this.$http.get('/question').then((response) => {
                    this.$set(this, 'question', JSON.parse(response.body));
                    console.log(this.question.body);
                  }, (response) => {
                    console.log(response);
                  });
                this.loading = false;
                //console.log(this.question);
            },
            answerQuestion: function(response) {
                //if (this.question.response.toUpperCase().match(response.toUpperCase()))
                if (this.question.response.toUpperCase() === response.toUpperCase()
                        || (this.question.response.toUpperCase() === 'a ' + response.toUpperCase()    //correct response
                        || this.question.response.toUpperCase() === 'the ' + response.toUpperCase()))
                {
                    this.score += this.question.value;
                }
                else
                {
                    this.correctAnswer = this.question.response;    //don't want to display answer to next question
                    this.showModal = true;
                    this.score -= this.question.value;
                }
                this.reset();
            },
            pass: function() {
                if (this.passes > 0) //make sure they can actually pass on a question
                {
                    this.passes--;
                    this.reset();
                }
            },
            reset: function() {
                this.$data.response = '';
                this.fetchRandomQuestion();
            }
        }

    });
});

