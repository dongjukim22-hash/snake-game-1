const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');
const scoreEl = document.getElementById('score');
const pauseBtn = document.getElementById('pause-btn');
const resumeBtn = document.getElementById('resume-btn');
const gameOverDiv = document.getElementById('game-over');
const restartBtn = document.getElementById('restart-btn');

const gridSize = 20; // 20x20 grid
const tileSize = canvas.width / gridSize;

let snake, direction, nextDirection, food, score, speed, interval, isPaused, isGameOver;

// 간단한 사운드 효과 (짧은 beep)
const eatSound = new Audio();
eatSound.src = "assets/beep.wav"; // assets 폴더에 beep.wav 파일을 준비하거나, 이 줄을 주석처리해도 무방

function resetGame() {
  snake = [{x: 10, y: 10}];
  direction = {x: 1, y: 0};
  nextDirection = {x: 1, y: 0};
  score = 0;
  speed = 120;
  isPaused = false;
  isGameOver = false;
  placeFood();
  updateScore();
  gameOverDiv.style.display = 'none';
}

function placeFood() {
  while (true) {
    food = {
      x: Math.floor(Math.random() * gridSize),
      y: Math.floor(Math.random() * gridSize)
    };
    if (!snake.some(seg => seg.x === food.x && seg.y === food.y)) break;
  }
}

function drawBoard() {
  ctx.fillStyle = "#222";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function drawSnake() {
  ctx.fillStyle = "#4caf50";
  snake.forEach((seg, i) => {
    ctx.fillRect(seg.x * tileSize, seg.y * tileSize, tileSize, tileSize);
    if (i === 0) {
      ctx.fillStyle = "#388e3c";
      ctx.fillRect(seg.x * tileSize, seg.y * tileSize, tileSize, tileSize);
      ctx.fillStyle = "#4caf50";
    }
  });
}

function drawFood() {
  ctx.fillStyle = "#ffeb3b";
  ctx.fillRect(food.x * tileSize, food.y * tileSize, tileSize, tileSize);
}

function updateScore() {
  scoreEl.textContent = score;
}

function gameLoop() {
  if (isPaused || isGameOver) return;

  // 방향 업데이트
  direction = nextDirection;

  // 새로운 머리 위치 계산
  const newHead = {
    x: snake[0].x + direction.x,
    y: snake[0].y + direction.y
  };

  // 벽 충돌
  if (
    newHead.x < 0 || newHead.x >= gridSize ||
    newHead.y < 0 || newHead.y >= gridSize
  ) {
    return endGame();
  }

  // 자기 몸 충돌
  if (snake.some(seg => seg.x === newHead.x && seg.y === newHead.y)) {
    return endGame();
  }

  // 이동
  snake.unshift(newHead);

  // 먹이 먹음
  if (newHead.x === food.x && newHead.y === food.y) {
    score++;
    updateScore();
    placeFood();
    if (eatSound && eatSound.play) eatSound.play();
    // 속도 증가
    if (speed > 50) speed -= 4;
    clearInterval(interval);
    interval = setInterval(gameLoop, speed);
  } else {
    snake.pop();
  }

  drawBoard();
  drawSnake();
  drawFood();
}

function endGame() {
  isGameOver = true;
  clearInterval(interval);
  gameOverDiv.style.display = 'flex';
}

function handleKey(e) {
  if (isGameOver) return;
  switch (e.key) {
    case "ArrowUp":
    case "w":
      if (direction.y === 0) nextDirection = {x: 0, y: -1};
      break;
    case "ArrowDown":
    case "s":
      if (direction.y === 0) nextDirection = {x: 0, y: 1};
      break;
    case "ArrowLeft":
    case "a":
      if (direction.x === 0) nextDirection = {x: -1, y: 0};
      break;
    case "ArrowRight":
    case "d":
      if (direction.x === 0) nextDirection = {x: 1, y: 0};
      break;
    case " ":
      if (!isPaused) pauseGame();
      else resumeGame();
      break;
  }
}

function pauseGame() {
  isPaused = true;
  pauseBtn.style.display = 'none';
  resumeBtn.style.display = '';
}

function resumeGame() {
  if (isGameOver) return;
  isPaused = false;
  pauseBtn.style.display = '';
  resumeBtn.style.display = 'none';
}

pauseBtn.onclick = pauseGame;
resumeBtn.onclick = resumeGame;
restartBtn && (restartBtn.onclick = () => {
  resetGame();
  interval = setInterval(gameLoop, speed);
});

window.addEventListener('keydown', handleKey);

resetGame();
drawBoard();
drawSnake();
drawFood();
interval = setInterval(gameLoop, speed);
