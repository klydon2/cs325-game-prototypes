var game = new Phaser.Game(800, 600, Phaser.CANVAS, 'game', 
{ preload: preload,
  create: create,
  render:render,
  update:update });

function preload() 
{
    game.load.image('Flag', 'assets/USAFlag.jpg');
    game.load.audio('banner','assets/StarSpangledBanner.mp3');
    game.load.audio('bell','assets/bell.mp3')
    game.load.audio('water','assets/waterdroplet.wav')
    game.load.audio('squish','assets/squish.wav')
}

var questionsAsked = 0;
var correct = 0;
var spacing = 0;
var questionsAnswered = 0;
var bellAudio;
var waterAudio;
var squishAudio;
var prompt;
var answers = []
answers.length = 3;

// Questions 
var question1 = {
    question: 'Who is the father of our country?',
    answer1: ['George Washington',true],
    answer2: ['Billy-bob Thornton', false],
    answer3: ['James Madison', false]
   };

var question2 = {
    question: 'What did the Declaration of Independance do?',
    answer1: ['Called the Aliens that attacked the White House',false],
    answer2: ['Declared our independance from Great Britain', true],
    answer3: ['Defined the borders of the United States', false]
   };

var question3 = {
    question: 'What is freedom of Religion?',
    answer1: ['The religion that worships freedom',false],
    answer2: ['The ability to practice or not practice any religion', true],
    answer3: ['The movement to free congressman James Religion', false]
   };

var question4 = {
    question: 'What is the economic system in the United States?',
    answer1: ['Capitalist Economy',true],
    answer2: ['Command Economy', false],
    answer3: ['Traditional Economy', false]
   };

var question5 = {
    question: 'Who makes federal laws?',
    answer1: ['Judicial Branch of the government',false],
    answer2: ['Executive Branch of the government', false],
    answer3: ['Congress', true]
   };

var question6 = {
    question: 'What are two parts of U.S. Congress?',
    answer1: ['Legislative and Executive',false],
    answer2: ['The Senate and House of Representatives', true],
    answer3: ['Democrat and Republican', false]
   };

var question7 = {
    question: 'How many U.S. Senetors are there?',
    answer1: ['100',true],
    answer2: ['435', false],
    answer3: ['76', false]
   };

var question8 = {
    question: 'How many U.S. Representatives are there?',
    answer1: ['100',false],
    answer2: ['435', true],
    answer3: ['76', false]
   };

var question9 = {
    question: 'What is the name of the current Speaker of the House?',
    answer1: ['Paul Ryan',true],
    answer2: ['Billy-bob Thornton', false],
    answer3: ['John Robinson', false]
   };

var question10 = {
    question: 'Who wrote the Declaration of Independance?',
    answer1: ['Alexander Hamilton',false],
    answer2: ['Thomas Jefferson', true],
    answer3: ['James Madison', false]
   };

var questions = [question1,question2,question3,question4,question5,question6,question7,question8,question9,question10];
//questions end



function create() 
{
    game.add.sprite(0, 0, 'Flag');
    var music = game.add.audio('banner',0.25);
    music.play();
    waterAudio = game.add.audio('water');
    bellAudio = game.add.audio('bell');
    squishAudio = game.add.audio('squish');
        
}

function update() {

    if(questionsAsked==questionsAnswered && questionsAsked<10)
    {
        if(prompt!=null)
        {
            killAll();
        }
        askQuestion(questions[questionsAsked]);
        questionsAsked++;
    }

    if(questionsAnswered == 10)
    {
        killAll();
        
        var text = game.add.text(game.world.centerX, game.world.centerY, 'You have failed to become a Citizen of the USA', 
            { 
                font: "bold 60px Times New Roman ",
                fill: "#ffffff",
                align: "center",
                wordWrap: true,
                wordWrapWidth: 800 ,
                strokeThickness: 5
            });
            text.anchor.set(0.5);
    }

    if(correct == 6)
    {

        killAll();

        var text = game.add.text(game.world.centerX, game.world.centerY, ' Congratulations! You have become a Citizen of the USA!', 
            { 
                font: "bold 60px Times New Roman ",
                fill: "#ffffff",
                align: "center",
                wordWrap: true,
                wordWrapWidth: 800 ,
                strokeThickness: 5
            });
        text.anchor.set(0.5);
    }
   
}

function over(item) {

    item.fill = "#ff0044";

}

function out(item) {

    item.fill = "#ffff44";

}

function down(item) {

    item.fill = "#ffff44";
    waterAudio.play();
}

function up1(item) {

    item.text = "Correct!!";
    item.fill = "#ffffff";
    bellAudio.play();
    questionsAnswered++;
    correct++;
}

function up2(item) {
    item.text = "Incorrect!"; 
    questionsAnswered++;
    squishAudio.play();
}

function createAnswers(answer){
    var text = game.add.text(game.world.centerX, game.world.centerY+spacing, answer[0], 
        { 
            font: "bold 50px Times New Roman ",
            fill: "#ffff44",
            align: "center",
            wordWrap: true,
            wordWrapWidth: 800 ,
            strokeThickness: 2
        });
    enableText(text,answer[1]);
    spacing = spacing+120;
    return text;
}

function enableText(text,verify)
 {

    text.anchor.set(0.5);

    text.inputEnabled = true;

    text.input.enableDrag();

    text.events.onInputOver.add(over,this);
    text.events.onInputOut.add(out, this);

    text.events.onInputDown.add(down, this);

    if(verify==true){
        text.events.onInputUp.add(up1,this);
    }
    else{
        text.events.onInputUp.add(up2,this);
    }

}

function render()
{

    game.debug.text(questionsAnswered + '/10', game.width-200,(game.height-32), { 
        font: "bold 20px Times New Roman ",
        fill: "#ffff44",
        align: "center",
        wordWrap: true,
        wordWrapWidth: 800 ,
        strokeThickness: 2
    });

    game.debug.text('Correct Answers: ' + correct, game.width-200, (game.height-16),{ 
        font: "bold 20px Times New Roman ",
        fill: "#ffff44",
        align: "center",
        wordWrap: true,
        wordWrapWidth: 800 ,
        strokeThickness: 2
    });
}

function askQuestion(question)
{
    prompt = game.add.text(game.world.centerX, game.world.top + 75, question.question, 
        { 
            font: "bold 60px Times New Roman ",
            fill: "#ffffff",
            align: "center",
            wordWrap: true,
            wordWrapWidth: 800 ,
            strokeThickness: 5
        });

    prompt.anchor.set(0.5);

    answers[0]=createAnswers(question.answer1);
    answers[1]=createAnswers(question.answer2);
    answers[2]=createAnswers(question.answer3);
}

function killAll(){
    game.world.remove(prompt);
    game.world.remove(answers[0]);
    game.world.remove(answers[1]);
    game.world.remove(answers[2]);
    spacing = 0;
}
