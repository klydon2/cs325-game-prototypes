var game = new Phaser.Game(800, 600, Phaser.CANVAS, 'game', { 
    preload: preload,
    create: create, 
    preRender: preRender, 
    render: render });

function preload() {

    game.load.image('bucket', 'assets/bucket.png', );
    game.load.image('cursor', 'assets/enemy-bullet.png');
    game.load.image('sky', 'assets/sky.png'); // sky.png obtained from http://phaser.io/tutorials/making-your-first-phaser-game/part2
    game.load.image('ground', 'assets/ground.png'); //ground.png obtained from http://phaser.io/tutorials/making-your-first-phaser-game/part2
    game.load.image('rain', 'assets/raindrop.png');
    game.load.image('cloud', 'assets/cloud.png');
    game.load.audio('water','assets/waterdroplet.wav')
    game.load.audio('bell','assets/bell.mp3')
    game.load.image('lightning', 'assets/lightning.png', );
    game.load.audio('thunder','assets/thunderclap.mp3');
    game.load.spritesheet('kaboom', 'assets/explode.png', 128, 128);
}

var bucket;
var line;
var mouseBody;
var mouseSpring;
var drawLine = false;
var ground;
var rain;
var timer;
var catchCounter = 0;
var missCounter = 0;
var lightningCollisionGroup;
var rainCollisionGroup;
var playerCollisionGroup;
var groundCollisionGroup;
var soundRain;
var soundBucket;
var soundThunder;
var interval;
var lightning;

function create() {
   
    // Create a sprite as a background using the 'sky' image.
    game.add.sprite(0, 0, 'sky');
  
    // enable physics p2 engine on world.
    game.physics.startSystem(Phaser.Physics.P2JS);
    game.physics.p2.setImpactEvents(true);
    game.physics.p2.gravity.y = 1000;
    game.physics.p2.restitution = 0.8;
    game.physics.p2.updateBoundsCollisionGroup();

    //create collision groups

    playerCollisionGroup = game.physics.p2.createCollisionGroup();
    rainCollisionGroup = game.physics.p2.createCollisionGroup();
    groundCollisionGroup = game.physics.p2.createCollisionGroup();
    lightningCollisionGroup = game.physics.p2.createCollisionGroup();

    //create ground.

    ground = game.add.sprite(0, game.height, 'ground');
    ground.width = game.width*2;
    ground.height = 80;
    game.physics.p2.enable(ground);
    ground.body.static = true;
    ground.body.setCollisionGroup(groundCollisionGroup);
    ground.body.collides([playerCollisionGroup, rainCollisionGroup,lightningCollisionGroup]);

    //  Create an object to pick-up

    bucket = game.add.sprite(200,200, 'bucket');
    game.physics.p2.enable(bucket, true);
    bucket.body.setCircle(40);
    bucket.body.setCollisionGroup(playerCollisionGroup);
    bucket.body.collides([groundCollisionGroup, rainCollisionGroup,lightningCollisionGroup]);
    bucket.animations.add('kaboom');


    //  Create our Mouse Cursor / Spring

    mouseBody = game.add.sprite(100, 100, 'cursor');
    game.physics.p2.enable(mouseBody, true);
    mouseBody.body.static = true;
    mouseBody.body.setCircle(10);
    mouseBody.body.data.shapes[0].sensor = true;

    //  Debug spring line

    line = new Phaser.Line(bucket.x, bucket.y, mouseBody.x, mouseBody.y);

    game.input.onDown.add(click, this);
    game.input.onUp.add(release, this);
    game.input.addMoveCallback(move, this);

    // create timer in order to call timer events which will decrease the interval between raindrops
    timer = game.time.create(false);
    interval = 200;
    timer.loop(interval, makeRain,this);
    timer.start();

    // Add Clouds

    game.add.sprite(-32, 32, 'cloud');
    game.add.sprite(16, 32, 'cloud');
    game.add.sprite(128+16, 32, 'cloud');
    game.add.sprite(128*2+16, 32, 'cloud');
    game.add.sprite(128*3+16, 32, 'cloud');
    game.add.sprite(128*4+16, 32, 'cloud');
    game.add.sprite(128*5+16, 32, 'cloud');
    
    game.add.sprite(-32, -32, 'cloud');
    game.add.sprite(16, -32, 'cloud');
    game.add.sprite(128+16, -32, 'cloud');
    game.add.sprite(128*2+16, -32, 'cloud');
    game.add.sprite(128*3+16, -32, 'cloud');
    game.add.sprite(128*4+16, -32, 'cloud');
    game.add.sprite(128*5+16, -32, 'cloud');

    game.add.sprite(0, 0, 'cloud');
    game.add.sprite(128, 0, 'cloud');
    game.add.sprite(128*2, 0, 'cloud');
    game.add.sprite(128*3, 0, 'cloud');
    game.add.sprite(128*4, 0, 'cloud');
    game.add.sprite(128*5, 0, 'cloud');

    // add sounds
    soundRain = game.add.audio('water');
    soundBucket = game.add.audio('bell');
    soundThunder = game.add.audio('thunder');


}



function click(pointer) {

    var bodies = game.physics.p2.hitTest(pointer.position, [ bucket.body ]);
    
    if (bodies.length)
    {
        //  Attach to the first body the mouse hit
        mouseSpring = game.physics.p2.createSpring(mouseBody, bodies[0], 0, 30, 1);
        line.setTo(bucket.x, bucket.y, mouseBody.x, mouseBody.y);
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
    line.setTo(bucket.x, bucket.y, mouseBody.x, mouseBody.y);

}

function preRender() {

    if (line)
    {
        line.setTo(bucket.x, bucket.y, mouseBody.x, mouseBody.y);
    }

}

function render() {

    if (drawLine)
    {
        //game.debug.geom(line);
    }

    game.debug.text('Catch Count: ' + catchCounter, game.width-160,(game.height-32));
    game.debug.text('Miss Count: ' + missCounter, game.width-160, (game.height-16));

}

function updateCounter() {

    interval= interval/1.5;
    return interval;

}

function makeRain() {

    rain = game.add.sprite(game.width*Math.random(), 40, 'rain');
    game.physics.p2.enable(rain);
    rain.body.setCollisionGroup(rainCollisionGroup);
    rain.body.collides(playerCollisionGroup,rainHitPlayer,this);
    rain.body.collides(groundCollisionGroup,rainHitGround,this);

    if(missCounter>10&&missCounter%2==0)
    {
        lightning = game.add.sprite(game.width*Math.random(), 40, 'lightning');
        game.physics.p2.enable(lightning);
        lightning.body.setCollisionGroup(lightningCollisionGroup);
        lightning.body.collides(playerCollisionGroup,lightningHitPlayer,this);
        lightning.body.collides(groundCollisionGroup,lightningHitGround,this);
    }
}

function rainHitPlayer(body1, body2){
    // body 1 is the rain. body2 is the player
        body1.sprite.destroy();
        soundBucket.play();
        catchCounter++;
    }

function lightningHitPlayer(body1, body2){
    // body 1 is the lightning. body2 is the player
    body1.sprite.destroy();
    soundThunder.play();
    body2.sprite.destroy();

    }

function rainHitGround(body1, body2){
    // body 1 is the rain.
        body1.sprite.destroy();
        soundRain.play();
        missCounter++;
    }    

function lightningHitGround(body1, body2){
    // body 1 is the lightning.
        body1.sprite.destroy();
    }    