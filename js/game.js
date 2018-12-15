class Menu extends Phaser.Scene { //super class for main menu

    constructor() {
        super('Menu');

        this.active;
        this.currentScene;

        this.menubg;
    }

    preload() {
        this.load.image('Menu', 'assets/mainmenu.png');
        this.load.image('button', 'assets/playbutton.png');
    }

    create() {
        score = 0;
        let menubg = this.add.sprite(0, 0, 'Menu');
        let button = this.add.sprite(0, 50, 'button');

        menubg.setOrigin(0, 0);
        button.setOrigin(0, 0);

        button.setInteractive();
        button.on('pointerdown', () => this.scene.start('Game'), score =0);
    }
}


class gameoverScene extends Phaser.Scene { //super clas for the gameover scene

    constructor() {
        super('gameoverScene');

        this.active;
        this.currentScene;

        this.menubg;
    }

    preload() {
        this.load.image('gameoverScene', 'assets/rip.png');
        this.load.image('button', 'assets/playbutton.png');
    }

    create() {

        let menubg2 = this.add.sprite(0, 0, 'gameoverScene');
        let button = this.add.sprite(0, 50, 'button');
        menubg2.setOrigin(0, 0);
        button.setOrigin(0, 0);

        button.setInteractive();
        button.on('pointerdown', () => this.scene.start('Menu'));
        
          scoreText = this.add.text(25, 175, 'Score : '+score, {
        
              
        fontSize: '32px',
        fill: 'black'
    });


    }
}

// create a new scene




let gameScene = new Phaser.Scene('Game');
var grounded = false;
var score = 0;
var scoreText;
var enemy;

// some parameters for our scene
gameScene.init = function () {
    this.playerSpeed = 1.5;
    this.playerMaxY = 100;
    this.enemyMaxY = 220;
    this.enemyMinY = 80;
}

gameScene.preload = function () { //loading screen after main menu
    var progressBar = this.add.graphics();
    var progressBox = this.add.graphics();
    progressBox.fillStyle(0xE50000, 0.8);
    progressBox.fillRect(100, 270, 200, 50);
    var width = this.cameras.main.width;
    var height = this.cameras.main.height;
    var loadingText = this.make.text({
        x: width / 2,
        y: height / 2 - 50,
        text: 'Howdy Partner',
        style: {
            font: '20px monospace',
            fill: '#ffffff'
        }
    });
    var assetText = this.make.text({
        x: width / 2,
        y: height / 2 + 50,
        text: '',
        style: {
            font: '18px monospace',
            fill: '#901C03'
            //assetText.setText('Loading asset: ' + file.key);    
        }
    });
    assetText.setOrigin(0.5, 0.5);
    this.load.on('progress', function (value) {
        progressBar.clear();
        progressBar.fillStyle(0xE50000, 1);
        progressBar.fillRect(100, 280, 200 * value, 30);
        percentText.setText(parseInt(value * 100) + '%');
    });
    this.load.on('fileprogress', function (file) {
        assetText.setText('Loading asset: ' + file.key);
    });
    this.load.on('complete', function () {
        progressBar.destroy();
        progressBox.destroy();
        loadingText.destroy();
        percentText.destroy();
        assetText.destroy();
    });
    loadingText.setOrigin(0.5, 0.5);
    var progressBar = this.add.graphics();
    var progressBox = this.add.graphics();
    progressBox.fillStyle(0x222222, 0.8);
    progressBox.fillRect(100, 270, 200, 50);
    var percentText = this.make.text({
        x: width / 2,
        y: height / 2 - 5,
        text: '0%',
        style: {
            font: '18px monospace',
            fill: '#ffffff'
        }
    });
    percentText.setOrigin(0.5, 0.5);



    // load images
    this.load.image('background', 'assets/sky3.png');
    this.load.image('player', 'assets/russle2.png');
    this.load.image('ground', 'assets/ground3.png');
    this.load.image('enemy', 'assets/cactus1.png');
    this.load.image('skull', 'assets/skull2.png');
    this.load.image('skull2', 'assets/skull2i.png');
    this.load.image('sun', 'assets/sun2.png');
    this.load.image('cloud1', 'assets/cloud2.png');
    this.load.image('cloud2', 'assets/cloud2.png');
    this.load.image('cloud3', 'assets/cloud2.png');
    this.load.image('rock', 'assets/rock2.png');
    this.load.image('rock2', 'assets/rock3.png');
    //load audio
    this.load.audio('theme', 'assets/audio/8bitTheme.mp3');

};


// called once after the preload ends
gameScene.create = function () {


    soundName = this.sound.add('theme'); //play music
    soundName.play();

    let bg = this.add.sprite(0, 0, 'background'); //create the background
    bg.setOrigin(0, 0);
    this.rock = this.add.sprite(100, this.sys.game.config.height / 2, 'rock').setScale(5);
    this.rock = this.add.sprite(300, this.sys.game.config.height / 2, 'rock2').setScale(5);

    scoreText = this.add.text(150, 100, 'Score : 0', {
        fontSize: '32px',
        fill: 'red'
    });

    let ground = this.physics.add.sprite(0, 700, 'ground');
    ground.body.allowGravity = false; //ground cant fall

    let sun = this.add.sprite(250, 75, 'sun');

    this.isPlayerAlive = true; //creating the player
    player = this.physics.add.sprite(40, 400, 'player'); //adding physics to the player
    player.body.allowGravity = true; //player can fall
    player.setBounce(0.2);
    player.setCollideWorldBounds(true); //player cant fall through the scrteen

    let skull = this.add.sprite(100, 555, 'skull');
    this.skull2 = this.add.sprite(this.sys.game.config.width - 110, 600, 'skull2');
    this.skull2.setScale(2);

    ground.setCollideWorldBounds(true); //ground cant fall through the screen

    gameScene.physics.add.collider(ground, player, enemy);

    this.enemies = this.add.group({ //group for the enemies
        key: 'enemy',
        repeat: 100,
        setXY: {
            x: 250,
            y: 435,
            stepX: 150,
            stepY: 0
        }
    });


    this.clouds = this.add.group({ //group for the clouds
        key: 'cloud1',
        repeat: 20,
        setXY: {
            x: 100,
            y: 100,
            stepX: 300,
            stepY: 0,
        }
    });



    //set speeds
    Phaser.Actions.Call(this.enemies.getChildren(), function (enemy) {
        enemy.speed = -1.5;
    }, this);


    Phaser.Actions.Call(this.clouds.getChildren(), function (cloud) {
        cloud.speed = -0.010;
    }, this);


}


gameScene.getScore = function () { //for loop for the score
    score++
    scoreText.setText('Score: ' + score);
}


gameScene.update = function () {



    //check is player isPlayer dead
    if (!this.isPlayerAlive) {
        return;
    }

    if (player.y >= 400) {
        grounded = true; //player cant jump after reaching a certain point on the y axis
    } else {
        grounded = false;
    }

    if (this.enemies.x = 400) { //if enemies are at 400 on the x axis the score should go up
        gameScene.getScore();
    }


    this.input.on('pointerdown', function (pointer) { //player jumps when pointer is down

        if (grounded) {
            player.body.velocity.y = -600; //if player is grounded the player can juimp at a velocity of -600


        }
    });

    let enemies = this.enemies.getChildren();
    let numEnemies = enemies.length;

    for (let i = 0; i < numEnemies; i++) {

        // move enemies
        enemies[i].x += enemies[i].speed;

        if (Phaser.Geom.Intersects.RectangleToRectangle(player.getBounds(), enemies[i].getBounds())) {
            this.gameOver();
            break;

        }

        let clouds = this.clouds.getChildren();
        let numClouds = clouds.length;

        for (let i = 0; i < numClouds; i++) {

            clouds[i].x += clouds[i].speed;

        };

    }
}

gameScene.gameOver = function () {

    // player alive flag set to  dead
    this.isPlayerAlive = false;
    soundName.destroy();
 
    //replace this.scene.restart with a camera Shake effect
    this.cameras.main.shake(500);

    //fading out

    this.time.delayedCall(250, function () {
        this.cameras.main.fade(250);
    }, [], this);

    // restart game
    this.time.delayedCall(500, function () {
        
        this.scene.start('gameoverScene');
    }, [], this);
   /* score.destroy();*/

}






// set the configuration of the game
let config = {
    type: Phaser.AUTO, // Phaser will use WebGL if available, if not it will use Canvas
    width: 375,
    height: 812,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: {
                y: 1000
            },
            debug: false,

        }
    },
    scene: [Menu, gameScene, gameoverScene]
};



// create a new game, pass the configuration
let game = new Phaser.Game(config);













