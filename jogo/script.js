const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");
const dificuldadeSelect = document.getElementById("dificuldade");

let player = { x: 10, y: canvas.height / 2 - 50, w: 10, h: 100, score: 0 };
let cpu = { x: canvas.width - 20, y: canvas.height / 2 - 50, w: 10, h: 100, score: 0 };
let ball = { x: canvas.width / 2, y: canvas.height / 2, r: 10, dx: 5, dy: 5 };
let extraBalls = [];
let powerUps = [];
let dificuldade = 'facil';
let baseSpeed = 5;
let ballHits = 0;

let ballSpeedMultiplier = {
  facil: 1,
  medio: 1.3,
  dificil: 1.6
};

dificuldadeSelect.addEventListener("change", () => {
  dificuldade = dificuldadeSelect.value;
});

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

function resetBall(ballObj = ball) {
  ballObj.x = canvas.width / 2;
  ballObj.y = canvas.height / 2;
  let angle = (Math.random() * Math.PI / 2) - Math.PI / 4;
  let speed = baseSpeed * ballSpeedMultiplier[dificuldade];
  let direction = Math.random() > 0.5 ? 1 : -1;
  ballObj.dx = direction * speed * Math.cos(angle);
  ballObj.dy = speed * Math.sin(angle);
  ballHits = 0;
}

function updateCPU() {
  let erroFactor = dificuldade === 'facil' ? 0.3 : dificuldade === 'medio' ? 0.2 : 0.1;
  let centerCPU = cpu.y + cpu.h / 2;
  let targetY = ball.y + (Math.random() - 0.5) * 30 * erroFactor;
  if (centerCPU < targetY - 10) cpu.y += 5;
  else if (centerCPU > targetY + 10) cpu.y -= 5;
}

function spawnPowerUp() {
  if (powerUps.length < 5 && Math.random() < 0.01) {
    const types = ['aumentar', 'duplicar'];
    powerUps.push({
      x: Math.random() * (canvas.width - 20) + 10,
      y: Math.random() * (canvas.height - 20) + 10,
      r: 10,
      type: types[Math.floor(Math.random() * types.length)]
    });
  }
}

function checkPowerUpCollisionBall(ballObj) {
  powerUps = powerUps.filter((p) => {
    const dx = ballObj.x - p.x;
    const dy = ballObj.y - p.y;
    const dist = Math.sqrt(dx * dx + dy * dy);
    if (dist < ballObj.r + p.r) {
      if (p.type === 'aumentar') {
        player.h += 30;
      } else if (p.type === 'duplicar') {
        const newBall = { ...ball };
        resetBall(newBall);
        extraBalls.push(newBall);
        setTimeout(() => {
          extraBalls = extraBalls.filter(b => b !== newBall);
        }, 10000);
      }
      return false;
    }
    return true;
  });
}

function drawBall(ballObj) {
  drawCircle(ballObj.x, ballObj.y, ballObj.r, 'white');
}

function moveBall(ballObj) {
  ballObj.x += ballObj.dx;
  ballObj.y += ballObj.dy;

  if (ballObj.y + ballObj.r > canvas.height || ballObj.y - ballObj.r < 0) ballObj.dy *= -1;

  if (
    ballObj.x - ballObj.r < player.x + player.w &&
    ballObj.y > player.y && ballObj.y < player.y + player.h
  ) {
    ballHits++;
    let speed = (baseSpeed + ballHits * 0.2) * ballSpeedMultiplier[dificuldade];
    ballObj.dx = Math.abs(speed);
    if (ballObj.x < canvas.width / 2) ballObj.dx *= -1;
    let angle = (Math.random() * Math.PI / 2) - Math.PI / 4;
    ballObj.dy = speed * Math.sin(angle);
  }

  if (
    ballObj.x + ballObj.r > cpu.x &&
    ballObj.y > cpu.y && ballObj.y < cpu.y + cpu.h
  ) {
    ballHits++;
    let speed = (baseSpeed + ballHits * 0.2) * ballSpeedMultiplier[dificuldade];
    ballObj.dx = -Math.abs(speed);
    if (ballObj.x > canvas.width / 2) ballObj.dx *= -1;
    let angle = (Math.random() * Math.PI / 2) - Math.PI / 4;
    ballObj.dy = speed * Math.sin(angle);
  }

  if (ballObj.x + ballObj.r < 0) {
    cpu.score++;
    resetBall(ballObj);
  } else if (ballObj.x - ballObj.r > canvas.width) {
    player.score++;
    resetBall(ballObj);
  }

  checkPowerUpCollisionBall(ballObj);
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawRect(player.x, player.y, player.w, player.h, 'white');
  drawRect(cpu.x, cpu.y, cpu.w, cpu.h, 'white');
  drawBall(ball);
  extraBalls.forEach(drawBall);

  powerUps.forEach(p => {
    drawCircle(p.x, p.y, p.r, p.type === 'aumentar' ? 'green' : 'blue');
  });

  ctx.fillText(`Player: ${player.score}`, 100, 20);
  ctx.fillText(`CPU: ${cpu.score}`, canvas.width - 150, 20);
}

function update() {
  moveBall(ball);
  extraBalls.forEach(moveBall);
  updateCPU();
  spawnPowerUp();
}

function loop() {
  update();
  draw();
  requestAnimationFrame(loop);
}

document.addEventListener("mousemove", (e) => {
  player.y = e.clientY - canvas.getBoundingClientRect().top - player.h / 2;
});

resetBall();
loop();
