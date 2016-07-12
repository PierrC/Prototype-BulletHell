// Create Canvas
var canvas = document.createElement("canvas");
var ctx = canvas.getContext("2d");
canvas.width = 450;
canvas.height = 600;
document.body.appendChild(canvas);

////////////////////////////////////////////////////
//                   IMAGES                       //
////////////////////////////////////////////////////

// Background image
var bgReady = false;
var bgImage = new Image();
bgImage.onload = function(){
    bgReady = true;
};
bgImage.src = "images/space_background1.jpg";

// Player image
var playerReady = false;
var playerImage = new Image();
playerImage.onload = function(){
    playerReady = true;
}
playerImage.src = "images/player_spaceship1T.gif";

// bullet Image
var bulletReady = false;
var bulletImage = new Image();
/*
bulletImage.onload = function(){
    bulletReady = true;
}
*/
bulletImage.src = "images/player_bullet1T.gif";



////////////////////////////////////////////////////
//               GAME OBJECTS                     //
////////////////////////////////////////////////////

var player = { 
    speed:200 
};
var score = 0;

var bullet = {
	speed:300
};
var bullets = [];

////////////////////////////////////////////////////
//               GAME CONTROLS                    //
////////////////////////////////////////////////////

// Handle keyboard controls
var keysDown = {};

addEventListener("keydown", function (e) {
	keysDown[e.keyCode] = true;
}, false);

addEventListener("keyup", function (e) {
	delete keysDown[e.keyCode];
}, false);


// Reset the game when player dies
var reset = function () {
	player.x = canvas.width / 2;
	player.y = canvas.height / 2;

};

var shootX = player.x+2;
var shootY = player.y-16;
// Update game objects
var update = function (modifier) {
	if (38 in keysDown) { // Player holding up
		player.y -= player.speed * modifier;
        if(player.y <= 0){
            player.y = 0;
        }   
	}
	if (40 in keysDown) { // Player holding down
		player.y += player.speed * modifier;
        if(player.y >= 576){
            player.y = 576;
        }
	}
	if (37 in keysDown) { // Player holding left
		player.x -= player.speed * modifier;
        if(player.x <= 0){
            player.x = 0;
        } 
	}
	if (39 in keysDown) { // Player holding right
		player.x += player.speed * modifier;
        if(player.x >= 426){
            player.x = 426;
        } 
	}
	if (32 in keysDown) { // Player holding right
		shootX = player.x+2;
		shootY = player.y-10;
		shoot();
	}
};

// shooting
var shootX = player.x+2;
var shootY = player.y-16;

var shoot = function(){
	bulletReady = true;
}

// drawing game objects
var render = function () {
    if (bgReady){
        ctx.drawImage(bgImage, 0, 0);
    }

    if (playerReady){
        ctx.drawImage( playerImage, player.x, player.y);
    }
	if (bulletReady){
		shootY -= 6;
        ctx.drawImage( bulletImage, shootX, shootY);
    }

    // Score (later)
};

// The main game loop
var main = function () {
	var now = Date.now();
	var delta = now - then;

	update(delta / 1000);
	render();

	then = now;

	// Request to do this again ASAP
	requestAnimationFrame(main);
};

// Cross-browser support for requestAnimationFrame
var w = window;
requestAnimationFrame = w.requestAnimationFrame || w.webkitRequestAnimationFrame || w.msRequestAnimationFrame || w.mozRequestAnimationFrame;

// Let's play this game!
var then = Date.now();
reset();
main();


