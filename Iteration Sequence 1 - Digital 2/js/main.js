var game = new Phaser.Game(800, 600, Phaser.CANVAS, 'game', 
{ preload: preload,
  create: create,
  render: render, 
  update:update });

function preload() 
{
    game.load.image('cloud', 'assets/cloud.png');
    game.load.image('sky', 'assets/sky.png'); // sky.png obtained from http://phaser.io/tutorials/making-your-first-phaser-game/part2
    game.load.image('cabin', 'assets/cabin.png');
    game.load.image('maggot', 'assets/maggot.png');
    game.load.image('saw', 'assets/saw.png');
    game.load.image('cannon', 'assets/cannon.png');
    game.load.image('silhouette', 'assets/oxford.png');
    game.load.audio('squish','assets/squish.wav');
    game.load.audio('sawdio','assets/saw.wav');
    game.load.audio('diablo','assets/Diablo 2 - Tristram Theme.mp3');
    game.load.audio('scream','assets/scream.wav');
    game.load.image('gameover','assets/gameover.png');
    game.load.image('moon','assets/moon.png');
    game.load.image('ground', 'assets/ground.png'); //ground.png obtained from http://phaser.io/tutorials/making-your-first-phaser-game/part2
}


var maggotCollisionGroup;
var playerCollisionGroup;
var groundCollisionGroup;
var bulletCollisionGroup;
var wallsCollision;
var infestationLevel=0;
var maggotCount=0;
var killCount=0;
var soundSaw;
var soundBugDeath;
var soundScream;
var music;
var bulletCount = 0;
var bullets;
var bullet;
var nextFire = 0;
var fireSpeed = 25000;
var fireRate = 200;
var wallCollisionGroup;


function create() 
{
    // Create a sprite as a background using the 'sky' image.
    game.add.sprite(0, 0, 'sky');
    game.add.sprite(0, 0, 'silhouette');
    game.add.sprite(game.width -220, 50, 'moon');

    // Start P2 physics engine. 
    game.physics.startSystem(Phaser.Physics.P2JS);
    game.physics.p2.setImpactEvents(true);
    game.physics.p2.gravity.y = 50;
    game.physics.p2.restitution = 0.8;
    game.physics.p2.updateBoundsCollisionGroup();

    //create collision groups

    playerCollisionGroup = game.physics.p2.createCollisionGroup();
    bulletCollisionGroup = game.physics.p2.createCollisionGroup();
    groundCollisionGroup = game.physics.p2.createCollisionGroup();
    maggotCollisionGroup = game.physics.p2.createCollisionGroup();
    wallCollisionGroup = game.physics.p2.createCollisionGroup();

    //create ground.
    ground = game.add.sprite(0, game.height, 'ground');
    ground.width = game.width*2;
    ground.height = 80;
    game.physics.p2.enable(ground);
    ground.body.static = true;
    ground.body.setCollisionGroup(groundCollisionGroup);
    ground.body.collides([playerCollisionGroup, maggotCollisionGroup]);

    //create maggots
    maggots = game.add.group();
    // create timer in order to call timer events which will decrease the interval between maggot drops
    timer = game.time.create(false);
    interval = 200;
    timer.loop(interval, makeMaggots,this);
    timer.start();

    // create input objects
    cursors = game.input.keyboard.createCursorKeys();
    fireButton = this.input.keyboard.addKey(Phaser.KeyCode.SPACEBAR);

    //create cabin
    cabins = game.add.group();

    cabin = game.add.sprite((game.world.width/2), game.height-70, 'cabin');
    cabin.scale.setTo(0.75);
    game.physics.p2.enable(cabin);
    cabin.body.static = true;
    cabin.body.setCollisionGroup(playerCollisionGroup);
    cabin.body.collides([groundCollisionGroup,maggotCollisionGroup]);

    // create cannon
    cannon = game.add.sprite(50, game.height-70, 'cannon');
    cannon.scale.setTo(0.75);
    game.physics.p2.enable(cannon);
    cannon.body.static = true;
    cannon.body.setCircle(10,10,0);
    cannon.body.setCollisionGroup(playerCollisionGroup);
    cannon.body.collides([groundCollisionGroup,maggotCollisionGroup]);
    cannon.anchor.setTo(0.5, 0.5);
    bullets = game.add.group();

    //Add Walls in order to kill bullets
    wall1 = game.add.sprite(game.width+10,0,'ground');
    wall1.height = game.height*2;
    wall1.width = 10
    game.physics.p2.enable(wall1);
    wall1.body.static = true;
    wall1.body.setCollisionGroup(wallCollisionGroup);
    wall1.body.collides(bulletCollisionGroup);

    wall2 = game.add.sprite(-10,0,'ground');
    wall2.height = game.height*2;
    wall2.width = 10
    game.physics.p2.enable(wall2);
    wall2.body.static = true;
    wall2.body.setCollisionGroup(wallCollisionGroup);
    wall2.body.collides(bulletCollisionGroup);

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
    game.add.sprite(128*6, 0, 'cloud');


    //Add Sounds
    soundBugDeath = game.add.audio('squish');
    soundScream = game.add.audio('scream', 0.2);
    soundSaw = game.add.audio('sawdio', 0.09);
    music = game.add.audio('diablo',0.25);
    music.play();
};

function update() {
    maggots.forEachAlive(moveMaggots,this);  //make maggots accelerate to cabin

    if (cursors.left.isDown) 
    {
        cannon.body.rotateLeft(100);
    }   //cannon movement
    else if (cursors.right.isDown)
    {
        cannon.body.rotateRight(100);
    }
    else 
    {
        cannon.body.setZeroRotation();
    }
    if (cursors.up.isDown)
    {
        cannon.body.thrust(400);
    }
    else if (cursors.down.isDown)
    {
        cannon.body.reverse(400);
    }
    if (fireButton.isDown)
    {
        shoot();
    }

    if(infestationLevel==100)
    {
        this.game.paused=true;
        gameover = game.add.sprite(game.world.width/8,game.world.height/4,'gameover');
        gameover.inputEnabled = true;
        gameover.events.onInputDown.add(listener, this);
    }

};


function moveMaggots (maggot) { 
     accelerateToObject(maggot,cabin,30);  //start accelerateToObject on every maggot
}

function accelerateToObject(obj1, obj2, speed) {
    if (typeof speed === 'undefined') { speed = 1000; }
    var angle = Math.atan2(obj2.y - obj1.y, obj2.x - obj1.x);
    obj1.body.rotation = angle + game.math.degToRad(90);  // correct angle of angry maggots (depends on the sprite used)
    obj1.body.force.x = Math.cos(angle) * speed;    // accelerateToObject 
    obj1.body.force.y = Math.sin(angle) * speed;
}

//creates maggots based on a timer. Limit added to maintain framerate.
function makeMaggots()
{

            if (maggotCount<=500)
            {
                maggot = maggots.create( game.width*Math.random(), 40,'maggot');
                maggot.scale.setTo(0.75);
                game.physics.p2.enable(maggot,false);
                maggot.body.setCollisionGroup(maggotCollisionGroup);
                maggot.body.collides(playerCollisionGroup, maggotHitCabin);
                maggot.body.collides(bulletCollisionGroup, bulletHitMaggot);
                maggotCount++;
            }
       
}

// maggot detection event with Cabin
function maggotHitCabin(body1, body2)
{
    // body 1 is the maggot. body2 is the cabin.
        body1.sprite.destroy();
        soundScream.play();
        infestationLevel++;
        maggotCount--;
}

//bullet collision detection event with maggot
function bulletHitMaggot(body1, body2)
{
    // body 2 is the bullet. body1 is the maggot.
    body1.sprite.destroy();
    soundBugDeath.play();
    bullet.body.force.x = fireSpeed;
    bullet.body.force.y = fireSpeed;
    killCount++;
    maggotCount--;
}

// function for shooting sawblades from cannon
function shoot() 
{
    if(game.time.now > nextFire && bulletCount <=100)
    {
        nextFire = game.time.now + fireRate;
        bullet = bullets.create( cannon.body.x, cannon.body.y, 'saw');
        bullet.scale.setTo(0.75);
        game.physics.p2.enable(bullet,false);
        bullet.body.setCollisionGroup(bulletCollisionGroup);
        bullet.body.collideWorldBounds = false;
        bullet.body.collides([maggotCollisionGroup,groundCollisionGroup]);
        bullet.body.collides(wallCollisionGroup, killBullet,this)
        bullet.body.force.x = Math.cos(cannon.rotation) * fireSpeed;
        bullet.body.force.y = Math.sin(cannon.rotation) * fireSpeed;
        soundSaw.play();
        bulletCount++;
    }
}

// prints our counter for bugs entering the house and bugs killed
function render()
    {

        game.debug.text('Infestation Level :% ' + infestationLevel, game.width-250,(game.height-32));
        game.debug.text('Killed: ' + bulletCount, game.width-250, (game.height-16));

    }

// kills bullet on contact with walls
function killBullet(body1,body2){
    body1.sprite.destroy();
    bulletCount--;
}


