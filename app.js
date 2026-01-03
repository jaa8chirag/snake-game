const board = document.querySelector('.board');
const startBtn = document.querySelector('.btn-start')
const modal = document.querySelector('.modal')
const startGameModal = document.querySelector('.start-game')
const gameOverModal = document.querySelector('.game-over')
const restartButton = document.querySelector('.btn-restart')

const highScoreElement = document.getElementById('high-score')
const scoreElement = document.getElementById('score')
const timeElement = document.getElementById('time')

let time = `00-00`
let score = 0;
let highScore = localStorage.getItem("highScore") || 0;

highScoreElement.innerText = highScore;

const blockHeight = 50;
const blockWidth = 50;

const cols = Math.floor(board.clientWidth / blockWidth)
const rows = Math.floor(board.clientHeight / blockHeight)

const blocks = {}

let direction = "right";
let intervalId = null;
let timeIntervalId = null;

let food = {
  x: Math.floor(Math.random() * rows),
  y: Math.floor(Math.random() * cols)
}

for (let row = 0; row < rows; row++) {
  for (let col = 0; col < cols; col++) {
    const block = document.createElement('div');
    block.classList.add("block")
    board.appendChild(block)
    blocks[`${row}-${col}`] = block
  }
}

let snake = [{ x: 1, y: 3 }]

function render() {
  let head = null

  blocks[`${food.x}-${food.y}`].classList.add('food')

  if (direction === "left") {
    head = { x: snake[0].x, y: snake[0].y - 1 }
  } else if (direction === "right") {
    head = { x: snake[0].x, y: snake[0].y + 1 }
  } else if (direction === "down") {
    head = { x: snake[0].x + 1, y: snake[0].y }
  } else if (direction === "up") {
    head = { x: snake[0].x - 1, y: snake[0].y }
  }

  if (head.x < 0 || head.x >= rows || head.y < 0 || head.y >= cols) {
    clearInterval(intervalId)
    modal.style.display = "flex"
    startGameModal.style.display = "none"
    gameOverModal.style.display = "flex"
    return
  }

  snake.forEach(segment => {
    blocks[`${segment.x}-${segment.y}`].classList.remove('fill')
  })

  if (head.x === food.x && head.y === food.y) {
    blocks[`${food.x}-${food.y}`].classList.remove('food')

    food = {
      x: Math.floor(Math.random() * rows),
      y: Math.floor(Math.random() * cols)
    }

    snake.unshift(head)

    score += 10
    scoreElement.innerText = score

    if (score > highScore) {
      highScore = score
      localStorage.setItem("highScore", highScore)
      highScoreElement.innerText = highScore
    }
  } else {
    snake.unshift(head)
    snake.pop()
  }

  snake.forEach(segment => {
    blocks[`${segment.x}-${segment.y}`].classList.add('fill')
  })
}

startBtn.addEventListener('click', () => {
  modal.style.display = 'none'
  intervalId = setInterval(render, 300)
  timeIntervalId = setInterval(()=>{
    let [min,sec] = time.split("-").map(Number)
    if(sec ==59){
        min+=1
        sec = 0
    }else{
        sec+=1
    }
    time= `${min}-${sec}`
    timeElement.innerText = time
  },1000)
})

restartButton.addEventListener('click', restartGame)

function restartGame() {
  clearInterval(intervalId)

  snake.forEach(segment => {
    blocks[`${segment.x}-${segment.y}`].classList.remove('fill')
  })
  blocks[`${food.x}-${food.y}`].classList.remove('food')

  score = 0
  time = `00-00`
  scoreElement.innerText = score
  timeElement.innerText = time
  highScoreElement.innerText = highScore

  direction = "right"
  snake = [{ x: 1, y: 3 }]
  food = {
    x: Math.floor(Math.random() * rows),
    y: Math.floor(Math.random() * cols)
  }

  modal.style.display = "none"
  intervalId = setInterval(render, 300)
}

addEventListener('keydown', (e) => {
  if (e.key === "ArrowUp" && direction !== "down") direction = "up"
  else if (e.key === "ArrowDown" && direction !== "up") direction = "down"
  else if (e.key === "ArrowLeft" && direction !== "right") direction = "left"
  else if (e.key === "ArrowRight" && direction !== "left") direction = "right"
})
