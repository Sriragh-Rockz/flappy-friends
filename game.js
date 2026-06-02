const menuMusic = document.getElementById("menuMusic");
const deadAudio = new Audio("assets/chetta.mp3");
const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
const bird = new Image();
const flapSound = new Audio();

let gameStarted = false;
let gameOver = false;

let y = 300;
let velocity = 0;

const gravity = 0.25;
const birdX = 100;
const birdSize = 150;

let score = 0;
const pipes = [];

function selectBird(name) {

    bird.src = "assets/" + name + ".png";
    flapSound.src = "assets/" + name + ".mp3";

    document.getElementById("menu").style.display = "none";

    menuMusic.pause();
    menuMusic.currentTime = 0;

    gameStarted = true;

}

function flap() {

    if (gameOver) return;

    velocity = -8;

    const sound = new Audio(flapSound.src);
    sound.volume = 1;
    sound.play();
}

document.addEventListener("click", () => {
    if (gameStarted) flap();
});

document.addEventListener("keydown", (e) => {

    if (e.code === "Space" && gameStarted) {
        flap();
    }

    if (e.key === "r" || e.key === "R") {
        restartGame();
    }

});

function createPipe() {

    const gap = 320;

    const topHeight = Math.random() * 250 + 50;

    pipes.push({
        x: canvas.width,
        width: 80,
        topHeight: topHeight,
        bottomY: topHeight + gap,
        scored: false
    });
}

setInterval(() => {

    if (gameStarted && !gameOver) {
        createPipe();
    }

}, 2000);
function restartGame() {

    y = 300;
    velocity = 0;
    score = 0;

    pipes.length = 0;

    gameOver = false;
    gameStarted = false;

    document.getElementById("menu").style.display = "block";

    menuMusic.play();
}


function animate() {

    requestAnimationFrame(animate);

    if (!gameStarted) return;

    velocity += gravity;
    y += velocity;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Bird
    ctx.drawImage(
        bird,
        birdX,
        y,
        birdSize,
        birdSize
    );

    // Pipes
    for (let i = pipes.length - 1; i >= 0; i--) {

        const pipe = pipes[i];

        pipe.x -= 4;

        ctx.fillStyle = "green";

        // Top Pipe
        ctx.fillRect(
            pipe.x,
            0,
            pipe.width,
            pipe.topHeight
        );

        // Bottom Pipe
        ctx.fillRect(
            pipe.x,
            pipe.bottomY,
            pipe.width,
            canvas.height - pipe.bottomY
        );

        // Score
        if (!pipe.scored && pipe.x + pipe.width < birdX) {

            score++;
            pipe.scored = true;

        }

        const hitbox = 40;

if (
    birdX + hitbox > pipe.x &&
    birdX + 20 < pipe.x + pipe.width &&
    (
        y + 15 < pipe.topHeight ||
        y + hitbox > pipe.bottomY
    )
) {

    if (!gameOver) {

    menuMusic.pause();

    deadAudio.currentTime = 0;
    deadAudio.play();

    deadAudio.onended = () => {
        menuMusic.play();
    };
}

gameOver = true;
if (y < 0) {

    if (!gameOver) {

        menuMusic.pause();

        deadAudio.currentTime = 0;
        deadAudio.play();

        deadAudio.onended = () => {
            menuMusic.play();
        };
    }

    gameOver = true;
}
}

        // Remove old pipes
        if (pipe.x < -100) {

            pipes.splice(i, 1);

        }

    }

    // Floor / Ceiling
    if (y < 0) {
        gameOver = true;
    }
if (y + birdSize > canvas.height) {

    if (!gameOver) {

        menuMusic.pause();

        deadAudio.currentTime = 0;
        deadAudio.play();

        deadAudio.onended = () => {
            menuMusic.play();
        };
    }

    gameOver = true;
}
    // Score
    ctx.fillStyle = "black";
    ctx.font = "40px Arial";
    ctx.fillText("Score: " + score, 20, 50);

    // Game Over
    if (gameOver) {

        ctx.fillStyle = "red";
        ctx.font = "70px Arial";
        ctx.fillText(
            "GAME OVER",
            canvas.width / 2 - 220,
            canvas.height / 2
        );

        ctx.font = "30px Arial";

        ctx.fillText(
            "Press R to Restart",
            canvas.width / 2 - 120,
            canvas.height / 2 + 60
        );

    }

}
menuMusic.volume = 0.4;

document.addEventListener("click", () => {
    if (!gameStarted) {
        menuMusic.play();
    }
}, { once: true });
animate();