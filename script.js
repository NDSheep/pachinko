const canvas = document.getElementById('pachinko-board');
const ctx = canvas.getContext('2d');
const launchButton = document.getElementById('launch-ball');
const scoreElement = document.getElementById('score');

canvas.width = 400;
canvas.height = 600;

const ballRadius = 10;
const pegRadius = 5;
const slotWidth = 80;
const slotHeight = 40;

let ball = null;
let score = 0;

const pegs = [];
const slots = [];

// Create pegs
for (let row = 0; row < 8; row++) {
    for (let col = 0; col < 7; col++) {
        pegs.push({
            x: 50 + col * 50 + (row % 2 ? 25 : 0),
            y: 100 + row * 50
        });
    }
}

// Create scoring slots
for (let i = 0; i < 5; i++) {
    slots.push({
        x: i * slotWidth,
        y: canvas.height - slotHeight,
        width: slotWidth,
        height: slotHeight,
        score: (i === 0 || i === 4) ? 10 : (i === 1 || i === 3) ? 50 : 100
    });
}

function drawPegs() {
    pegs.forEach(peg => {
        ctx.beginPath();
        ctx.arc(peg.x, peg.y, pegRadius, 0, Math.PI * 2);
        ctx.fillStyle = '#333';
        ctx.fill();
        ctx.closePath();
    });
}

function drawSlots() {
    slots.forEach(slot => {
        ctx.fillStyle = '#ddd';
        ctx.fillRect(slot.x, slot.y, slot.width, slot.height);
        ctx.strokeStyle = '#333';
        ctx.strokeRect(slot.x, slot.y, slot.width, slot.height);
        ctx.fillStyle = '#333';
        ctx.font = '16px Arial';
        ctx.fillText(slot.score, slot.x + slot.width / 2 - 10, slot.y + slot.height / 2 + 5);
    });
}

function drawBall() {
    if (ball) {
        ctx.beginPath();
        ctx.arc(ball.x, ball.y, ballRadius, 0, Math.PI * 2);
        ctx.fillStyle = 'red';
        ctx.fill();
        ctx.closePath();
    }
}

function updateBall() {
    if (ball) {
        ball.vy += 0.2; // Gravity
        ball.x += ball.vx;
        ball.y += ball.vy;

        // Collision with pegs
        pegs.forEach(peg => {
            const dx = ball.x - peg.x;
            const dy = ball.y - peg.y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < ballRadius + pegRadius) {
                const angle = Math.atan2(dy, dx);
                ball.vx = Math.cos(angle) * 2;
                ball.vy = Math.sin(angle) * 2;
            }
        });

        // Collision with walls
        if (ball.x < ballRadius || ball.x > canvas.width - ballRadius) {
            ball.vx *= -0.8;
        }

        // Check if ball is in a slot
        slots.forEach(slot => {
            if (
                ball.x > slot.x &&
                ball.x < slot.x + slot.width &&
                ball.y > slot.y &&
                ball.y < slot.y + slot.height
            ) {
                score += slot.score;
                scoreElement.textContent = `Score: ${score}`;
                ball = null;
            }
        });

        // Ball out of bounds
        if (ball && ball.y > canvas.height) {
            ball = null;
        }
    }
}

function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawPegs();
    drawSlots();
    drawBall();
    updateBall();
    requestAnimationFrame(gameLoop);
}

launchButton.addEventListener('click', () => {
    if (!ball) {
        ball = {
            x: canvas.width / 2,
            y: 20,
            vx: (Math.random() - 0.5) * 4,
            vy: 0
        };
    }
});

gameLoop();

