var game = new Phaser.Game(800, 600, Phaser.CANVAS, 'phaser-example', { preload: preload, create: create, preRender: preRender, render: render });

//The vast majority of the code contained within is not of my own work, it was obtained from https://phaser.io/examples/v2/p2-physics/mouse-spring with minor variations
// of my own added.

function preload() {

    game.load.image('gummi', 'assets/gummi.png');
    game.load.image('ashes', 'assets/ashes.png');
    game.load.image('cursor', 'assets/enemy-bullet.png');
    game.load.image('sky', 'assets/sky.png'); // sky.png obtained from http://phaser.io/tutorials/making-your-first-phaser-game/part2
    game.load.image('ground', 'assets/ground.png'); //ground.png obtained from http://phaser.io/tutorials/making-your-first-phaser-game/part2

}

var ashes;
var line;
var mouseBody;
var mouseSpring;
var drawLine = false;
var platforms;

function create() {
   
    // Create a sprite as a background using the 'sky' image.
    game.add.sprite(0, 0, 'sky');

    // Creating group to add ground as a platform and enable physics for group
    // ( From tutorial cited above.)
    platforms = game.add.group();
    platforms.enableBody = true;
    var ground = platforms.create(0, game.world.height - 64, 'ground');
    ground.scale.setTo(2, 2);
    ground.body.immovable = true;

    // enable physics p2 engine on world.
    game.physics.startSystem(Phaser.Physics.P2JS);
    game.physics.p2.gravity.y = 100;
    game.physics.p2.restitution = 0.8;

    //  Create an object to pick-up

    ashes = game.add.sprite(200, 200, 'ashes');
    // game.physics.p2.enable(ashes, false);
    game.physics.p2.enable(ashes, true);
    ashes.body.setCircle(20);

    //  Create our Mouse Cursor / Spring

    mouseBody = game.add.sprite(100, 100, 'cursor');
    game.physics.p2.enable(mouseBody, true);
    mouseBody.body.static = true;
    mouseBody.body.setCircle(10);
    mouseBody.body.data.shapes[0].sensor = true;

    //  Debug spring line

    line = new Phaser.Line(ashes.x, ashes.y, mouseBody.x, mouseBody.y);

    game.input.onDown.add(click, this);
    game.input.onUp.add(release, this);
    game.input.addMoveCallback(move, this);

}

function click(pointer) {

    var bodies = game.physics.p2.hitTest(pointer.position, [ ashes.body ]);
    
    if (bodies.length)
    {
        //  Attach to the first body the mouse hit
        mouseSpring = game.physics.p2.createSpring(mouseBody, bodies[0], 0, 30, 1);
        line.setTo(ashes.x, ashes.y, mouseBody.x, mouseBody.y);
        drawLine = true;
    }

}

function release() {

    game.physics.p2.removeSpring(mouseSpring);

    drawLine = false;

}

function move(pointer, x, y, isDown) {

    mouseBody.body.x = x;
    mouseBody.body.y = y;
    line.setTo(ashes.x, ashes.y, mouseBody.x, mouseBody.y);

}

function preRender() {

    if (line)
    {
        line.setTo(ashes.x, ashes.y, mouseBody.x, mouseBody.y);
    }

}

function render() {

    if (drawLine)
    {
        game.debug.geom(line);
    }

}
