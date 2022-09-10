class ball {
	constructor() {
		this.x = 200;
		this.y = random(200, 300);
		this.dir = p5.Vector.random2D();
		this.r = 6;
	}
	update() {
		if (this.x + this.r > width || this.x - this.r < 0) {
			this.dir.x *= -1;
		}
		if (this.y + this.r > height || this.y - this.r < 0) {
			this.dir.y *= -1;
		}
		this.x += this.dir.x;
		this.y += this.dir.y;
		push();
		stroke(255);
		strokeWeight(10);
		noFill();
		circle(this.x, this.y, this.r / 2);
		pop();
	}
}

class invaderObj {
	constructor(x, y) {
		this.x = x;
		this.y = y;
		this.dead = 0;
		this.bomb = 0;
		this.invaderHeight = 70;
		this.imgpos = int(random(4)) * this.invaderHeight;
	}
	draw() {
		image(spritesheet, this.x, this.y, 14, 14, 0, this.imgpos, spritesheet.width, this.invaderHeight);
	}
	///// EXPERIMENT /////
	move() {
		this.x += globalInvDir;
		if (this.x < 6 || this.x > 394) {
			globalInvDir = -globalInvDir;
			this.x += globalInvDir; // restore its position
			// now bring all invaders down a bit
			lowerAllInvaders();
		}
	}
}
class gunObj {
	constructor(x) {
		this.x = x;
	}
	draw() {
		fill(255, 0, 0);
		rect(this.x - 10, 390, 20, 20);
		rect(this.x - 2, 380, 4, 20);
	}
	move() {
		this.x += (keyArray[RIGHT_ARROW] === 1) - (keyArray[LEFT_ARROW] === 1);
	}
}
class bulletObj {
	constructor() {
		this.x = 0;
		this.y = 0;
		this.fire = 0;
	}
	draw() {
		fill(255, 0, 0);
		ellipse(this.x, this.y, 2, 6);
		this.y -= 5;
		if (this.y < 0) {
			this.fire = 0;
		}
		for (var i = 0; i < invaders.length; i++) {
			if (invaders[i].dead === 0 && dist(this.x, this.y, invaders[i].x, invaders[i].y) < 6) {
				invaders[i].dead = 1;
				this.fire = 0;
			}
		}
	}
}
class bombObj {
	constructor() {
		this.x = 0;
		this.y = 0;
		this.dropped = 0;
	}
	draw() {
		fill(43, 21, 21);
		ellipse(this.x, this.y, 3, 3);
		this.y++;
		if (this.y > 400) {
			this.dropped = 0;
		}
		if (this.y > 390) {
			if (this.x > gun.x - 10 && this.x < gun.x + 10) {
				gameOver = 1;
			}
		}
	}
}
var gameOver = false;
var gun;
var invaders = [];
var globalInvDir = 1;
var keyArray = [];
var bullets;
var bulletIndex = 0;
var bombs = [];
var initialScreenVar;
var currFrameCount = 0;
var spritesheet;
var ballin;

var lowerAllInvaders = function () {
	for (var i = 0; i < invaders.length; i++) {
		invaders[i].y += 5;
	}
};
function keyPressed() {
	keyArray[keyCode] = 1;
	initialScreenVar.wait = false;
}
function keyReleased() {
	keyArray[keyCode] = 0;
}
///// EXPERIMENT /////
function checkFire() {
	if (keyArray[32] === 1) {
		if (currFrameCount < frameCount - 10) {
			currFrameCount = frameCount;
			bullets[bulletIndex].fire = 1;
			bullets[bulletIndex].x = gun.x;
			bullets[bulletIndex].y = 380;
			bulletIndex++;
			if (bulletIndex > 4) {
				bulletIndex = 0;
			}
		}
	}
}
function setup() {
	createCanvas(400, 400);
	ballin = new ball();
	gun = new gunObj(200);
	bullets = [new bulletObj(), new bulletObj(), new bulletObj(), new bulletObj(), new bulletObj()];
	// initialize space invaders
	var a = 100;
	var b = 20;
	for (var i = 0; i < 3; i++) {
		for (var j = 0; j < 10; j++) {
			invaders.push(new invaderObj(a, b));
			bombs.push(new bombObj());
			a += 20;
		}
		a = 100;
		b += 20;
	}
	initialScreenVar = new startScreen();
	initialScreenVar.setup();
	spritesheet = loadImage("sheet.png");
}
function draw() {
	if (initialScreenVar.wait) {
		initialScreenVar.draw();
		return;
	}
	background(0, 255, 217);
	ballin.update();
	if (gameOver === false) {
		for (var i = 0; i < invaders.length; i++) {
			if (invaders[i].dead === 0) {
				invaders[i].draw();
				invaders[i].move();
				if (bombs[i].dropped === 1) {
					bombs[i].draw();
				} else {
					if (random(0, 10000) < 2) {
						bombs[i].dropped = 1;
						bombs[i].x = invaders[i].x;
						bombs[i].y = invaders[i].y + 5;
					}
				}
			}
		}
		gun.draw();
		gun.move();
		checkFire();
		for (i = 0; i < 5; i++) {
			if (bullets[i].fire === 1) {
				bullets[i].draw();
			}
		}
	} else {
		fill(255, 0, 0);
		textSize(40);
		text("Game Over", 100, 200);
	}
}
