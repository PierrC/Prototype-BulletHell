
addEventListener("keydown", function (e) {
	keysDown[e.keyCode] = true;
	e.preventDefault();
}, false);

addEventListener("keyup", function (e) {
	keysDown[e.keyCode] = false;
}, false);

var shoot = function(){
	shootX = player.position.x + 2.0;
	shootY = player.position.y - 16.0;
	bullet = new Sprite(bulletImage, new position(shootX, shootY), 200, true, 12);
	bullets.push(bullet);
}
var enemy2Shoot = function(x, y){
	shootXEnemy = x + 2.0;
	shootYEnemy = y+16.0;
	bulletEnemy = new Sprite(enemy2_bulletImage, new position(shootXEnemy, shootYEnemy), 200, true, 10, 0, 0);
	enemyBullets.push(bulletEnemy);
}
var bossShoot = function(){
	shootXboss = Math.random() * 426;
	shootYboss = 0;
	bulletEnemy = new Sprite(enemy2_bulletImage, new position(shootXboss, shootYboss), 200, true, 10, 0, 0);
	enemyBullets.push(bulletEnemy);
}

var enemy1Spawn = function(){
	enemy1_positionX = Math.random() * (426 - 0 ) + 0; //Math.random() * (max - min) + min;
	enemy1_positionY = Math.random() * (-30 +100 ) - 100; //Math.random() * (max - min) + min;
	var enemy1 = new Sprite(getEnemyImage(1), new position(enemy1_positionX, enemy1_positionY), 200, true, 1, 0, 0);
	enemies.push(enemy1);	
}
var enemySpawn = function(enemyType, spawn_position){

}

var enemy2Spawn = function(){
	var sideDecider = Math.round(Math.random()); // allows enemy to be spawned on both sides of the screen
	var enemy2_positionX = 0;
	if(sideDecider == 0){ enemy2_positionX = -20; }
	else{ enemy2_positionX = 460; }
	enemy2_positionY = Math.random() * (100 - 30 ) + 30; //Math.random() * (max - min) + min;
	var enemy2 = new Sprite(getEnemyImage(2), new position(enemy2_positionX, enemy2_positionY), 100, true, 2, 0, 0);
	enemies.push(enemy2);	
}
var bossSpawn = function(){
	var boss = new Sprite(getEnemyImage(3), new position(-10, -100), 100, true, 3, 100, 100);
	console.log("boss")
	enemies.push(boss);
}


// drawing game objects
var render = function () {
    if (background.exi){
        ctx.drawImage(background.image, 0, 0);
    }
    if (player.exi){
        ctx.drawImage( player.image ,player.position.x, player.position.y);
    }
	for(var i = 0; i < bullets.length; i++){
		if (bullets[i].exi == true){
			bullets[i].position.y -= 6;
			if(bullets[i].position.y <=  -10){
				bullets.splice(i, 1);
			}
			else{
    			ctx.drawImage( bullets[i].image, bullets[i].position.x, bullets[i].position.y);
			}
		}
	}
	for(var i = 0; i < enemyBullets.length; i++){
		if(enemyBullets[i].type == 10){
			enemyBullets[i].position.y += 6;
			if(enemyBullets[i].position.y >=  650){
				enemyBullets.splice(i, 1);
			}
			else{
    			ctx.drawImage( enemyBullets[i].image, enemyBullets[i].position.x, enemyBullets[i].position.y);
			}
		}
	}
	for(var i = 0; i < enemies.length; i++){
		if(enemies[i].type == 1){
			if(enemies[i].position.y >= 650){
				enemies.splice(i, 1);
			}
			
			else{
				enemies[i].position.y += 3;
				if(enemies[i].exi == true){
					ctx.drawImage( enemies[i].image, enemies[i].position.x, enemies[i].position.y);
				}
			}
		}
		else if(enemies[i].type == 2){
			if(enemies[i].exi == true){
				ctx.drawImage( enemies[i].image, enemies[i].position.x, enemies[i].position.y);
			}	
			enemies[i].position.x += 0.01 * enemies[i].speed
			if(enemies[i].position.x <= 0 && enemies[i].speed < 0){ 
				enemies[i].speed = enemies[i].speed*(-1);
				enemies[i].position.y += 10
			}
			else if(enemies[i].position.x >= 426 && enemies[i].speed > 0){
				enemies[i].speed = enemies[i].speed*(-1);
			}	
		}
		else if(enemies[i].type == 3){
			
			if(enemies[i].exi == true){
				ctx.drawImage(enemies[i].image, enemies[i].position.x, enemies[i].position.y);
			}
			if(enemies[i].position.y <= 0){
				enemies[i].position.y += 1;
			}
			else if(enemies[i].position.y > 0){
				bossCanShoot = true;
			}
		}
	}	
};



// Reset the game when player dies
var reset = function () {
	player.position.x = canvas.width / 2;
	player.position.y = canvas.height / 2;
	shootX = player.position.x + 2.0;
	shootY = player.position.y-16.0;
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
		player.position.x -= player.speed * modifier;
        if(player.position.x <= 0){
            player.poposition.xsX = 0;
        } 
	}
	if (keysDown[38] == true) { // Player holding up
		player.position.y -= player.speed * modifier;
        if(player.position.y <= 0){
            player.position.y = 0;
        }
	}
	if (keysDown[40] == true) { // Player holding down
		player.position.y += player.speed * modifier;
        if(player.position.y >= 576){
            player.position.y = 576;
        }
	}
	if (keysDown[39] == true) { // Player holding right
		player.position.x += player.speed * modifier;
        if(player.position.x >= 426){
            player.position.x= 426;
        } 
	}
	if (keysDown[77] == true) { // Player holding m
		unmuteAudio();
	}
	if (keysDown[78] == true) { // Player holding n
		muteAudio();
	}
	
	// basic enemy 
	for(var i = 0; i < enemies.length; i ++){
		for(var j = 0; j < bullets.length; j++){
			if(enemies[i].exi == true){
				if(bullets[j].exi == true){
					distanceB.x = Math.abs(enemies[i].position.x - bullets[j].position.x);
					distanceB.y = Math.abs(enemies[i].position.y - bullets[j].position.y);		
					
					if(enemies[i].type == 3 && distanceB.y < 80){
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
					else if(  distanceB.x < 16 && distanceB.y < 10){
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
		distance.x = Math.abs(enemies[i].position.x - player.position.x);
		distance.y = Math.abs(enemies[i].position.y - player.position.y);
		if(enemies[i].type == 2 && distance.x <= 1 && enemies[i].token1 <= 0){
			 enemy2Shoot(enemies[i].position.x, enemies[i].position.y);
			 enemies[i].token1 = 100;
			 audio3.play();
		}
		else if(enemies[i].type == 3 && enemies[i].token1 <= 0 && bossCanShoot == true){
			audio3.play();
				for(var h = 0; h < 2; h++){
					bossShoot();
				}
				enemies[i].token1 = 50;
			
		}
		enemies[i].token1 -= 1;
		if(enemies[i].exi == true){
		// Due to reset put this last	
			if(  distance.x < 20 && distance.y < 16){
				audio5.play();
				reset();
			}
		}
	}
	for(var i = 0; i < enemyBullets.length; i++){
		distance.x = Math.abs(enemyBullets[i].position.x - player.position.x);
		distance.y = Math.abs(enemyBullets[i].position.y - player.position.y);
		if(  distance.x < 12 && distance.y < 12){
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


