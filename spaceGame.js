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
bulletImage.src = "images/player_bullet1T.gif";

// enemy1 Image
var enemy1Ready = false;
var enemy1Image = new Image();
enemy1Image.src = "images/enemy1_spaceship1T.gif";


////////////////////////////////////////////////////
//               GAME OBJECTS                     //
////////////////////////////////////////////////////

var player = { 
    speed:200 
};
var score = 0;

var bullets = [];
var bullet = function( positionX, positionY){
	this.bulletX = positionX;
	this.bulletY = positionY;
	this.bulletReady = true;
}


var enemies = [];
var numberOfenemies1 = 5;
var enemy1 = function( positionX, positionY, speed){
	this.enemy1X = positionX;
	this.enemy1Y = positionY;
	this.enemy1speed = speed
	this.enemy1Ready = true;
}

var score; 

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

var shootX = 0;
var shootY = 0;

// Reset the game when player dies
var reset = function () {
	player.x = canvas.width / 2;
	player.y = canvas.height / 2;
	shootX = player.x + 2.0;
	shootY = player.y-16.0;
	while(enemies.length != 0){
		enemies.shift();
	}
	numberOfenemies1 = 5;
	score = 0;

};

// Update game objects
var canShoot = true;
var date = new Date();
var activationTime = Date.now();

var distanceX = 0;
var distanceY = 0;
var distanceBX = 0;
var distanceBY = 0;

var update = function (modifier) {
	var currentTime = Date.now();

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
		if(canShoot == true){
			shoot();
			canShoot = false;
			activationTime = Date.now();
		}
		if(currentTime >= activationTime+200){
			canShoot = true;
		}
	}

	// basic enemy 
	
	for(var i = 0; i < enemies.length; i ++){
		if(enemies[i].enemy1Ready == true){
			for(var j = 0; j < bullets.length; j++){
				if(bullets[j].bulletReady == true){
					distanceBX = Math.abs(enemies[i].enemy1X - bullets[j].bulletX);
					distanceBY = Math.abs(enemies[i].enemy1Y - bullets[j].bulletY);
			
					if(  distanceBX < 16 && distanceBY < 10){
						enemies[i].enemy1Ready = false;
					}
				}
			}
		}
	}
	for(var i = 0; i < enemies.length; i ++){
		if(enemies[i].enemy1Ready == true){
			distanceX = Math.abs(enemies[i].enemy1X - player.x);
			distanceY = Math.abs(enemies[i].enemy1Y - player.y);
			
			if(  distanceX < 20 && distanceY < 16){
				console.log(score);
				reset();

			}
		}
	}
};
	


// object spawning

var shoot = function(){
	shootX = player.x + 2.0;
	shootY = player.y-16.0;
	newBullet = new bullet(shootX, shootY);
	bullets.push(newBullet);
}

var enemy1Spawn = function(){
	enemy1_positionX = Math.random() * (426 - 0 ) + 0; //Math.random() * (max - min) + min;
	enemy1_positionY = Math.random() * (-30 +100 ) - 100; //Math.random() * (max - min) + min;
	enemy1_speed = 200;
	newEnemy1 = new enemy1(enemy1_positionX, enemy1_positionY, enemy1_speed);
	enemies.push(newEnemy1);	
}

// drawing game objects

var render = function () {
    if (bgReady){
        ctx.drawImage(bgImage, 0, 0);
    }
    if (playerReady){
        ctx.drawImage( playerImage, player.x, player.y);
    }
	for(var i = 0; i < bullets.length; i++){
		if (bullets[i].bulletReady == true){
			bullets[i].bulletY -= 6;
			if(bullets[i].bulletY <=  -10){
				bullets.shift();
			}
			else{
    			ctx.drawImage( bulletImage, bullets[i].bulletX, bullets[i].bulletY);
			}
		}
	}

	for(var i = 0; i < enemies.length; i++){
			if(enemies[i].enemy1Y >= 650){
				enemies.shift();
			}
			
			else{
				if(enemies[i].enemy1Ready == true){
					ctx.drawImage( enemy1Image, enemies[i].enemy1X, enemies[i].enemy1Y);
				}
				enemies[i].enemy1Y += 3;
			}
	}	

};

// The main game loop
var main = function () {
	var now = Date.now();
	var delta = now - then;
	update(delta / 1000);


	
	if(score % 250 == 0){
		numberOfenemies1 += 1;
	}

	if(enemies.length < numberOfenemies1){
		enemy1Spawn();
	}
	

	render();

	then = now;

	score += 1;
	console.log(score);

	requestAnimationFrame(main);
};

// Cross-browser support for requestAnimationFrame
var w = window;
requestAnimationFrame = w.requestAnimationFrame || w.webkitRequestAnimationFrame || w.msRequestAnimationFrame || w.mozRequestAnimationFrame;

// Let's play this game!
var then = Date.now();
reset();
enemy1Spawn();
main();


