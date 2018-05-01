var game = new Phaser.Game(800, 600, Phaser.CANVAS, 'game', 
{ preload: preload,
  create: create,
  update:update });

function preload() 
{
    game.load.image('Flag', 'assets/USAFlag.jpg');
    game.load.audio('banner','assets/StarSpangledBanner.mp3');
    game.load.audio('bell','assets/bell.mp3')
    game.load.audio('water','assets/waterdroplet.wav')
}

var counter = 0;
var correct = 0;
var spacing = 0;
var bellAudio;
var waterAudio;
var question = {
    question: 'Who is the father of our country?',
    answer1: ['George Washington',true],
    answer2: ['Billy-bob Thornton', false],
    answer3: ['James Madisson', false]
   };


function create() 
{
    game.add.sprite(0, 0, 'Flag');
    var text = game.add.text(game.world.centerX, game.world.top + 75, question.question, 
        { 
            font: "bold 60px Times New Roman ",
            fill: "#ffffff",
            align: "center",
            wordWrap: true,
            wordWrapWidth: 800 ,
            strokeThickness: 5
        });

    text.anchor.set(0.5);

    createAnswers(question.answer1);
    createAnswers(question.answer2);
    createAnswers(question.answer3);

    var music = game.add.audio('banner',0.25);
    music.play();
    waterAudio = game.add.audio('water');
    bellAudio = game.add.audio('bell');

}

function update() {
   
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
    counter++;
}
function up2(item) {
    item.text = "Incorrect!"; 
    counter++;
    correct++;
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
    spacing = spacing+100;
}

function enableText(text,verify) {

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
