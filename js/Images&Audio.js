////////////////////////////////////////////////////
//                   IMAGES                       //
////////////////////////////////////////////////////

var Sprite = function(image, position, speed, exi, type, token1, token2){
    this.image = image;
    this.position = position;
    this.speed = speed;
	this.exi = exi;
	this.type = type;
	this.token1 = token1;
	this.token2 = token2;

////////////////////////////////////////////////////////
//                  Type List                         //
/*//////////////////////////////////////////////////////
0 = background
1 = enemy1
2 = enemy2
3 = boss

10 = enemy2_bullets
11 = player
12 = player_bullet
//////////////////////////////////////////////////////*/
};


const NULL_POSITION = new position(0,0);

// Background image
var bgImage = new Image();
bgImage.src = "img/space_background1.jpg";
var background = new Sprite(bgImage, NULL_POSITION, 0, true, 0, 0, 0);

// Player image
var playerImage = new Image();
playerImage.src = "img/player_spaceship1T.gif";
var player = new Sprite(playerImage, NULL_POSITION, 200, true, 11, 0, 0);

// bullet Image
var bulletImage = new Image();
bulletImage.src = "img/player_bullet1T.gif";

// enemy1 Image
var enemy1Image = new Image();
enemy1Image.src = "img/enemy1_spaceship1T.gif";

// enemy2 Image
var enemy2Image = new Image();
enemy2Image.src = "img/enemy2_spaceship1T.gif";

// enemy2_bullet Image
var enemy2_bulletImage = new Image();
enemy2_bulletImage.src = "img/enemy2_bullet3T.png";

// boss Image
var bossImage = new Image();
bossImage.src = "img/bossT.gif";


var getEnemyImage = function(enemyNumber){
    switch(enemyNumber){
        case 1: return enemy1Image;
        case 2: return enemy2Image;
        case 3: return bossImage;
    }
}



////////////////////////////////////////////////////
//                   AUDIO                        //
////////////////////////////////////////////////////


// Allan Haapalainen - A journey Through Space
// https://www.youtube.com/watch?v=9fKadz4HlSk
var audio = new Audio('sound/track1.mp3');
audio.loop = true;
audio.play();
var audio2_1 = new Audio('sound/Shoot1.wav');
audio2_1.volume = 0.3;
var audio2_2 = new Audio('sound/Shoot1.wav');
audio2_2.volume = 0.3;
var audio3 = new Audio('sound/enemyShoot.wav');
audio3.volume = 0.2;
var audio4_1 = new Audio('sound/explosion2.wav');
audio4_1.volume = 0.2;
var audio4_2 = new Audio('sound/explosion2.wav');
audio4_2.volume = 0.2;
var audio5 = new Audio('sound/explosion1.wav');
audio5.volume = 0.2;

var AudioC1 = 0;
var AudioC2 = 0;


var muteAudio = function(){
	audio.muted = true;
	audio2_1.muted = true;
	audio2_2.muted = true;
	audio3.muted = true;
	audio4_1.muted = true;
	audio4_2.muted = true;
	audio5.muted = true;
}
var unmuteAudio = function(){
	audio.muted = false;
	audio2_1.muted = false;
	audio2_2.muted = false;
	audio3.muted = false;
	audio4_1.muted = false;
	audio4_2.muted = false;
	audio5.muted = false;
}


