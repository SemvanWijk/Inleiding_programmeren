// voeg knop toe om van kleur te verander
//einde 





var canvas = document.getElementById("canvas");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

var ctx = canvas.getContext("2d");

var x = 50;
var y = canvas.height - 75;
var dx = 0;
var dy = 0;
var jumping = false;

var platformImg = new Image();
platformImg.src = "./img/platform.png";

var signImg = new Image();
signImg.src = "./img/sign.png";

var coinImg = new Image();
coinImg.src = "./img/coin.png";

var coin = {
	x: 500,
	y: canvas.height - 840,
	width: 100,
	height: 80
};

var slimeImages = [
	"./img/blue.png",
	"./img/green.png",
	"./img/orange.png",
];

var slimeIndex = 0;


var coinLocations = [
	{ x: 50, y: canvas.height - 115, width: 100, height: 80 },
	{ x: 325, y: canvas.height - 190, width: 100, height: 80 },
	{ x: 650, y: canvas.height - 265, width: 100, height: 80 },
	{ x: 925, y: canvas.height - 340, width: 100, height: 80 },
	{ x: 1150, y: canvas.height - 465, width: 100, height: 80 },
	{ x: 1175, y: canvas.height - 565, width: 100, height: 80 },
	{ x: 925, y: canvas.height - 665, width: 100, height: 80 },
	{ x: 550, y: canvas.height - 565, width: 100, height: 80 },
	{ x: 225, y: canvas.height - 465, width: 100, height: 80 },
	{ x: 25, y: canvas.height - 565, width: 100, height: 80 },
	{ x: 175, y: canvas.height - 715, width: 100, height: 80 },
	{ x: 500, y: canvas.height - 840, width: 100, height: 80 },
]
var coinPickUp = new Audio("./sounds/sonic-ring-sound.mp3");
var changeImage = new Audio("./sounds/slick.mp3")

var score = 0;

var platforms = [
	{ x: 0, y: canvas.height - 50, width: 200, height: 100 },
	{ x: 300, y: canvas.height - 125, width: 150, height: 100 },
	{ x: 600, y: canvas.height - 200, width: 200, height: 100 },
	{ x: 900, y: canvas.height - 275, width: 150, height: 100 },
	{ x: 1100, y: canvas.height - 400, width: 200, height: 100 },
	{ x: 1200, y: canvas.height - 500, width: 50, height: 30 },
	{ x: 900, y: canvas.height - 600, width: 150, height: 100 },
	{ x: 500, y: canvas.height - 500, width: 200, height: 100 },
	{ x: 200, y: canvas.height - 400, width: 150, height: 100 },
	{ x: 0, y: canvas.height - 500, width: 150, height: 100 },
	{ x: 200, y: canvas.height - 650, width: 50, height: 30 },
	{ x: 400, y: canvas.height - 775, width: 300, height: 100 },
];

function drawPlayer() {
    var slimeImage = new Image();
    slimeImage.src = slimeImages[slimeIndex];
    ctx.drawImage(slimeImage, x, y, 60, 50);
}



function drawPlatform(platform) {
	ctx.drawImage(platformImg, platform.x, platform.y, platform.width, platform.height);
}

function drawSign() {
	ctx.drawImage(signImg, 148, 720, 50, 50);
}

function jump() {
	if (!jumping) {
		jumping = true;
		dy = -10;
	}
}

function moveLeft() {
	dx = -5;
}

function moveRight() {
	dx = 5;
}

function stopMoving() {
	dx = 0;
}

function applyGravity() {
	if (!jumping) {
		dy += 0.5;
		y += dy;
	} else if (dy < 0 && jumping) {
		dy += 0.5;
		y += dy;
	} else if (dy >= 0 && jumping) {
		dy += 1;
		y += dy;
	}
}

function checkPlatformCollision() {
	for (var i = 0; i < platforms.length; i++) {
		if (
			y > platforms[i].y - 50 &&
			y < platforms[i].y + platforms[i].height &&
			x > platforms[i].x - 50 &&
			x < platforms[i].x + platforms[i].width
		) {
			jumping = false;
			dy = 0;
			y = platforms[i].y - 50;
			break;
		}
	}

	if (y + 50 >= canvas.height - 5) {
		// Set the player back to its starting position
		x = 50;
		y = canvas.height - 75;
		dx = 0;
		dy = 0;
		jumping = false;
		score = 0;
	}
}


function draw() {
	ctx.clearRect(0, 0, canvas.width, canvas.height);

	for (var i = 0; i < platforms.length; i++) {
		drawPlatform(platforms[i]);
	}

	drawSign();

	drawPlayer();

	applyGravity();

	checkPlatformCollision();

	// Check for collision with the coin
	if (
		x + 50 >= coin.x &&
		x <= coin.x + coin.width &&
		y + 50 >= coin.y &&
		y <= coin.y + coin.height
	) {
		// Randomly select a new location for the coin
		const newcoinIndex = Math.floor(Math.random() * coinLocations.length);
		const newcoinLocation = coinLocations[newcoinIndex];
		coin.x = newcoinLocation.x;
		coin.y = newcoinLocation.y;
		coinPickUp.play()

		score++;
	}

	ctx.drawImage(coinImg, coin.x, coin.y, coin.width, coin.height);

	ctx.fillStyle = "white";
	ctx.font = "24px Arial";
	ctx.fillText("Score: " + score, canvas.width - 150, 50);

	// Move the character
	if (x + dx > canvas.width - 50 || x + dx < 0) {
		dx = 0;
	}

	x += dx;

	requestAnimationFrame(draw);
}


document.addEventListener("keydown", function (event) {
	if (event.code === "ArrowLeft") {
		moveLeft();
	} else if (event.code === "ArrowRight") {
		moveRight();
	} else if (event.code === "Space") {
		jump();
	} else if (event.code === "ArrowDown") {
        slimeIndex = (slimeIndex + 1) % slimeImages.length;
		changeImage.play()
    }
});


document.addEventListener("keyup", function (event) {
	if (event.code === "ArrowLeft" || event.code === "ArrowRight") {
		stopMoving();
	}
});

requestAnimationFrame(draw);