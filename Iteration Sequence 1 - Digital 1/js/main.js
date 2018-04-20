var game = new Phaser.Game(800, 600, Phaser.CANVAS, 'game', 
{ preload: preload,
  create: create,
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
    game.load.image('moon','assets/moon.png');
    game.load.image('ground', 'assets/ground.png'); //ground.png obtained from http://phaser.io/tutorials/making-your-first-phaser-game/part2
}


var maggotCollisionGroup;
var playerCollisionGroup;
var groundCollisionGroup;
var bulletCollisionGroup;
var infestationLevel=0;
var maggotCount=0;
var killCount=0;
var soundSaw;
var soundBugDeath;
var music;

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
    // create timer in order to call timer events which will decrease the interval between raindrops
    timer = game.time.create(false);
    interval = 200;
    timer.loop(interval, makeMaggots,this);
    timer.start();

    // create input objects
    cursors = game.input.keyboard.createCursorKeys();
    fireButton = this.input.keyboard.addKey(Phaser.KeyCode.SPACEBAR);

    //create cabin
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
    cannon.body.setCollisionGroup(playerCollisionGroup);
    cannon.body.collides([groundCollisionGroup,maggotCollisionGroup]);

    // create weapon for cannon
    bullets = game.add.group();
    weapon = game.add.weapon(10, 'saw',"",bullets);
    weapon.bulletKillType = Phaser.Weapon.KILL_WORLD_BOUNDS;
    weapon.bulletSpeed = 700;
    weapon.fireRate = 600;
    weapon.bulletAngleVariance = 10;
    weapon.trackSprite(cannon, 50, 0, true);

    // Hack to make weapon work with P2 physics Currently not working

   /* this.bullets.enableBody = true;
    this.bullets.physicsBodyType = Phaser.Physics.P2JS;
    this.bullets.createMultiple(100, 'bullet', 0, false);
    this.bullets.setAll('outOfBoundsKill', true);
    this.bullets.setAll('checkWorldBounds', true);
    this.bullets.forEach(function(bullet){
    bullet.body.setCollisionGroup(bulletCollisionGroup);
    bullet.body.collides(maggotCollisionGroup);*/
       

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
    soundSaw = game.add.audio('sawdio', 0.02);
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
        weapon.fire();
        soundSaw.play();
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
                var maggot = maggots.create( game.width*Math.random(), 40,'maggot');
                maggot.scale.setTo(0.75);
                game.physics.p2.enable(maggot,false);
                maggot.body.setCollisionGroup(maggotCollisionGroup);
                maggot.body.collides(playerCollisionGroup, maggotHitCabin);
                maggot.body.collides(bulletCollisionGroup, bulletHitMaggot);
                maggotCount++;
            }
       
}

function maggotHitCabin(body1, body2)
{
    // body 1 is the maggot. body2 is the cabin.
        body1.sprite.destroy();
        infestationLevel++;
        maggotCount--;
}

function bulletHitMaggot(body1, body2)
{
    // body 1 is the bullet. body2 is the maggot.
    body2.sprite.destroy();
    soundBugDeath.play();
    killCount++;
    maggotCount--;
}