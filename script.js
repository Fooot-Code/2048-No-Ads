const size = 4;
let board = [];
let score = 0;

function toggleDarkMode() {
    const body = document.body;
    const darkModeButton = document.getElementById('dark-mode-button');
    body.classList.toggle('dark-mode');
    
    if (body.classList.contains('dark-mode')) {
        darkModeButton.textContent = 'Light Mode';
    } else {
        darkModeButton.textContent = 'Dark Mode';
    }
    
    const color = body.classList.contains('dark-mode') ? '#333' : '#fff';
    document.body.style.background = color;

}

function createBoard() {
  const gameContainer = document.getElementById('game');
  gameContainer.innerHTML = '';
  board = Array.from({ length: size }, () => Array(size).fill(0));
  addTile();
  addTile();
  drawBoard();
}

function addTile() {
  let empty = [];
  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      if (board[r][c] === 0) empty.push([r, c]);
    }
  }
  if (empty.length === 0) return;
  const [r, c] = empty[Math.floor(Math.random() * empty.length)];
  board[r][c] = Math.random() < 0.9 ? 2 : 4;
}

function drawBoard() {
  const gameContainer = document.getElementById('game');
  gameContainer.innerHTML = '';
  board.forEach(row => row.forEach(cell => {
    const tile = document.createElement('div');
    tile.className = 'tile';
    if (cell > 0) {
      tile.textContent = cell;
      tile.dataset.value = cell;
    }
    gameContainer.appendChild(tile);
  }));
}

function slide(row) {
  let arr = row.filter(val => val);
  for (let i = 0; i < arr.length - 1; i++) {
    if (arr[i] === arr[i + 1]) {
      arr[i] *= 2;
      score += arr[i]; // Add the merged value to the score
      arr[i + 1] = 0;
    }
  }
  return arr.filter(val => val).concat(Array(size - arr.filter(val => val).length).fill(0));
}

function rotateMatrix(matrix) {
  return matrix[0].map((_, i) => matrix.map(row => row[i]).reverse());
}


function move(direction) {
  let rotated = board;
  for (let i = 0; i < direction; i++) {
    rotated = rotateMatrix(rotated);
  }
  let moved = rotated.map(row => slide(row));
  for (let i = 0; i < (4 - direction) % 4; i++) {
    moved = rotateMatrix(moved);
  }
  if (JSON.stringify(moved) !== JSON.stringify(board)) {
    board = moved;
    addTile();
    drawBoard();
  }

  addScore();

  if (checkGameOver()) {
    alert('You win! Press "r" to restart, or continue playing by hitting "OK".');
  }

}

function addScore() {
  const scoreDisplay = document.getElementById('score');
  let total = 0;
  board.forEach(row => row.forEach(cell => {
    if (cell > 0) total += cell;
    
  }));
  scoreDisplay.textContent = total;
}

function checkGameOver() {
    for (let r = 0; r < size; r++) {
      for (let c = 0; c < size; c++) {
        if (board[r][c] === 2048) return true;
      }
    }
    return false;
  }

function restartGame() {
  createBoard();
}

window.addEventListener('keydown', e => {
    switch (e.key) {
      case 'ArrowUp': move(3); break;
      case 'ArrowRight': move(2); break;
      case 'ArrowDown': move(1); break;
      case 'ArrowLeft': move(0); break;
      case 'r': restartGame(); break;
    }
});

createBoard();
