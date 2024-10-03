const gameBoard = document.getElementById('gameBoard');
const context = gameBoard.getContext('2d');
const scoreText = document.getElementById('scoreVal');
const startBtn = document.getElementById('startBtn');
const restartBtn = document.getElementById('restartBtn');  

const WIDTH = gameBoard.width;
const HEIGHT = gameBoard.height; 
const UNIT = 25;

let foodX;
let foodY;
let xVel = UNIT;
let yVel = 0;
let score = 0;
let active = true;
let started = false;
let paused = false;

let snake = [
    {x: UNIT * 3, y: 0},
    {x: UNIT * 2, y: 0},
    {x: UNIT, y: 0},
    {x: 0, y: 0}
];

startBtn.addEventListener('click', startGame);
restartBtn.addEventListener('click', restartGame);
window.addEventListener('keydown', keyPress);

function startGame() {
    if (!started) {
        started = true;
        active = true;
        paused = false;
        score = 0;
        scoreText.textContent = score;
        resetSnake();
        startBtn.disabled = true; 
        startBtn.style.display = 'none'; 
        restartBtn.style.display = 'none'; 
        context.fillStyle = '#212121';
        context.fillRect(0, 0, WIDTH, HEIGHT);
        createFood();
        displayFood();
        drawSnake();
        nextTick();
    }
}

function resetSnake() {
    snake = [
        {x: UNIT * 3, y: 0},
        {x: UNIT * 2, y: 0},
        {x: UNIT, y: 0},
        {x: 0, y: 0}
    ];
    xVel = UNIT;
    yVel = 0;
}

function restartGame() {
    resetGame();
    startGame();
}

function resetGame() {
    started = false;
    active = true;
    paused = false;
    score = 0;
    scoreText.textContent = score;
    resetSnake();
    context.fillStyle = '#212121';
    context.fillRect(0, 0, WIDTH, HEIGHT);
    createFood();
}

function clearBoard() {
    context.fillStyle = '#212121';
    context.fillRect(0, 0, WIDTH, HEIGHT);
}

function createFood() {
    foodX = Math.floor(Math.random() * WIDTH / UNIT) * UNIT;
    foodY = Math.floor(Math.random() * HEIGHT / UNIT) * UNIT;
}

function displayFood() {
    context.fillStyle = 'red';
    context.fillRect(foodX, foodY, UNIT, UNIT);
}

function drawSnake() {
    context.fillStyle = 'aqua';
    context.strokeStyle = '#212121';
    snake.forEach((snakePart) => {
        context.fillRect(snakePart.x, snakePart.y, UNIT, UNIT);
        context.strokeRect(snakePart.x, snakePart.y, UNIT, UNIT);
    });
}

function moveSnake() {
    const head = { x: snake[0].x + xVel, y: snake[0].y + yVel };
    snake.unshift(head);
    if (snake[0].x === foodX && snake[0].y === foodY) {
        score += 1;
        scoreText.textContent = score;
        createFood();
    } else {
        snake.pop();
    }
}

function nextTick() {
    if (active && !paused) {
        setTimeout(() => {
            clearBoard();
            displayFood();
            moveSnake();
            drawSnake();
            checkGameOver();
            nextTick();
        }, 200);
    } else if (!active) {
        clearBoard();
        context.font = "bold 50px serif";
        context.fillStyle = "white";
        context.textAlign = "center";
        context.fillText("Game Over!!", WIDTH / 2, HEIGHT / 2);
        restartBtn.style.display = 'inline-block'; 
    }
}

function keyPress(event) {
    if (!started) return;

    if (event.keyCode === 32) {
        paused = !paused;
        if (!paused) nextTick();
    }

    const LEFT = 37;
    const UP = 38;
    const RIGHT = 39;
    const DOWN = 40;

    switch (true) {
        case (event.keyCode == LEFT && xVel === 0):
            xVel = -UNIT;
            yVel = 0;
            break;
        case (event.keyCode == RIGHT && xVel === 0):
            xVel = UNIT;
            yVel = 0;
            break;
        case (event.keyCode == UP && yVel === 0):
            xVel = 0;
            yVel = -UNIT;
            break;
        case (event.keyCode == DOWN && yVel === 0):
            xVel = 0;
            yVel = UNIT;
            break;
    }
}

function checkGameOver() {
    if (
        snake[0].x < 0 || snake[0].x >= WIDTH ||
        snake[0].y < 0 || snake[0].y >= HEIGHT ||
        checkSelfCollision()
    ) {
        active = false;
    }
}

function checkSelfCollision() {
    for (let i = 1; i < snake.length; i++) {
        if (snake[i].x === snake[0].x && snake[i].y === snake[0].y) {
            return true;
        }
    }
    return false;
}
