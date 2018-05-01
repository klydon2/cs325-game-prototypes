var game = new Phaser.Game(800, 600, Phaser.CANVAS, 'game', 
{ preload: preload,
  create: create,
  update:update });

function preload() 
{
    game.load.image('Flag', 'assets/USAFlag.jpg');
}

var clicks = 0;
var spacing = 0;
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
}

function up(item,valid) {

    if(valid==true){
        item.text = "Correct!!";
        item.fill = "#ffffff";
    }
    else{
         item.text = "Incorrect!"; 
        }
    
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
    enableText(text,answer);
    spacing = spacing+100;
}

function enableText(text,answer) {

    text.anchor.set(0.5);

    text.inputEnabled = true;

    text.input.enableDrag();

    text.events.onInputOver.add(over,this);
    text.events.onInputOut.add(out, this);

    text.events.onInputDown.add(down, this);
    text.events.onInputUp.add(up,this);
}
