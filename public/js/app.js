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

    var vm = new Vue({
        //whatever div we want to target
        el: '#app',

        // Here we can register any values or collections that hold data
        // for the application
        data: {
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
            correctAnswer: '',
            response: ''
        },

        // Anything within the ready function will run when the application loads
        created: function() {
            this.reset();
        },

        // Methods we want to use in our application are registered here
        methods: {
            fetchRandomQuestion: function() {
                this.$http.get('/question').then((response) => {
                    this.$set(this, 'question', JSON.parse(response.body));
                    console.log(this.question.response);
                  }, (response) => {
                    console.log(response);
                  });
                //console.log(this.question);
            },
            answerQuestion: function(response) {
                var answer = replaceAllBackSlash(this.question.response.toUpperCase());
                //if (this.question.response.toUpperCase().match(response.toUpperCase()))
                if (answer === response.toUpperCase()
                        || (answer == 'a ' + response.toUpperCase()    //correct response
                        || answer == 'the ' + response.toUpperCase()))
                {
                    this.score += this.question.value;
                }
                else
                {
                    this.correctAnswer = this.question.response.replace("\\", "");    //don't want to display answer to next question
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

function replaceAllBackSlash(targetStr){
    var index=targetStr.indexOf("\\");
    while(index >= 0){
        targetStr=targetStr.replace("\\","");
        index=targetStr.indexOf("\\");
    }
    return targetStr;
}