class ball {
	constructor() {
		this.x = random(100, 300);
		this.y = random(200, 300);
		this.color = [random(180), random(180), random(180)];
		this.dir = p5.Vector.fromAngle(random(PI / 6, (5 * PI) / 6)).mult(1.6);
		this.dir.y *= -1;
		this.d = 3;
		this.r = this.d / 2;
	}
	update() {
		if (this.y + this.r > height) {
			gameOver = true;
			reason = "ball touch the bottom";
		}
		if (this.x + this.d * 2 > width || this.x - this.d * 2 < 0) {
			this.dir.x *= -1;
		}
		if (this.y - this.d * 2 < 0) {
			this.dir.y *= -1;
		}
		this.x += this.dir.x;
		this.y += this.dir.y;
		push();
		stroke(this.color);
		strokeWeight(10);
		noFill();
		circle(this.x, this.y, this.d);
		pop();
	}
	bulletCollide(bullet) {
		if (!bullet.fire) return;
		let DeltaX = this.x - max(bullet.x, min(this.x, bullet.x + bullet.w));
		let DeltaY = this.y - max(bullet.y, min(this.y, bullet.y + bullet.h));
		let result = DeltaX * DeltaX + DeltaY * DeltaY < (this.d / 2) * (this.d / 2);
		if (result) console.log("ball collide with bullet, spawning new");
		return result;
	}
	paddleCollide(paddle) {
		if (this.y + this.r < height - paddle.h) {
			return;
		}
		if (this.x + this.d > paddle.x && this.x - this.d < paddle.x + paddle.w) {
			this.dir.y = -abs(this.dir.y);
		}
	}
	bombCollide(bomb) {
		if (dist(this.x, this.y, bomb.x, bomb.y) < this.d / 2 + bomb.d / 2) {
			bomb.dropped = 0;
			console.log("ball collide with bomb");
		}
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
			if (this.y > 340) {
				gameOver = true;
				reason = "invaders touch the bottom";
			}
		}
	}
}
class gunObj {
	constructor(x) {
		this.x = x;
		this.y = 390;
		this.w = 20;
		this.h = 20;
		this.clamp = (num, min, max) => Math.min(Math.max(num, min), max);
	}
	draw() {
		fill(255, 0, 0);
		rect(this.x - 10, this.y, this.w, this.h);
		rect(this.x - 2, 380, 4, 20);
	}
	move() {
		this.x += (keyArray[RIGHT_ARROW] === 1) - (keyArray[LEFT_ARROW] === 1);
		this.x = this.clamp(this.x, 10, 390);
	}
}
class bulletObj {
	constructor() {
		this.x = 0;
		this.y = 0;
		this.w = 2;
		this.h = 6;
		this.fire = 0;
	}
	draw() {
		fill(255, 0, 0);
		ellipse(this.x, this.y, this.w, this.h);
		this.y -= 5;
		if (this.y < 0) {
			this.fire = 0;
		}
		for (var i = 0; i < invaders.length; i++) {
			if (invaders[i].dead === 0 && dist(this.x, this.y, invaders[i].x, invaders[i].y) < 6) {
				invaders[i].dead = 1;
				deadCount++;
				this.fire = 0;
			}
		}
	}
}
class bombObj {
	constructor() {
		this.x = 0;
		this.y = 0;
		this.d = 3;
		this.dropped = 0;
	}
	draw() {
		fill(43, 21, 21);
		circle(this.x, this.y, this.d);
		this.y++;
		if (this.y > 400) {
			this.dropped = 0;
		}
		if (this.y > 390) {
			if (this.x > gun.x - 10 && this.x < gun.x + 10) {
				gameOver = true;
				reason = "invaders touch the bottom";
			}
		}
	}
}
var gameOver = false;
var gameWin = false;
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
var deadCount = 0;
var reason = "";

function lowerAllInvaders() {
	for (var i = 0; i < invaders.length; i++) {
		invaders[i].y += 5;
	}
}
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
	if (gameOver) {
		background(0);
		fill(255, 0, 0);
		textSize(40);
		text("Game Over", 100, 200);
		return;
	}
	if (gameWin) {
		background(0, 255, 0);
		fill(255, 0, 0);
		textSize(40);
		text("You Win!", 100, 200);
		return;
	}
	gameWin = deadCount === invaders.length;
	ballin.update();
	for (var i = 0; i < invaders.length; i++) {
		if (invaders[i].dead === 0) {
			invaders[i].draw();
			invaders[i].move();
			if (bombs[i].dropped === 1) {
				bombs[i].draw();
				ballin.bombCollide(bombs[i]);
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
	ballin.paddleCollide(gun);
	checkFire();
	for (i = 0; i < 5; i++) {
		if (bullets[i].fire === 1) {
			bullets[i].draw();
		}
	}
	for (let i = 0; i < bullets.length; i++) {
		if (ballin.bulletCollide(bullets[i])) {
			ballin = new ball();
		}
	}
}
