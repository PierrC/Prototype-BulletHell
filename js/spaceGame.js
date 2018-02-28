// Create Canvas
var canvas = document.createElement("canvas");
var ctx = canvas.getContext("2d");
canvas.width = 450;
canvas.height = 600;
document.body.appendChild(canvas);



////////////////////////////////////////////////////
//               GAME OBJECTS                     //
////////////////////////////////////////////////////


var State = 0;
/*
	0: Menu
	1: Game
	2: Game Over
*/
var timer = 1;
var score = 0;
var highscore = 0;
var bullets = [];

var enemies = [];
var enemyBullets = [];

var scoreEl = document.getElementById('score');

var canShoot = true;
var date = new Date();
var activationTime = Date.now();


var distance = new position(0,0);

var distanceB = new position(0,0);

var enemy1SpawnDelay = 100;
var enemy1Timer = 0;

var enemy2SpawnDelay = 1000;
var enemy2Timer = 0;

var shootX = 0;
var shootY = 0;

var timerBoss = 0;
var bossIsHere = false;
var bossCanShoot = false;

////////////////////////////////////////////////////
//               GAME CONTROLS                    //
////////////////////////////////////////////////////

// Handle keyboard controls
var keysDown = {};


// object spawning



// The main game loop
var main = function () {
	if( State == 0){
		menuRender();
	}
	else if(State == 1){
	var now = Date.now();
	var delta = now - then;
	update(delta / 1000);

	if(timer % 100 == 0 && enemy1SpawnDelay > 50){
		enemy1SpawnDelay = enemy1SpawnDelay * 0.98;
	}
    if (timer % 200 == 0 && enemy2SpawnDelay > 500) {
        enemy2SpawnDelay = enemy2SpawnDelay * 0.95;
    }

	render();
	then = now;
	timer += 1;

	requestAnimationFrame(main);
	}
};

////////////////////////////////////////////////////////////////////////////////
/////                          /\ /\  |_ |\ | |  |                         /////
/////                         /     \ |_ | \| |__|                         /////
////////////////////////////////////////////////////////////////////////////////

var menuRender = function(){

	if (background.exi){
        ctx.drawImage(background.image, 0, 0);
    }
	ctx.fillStyle = "White";
	ctx.font = "30px Arial";
	ctx.fillText("press ENTER to start",10,50);
	ctx.fillText("Your high score is " + highscore ,10,100);
	if (keysDown[13] == true) { // Player holding down
		State = 1;
	};
	if (keysDown[77] == true) { // Player holding m
		muteAudio();
	}
	if (keysDown[78] == true) { // Player holding n
		unmuteAudio();
	}
	requestAnimationFrame(main);
}


// Cross-browser support for requestAnimationFrame
var w = window;
requestAnimationFrame = w.requestAnimationFrame || w.webkitRequestAnimationFrame || w.msRequestAnimationFrame || w.mozRequestAnimationFrame;

// Let's play this game!
var then = Date.now();
reset();
muteAudio();
main();
