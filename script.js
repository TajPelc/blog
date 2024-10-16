const terminal = document.getElementById('content');
const acceptMissionBtn = document.getElementById('accept-mission');
const hackButton = document.getElementById('hack-button');
const buttonsContainer = document.getElementById('buttons-container');
const cpuMeter = document.getElementById('cpu-meter');

// Typing speed control (lower value = faster typing)
const typingSpeed = 75; // Adjust this value to change typing speed

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
function getScreenShakeOffset() {
    if (screenShake.duration > 0) {
        const progress = (Date.now() - screenShake.start) / screenShake.duration;
        if (progress < 1) {
            const decreasingIntensity = screenShake.intensity * (1 - progress);
            return {
                x: (Math.random() - 0.5) * 2 * decreasingIntensity,
                y: (Math.random() - 0.5) * 2 * decreasingIntensity
            };
        } else {
            screenShake.duration = 0; // Stop shaking
        }
    }
    return { x: 0, y: 0 };
}

let audioContext;
let gainNode;
let audioInitialized = false;

function initAudio() {
    if (audioInitialized) return;
    
    try {
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
        gainNode = audioContext.createGain();
        gainNode.connect(audioContext.destination);
        gainNode.gain.setValueAtTime(0.1, audioContext.currentTime); // Set volume
        
        audioInitialized = true;
        console.log('Audio initialized successfully');
    } catch (error) {
        console.error('Failed to initialize audio:', error);
    }
}
function ensureAudioContext() {
    if (audioContext && audioContext.state === 'suspended') {
        audioContext.resume().then(() => {
            console.log('AudioContext resumed successfully');
        }).catch(error => {
            console.error('Failed to resume AudioContext:', error);
        });
    }
}

function playTone(frequency, duration, type = 'square') {
    if (!audioInitialized) {
        console.warn('Audio not initialized. Cannot play tone.');
        return;
    }
    ensureAudioContext();
    
    try {
        const oscillator = audioContext.createOscillator();
        oscillator.type = type;
        oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime);
        oscillator.connect(gainNode);
        oscillator.start();
        oscillator.stop(audioContext.currentTime + duration);
        console.log(`Playing tone: ${frequency}Hz for ${duration}s`);
    } catch (error) {
        console.error('Failed to play tone:', error);
    }
}
function playCollectSound() {
    if (!audioInitialized) {
        console.warn('Audio not initialized. Cannot play collect sound.');
        return;
    }
    ensureAudioContext();
    
    try {
        const duration = 0.15;
        const fadeOutTime = 0.05;

        // Create an oscillator for a softer sine wave
        const oscillator = audioContext.createOscillator();
        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(440, audioContext.currentTime); // A4 note
        oscillator.frequency.exponentialRampToValueAtTime(880, audioContext.currentTime + duration); // Glide to A5

        // Create a gain node for volume control and fade out
        const gainNode = audioContext.createGain();
        gainNode.gain.setValueAtTime(0.1, audioContext.currentTime); // Start at lower volume
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration);

        // Connect nodes
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);

        // Play sound
        oscillator.start();
        oscillator.stop(audioContext.currentTime + duration);

        console.log('Playing improved collect sound');
    } catch (error) {
        console.error('Failed to play collect sound:', error);
    }
}


function playGameOverSound() {
    if (!audioInitialized) {
        console.warn('Audio not initialized. Cannot play game over sound.');
        return;
    }
    playTone(294.66, 0.2);
    setTimeout(() => playTone(277.18, 0.2), 250);
    setTimeout(() => playTone(261.63, 0.3), 500);
}
function playSnakeMoveSound() {
    if (!audioInitialized) {
        console.warn('Audio not initialized. Cannot play snake move sound.');
        return;
    }
    ensureAudioContext();
    try {
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();

        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(220, audioContext.currentTime); // A3 note
        
        gainNode.gain.setValueAtTime(0.05, audioContext.currentTime); // Start quiet
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1); // Quick fade out

        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);

        oscillator.start();
        oscillator.stop(audioContext.currentTime + 0.1);
    } catch (error) {
        console.error('Failed to play snake move sound:', error);
    }
}
function playExplosionSound() {
    if (!audioInitialized) {
        console.warn('Audio not initialized. Cannot play explosion sound.');
        return;
    }
    ensureAudioContext();
    try {
        const duration = 2;
        const currentTime = audioContext.currentTime;

        // Master gain node - Significantly reduced initial volume
        const masterGain = audioContext.createGain();
        masterGain.gain.setValueAtTime(0.2, currentTime); // Reduced from 0.8 to 0.2
        masterGain.gain.exponentialRampToValueAtTime(0.001, currentTime + duration);
        masterGain.connect(audioContext.destination);

        // 1. Initial transient (sharp attack) - Reduced volume
        const transient = audioContext.createOscillator();
        const transientGain = audioContext.createGain();
        transient.frequency.setValueAtTime(100, currentTime);
        transient.frequency.exponentialRampToValueAtTime(20, currentTime + 0.1);
        transientGain.gain.setValueAtTime(0.3, currentTime); // Reduced from 1 to 0.3
        transientGain.gain.exponentialRampToValueAtTime(0.01, currentTime + 0.1);
        transient.connect(transientGain).connect(masterGain);
        transient.start(currentTime);
        transient.stop(currentTime + 0.1);

        // 2. Low-frequency rumble - Adjusted for less intensity
        const rumble = audioContext.createBufferSource();
        const rumbleBuffer = audioContext.createBuffer(1, audioContext.sampleRate * duration, audioContext.sampleRate);
        const rumbleData = rumbleBuffer.getChannelData(0);
        for (let i = 0; i < rumbleBuffer.length; i++) {
            rumbleData[i] = (Math.random() * 2 - 1) * Math.exp(-i / (audioContext.sampleRate * 0.5)) * 0.5; // Reduced amplitude
        }
        rumble.buffer = rumbleBuffer;
        const rumbleLowpass = audioContext.createBiquadFilter();
        rumbleLowpass.type = 'lowpass';
        rumbleLowpass.frequency.setValueAtTime(100, currentTime); // Lowered from 120 to 100
        rumble.connect(rumbleLowpass).connect(masterGain);
        rumble.start(currentTime);

        // 3. Mid-range crackle - Slightly reduced
        const crackle = audioContext.createBufferSource();
        const crackleBuffer = audioContext.createBuffer(1, audioContext.sampleRate * duration, audioContext.sampleRate);
        const crackleData = crackleBuffer.getChannelData(0);
        for (let i = 0; i < crackleBuffer.length; i++) {
            crackleData[i] = (Math.random() * 2 - 1) * Math.exp(-i / (audioContext.sampleRate * 0.2)) * 0.7; // Reduced amplitude
        }
        crackle.buffer = crackleBuffer;
        const crackleBandpass = audioContext.createBiquadFilter();
        crackleBandpass.type = 'bandpass';
        crackleBandpass.frequency.setValueAtTime(800, currentTime); // Lowered from 1000 to 800
        crackleBandpass.Q.setValueAtTime(0.5, currentTime); // Reduced Q for a wider, less harsh band
        crackle.connect(crackleBandpass).connect(masterGain);
        crackle.start(currentTime);

        // 4. High-frequency hiss - Reduced significantly
        const hiss = audioContext.createBufferSource();
        const hissBuffer = audioContext.createBuffer(1, audioContext.sampleRate * duration, audioContext.sampleRate);
        const hissData = hissBuffer.getChannelData(0);
        for (let i = 0; i < hissBuffer.length; i++) {
            hissData[i] = (Math.random() * 2 - 1) * Math.exp(-i / (audioContext.sampleRate * 0.1)) * 0.3; // Significantly reduced amplitude
        }
        hiss.buffer = hissBuffer;
        const hissHighpass = audioContext.createBiquadFilter();
        hissHighpass.type = 'highpass';
        hissHighpass.frequency.setValueAtTime(2000, currentTime); // Lowered from 3000 to 2000
        hiss.connect(hissHighpass).connect(masterGain);
        hiss.start(currentTime);

        // Compression for consistency, but with gentler settings
        const compressor = audioContext.createDynamicsCompressor();
        compressor.threshold.setValueAtTime(-15, currentTime);
        compressor.knee.setValueAtTime(15, currentTime);
        compressor.ratio.setValueAtTime(10, currentTime); // Reduced from 20 to 10
        compressor.attack.setValueAtTime(0.005, currentTime); // Slight attack to soften initial transient
        compressor.release.setValueAtTime(0.1, currentTime);
        masterGain.connect(compressor);
        compressor.connect(audioContext.destination);

        console.log('Playing volume-adjusted explosion sound');
    } catch (error) {
        console.error('Failed to play explosion sound:', error);
    }
}

function createBandpassFilter(frequency, Q) {
    const filter = audioContext.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(frequency, audioContext.currentTime);
    filter.Q.setValueAtTime(Q, audioContext.currentTime);
    return filter;
}

// Make sure to reset the gain after the explosion
function resetGain() {
    if (gainNode) {
        gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
    }
}

let gameCanvas, gameCtx, gameLoop, timerInterval;
let snake, food, direction, turns, gameTime;
let gameState = 'initial'; // 'initial', 'countdown', 'playing', 'failed', 'success'
let packetsCollected = 0;
let GRID_SIZE = 10;
const GAME_SPEED = 150; // Adjust as needed
const TOTAL_PACKETS = 3;
let canvasScale = 1;
let CANVAS_WIDTH = 300;
let CANVAS_HEIGHT = 200;


function initializeGame() {
    startTyping(gameInstructions, () => {
        hackButton.style.display = 'block';
    });
}

function setupCanvas() {
    const containerWidth = document.getElementById('game-container').clientWidth;
    const screenWidth = window.innerWidth;
    
    if (screenWidth < 600) {
        // On mobile, make the canvas fill the width of the screen
        CANVAS_WIDTH = containerWidth;
        CANVAS_HEIGHT = containerWidth * (2/3); // Maintain 3:2 aspect ratio
    } else {
        // On desktop, keep original size
        CANVAS_WIDTH = 600;
        CANVAS_HEIGHT = 300;
    }

    canvasScale = window.devicePixelRatio || 1;
    
    gameCanvas.width = CANVAS_WIDTH * canvasScale;
    gameCanvas.height = CANVAS_HEIGHT * canvasScale;
    gameCanvas.style.width = CANVAS_WIDTH + 'px';
    gameCanvas.style.height = CANVAS_HEIGHT + 'px';
    
    gameCtx.scale(canvasScale, canvasScale);
    
    // Adjust grid size based on new canvas dimensions
    GRID_SIZE = Math.floor(CANVAS_WIDTH / 30); // Adjust this value as needed
}
function startGame() {
    initAudio();
    ensureAudioContext();

    if (!gameCanvas) {
        const gameContainer = document.createElement('div');
        gameContainer.id = 'game-container';
        gameContainer.style.width = '100%';
        gameContainer.style.maxWidth = '600px';
        gameContainer.style.margin = '0 auto';

        gameCanvas = document.createElement('canvas');
        gameCanvas.id = 'game-canvas';
        
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
        setupCanvas(); // Add this line to set up the canvas
        setupControls();
    }

    resetGame();
    scrollToBottom();
    startCountdown();
}

function resetGame() {
    cleanupFailureScreen();
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
    screenShake = { intensity: 0, duration: 0, start: 0 };
    canvasShake = { x: 0, y: 0 };
    gameCanvas.style.transform = 'none';
}

function placeFood() {
    do {
        food = {
            x: Math.floor(Math.random() * (CANVAS_WIDTH / GRID_SIZE)),
            y: Math.floor(Math.random() * (CANVAS_HEIGHT / GRID_SIZE))
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
    gameCtx.font = `${Math.max(16, CANVAS_WIDTH / 18)}px VT323`;
    gameCtx.textAlign = 'left';
    gameCtx.fillText(`Time: ${gameTime}s`, CANVAS_WIDTH / 30, CANVAS_HEIGHT / 10);
    gameCtx.fillText(`Packets: ${packetsCollected}/${TOTAL_PACKETS}`, CANVAS_WIDTH / 30, CANVAS_HEIGHT / 5);
}
let explosionParticles = [];
let explosionQueue = [];
let lastExplosionTime = 0;
const EXPLOSION_DELAY = 1000; // ms between each segment explosion
const SHAKE_DURATION = 1000; // ms of shaking before explosion
const DISINTEGRATION_DURATION = 1000; // ms
const PARTICLE_LIFETIME = 1500; // ms

function handleWinCondition() {
    ensureAudioContext();
    gameState = 'won';
    clearInterval(gameLoop);

    playExplosionSound();
    setTimeout(resetGain, 1000);
    startDisintegration();
}
function startDisintegration() {
    const startTime = Date.now();
    const originalSnake = [...snake];
    const DISINTEGRATION_DURATION = 1000;
    const SEGMENT_DELAY = 50;
    let explosionEnded = false;

    function animateDisintegration() {
        const now = Date.now();
        const progress = (now - startTime) / DISINTEGRATION_DURATION;

        gameCtx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

        if (progress < 1) {
            // Draw snake and create explosions
            originalSnake.forEach((segment, index) => {
                const segmentStartTime = startTime + index * SEGMENT_DELAY;
                const segmentProgress = (now - segmentStartTime) / SEGMENT_DELAY;

                if (segmentProgress < 0) {
                    // Segment hasn't started disintegrating yet, draw normally
                    gameCtx.fillStyle = '#ffff00';
                    gameCtx.fillRect(segment.x * GRID_SIZE, segment.y * GRID_SIZE, GRID_SIZE, GRID_SIZE);
                } else if (segmentProgress < 1) {
                    // Segment is in the process of disintegrating
                    const wiggle = Math.sin(now * 0.01 + index) * 2;
                    const x = segment.x * GRID_SIZE + wiggle;
                    const y = segment.y * GRID_SIZE + wiggle;
                    
                    gameCtx.fillStyle = '#ffff00';
                    gameCtx.fillRect(x, y, GRID_SIZE, GRID_SIZE);

                    // Create particles
                    if (Math.random() < 0.4) {
                        createExplosionParticles(segment, 3);
                    }
                } else if (segmentProgress >= 1 && segmentProgress < 1.2) {
                    // Segment has just finished disintegrating, create a burst of particles
                    createExplosionParticles(segment, 30);
                    playExplosionSound();
                    
                    // Trigger screen shake
                    screenShake = {
                        intensity: 8,
                        duration: 200,
                        start: now
                    };
                }
            });
        } else if (!explosionEnded) {
            explosionEnded = true;
            setTimeout(() => {
                showAccessGranted();
            }, 2000); // Wait for 2 seconds after explosion ends before showing access granted
        }

        // Update and draw existing particles
        updateAndDrawParticles();
        updateCanvasShake();
        gameCanvas.style.transform = `translate(${canvasShake.x}px, ${canvasShake.y}px)`;

        if (!explosionEnded || explosionParticles.some(p => !p.settled)) {
            requestAnimationFrame(animateDisintegration);
        } else {
            gameCanvas.style.transform = 'none';
        }
    }

    requestAnimationFrame(animateDisintegration);
}



let screenShake = { intensity: 0, duration: 0, start: 0 };
let canvasShake = { x: 0, y: 0 };

function updateCanvasShake() {
    if (screenShake.duration > 0) {
        const progress = (Date.now() - screenShake.start) / screenShake.duration;
        if (progress < 1) {
            const decreasingIntensity = screenShake.intensity * (1 - progress);
            canvasShake.x = (Math.random() - 0.5) * 2 * decreasingIntensity;
            canvasShake.y = (Math.random() - 0.5) * 2 * decreasingIntensity;
        } else {
            screenShake.duration = 0;
            canvasShake.x = 0;
            canvasShake.y = 0;
        }
    }
}

const PARTICLE_TYPES = {
    CHUNK: 'chunk',
    SPARK: 'spark',
    SMOKE: 'smoke'
};

function createExplosionParticles(segment, count = 20) {
    const colors = ['#ff8800', '#ff0000', '#880000']; // Orange, red, dark red for effect particles
    const particles = [];

    // Create multiple snake part particles of different sizes
    const numSnakeParts = Math.floor(Math.random() * 3) + 3; // 3 to 5 parts per segment
    for (let i = 0; i < numSnakeParts; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * 15 + 10; // Much higher speed for violent explosion
        particles.push({
            x: (segment.x + 0.5) * GRID_SIZE,
            y: (segment.y + 0.5) * GRID_SIZE,
            vx: Math.cos(angle) * speed,
            vy: Math.sin(angle) * speed,
            size: GRID_SIZE * (Math.random() * 0.4 + 0.2), // Size between 20% and 60% of original
            color: '#ffff00', // Yellow for snake parts
            type: 'snakePart',
            rotation: Math.random() * Math.PI * 2,
            rotationSpeed: (Math.random() - 0.5) * 0.5
        });
    }

    // Create effect particles
    for (let i = 0; i < count - numSnakeParts; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * 5 + 3;
        particles.push({
            x: (segment.x + 0.5) * GRID_SIZE,
            y: (segment.y + 0.5) * GRID_SIZE,
            vx: Math.cos(angle) * speed,
            vy: Math.sin(angle) * speed,
            size: Math.random() * GRID_SIZE / 2 + GRID_SIZE / 4,
            color: colors[Math.floor(Math.random() * colors.length)],
            type: 'effect',
            lifetime: PARTICLE_LIFETIME,
            createdAt: Date.now()
        });
    }

    explosionParticles.push(...particles);
}
function updateAndDrawParticles() {
    const now = Date.now();
    explosionParticles = explosionParticles.filter(particle => {
        if (particle.type === 'effect') {
            const age = now - particle.createdAt;
            if (age > particle.lifetime) return false;
            const progress = age / particle.lifetime;
            const size = particle.size * (1 - progress * 0.5);
            const alpha = 1 - progress;
            particle.size = size;
            particle.alpha = alpha;
        }

        if (particle.settled) {
            // Draw settled particles without moving them
            gameCtx.save();
            gameCtx.translate(particle.x, particle.y);
            gameCtx.rotate(particle.rotation);
            gameCtx.globalAlpha = particle.alpha || 1;
            gameCtx.fillStyle = particle.color;
            gameCtx.fillRect(-particle.size/2, -particle.size/2, particle.size, particle.size);
            gameCtx.restore();
            return true;
        }

        // Update position for moving particles
        particle.x += particle.vx;
        particle.y += particle.vy;

        // Apply gravity to moving particles
        particle.vy += 0.3;

        // Bounce off edges with improved physics
        const bounceDamping = particle.type === 'snakePart' ? 0.7 : 0.8;
        if (particle.x - particle.size/2 < 0) {
            particle.vx = Math.abs(particle.vx) * bounceDamping;
            particle.x = particle.size/2;
        } else if (particle.x + particle.size/2 > CANVAS_WIDTH) {
            particle.vx = -Math.abs(particle.vx) * bounceDamping;
            particle.x = CANVAS_WIDTH - particle.size/2;
        }

        if (particle.y - particle.size/2 < 0) {
            particle.vy = Math.abs(particle.vy) * bounceDamping;
            particle.y = particle.size/2;
        } else if (particle.y + particle.size/2 > CANVAS_HEIGHT) {
            particle.vy = -Math.abs(particle.vy) * bounceDamping;
            particle.y = CANVAS_HEIGHT - particle.size/2;
            
            // Additional friction for snake parts near the bottom
            if (particle.type === 'snakePart') {
                particle.vx *= 0.9;
                
                // Stop movement if close to bottom and moving slowly
                const velocityThreshold = 0.5;
                const bottomThreshold = 5;
                if (CANVAS_HEIGHT - (particle.y + particle.size/2) < bottomThreshold && 
                    Math.abs(particle.vx) < velocityThreshold && 
                    Math.abs(particle.vy) < velocityThreshold) {
                    particle.vx = 0;
                    particle.vy = 0;
                    particle.y = CANVAS_HEIGHT - particle.size/2;
                    particle.settled = true;
                }
            }
        }

        // Apply rotation to moving snake parts
        if (particle.type === 'snakePart') {
            particle.rotation += particle.rotationSpeed;
            particle.rotationSpeed *= 0.99;
        }

        // Draw particle
        gameCtx.save();
        gameCtx.translate(particle.x, particle.y);
        if (particle.type === 'snakePart') {
            gameCtx.rotate(particle.rotation);
        }
        gameCtx.globalAlpha = particle.alpha || 1;
        gameCtx.fillStyle = particle.color;
        gameCtx.fillRect(-particle.size/2, -particle.size/2, particle.size, particle.size);
        gameCtx.restore();

        return true;
    });
}




function animateExplosion() {
    const currentTime = Date.now();
    
    updateCanvasShake();

    gameCanvas.style.transform = `translate(${canvasShake.x}px, ${canvasShake.y}px)`;

    gameCtx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    let allExploded = true;
    for (let segment of explosionQueue) {
        if (!segment.exploded) {
            allExploded = false;
            const timeSinceStart = currentTime - segment.startTime;
            if (timeSinceStart > 0) {
                segment.exploded = true;
                createExplosionParticles(segment);
                playExplosionSound();
                // Trigger screen shake
                screenShake = {
                    intensity: 15,
                    duration: 300,
                    start: currentTime
                };
            }
        }
    }

    updateAndDrawParticles();

    if (allExploded && explosionParticles.length === 0) {
        gameCanvas.style.transform = 'none';
        setTimeout(showAccessGranted, 500);
    } else {
        requestAnimationFrame(animateExplosion);
    }
}


function showAccessGranted() {
    let startTime = Date.now();
    function animateAccessGranted() {
        // Clear canvas
        gameCtx.fillStyle = '#000000';
        gameCtx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

        // Draw "ACCESS GRANTED" text with glitch effect
        gameCtx.fillStyle = '#ffff00'; // Changed from green to yellow
        gameCtx.font = `bold ${Math.max(30, CANVAS_WIDTH / 10)}px VT323`;
        gameCtx.textAlign = 'center';
        gameCtx.textBaseline = 'middle';
        
        let text = 'ACCESS GRANTED';
        let glitchOffset = Math.random() * 5 - 2.5;
        gameCtx.fillText(text, CANVAS_WIDTH / 2 + glitchOffset, CANVAS_HEIGHT / 2);

        // Add some "digital noise" in yellow and red tones
        for (let i = 0; i < 100; i++) {
            let x = Math.random() * CANVAS_WIDTH;
            let y = Math.random() * CANVAS_HEIGHT;
            let size = Math.random() * 2 + 1;
            let color = Math.random() < 0.5 ? '#ffff00' : '#ff0000'; // Randomly choose between yellow and red
            gameCtx.fillStyle = `${color}${Math.floor(Math.random() * 80 + 20).toString(16)}`; // Add some transparency
            gameCtx.fillRect(x, y, size, size);
        }

        if (Date.now() - startTime < 2000) {
            requestAnimationFrame(animateAccessGranted);
        } else {
            renderSuccessScreen();
        }
    }

    animateAccessGranted();
}



function moveSnake() {
    ensureAudioContext();
    let head = { ...snake[0] };

    if (turns[head.x + ',' + head.y]) {
        direction = turns[head.x + ',' + head.y];
        delete turns[head.x + ',' + head.y];
    }

    head.x += direction.x;
    head.y += direction.y;

    if (head.x < 0 || head.x >= CANVAS_WIDTH / GRID_SIZE ||
        head.y < 0 || head.y >= CANVAS_HEIGHT / GRID_SIZE) {
        return false;
    }

    snake.unshift(head);

    if (head.x === food.x && head.y === food.y) {
        packetsCollected++;
        playCollectSound();
        if (packetsCollected < TOTAL_PACKETS) {
            placeFood();
        }
    } else {
        snake.pop();
    }

    playSnakeMoveSound();

    return true;
}

function checkCollision() {
    const head = snake[0];
    return snake.slice(1).some(segment => segment.x === head.x && segment.y === head.y);
}
function updateGame() {
    if (gameState !== 'failed') {
        const shakeOffset = getScreenShakeOffset();
        gameCanvas.style.transform = `translate(${shakeOffset.x}px, ${shakeOffset.y}px)`;
    }

    gameCtx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    switch (gameState) {
        case 'playing':
            if (!moveSnake() || checkCollision()) {
                ensureAudioContext();
                gameState = 'failed';
                playGameOverSound();
                renderFailureOverlay();
                clearInterval(gameLoop);

                screenShake = { intensity: 0, duration: 0, start: 0 };
                canvasShake = { x: 0, y: 0 };
                gameCanvas.style.transform = 'none';

                break;
            }
            if (packetsCollected >= TOTAL_PACKETS) {
                handleWinCondition();
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

    gameCtx.restore(); 
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

        // Clear the canvas and redraw the game state
        renderGame();

        // Create a terminal-like overlay
        gameCtx.fillStyle = 'rgba(0, 0, 0, 0.8)';
        gameCtx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

        // Draw a retro-style frame
        gameCtx.strokeStyle = '#ffff00';
        gameCtx.lineWidth = Math.max(2, CANVAS_WIDTH / 150);
        gameCtx.strokeRect(CANVAS_WIDTH * 0.1, CANVAS_HEIGHT * 0.1, CANVAS_WIDTH * 0.8, CANVAS_HEIGHT * 0.8);

        // Draw countdown text
        gameCtx.fillStyle = '#ffff00';
        gameCtx.font = `bold ${Math.max(40, CANVAS_WIDTH / 7)}px VT323`;
        gameCtx.textAlign = 'center';
        gameCtx.textBaseline = 'middle';

        gameCtx.fillText(`COUNTDOWN: ${remainingTime}`, CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2);
        // Draw additional information
        gameCtx.font = `${Math.max(16, CANVAS_WIDTH / 18)}px VT323`;
        gameCtx.fillText('PREPARE FOR FIREWALL BREACH', CANVAS_WIDTH / 2, CANVAS_HEIGHT * 0.3);
        gameCtx.fillText(`Packets to Collect: ${TOTAL_PACKETS}`, CANVAS_WIDTH / 2, CANVAS_HEIGHT * 0.7);

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
let failureScreenInterval;

function renderFailureOverlay() {
    // Ensure the canvas is in its original position
    gameCanvas.style.transform = 'none';

    gameCtx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    // Create a terminal-like overlay
    gameCtx.fillStyle = 'rgba(0, 0, 0, 0.8)';
    gameCtx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    // Draw a retro-style frame
    gameCtx.strokeStyle = '#ffff00';
    gameCtx.lineWidth = Math.max(2, CANVAS_WIDTH / 150);
    gameCtx.strokeRect(CANVAS_WIDTH * 0.1, CANVAS_HEIGHT * 0.1, CANVAS_WIDTH * 0.8, CANVAS_HEIGHT * 0.8);

    // Draw failure message
    gameCtx.fillStyle = '#ffff00';
    gameCtx.font = `bold ${Math.max(24, CANVAS_WIDTH / 12)}px VT323`;
    gameCtx.textAlign = 'center';
    gameCtx.textBaseline = 'middle';
    gameCtx.fillText('BYPASS FAILED', CANVAS_WIDTH / 2, CANVAS_HEIGHT * 0.3);

    // Draw "This incident will be reported" message
    gameCtx.font = `${Math.max(16, CANVAS_WIDTH / 24)}px VT323`;
    gameCtx.fillText('This incident will be reported.', CANVAS_WIDTH / 2, CANVAS_HEIGHT * 0.7);

    // Draw RETRY button
    const buttonWidth = CANVAS_WIDTH * 0.3;
    const buttonHeight = CANVAS_HEIGHT * 0.1;
    const buttonX = CANVAS_WIDTH / 2 - buttonWidth / 2;
    const buttonY = CANVAS_HEIGHT * 0.5 - buttonHeight / 2;

    gameCtx.strokeStyle = '#ffff00';
    gameCtx.lineWidth = Math.max(2, CANVAS_WIDTH / 300);
    gameCtx.strokeRect(buttonX, buttonY, buttonWidth, buttonHeight);

    gameCtx.font = `bold ${Math.max(18, CANVAS_WIDTH / 20)}px VT323`;
    gameCtx.fillText('[ RETRY ]', CANVAS_WIDTH / 2, CANVAS_HEIGHT * 0.5);

    // Add click event listener to the canvas for the RETRY button
    gameCanvas.onclick = function(event) {
        const rect = gameCanvas.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;

        if (x > buttonX && x < buttonX + buttonWidth &&
            y > buttonY && y < buttonY + buttonHeight) {
            cleanupFailureScreen();
            resetGame();
            startCountdown();
        }
    };

    // Start the flashing effect for "BYPASS FAILED"
    startFailureFlashingEffect();
}

function startFailureFlashingEffect() {
    let isVisible = true;
    failureScreenInterval = setInterval(() => {
        if (isVisible) {
            gameCtx.fillStyle = 'rgba(0, 0, 0, 0.8)';
            gameCtx.fillRect(CANVAS_WIDTH * 0.1, CANVAS_HEIGHT * 0.2, CANVAS_WIDTH * 0.8, CANVAS_HEIGHT * 0.2);
        } else {
            gameCtx.fillStyle = '#ffff00';
            gameCtx.font = `bold ${Math.max(24, CANVAS_WIDTH / 12)}px VT323`;
            gameCtx.textAlign = 'center';
            gameCtx.textBaseline = 'middle';
            gameCtx.fillText('BYPASS FAILED', CANVAS_WIDTH / 2, CANVAS_HEIGHT * 0.3);
        }
        isVisible = !isVisible;
    }, 500);
}


function cleanupFailureScreen() {
    // Clear the flashing interval
    if (failureScreenInterval) {
        clearInterval(failureScreenInterval);
        failureScreenInterval = null;
    }

    // Remove the click event listener from the canvas
    gameCanvas.onclick = null;

    // Clear the entire canvas
    gameCtx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
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
        initAudio();
        initializeGame();
    });

    hackButton.addEventListener('click', () => {
        hackButton.style.display = 'none';
        initAudio();
        startGame();
    });
});

window.addEventListener('resize', () => {
    setupCanvas();
    resetGame();
});
