const bird = document.getElementById("bird");
const gameContainer = document.getElementById("game-container");
const scoreDisplay = document.getElementById("score");
const highScoreDisplay = document.getElementById("high-score");
const gameOverScreen = document.getElementById("game-over");
const boopSound = document.getElementById("boop-sound");

let birdY = 200;
let gravity = 0.6;
let velocity = 0;
let score = 0;
let highScore = 0; // Variable to track high score
let pipes = [];
let gameInterval;
let pipeInterval;
const jumpHeight = gameContainer.offsetHeight / 12;  // Decrease jump height to 1/12th of game screen

// Function to create pipes
function createPipe() {
    const pipeHeight = Math.floor(Math.random() * 200) + 100;
    const gap = 200; // Increase gap between pipes

    // Top pipe
    const topPipe = document.createElement("div");
    topPipe.classList.add("pipe");
    topPipe.style.height = pipeHeight + "px";
    topPipe.style.top = "0";
    topPipe.style.left = "400px";

    // Bottom pipe
    const bottomPipe = document.createElement("div");
    bottomPipe.classList.add("pipe");
    bottomPipe.style.height = gameContainer.offsetHeight - pipeHeight - gap + "px";
    bottomPipe.style.top = pipeHeight + gap + "px";
    bottomPipe.style.left = "400px";

    gameContainer.appendChild(topPipe);
    gameContainer.appendChild(bottomPipe);
    pipes.push({ topPipe, bottomPipe });
}

// Function to update game frame
function updateGame() {
    velocity += gravity;
    birdY += velocity;
    bird.style.top = birdY + "px";

    // Check for collision with top and bottom of the game container
    if (birdY > gameContainer.offsetHeight - bird.offsetHeight || birdY < 0) {
        endGame();
    }

    // Move pipes and detect collision
    pipes.forEach((pipe, index) => {
        let pipeLeft = parseInt(pipe.topPipe.style.left);
        pipeLeft -= 3;
        pipe.topPipe.style.left = pipeLeft + "px";
        pipe.bottomPipe.style.left = pipeLeft + "px";

        // Remove pipe when it moves out of screen
        if (pipeLeft < -pipe.topPipe.offsetWidth) {
            pipe.topPipe.remove();
            pipe.bottomPipe.remove();
            pipes.splice(index, 1);
            score++;
            scoreDisplay.textContent = "Score: " + score;

            // Play boop sound every 5 points
            if (score % 5 === 0) {
                boopSound.currentTime = 0; // Reset sound to start
                boopSound.play(); // Play sound
            }
        }

        // Collision detection with pipes
        if (
            pipeLeft < bird.offsetLeft + bird.offsetWidth &&
            pipeLeft + pipe.topPipe.offsetWidth > bird.offsetLeft &&
            (birdY < parseInt(pipe.topPipe.style.height) ||
                birdY + bird.offsetHeight > parseInt(pipe.bottomPipe.style.top))
        ) {
            endGame();
        }
    });
}

// Function to start the game
function startGame() {
    gameInterval = setInterval(updateGame, 20);
    pipeInterval = setInterval(createPipe, 2000);
}

// Function to end the game
function endGame() {
    clearInterval(gameInterval);
    clearInterval(pipeInterval);
    // Update high score if the current score is greater
    if (score > highScore) {
        highScore = score;
        highScoreDisplay.textContent = "High Score: " + highScore; // Update high score display
    }
    gameOverScreen.style.display = "block";
}

// Reset game function
function resetGame() {
    birdY = 200;
    velocity = 0;
    score = 0;
    scoreDisplay.textContent = "Score: 0";
    pipes.forEach(pipe => {
        pipe.topPipe.remove();
        pipe.bottomPipe.remove();
    });
    pipes = [];
    gameOverScreen.style.display = "none";
    startGame();
}

// Control bird with screen click and spacebar press
document.addEventListener("click", jump);
document.addEventListener("keydown", function(event) {
    if (event.code === "Space") {
        jump();
    }
});

function jump() {
    velocity = -jumpHeight / 6;  // Adjust the upward velocity for smaller jumps
}

// Start the game
startGame();
  