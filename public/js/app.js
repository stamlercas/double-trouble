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

    /* maybe later
    Vue.component('question-container', {
        props: ['question'],
        template: '#question-container'
    })
    */

    Vue.component('category-item', {
        props: ['category', 'active'],
        template: '#category-item',
        computed: {
            isActive: function() {
                return active ? true : false;
            }
        }
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
            categories: [],     // contains the categories
            questions: {},      // this will have arrays of questions for each category
            score: 0,
            passes: 3,
            showModal: false,
            loading: true,
            correctAnswer: '',
            response: '',
            numCategories: 5,   // number of categories in game
            numQuestions: 5,    // number of questions in each category
            currentQuestion: 0  // to keep track of how many questions the user has answered
        },

        // Anything within the ready function will run when the application loads
        created: function() {
            this.fetchCategories();
        },

        // Methods we want to use in our application are registered here
        methods: {
            fetchCategories: function() {
                this.question.body = 'Fetching Categories...';
                var categories;
                this.$http.get('/categories').then((response) => {
                    categories = JSON.parse(response.body); // placing the categories into the array
                    console.log("Number of categories: " + categories.length);
                    var numCategories = 5;      // number of categories
                    var numQuestions = 5;       // number of questions in each category

                    this.question.body = "Selecting Categories...";
                    var temp = [];   // this will be where categories questions are pushed to
                    for (var i = 0; i < numCategories; i++)
                    {
                        categoryFlag = false;   // will be raised if the category is found in the temp variable
                        do {
                            var index = Math.floor(Math.random() * ( (categories.length - 1) - (0) ));
                            console.log("Category id picked: " + index);
                            temp[i] = categories[index];
                            for (var j = 0; j < i; j++)
                            {
                                // if the two array indexes are found to have the same id, raise the flag and pick a different category
                                if (temp[j].id == temp[i].id && i != j)
                                    categoryFlag = true;
                                else
                                    categoryFlag = false;
                            }
                        } while(categoryFlag);  // keep repeating while the flag is raised
                    }
                    // after the categorys are picked from the object, push them onto the categories array in app 
                    for (var i = 0; i < temp.length; i++)
                    {
                        console.log(temp[i]);
                    }
                    this.categories = temp;
                  }, (response) => {
                    console.log(response);

                // chaining promises together
                /*
                  }).then( function() {
                    // now time to create an array of questions for each category
                    for (var i = 0; i < this.categories.length; i++)
                    {
                        for (var j = 0; j < this.numQuestions; j++)
                        {
                            this.$http.get('/categories/' + this.categories[i].id).then((response) => {
                                body = JSON.parse(response.body);
                                console.log(body);
                                // grabbing a random question from the category
                                this.categories[i].questions[j] = body.category.question[Math.floor(Math.random() * ( (body.category.questions.length - 1) - (0 + 1)))];
                            }, (response) => {
                                console.log(response);
                            });
                        }
                    }
                */
                // last promise... start the game!!
                  }).then( function() {
                    this.getQuestion();
                  });
            },
            fetchRandomQuestion: function() {
                this.loading = true;
                this.question.body = 'Loading...';
                this.$http.get('/question').then((response) => {
                    this.$set(this, 'question', JSON.parse(response.body));
                    console.log(this.question.body);
                    this.loading = false;   // put in promise, since it is async
                  }, (response) => {
                    console.log(response);
                  });
                //console.log(this.question);
            },
            getQuestion: function() {
                this.loading = true;
                this.question.body = 'Loading...';
                var i = parseInt(this.currentQuestion / this.numCategories);
                this.$http.get('/categories/' + this.categories[i].id).then((response) => {
                        body = JSON.parse(response.body);
                        // grabbing a random question from the category
                        // in order of indeces
                        var jeopardyValues = [200, 400, 600, 800, 1000];
                        
                        // keep looping until it finds a suitable match
                        var foundMatch = false;
                        var index = 0;  // should probably keep track of index, so as to not get stuck in infinite loop
                        do {
                            // grab random question
                            var question = body.category.questions[Math.floor(Math.random() * ( (body.category.questions.length - 1) - (0 + 1)))];
                            // check whether the question matches the values specified
                            var questionInCategory = this.currentQuestion % this.numQuestions;
                            //console.log([jeopardyValues[questionInCategory], jeopardyValues[questionInCategory] * 2]);
                            foundMatch = matchesQuestionValue(question, [jeopardyValues[questionInCategory], jeopardyValues[questionInCategory] * 2]);
                            if (question.body.search('<') != -1)   // if question contains HTML, search for new question
                                foundMatch = false;
                            index++; //
                        }   while(!foundMatch || index < this.categories[i].questions_count);
                        // once it finds suitable question, set it in app and strip slashes
                        question.body = question.body.substring(1, question.body.length - 1);
                        this.$set(this, 'question', question );

                        this.categories[i].already_used = true;     // do not want to repeat the same question twice
                        this.question.category = this.categories[i];
                        this.loading = false;
                        console.log("The answer is: " + this.question.response);
                    }, (response) => {
                        console.log(response);
                });
            },
            answerQuestion: function(response) {
                var answer = replaceAllBackSlash(this.question.response.toUpperCase());
                var response = response.toUpperCase();      // both of these are put into upper case to make them case insensitive
                //if (this.question.response.toUpperCase().match(response.toUpperCase()))
                var answerAdditives = [
                    '',
                    'A ',
                    'THE ',
                    'SIR '
                ];
                var correct = false;
                for (var i = 0; i < answerAdditives.length; i++)
                    if (answer === answerAdditives[i] + response)
                    {
                        correct = true;
                        break;
                    }
                // check to see whether the response matches the correct answer before paranthesis
                if (answer.indexOf(" (") != -1)
                    if (answer.substring(0, answer.indexOf(" (")) == response)
                        correct = true;
                // or after parenthesis
                if (answer.indexOf(") ") != -1)
                    if (answer.substring(") ", answer.length) == response)
                        correct = true;
                // if an answer has 2 answers seperated with an &
                if (answer.indexOf(" & ") != -1)
                    if ( answer.substring(0, answer.indexOf(" &")) === response ||
                            answer.substring( answer.indexOf("& ") + 2, answer.length) === response)
                        correct = true;
                if (answer.indexOf('"') == 0)   //if the answer is within quotation marks, ex: "Mourning Becomes Electra" will match Mourning Becomes Electra
                    if (answer.substring(1, answer.length - 1) === response)
                        correct = true;
                if (answer.indexOf('(') == 0)   // if the answer starts with a parenthesis, ex: (Samuel) Morse
                    if (answer.substring(1, answer.indexOf(")") + answer.substring(")" + 1, answer.length)) === response ||
                        answer.substring(answer.indexOf(")" + 1, answer.length)) === response)
                        correct = true;
                if (correct)
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
            finish: function() {
                this.question.body = "Congratulations! You finished with a score of " + this.score + "!";
            },
            pass: function() {
                if (this.passes > 0) //make sure they can actually pass on a question
                {
                    this.passes--;
                    this.reset();
                }
            },
            reset: function() {
                this.currentQuestion++;
                this.$data.response = '';
                if (this.currentQuestion >= this.numCategories * this.numQuestions)
                    this.finish();
                else
                    this.getQuestion();
            }
        },
        computed: {
            finished: function() {
                return this.currentQuestion >= this.numCategories * this.numQuestions;
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

/*
* checks whether a questions value mathces the values given
*/
function matchesQuestionValue(question, values)
{
    for (var i = 0; i < values.length; i++)
    {
        if (question.value == values[i])
            return true;
    }
    return false;
}