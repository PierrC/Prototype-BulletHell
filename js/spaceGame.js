// Create Canvas
var canvas = document.createElement("canvas");
var ctx = canvas.getContext("2d");
canvas.width = 450;
canvas.height = 600;
document.body.appendChild(canvas);

////////////////////////////////////////////////////
//                   IMAGES                       //
////////////////////////////////////////////////////

var Sprite = function(image, posX, posY, speed, exi, type, token1, token2){
    this.image = image;
    this.posX = posX;
    this.posY = posY;
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

// Background image
var bgImage = new Image();
bgImage.src = "img/space_background1.jpg";
var background = new Sprite(bgImage, 0, 0, 0, true, 0, 0, 0);

// Player image
var playerImage = new Image();
playerImage.src = "img/player_spaceship1T.gif";
var player = new Sprite(playerImage, canvas.width / 2, canvas.height / 2, 200, true, 11, 0, 0);

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

var distanceX = 0;
var distanceY = 0;
var distanceBX = 0;
var distanceBY = 0;

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

addEventListener("keydown", function (e) {
	keysDown[e.keyCode] = true;
	e.preventDefault();
}, false);

addEventListener("keyup", function (e) {
	keysDown[e.keyCode] = false;
}, false);

// Reset the game when player dies
var reset = function () {
	player.posX = canvas.width / 2;
	player.posY = canvas.height / 2;
	shootX = player.posX + 2.0;
	shootY = player.posY-16.0;
	while(enemies.length != 0){
		enemies.shift();
	}
	while(bullets.length != 0){
		bullets.shift();
	}
	while(enemyBullets.length != 0){
		enemyBullets.shift();
	}
	if(score > highscore){
		highscore = score;
	}
	timer = 1;
	score = 0;
	enemy1SpawnDelay = 100;
	enemy2SpawnDelay = 1000;
	enemy1Timer = 0;
	State = 0;
	timerBoss = 0;
	bossIsHere = false;
};

// Update game objects
var update = function (modifier) {
	var currentTime = Date.now();
	if (keysDown[32] == true) { // Player holding space
		if(canShoot == true){
			shoot();
			canShoot = false;
			activationTime = Date.now();
			
			if(AudioC1 == 0){
				audio2_1.play();
				AudioC1++;
			}
			else{
				audio2_2.play();
				AudioC1--;
			}

		}
		if(currentTime >= activationTime+250){
			canShoot = true;
		}
	}
	if (keysDown[37] == true) { // Player holding left
		player.posX -= player.speed * modifier;
        if(player.posX <= 0){
            player.posX = 0;
        } 
	}
	if (keysDown[38] == true) { // Player holding up
		player.posY -= player.speed * modifier;
        if(player.posY <= 0){
            player.posY = 0;
        }
	}
	if (keysDown[40] == true) { // Player holding down
		player.posY += player.speed * modifier;
        if(player.posY >= 576){
            player.posY = 576;
        }
	}
	if (keysDown[39] == true) { // Player holding right
		player.posX += player.speed * modifier;
        if(player.posX >= 426){
            player.posX= 426;
        } 
	}
	if (keysDown[77] == true) { // Player holding right
		audio.muted = true;
		audio2_1.muted = true;
		audio2_2.muted = true;
		audio3.muted = true;
		audio4_1.muted = true;
		audio4_2.muted = true;
		audio5.muted = true;
	}
	if (keysDown[78] == true) { // Player holding right
		audio.muted = false;
		audio2_1.muted = false;
		audio2_2.muted = false;
		audio3.muted = false;
		audio4_1.muted = false;
		audio4_2.muted = false;
		audio5.muted = false;
	}
	
	// basic enemy 
	for(var i = 0; i < enemies.length; i ++){
		for(var j = 0; j < bullets.length; j++){
			if(enemies[i].exi == true){
				if(bullets[j].exi == true){
					distanceBX = Math.abs(enemies[i].posX - bullets[j].posX);
					distanceBY = Math.abs(enemies[i].posY - bullets[j].posY);		
					
					if(enemies[i].type == 3 && distanceBY < 80){
						enemies[i].token2 -= 1;
						bullets[j].exi = false;
						if(enemies[i].token2 <= 0){
							enemies[i].exi = false;
							bossIsHere = false;
							bossCanShoot = false;
							score += 10000;
							enemy1SpawnDelay -= 10;
							enemy2SpawnDelay -= 5;
						}
					} 
					else if(  distanceBX < 16 && distanceBY < 10){
						enemies[i].exi = false;
						bullets[j].exi = false;
						// audio4_1.play();
						
						if(AudioC2 == 0){
							audio4_1.play();
							AudioC2++;
						}
						else{
							audio4_2.play();
							AudioC2--;
						}
						score += 100;
					}
				}
			}
		}
	}
	for(var i = 0;i < enemies.length; i++){
		if(enemies[i].exi == false){
			enemies.splice(i, 1);
			i--;
		}
	}
	for(var i = 0;i < bullets.length; i++){
		if(bullets[i].exi == false){
			bullets.splice(i, 1);
			i--;
		}
	}

	for(var i = 0; i < enemies.length; i ++){
		distanceX = Math.abs(enemies[i].posX - player.posX);
		distanceY = Math.abs(enemies[i].posY - player.posY);
		if(enemies[i].type == 2 && distanceX <= 1 && enemies[i].token1 <= 0){
			 enemy2Shoot(enemies[i].posX, enemies[i].posY);
			 enemies[i].token1 = 100;
			 audio3.play();
		}
		else if(enemies[i].type == 3 && enemies[i].token1 <= 0 && bossCanShoot == true){
			audio3.play();
				for(var h = 0; h < 8; h++){
					bossShoot();
				}
				enemies[i].token1 = 100;
			
		}
		enemies[i].token1 -= 1;
		if(enemies[i].exi == true){
		// Due to reset put this last	
			if(  distanceX < 20 && distanceY < 16){
				audio5.play();
				reset();
			}
		}
	}
	for(var i = 0; i < enemyBullets.length; i++){
		distanceX = Math.abs(enemyBullets[i].posX - player.posX);
		distanceY = Math.abs(enemyBullets[i].posY - player.posY);
		if(  distanceX < 12 && distanceY < 12){
				audio5.play();
				reset();
			}
	}
	if((timer % 6000 == 0) && bossIsHere == false){
			console.log("boss")
		bossIsHere = true;
		
		for(var i = 0; i < enemies.length ; i++){
			if(enemies[i].type == 2){
				enemies[i].exi = false;
			}
		}
		
		bossSpawn();
	}
	enemy1Timer += 5;
	if(enemy1Timer >= enemy1SpawnDelay ){
		enemy1Timer = 0;
		enemy1Spawn();

	}
	enemy2Timer += 5;
	if(enemy2Timer >= enemy2SpawnDelay && bossIsHere == false){
		enemy2Timer = 0;
		enemy2Spawn();
	}
	scoreEl.innerHTML = score;
};

// object spawning
var shoot = function(){
	shootX = player.posX + 2.0;
	shootY = player.posY-16.0;
	bullet = new Sprite(bulletImage, shootX, shootY, 200, true, 12);
	bullets.push(bullet);
}
var enemy2Shoot = function(x, y){
	shootXEnemy = x + 2.0;
	shootYEnemy = y+16.0;
	bulletEnemy = new Sprite(enemy2_bulletImage, shootXEnemy, shootYEnemy, 200, true, 10, 0, 0);
	enemyBullets.push(bulletEnemy);
}
var bossShoot = function(){
	shootXboss = Math.random() * 426;
	shootYboss = 0;
	bulletEnemy = new Sprite(enemy2_bulletImage, shootXboss, shootYboss, 200, true, 10, 0, 0);
	enemyBullets.push(bulletEnemy);
}

var enemy1Spawn = function(){
	enemy1_positionX = Math.random() * (426 - 0 ) + 0; //Math.random() * (max - min) + min;
	enemy1_positionY = Math.random() * (-30 +100 ) - 100; //Math.random() * (max - min) + min;
	var enemy1 = new Sprite(enemy1Image, enemy1_positionX, enemy1_positionY, 200, true, 1, 0, 0);
	enemies.push(enemy1);	
}
var enemy2Spawn = function(){
	var sideDecider = Math.round(Math.random()); // allows enemy to be spawned on both sides of the screen
	var enemy2_positionX = 0;
	if(sideDecider == 0){ enemy2_positionX = -20; }
	else{ enemy2_positionX = 460; }
	enemy2_positionY = Math.random() * (100 - 30 ) + 30; //Math.random() * (max - min) + min;
	var enemy2 = new Sprite(enemy2Image, enemy2_positionX, enemy2_positionY, 100, true, 2, 0, 0);
	enemies.push(enemy2);	
}
var bossSpawn = function(){
	var boss = new Sprite(bossImage, -10, -100, 100, true, 3, 100, 100);
	console.log("boss")
	enemies.push(boss);
}

// drawing game objects
var render = function () {
    if (background.exi){
        ctx.drawImage(background.image, 0, 0);
    }
    if (player.exi){
        ctx.drawImage( player.image ,player.posX, player.posY);
    }
	for(var i = 0; i < bullets.length; i++){
		if (bullets[i].exi == true){
			bullets[i].posY -= 6;
			if(bullets[i].posY <=  -10){
				bullets.splice(i, 1);
			}
			else{
    			ctx.drawImage( bullets[i].image, bullets[i].posX, bullets[i].posY);
			}
		}
	}
	for(var i = 0; i < enemyBullets.length; i++){
		if(enemyBullets[i].type == 10){
			enemyBullets[i].posY += 6;
			if(enemyBullets[i].posY >=  650){
				enemyBullets.splice(i, 1);
			}
			else{
    			ctx.drawImage( enemyBullets[i].image, enemyBullets[i].posX, enemyBullets[i].posY);
			}
		}
	}
	for(var i = 0; i < enemies.length; i++){
		if(enemies[i].type == 1){
			if(enemies[i].posY >= 650){
				enemies.splice(i, 1);
			}
			
			else{
				enemies[i].posY += 3;
				if(enemies[i].exi == true){
					ctx.drawImage( enemies[i].image, enemies[i].posX, enemies[i].posY);
				}
			}
		}
		else if(enemies[i].type == 2){
			if(enemies[i].exi == true){
				ctx.drawImage( enemies[i].image, enemies[i].posX, enemies[i].posY);
			}	
			enemies[i].posX += 0.01 * enemies[i].speed
			if(enemies[i].posX <= 0 && enemies[i].speed < 0){ 
				enemies[i].speed = enemies[i].speed*(-1);
				enemies[i].posY += 10
			}
			else if(enemies[i].posX >= 426 && enemies[i].speed > 0){
				enemies[i].speed = enemies[i].speed*(-1);
			}	
		}
		else if(enemies[i].type == 3){
			
			if(enemies[i].exi == true){
				ctx.drawImage(enemies[i].image, enemies[i].posX, enemies[i].posY);
			}
			if(enemies[i].posY <= 0){
				enemies[i].posY += 1;
			}
			else if(enemies[i].posY > 0){
				bossCanShoot = true;
			}
		}
	}	

};
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
	if(timer % 200 == 0 && enemy2SpawnDelay > 500){
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
		audio.muted = true;
		audio2_1.muted = true;
		audio2_2.muted = true;
		audio3.muted = true;
		audio4_1.muted = true;
		audio4_2.muted = true;
		audio5.muted = true;
	}
	if (keysDown[78] == true) { // Player holding n
		audio.muted = false;
		audio2_1.muted = false;
		audio2_2.muted = false;
		audio3.muted = false;
		audio4_1.muted = false;
		audio4_2.muted = false;
		audio5.muted = false;
	}
	requestAnimationFrame(main);
}


// Cross-browser support for requestAnimationFrame
var w = window;
requestAnimationFrame = w.requestAnimationFrame || w.webkitRequestAnimationFrame || w.msRequestAnimationFrame || w.mozRequestAnimationFrame;

// Let's play this game!
var then = Date.now();
reset();
main();
