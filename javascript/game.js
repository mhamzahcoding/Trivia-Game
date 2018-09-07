$(document).ready(function(){
  
    // event listeners
    $("#remaining-time").hide();
    $("#start").on('click', trivia.startGame);
    $(document).on('click' , '.option', trivia.guessChecker);
    
  })
  
  var trivia = {
    // trivia properties
    correct: 0,
    incorrect: 0,
    unanswered: 0,
    currentSet: 0,
    timer: 20,
    timerOn: false,
    timerId : '',
    // questions options and answers data
    questions: {
      q1: "Cricket is about hitting a ball with a bat. What material is the bat made of?",
      q2: "What is a cricket ball made of?",
      q3: "What is the name given to the person trying to hit the ball?",
      q4: "What is the name of the person who delivers the ball to the batsman?",
      q5: "The batsman stands in front of something called a wicket. What is the wicket physically comprised of?",
      q6: "Approximately how many countries worldwide are affiliated to the International Cricket Conference and play the game?"
    },
    options: {
      q1: ["Aluminium", "Plastic", "Vulcanized rubber", "Wood"],
      q2: ["Hard Rubber", "Wood", "Leather Outer / Cork Inner", "Plastic"],
      q3: ["Hitter", "Batsman", "Bradder", "Bat player"],
      q4: ["Bowler", "Thrower", "Pitcher", "Chucker"],
      q5: ["A goal and a net", "Two Stumps, three bails", "Three Stumps, two bails", "A stump and a bail"],
      q6: ["Between 50 and 100", "More than 100", "10", "Between 11 and 50"]
    },
    answers: {
      q1: "Wood",
      q2: "Leather Outer / Cork Inner",
      q3: "Batsman",
      q4: "Bowler",
      q5: "Three Stumps, two bails",
      q6: "More than 100"
    },
    // start the game
    startGame: function(){
      // resetting stats to 0
      trivia.currentSet = 0;
      trivia.correct = 0;
      trivia.incorrect = 0;
      trivia.unanswered = 0;
      clearInterval(trivia.timerId);
      
      $('#game').show();
      
      // empty
      $('#results').html('');
      
      // timer display
      $('#timer').text(trivia.timer);
      
      // no need for start button, so removing it.
      $('#start').hide();
  
      $('#remaining-time').show();
      
      //  first question shown here
      trivia.nextQuestion();
      
    },
    // loop to show trivia questions and options 
    nextQuestion : function(){
      
      // set timer to 5 seconds
      trivia.timer = 5;
       $('#timer').removeClass('last-seconds');
      $('#timer').text(trivia.timer);
      
      // to prevent timer speed up
      if(!trivia.timerOn){
        trivia.timerId = setInterval(trivia.timerRunning, 1000);
      }
      
      // gets all the questions then indexes the current questions
      var questionContent = Object.values(trivia.questions)[trivia.currentSet];
      $('#question').text(questionContent);
      
      // display 4 optioins to select from
      var questionOptions = Object.values(trivia.options)[trivia.currentSet];
      
      // creating html content
      $.each(questionOptions, function(index, key){
        $('#options').append($('<button class="option btn btn-info btn-lg">'+key+'</button>'));
      })
      
    },
    // count unanswered questions
    timerRunning : function(){

      if(trivia.timer > -1 && trivia.currentSet < Object.keys(trivia.questions).length){
        $('#timer').text(trivia.timer);
        trivia.timer--;
          if(trivia.timer === 4){
            $('#timer').addClass('last-seconds');
          }
      }
      // if unanswerd question then show correct answer as a result
      else if(trivia.timer === -1){
        trivia.unanswered++;
        trivia.result = false;
        clearInterval(trivia.timerId);
        resultId = setTimeout(trivia.guessResult, 1000);
        $('#results').html('<h3>Out of time! The answer was '+ Object.values(trivia.answers)[trivia.currentSet] +'</h3>');
      }
      // show results and end of game
      else if(trivia.currentSet === Object.keys(trivia.questions).length){
        
        // game result
        $('#results')
          .html('<h3>Thank you for playing!</h3>'+
          '<p>Correct: '+ trivia.correct +'</p>'+
          '<p>Incorrect: '+ trivia.incorrect +'</p>'+
          '<p>Unaswered: '+ trivia.unanswered +'</p>'+
          '<p>Please play again!</p>');
        
        // hide game sction
        $('#game').hide();
        
        // button to re play the game
        $('#start').show();
      }
      
    },
    // tells which option was selected
    guessChecker : function() {
      
      // setting timeout
      var resultId;
      
      var currentAnswer = Object.values(trivia.answers)[trivia.currentSet];
      
      // if else to determine correct and incorrect answer
      if($(this).text() === currentAnswer){
        // green button if chosen correct answer
        $(this).addClass('btn-success').removeClass('btn-info');
        
        trivia.correct++;
        clearInterval(trivia.timerId);
        resultId = setTimeout(trivia.guessResult, 1000);
        $('#results').html('<h3>Correct Answer!</h3>');
      }

      else{
        // red button if chosen incorrect answer
        $(this).addClass('btn-danger').removeClass('btn-info');
        
        trivia.incorrect++;
        clearInterval(trivia.timerId);
        resultId = setTimeout(trivia.guessResult, 1000);
        $('#results').html('<h3>Better luck next time! '+ currentAnswer +'</h3>');
      }
      
    },

    guessResult : function(){
      
      // new question in an array
      trivia.currentSet++;
      
      // remove options and results
      $('.option').remove();
      $('#results h3').remove();
      
      // new question
      trivia.nextQuestion();
       
    }
  
  }