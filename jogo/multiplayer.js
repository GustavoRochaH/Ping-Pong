const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

let player1 = { x: 10, y: canvas.height / 2 - 50, w: 10, h: 100, score: 0, dy: 0 };
let player2 = { x: canvas.width - 20, y: canvas.height / 2 - 50, w: 10, h: 100, score: 0, dy: 0 };
let ball = { x: canvas.width / 2, y: canvas.height / 2, r: 10, dx: 5, dy: 5 };

function drawRect(x, y, w, h, color) {
  ctx.fillStyle = color;
  ctx.fillRect(x, y, w, h);
}

function drawCircle(x, y, r, color) {
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
  ctx.fill();
}

function resetBall() {
  ball.x = canvas.width / 2;
  ball.y = canvas.height / 2;
  let angle = (Math.random() * Math.PI / 2) - Math.PI / 4;
  let direction = Math.random() > 0.5 ? 1 : -1;
  ball.dx = direction * 5 * Math.cos(angle);
  ball.dy = 5 * Math.sin(angle);
}

function moveBall() {
  ball.x += ball.dx;
  ball.y += ball.dy;

  if (ball.y + ball.r > canvas.height || ball.y - ball.r < 0) ball.dy *= -1;

  if (
    ball.x - ball.r < player1.x + player1.w &&
    ball.y > player1.y && ball.y < player1.y + player1.h
  ) {
    ball.dx = Math.abs(ball.dx);
  }

  if (
    ball.x + ball.r > player2.x &&
    ball.y > player2.y && ball.y < player2.y + player2.h
  ) {
    ball.dx = -Math.abs(ball.dx);
  }

  if (ball.x + ball.r < 0) {
    player2.score++;
    resetBall();
  } else if (ball.x - ball.r > canvas.width) {
    player1.score++;
    resetBall();
  }
}

function movePlayers() {
  player1.y += player1.dy;
  player2.y += player2.dy;

  // Limites da tela
  player1.y = Math.max(0, Math.min(canvas.height - player1.h, player1.y));
  player2.y = Math.max(0, Math.min(canvas.height - player2.h, player2.y));
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  drawRect(player1.x, player1.y, player1.w, player1.h, 'white');
  drawRect(player2.x, player2.y, player2.w, player2.h, 'white');
  drawCircle(ball.x, ball.y, ball.r, 'white');

  ctx.fillStyle = 'white';
  ctx.font = '20px Arial';
  ctx.fillText(`Jogador 1: ${player1.score}`, 50, 30);
  ctx.fillText(`Jogador 2: ${player2.score}`, canvas.width - 180, 30);
}

function update() {
  movePlayers();
  moveBall();
}

function gameLoop() {
  update();
  draw();
  requestAnimationFrame(gameLoop);
}

// Controles
document.addEventListener("keydown", (e) => {
  if (e.key === "w") player1.dy = -5;
  if (e.key === "s") player1.dy = 5;
  if (e.key === "ArrowUp") player2.dy = -5;
  if (e.key === "ArrowDown") player2.dy = 5;
});

document.addEventListener("keyup", (e) => {
  if (e.key === "w" || e.key === "s") player1.dy = 0;
  if (e.key === "ArrowUp" || e.key === "ArrowDown") player2.dy = 0;
});

resetBall();
gameLoop();
