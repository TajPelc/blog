const terminal = document.getElementById('content');
const acceptMissionBtn = document.getElementById('accept-mission');
const hackButton = document.getElementById('hack-button');
const buttonsContainer = document.getElementById('buttons-container');
const cpuMeter = document.getElementById('cpu-meter');

// Typing speed control (lower value = faster typing)
const typingSpeed = 80; // Adjust this value to change typing speed

const headerText = `
BRNO BUNKER OPERATING SYSTEM
BUILD VERSION 6.22
`;

const missionText = `

-= TOP SECRET: MISSION BRIEFING =-

Target Name: Taj Pelc
Gender: Male
Ethnicity: Caucasian
Hair: No hair
Height: 168 cm
Weight: 70 kg
Nationality: Slovenian
Languages: English, German, Slovak

Skills Profile:
• Expert in Technical Leadership
• Specialized in Continuous Delivery
• Advanced Web Development Skills

Note: Target's expertise in these areas makes them a high-value asset for technological operations and potential recruitment.

Mission Objective: Engage target for intelligence gathering at the networking event. Approach with caution.

To access full profile, complete the following security check.`;

const gameInstructions = `
ACCESS DENIED. FIREWALL PROTECTION.

Bypass protection?

1. Use arrow keys or on-screen controls to hack.
2. Collect red data packets.
3. Avoid firewall edges.

Good luck, agent.
`;
const style = document.createElement('style');
style.textContent = `
@keyframes blink {
  0% { opacity: 0; }
  50% { opacity: 1; }
  100% { opacity: 0; }
}
`;
document.head.appendChild(style);
let index = 0;
let isTyping = true;
let currentText = '';

function scrollToBottom() {
    window.scrollTo(0, document.body.scrollHeight);
}

function createCursor() {
    const cursor = document.createElement('span');
    cursor.id = 'cursor';
    cursor.textContent = '_';
    cursor.style.animation = 'blink 0.7s infinite';
    return cursor;
}
function typeText(callback) {
    let cursor = document.getElementById('cursor');
    if (!cursor) {
        cursor = createCursor();
        terminal.appendChild(cursor);
    }

    if (index < currentText.length) {
        const chunkSize = Math.floor(Math.random() * 2) + 1;
        const chunk = currentText.substr(index, chunkSize);
        terminal.insertBefore(document.createTextNode(chunk), cursor);
        index += chunk.length;
        const delay = typingSpeed * (chunk.length / 2);
        setTimeout(() => typeText(callback), delay);
        scrollToBottom();
    } else {
        isTyping = false;
        cursor.remove();
        if (callback) {
            callback();
        }
        scrollToBottom();
    }
}

function startTyping(text, callback) {
    terminal.innerHTML = ''; // Clear terminal
    currentText = text;
    index = 0;
    isTyping = true;
    typeText(callback);
}

startTyping(headerText + missionText, () => {
    buttonsContainer.style.display = 'flex';
});

function updateCPUMeter() {
    const usage = Math.floor(Math.random() * 30) + 70; // Random value between 70-99
    cpuMeter.textContent = `CPU: ${usage}%`;
}

setInterval(updateCPUMeter, 1000); // Update CPU meter every second

let gameCanvas, gameCtx, gameLoop, timerInterval;
let snake, food, direction, turns, gameTime;
let gameState = 'initial'; // 'initial', 'countdown', 'playing', 'failed', 'success'
let packetsCollected = 0;
const GRID_SIZE = 10;
const GAME_SPEED = 150; // Adjust as needed
const TOTAL_PACKETS = 3;

function initializeGame() {
    startTyping(gameInstructions, () => {
        hackButton.style.display = 'block';
    });
}

function startGame() {
    if (!gameCanvas) {
        const gameContainer = document.createElement('div');
        gameContainer.id = 'game-container';

        gameCanvas = document.createElement('canvas');
        gameCanvas.id = 'game-canvas';
        gameCanvas.width = 300;
        gameCanvas.height = 200;

        const gameControls = document.createElement('div');
        gameControls.id = 'game-controls';

        const controlButtons = [
            { id: 'up', text: '↑' },
            { id: 'left', text: '←' },
            { id: 'right', text: '→' },
            { id: 'down', text: '↓' }
        ];

        controlButtons.forEach(button => {
            const btn = document.createElement('button');
            btn.id = button.id;
            btn.textContent = button.text;
            btn.classList.add('control-btn');
            gameControls.appendChild(btn);
        });

        gameContainer.appendChild(gameCanvas);
        gameContainer.appendChild(gameControls);
        terminal.appendChild(gameContainer);

        gameCtx = gameCanvas.getContext('2d');
        setupControls();
    }

    resetGame();
    scrollToBottom();
    startCountdown();
}

function resetGame() {
    snake = [
        { x: 15, y: 10 },
        { x: 14, y: 10 },
        { x: 13, y: 10 },
        { x: 12, y: 10 }
    ];
    direction = { x: 1, y: 0 };
    turns = {};
    gameTime = 60;
    packetsCollected = 0;
    placeFood();
    gameState = 'initial';
    if (timerInterval) clearInterval(timerInterval);

    const retryButton = document.getElementById('retryButton');
    if (retryButton) {
        document.body.removeChild(retryButton);
    }
}

function placeFood() {
    do {
        food = {
            x: Math.floor(Math.random() * (gameCanvas.width / GRID_SIZE)),
            y: Math.floor(Math.random() * (gameCanvas.height / GRID_SIZE))
        };
    } while (snake.some(segment => segment.x === food.x && segment.y === food.y));
}

function drawSnake() {
    gameCtx.fillStyle = '#ffff00';
    snake.forEach(segment => gameCtx.fillRect(segment.x * GRID_SIZE, segment.y * GRID_SIZE, GRID_SIZE, GRID_SIZE));
}

function drawFood() {
    gameCtx.fillStyle = '#ff0000';
    gameCtx.fillRect(food.x * GRID_SIZE, food.y * GRID_SIZE, GRID_SIZE, GRID_SIZE);
}

function clearCanvas() {
    gameCtx.fillStyle = '#000000';
    gameCtx.fillRect(0, 0, gameCanvas.width, gameCanvas.height);
}

function renderGame() {
    clearCanvas();
    drawSnake();
    drawFood();

    gameCtx.fillStyle = '#ffff00';
    gameCtx.font = '16px VT323';
    gameCtx.textAlign = 'left';
    gameCtx.fillText(`Time: ${gameTime}s`, 10, 20);
    gameCtx.fillText(`Packets Collected: ${packetsCollected}/${TOTAL_PACKETS}`, 10, 40);
}
function moveSnake() {
    let head = { ...snake[0] };

    if (turns[head.x + ',' + head.y]) {
        direction = turns[head.x + ',' + head.y];
        delete turns[head.x + ',' + head.y];
    }

    head.x += direction.x;
    head.y += direction.y;

    if (head.x < 0 || head.x >= gameCanvas.width / GRID_SIZE ||
        head.y < 0 || head.y >= gameCanvas.height / GRID_SIZE) {
        return false;
    }

    snake.unshift(head);

    if (head.x === food.x && head.y === food.y) {
        packetsCollected++;
        if (packetsCollected < TOTAL_PACKETS) {
            placeFood();
        }
    } else {
        snake.pop();
    }

    return true;
}

function checkCollision() {
    const head = snake[0];
    return snake.slice(1).some(segment => segment.x === head.x && segment.y === head.y);
}
function updateGame() {
    switch (gameState) {
        case 'playing':
            if (!moveSnake() || checkCollision()) {
                gameState = 'failed';
                renderFailureOverlay();
                clearInterval(gameLoop);
                break;
            }
            if (packetsCollected >= TOTAL_PACKETS) {
                gameState = 'success';
                clearInterval(gameLoop);
                renderSuccessScreen();
                break;
            }
            renderGame();
            break;
        case 'initial':
        case 'countdown':
            renderGame();
            break;
        case 'failed':
            break;
        case 'success':
            renderGame();
            break;
    }
}
function startCountdown() {
    let countdownDuration = 5000;
    let startTime = Date.now();
    gameState = 'countdown';

    function drawCountdown() {
        let elapsedTime = Date.now() - startTime;
        let remainingTime = Math.ceil((countdownDuration - elapsedTime) / 1000);

        if (remainingTime <= 0) {
            gameState = 'playing';
            startTimer();
            renderGame();
            gameLoop = setInterval(updateGame, GAME_SPEED)
            return;
        }

        renderGame();

        gameCtx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        gameCtx.fillRect(0, 0, gameCanvas.width, gameCanvas.height);

        gameCtx.fillStyle = '#ffff00';
        gameCtx.font = '40px VT323';
        gameCtx.textAlign = 'center';
        gameCtx.textBaseline = 'middle';
        gameCtx.fillText(remainingTime, gameCanvas.width / 2, gameCanvas.height / 2);
        gameCtx.font = '16px VT323';
        gameCtx.fillText(`Packets to Collect: ${packetsCollected}/${TOTAL_PACKETS}`, gameCanvas.width / 2, gameCanvas.height / 2 + 40);

        requestAnimationFrame(drawCountdown);
    }

    requestAnimationFrame(drawCountdown);
}

function startTimer() {
    timerInterval = setInterval(() => {
        gameTime--;
        if (gameTime <= 0) {
            clearInterval(timerInterval);
            gameState = 'failed';
        }
    }, 1000);
}

function renderSuccessScreen() {
    const successText = `
Hack successful.
Firewall bypassed.
Full access granted.

> sh load_profile.sh --name=taj --last=pelc

EXECUTING ...

Your subject has left the following hyperlinks:
>
`;

    startTyping(successText, () => {
        const finalButtons = document.createElement('div');
        finalButtons.id = 'final-buttons';
        finalButtons.innerHTML = `
                <a href="https://www.linkedin.com/in/tajpelc" target="_blank" class="final-btn">LinkedIn</a>
                <a href="https://www.pelc.cc/" target="_blank" class="final-btn">Website</a>
                <a href="https://daily.pelc.cc/" target="_blank" class="final-btn">Daily Newsletter</a>
            `;
        terminal.appendChild(finalButtons);
        scrollToBottom();
    });
}
function renderFailureOverlay() {
    renderGame();

    gameCtx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    gameCtx.fillRect(0, 0, gameCanvas.width, gameCanvas.height);

    gameCtx.fillStyle = '#ffff00';
    gameCtx.font = '24px VT323';
    gameCtx.textAlign = 'center';
    gameCtx.textBaseline = 'middle';
    gameCtx.fillText('BYPASS FAILED', gameCanvas.width / 2, gameCanvas.height / 2 - 30);
    gameCtx.font = '16px VT323';
    gameCtx.fillText('This incident will be reported.', gameCanvas.width / 2, gameCanvas.height / 2 + 10);

    if (!document.getElementById('retryButton')) {
        const retryButton = document.createElement('button');
        retryButton.id = 'retryButton';
        retryButton.textContent = 'RETRY';
        retryButton.style.position = 'absolute';
        retryButton.style.left = '50%';
        retryButton.style.top = `${gameCanvas.offsetTop + gameCanvas.height / 2 + 60}px`;
        retryButton.style.transform = 'translateX(-50%)';
        retryButton.style.width = '100px';
        retryButton.style.padding = '10px';
        retryButton.style.backgroundColor = '#ffff00';
        retryButton.style.color = '#000000';
        retryButton.style.border = 'none';
        retryButton.style.fontFamily = 'VT323, monospace';
        retryButton.style.fontSize = '18px';
        retryButton.style.cursor = 'pointer';

        retryButton.addEventListener('click', () => {
            document.body.removeChild(retryButton);
            resetGame();
            startCountdown();
        });

        document.body.appendChild(retryButton);
    }
}
function setupControls() {
    function handleKeyPress(e) {
        if (gameState === 'playing') {
            const head = snake[0];
            switch (e.key) {
                case 'ArrowUp': if (direction.y === 0) turns[head.x + ',' + head.y] = { x: 0, y: -1 }; break;
                case 'ArrowDown': if (direction.y === 0) turns[head.x + ',' + head.y] = { x: 0, y: 1 }; break;
                case 'ArrowLeft': if (direction.x === 0) turns[head.x + ',' + head.y] = { x: -1, y: 0 }; break;
                case 'ArrowRight': if (direction.x === 0) turns[head.x + ',' + head.y] = { x: 1, y: 0 }; break;
            }
        }
        e.preventDefault();
    }

    document.addEventListener('keydown', handleKeyPress);

    gameCanvas.addEventListener('click', () => {
        if (gameState === 'initial') {
            resetGame();
            startCountdown();
        }
    });

    document.getElementById('up').addEventListener('click', () => {
        if (direction.y === 0 && gameState === 'playing')
            turns[snake[0].x + ',' + snake[0].y] = { x: 0, y: -1 };
    });
    document.getElementById('down').addEventListener('click', () => {
        if (direction.y === 0 && gameState === 'playing')
            turns[snake[0].x + ',' + snake[0].y] = { x: 0, y: 1 };
    });
    document.getElementById('left').addEventListener('click', () => {
        if (direction.x === 0 && gameState === 'playing')
            turns[snake[0].x + ',' + snake[0].y] = { x: -1, y: 0 };
    });
    document.getElementById('right').addEventListener('click', () => {
        if (direction.x === 0 && gameState === 'playing')
            turns[snake[0].x + ',' + snake[0].y] = { x: 1, y: 0 };
    });
}

document.addEventListener('DOMContentLoaded', () => {
    startTyping(headerText + missionText, () => {
        acceptMissionBtn.style.display = 'block';
    });

    acceptMissionBtn.addEventListener('click', () => {
        acceptMissionBtn.style.display = 'none';
        initializeGame();
    });

    hackButton.addEventListener('click', () => {
        hackButton.style.display = 'none';
        startGame();
    });
});
