// Game configuration
const config = {
  ballCount: 1,
  ballRadius: 20,
  gravity: 0.2,
  bounceVelocity: -8,
  handRadius: 50,
  countdownTime: 3, // Seconds before game starts
};

// Game state
let gameState = {
  balls: [],
  hands: [],
  score: 0,
  gameOver: false,
  startTime: null,
  animationId: null,
  countdown: 0,
  isCountingDown: false,
};

// Canvas setup
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const HIT_COOLDOWN = 250; // milliseconds
// UI elements
const overlay = document.getElementById("overlay");
const startButton = document.getElementById("startButton");
const timeScoreDisplay = document.getElementById("timeScore");
const touchScoreDisplay = document.getElementById("touchScore");
const overlayMessage = document.getElementById("overlayMessage");
const loadingOverlay = document.getElementById("loadingOverlay");
const loadingStatus = document.getElementById("loadingStatus");

// Initialize balls
function initBalls() {
  gameState.balls = [];
  for (let i = 0; i < config.ballCount; i++) {
    gameState.balls.push({
      x: canvas.width / 2,
      y: 100,
      vx: 0,
      vy: 0,
      radius: config.ballRadius,
      color: `hsl(${i * 120}, 70%, 60%)`,
      lastHitTime: 0,
    });    
  }
}

// Update ball physics
function updateBalls() {
  gameState.balls.forEach((ball) => {
    // Apply gravity
    ball.vy += config.gravity;

    // Update position
    ball.x += ball.vx;
    ball.y += ball.vy;
    ball.vx = Math.max(-6, Math.min(6, ball.vx));
    ball.vy = Math.max(-12, Math.min(12, ball.vy));

    // Bounce off left/right walls
    if (ball.x - ball.radius < 0 || ball.x + ball.radius > canvas.width) {
      ball.vx *= -1;
      ball.x =
        ball.x < canvas.width / 2 ? ball.radius : canvas.width - ball.radius;
    }
    

    // Bounce off top
    if (ball.y - ball.radius < 0) {
      ball.vy *= -1;
      ball.y = ball.radius;
    }
  });
}

// Check collisions between balls and hands
function checkCollisions() {
  const now = performance.now();

  gameState.balls.forEach((ball) => {
    for (let i = 0; i < gameState.hands.length; i++) {
      const hand = gameState.hands[i];

      const dx = ball.x - hand.x;
      const dy = ball.y - hand.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      const hitDistance = ball.radius + config.handRadius;

      // Hard cooldown gate
      if (
        distance < hitDistance &&
        now - ball.lastHitTime > HIT_COOLDOWN
      ) {
        ball.lastHitTime = now;

        // Score 
        gameState.touchScore += 1;
        touchScoreDisplay.textContent = gameState.touchScore;

        // Physics 
        ball.vy = config.bounceVelocity;
        ball.vx += dx * 0.07;

        break; // STOP checking other hands
      }
    }
  });
}

function updateScore() {
  if (gameState.startTime && !gameState.gameOver) {
    gameState.score = Math.floor((Date.now() - gameState.startTime) / 1000);
    timeScoreDisplay.textContent = gameState.score;
  }
}

// Check if any ball fell off screen
function checkGameOver() {
  return gameState.balls.some((ball) => ball.y - ball.radius > canvas.height);
}

// Update score (time in seconds)
function updateScore1() {
  if (gameState.startTime && !gameState.gameOver) {
    gameState.score = Math.floor((Date.now() - gameState.startTime) / 1000);
    scoreDisplay.textContent = gameState.score;
  }
}

// Render everything
function render() {
  // Draw video feed directly onto canvas (mirrored)
  const webcam = document.getElementById("webcam");
  if (webcam && webcam.readyState === webcam.HAVE_ENOUGH_DATA) {
    ctx.save();
    // Mirror the video horizontally
    ctx.scale(-1, 1);
    ctx.drawImage(webcam, -canvas.width, 0, canvas.width, canvas.height);
    ctx.restore();

    // Add semi-transparent overlay for better game element visibility
    ctx.fillStyle = "rgba(0, 0, 0, 0.3)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  } else {
    // Fallback if video not ready
    ctx.fillStyle = "#000";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }

  // Draw balls
  gameState.balls.forEach((ball) => {
    ctx.fillStyle = ball.color;
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
    ctx.fill();

    // Add white outline for visibility
    ctx.strokeStyle = "white";
    ctx.lineWidth = 2;
    ctx.stroke();
  });

  // Draw hand zones as paddles
  gameState.hands.forEach((hand, index) => {
    // Outer circle
    ctx.strokeStyle = "rgba(255, 255, 255, 0.8)";
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.arc(hand.x, hand.y, config.handRadius, 0, Math.PI * 2);
    ctx.stroke();

    // Inner fill
    ctx.fillStyle = "rgba(100, 200, 255, 0.3)";
    ctx.fill();

    // Center dot
    ctx.fillStyle = "white";
    ctx.beginPath();
    ctx.arc(hand.x, hand.y, 5, 0, Math.PI * 2);
    ctx.fill();

    // Hand label
    ctx.fillStyle = "white";
    ctx.font = "bold 16px Arial";
    ctx.textAlign = "center";
    ctx.fillText(`Hand ${index + 1}`, hand.x, hand.y - config.handRadius - 10);
  });

  // Draw countdown if active
  if (gameState.isCountingDown) {
    ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = "white";
    ctx.font = "bold 72px Arial";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(
      Math.ceil(gameState.countdown),
      canvas.width / 2,
      canvas.height / 2,
    );

    ctx.font = "bold 24px Arial";
    ctx.fillText("Get Ready!", canvas.width / 2, canvas.height / 2 + 60);
  }
}

// Main game loop
function gameLoop() {
  if (gameState.gameOver) return;

  // Handle countdown
  if (gameState.isCountingDown) {
    gameState.countdown -= 1 / 60; // Decrease by frame time (assuming 60fps)

    if (gameState.countdown <= 0) {
      gameState.isCountingDown = false;
      gameState.startTime = Date.now(); // Start timer after countdown
    }
  } else {
    // Only update game logic after countdown finishes
    updateBalls();
    checkCollisions();
    updateScore();
    updateScore1();

    // Check lose condition
    if (checkGameOver()) {
      endGame();
      return;
    }
  }

  render();
  gameState.animationId = requestAnimationFrame(gameLoop);
}

// Start game
async function startGame() {
  gameState.gameOver = false;
  gameState.startTime = null; // Will be set after countdown
  gameState.score = 0;
  gameState.hands = [];
  gameState.countdown = config.countdownTime;
  gameState.isCountingDown = true;
  gameState.touchScore = 0;
  touchScoreDisplay.textContent = "0";

  initBalls();

  // Initialize hand tracking if not already done
  if (!window.handTrackingInitialized) {
    // Show loading overlay
    loadingOverlay.classList.remove("hidden");
    loadingStatus.textContent = "Requesting camera access...";

    const webcam = document.getElementById("webcam");

    // Update loading status
    loadingStatus.textContent = "Loading MediaPipe Hands model...";

    const success = await window.handTracking.setupHandTracking(
      webcam,
      function receiveHands(hands) {
        gameState.hands = hands;
      },
    );

    // Hide loading overlay
    loadingOverlay.classList.add("hidden");

    if (!success) {
      endGame();
      overlayMessage.textContent = "Camera access required to play!";
      return;
    }

    window.handTracking.startDetection();
    window.handTrackingInitialized = true;
  }

  overlay.classList.add("hidden");
  gameLoop();
}

// End game
function endGame() {
  gameState.gameOver = true;
  cancelAnimationFrame(gameState.animationId);

  // Create game over message with better formatting
  const emoji =
    gameState.score > 30 ? "🎉" : gameState.score > 15 ? "👏" : "💪";
  const message =
    gameState.score > 30
      ? "Amazing!"
      : gameState.score > 15
        ? "Great Job!"
        : "Game Over!";

  overlayMessage.innerHTML = `
        <div style="font-size: 3rem; margin-bottom: 0.5rem;">${emoji}</div>
        <div style="font-size: 2rem; margin-bottom: 0.5rem;">${message}</div>
        <div style="font-size: 1.2rem; color: #666; font-family: 'Poppins', sans-serif; font-weight: 600;">
            You survived ${gameState.score} seconds
        </div>
    `;
  startButton.textContent = "Play Again";
  overlay.classList.remove("hidden");
}

// Event listeners
startButton.addEventListener("click", startGame);

// Check if TensorFlow.js is loaded
function checkTensorFlowLoaded() {
  if (typeof tf !== "undefined" && typeof handPoseDetection !== "undefined") {
    // TensorFlow.js and dependencies loaded
    loadingOverlay.classList.add("hidden");
  } else {
    // Check again after a short delay
    setTimeout(checkTensorFlowLoaded, 100);
  }
}

// Start checking once DOM is loaded
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", checkTensorFlowLoaded);
} else {
  checkTensorFlowLoaded();
}

// Initial render
render();