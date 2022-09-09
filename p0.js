class initial {
	constructor() {
	  this.x = 120;
	  this.y = 200;
	}
	update() {
	  this.y = 200 + posit(frameCount / 60);
	}
	show() {
	  rotate(cos(frameCount / 60)/30);
	  arc(this.x, this.y - 10, 20, 20, PI / 2, -0.5);
	  arc(this.x, this.y + 10, 20, 20, PI + PI / 2, PI - 0.5);
	  arc(this.x + 35, this.y, 30, 40, PI / 5, 1.6 * PI);
	  line(this.x + 40, this.y + 5, this.x + 55, this.y + 5);
	  line(this.x + 48, this.y + 6, this.x + 48, this.y + 20);
	  rotate(-cos(frameCount / 60)/30);
	}
  }
  class particle {
	constructor(g) {
	  this.x = random(width);
	  this.y = random(height);
	  this.r = g * 3;
	  this.g = g;
	  this.color = [random(255), random(255), random(255), random(80, 160)];
	}
	show() {
	  fill(this.color);
	  ellipse(this.x, this.y, this.r, this.r);
	}
	update() {
	  this.y = this.y + this.g;
	  if (this.y > height) {
		this.y = random(-3);
		this.x = random(width); 
	  }
	}
  }
  class pipe {
	constructor() {
	  this.x = 350;
	  this.y = 200 + posit(frameCount / 60 - 350);
	  this.color = [random(100, 200), random(100, 200), random(100, 200)];
	}
	show() {
	  fill(this.color);
	  rect(this.x, 0, 50, this.y - 50);
	  rect(this.x, this.y + 50, 50, height);
	}
	update() {
	  this.x -= 3;
	  if (this.x < -50) {
		this.x = width + 50;
		this.y = 200 + posit(frameCount / 60 - 350);
		this.color = [random(100, 200), random(100, 200), random(100, 200)];
	  }
	}
  }
  var dots = [];
  var myInitial;
  var pipes = [];
  
  function startScreen(){
	function setup() {
	createCanvas(400, 400);
	myInitial = new initial();
	for (let i = 0; i < 30; i++) {
	  dots.push(new particle(random(0.2, 2.6)));
	}
	pipes.push(new pipe());
	pipes.push(new pipe());
	pipes[1].x = 600;
	pipes[1].y = 200 + posit(frameCount / 60 - PI * PI);
  }
  
  function draw() {
	background(220);
	noStroke();
	
	for (let i = 0; i < dots.length; i++) {
	  dots[i].show();
	  dots[i].update();
	}
	for (let i = 0; i < pipes.length; i++) {
	  pipes[i].show();
	  pipes[i].update();
	}
	noFill();
	stroke(0);
	strokeWeight(2);
	myInitial.update();
	myInitial.show();
	noStroke();
	textSize(18);
	fill(10);
	text("Saksham Goyal", 270, 390);
  }
  function posit(x) {
	return 100 * sin(x);
  }
  }
  