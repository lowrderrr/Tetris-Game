// Tetris Game Implementation
// https://tetris.fandom.com/wiki/Tetris_Guideline

const CONFIG = {
  imageSquareSize: 32,
  blockSize: 32,
  frameRate: 60,
  gameSpeed: 1, // Pieces fall every ~35 frames
  gridWidth: 10,
  gridHeight: 20,
};

// DOM Setup
const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');

// Game Constants
const GRID = CONFIG.blockSize;
const COLORS = {
  I: '#00FFFF',
  O: '#FFFF00',
  T: '#9933FF',
  S: '#00FF00',
  Z: '#FF0000',
  J: '#0033FF',
  L: '#FF9900',
};

const TETROMINOS = {
  I: [[0, 1, 0, 0], [0, 1, 0, 0], [0, 1, 0, 0], [0, 1, 0, 0]],
  O: [[1, 1], [1, 1]],
  T: [[0, 1, 0], [1, 1, 1], [0, 0, 0]],
  S: [[0, 1, 1], [1, 1, 0], [0, 0, 0]],
  Z: [[1, 1, 0], [0, 1, 1], [0, 0, 0]],
  J: [[1, 0, 0], [1, 1, 1], [0, 0, 0]],
  L: [[0, 0, 1], [1, 1, 1], [0, 0, 0]],
};

// Game State
class GameState {
  constructor() {
    this.playfield = [];
    this.currentPiece = null;
    this.nextPiece = null;
    this.score = 0;
    this.lines = 0;
    this.gameOver = false;
    this.isPaused = false;
    this.init();
  }

  init() {
    // Initialize empty playfield
    for (let row = 0; row < CONFIG.gridHeight; row++) {
      this.playfield[row] = [];
      for (let col = 0; col < CONFIG.gridWidth; col++) {
        this.playfield[row][col] = null;
      }
    }
    this.currentPiece = this.getRandomPiece();
    this.nextPiece = this.getRandomPiece();
  }

  getRandomPiece() {
    const pieces = Object.keys(TETROMINOS);
    const randomPiece = pieces[Math.floor(Math.random() * pieces.length)];
    return {
      name: randomPiece,
      matrix: TETROMINOS[randomPiece].map(row => [...row]),
      row: -2, // Start above the playfield
      col: Math.floor(CONFIG.gridWidth / 2) - 1,
    };
  }

  reset() {
    this.init();
    this.score = 0;
    this.lines = 0;
    this.gameOver = false;
    this.isPaused = false;
  }
}

// Game Logic
class Tetris {
  constructor() {
    this.state = new GameState();
    this.dropCounter = 0;
    this.dropInterval = 35; // Frames between drops
    this.animationId = null;
  }

  rotate(matrix) {
    const N = matrix.length;
    const rotated = matrix.map(() => []);

    for (let i = 0; i < N; i++) {
      for (let j = 0; j < N; j++) {
        rotated[j][N - 1 - i] = matrix[i][j];
      }
    }
    return rotated;
  }

  isValidMove(piece, row, col) {
    const { matrix } = piece;

    for (let r = 0; r < matrix.length; r++) {
      for (let c = 0; c < matrix[r].length; c++) {
        if (matrix[r][c]) {
          const newRow = row + r;
          const newCol = col + c;

          // Check bounds
          if (newCol < 0 || newCol >= CONFIG.gridWidth || newRow >= CONFIG.gridHeight) {
            return false;
          }

          // Check collision with placed pieces
          if (newRow >= 0 && this.state.playfield[newRow][newCol]) {
            return false;
          }
        }
      }
    }
    return true;
  }

  placePiece(piece) {
    const { matrix, row, col, name } = piece;

    for (let r = 0; r < matrix.length; r++) {
      for (let c = 0; c < matrix[r].length; c++) {
        if (matrix[r][c]) {
          const newRow = row + r;
          const newCol = col + c;

          // Game over if piece extends above playfield
          if (newRow < 0) {
            this.state.gameOver = true;
            return;
          }

          this.state.playfield[newRow][newCol] = name;
        }
      }
    }

    this.clearLines();
    this.spawnNextPiece();
  }

  clearLines() {
    let clearedLines = 0;

    for (let row = CONFIG.gridHeight - 1; row >= 0; ) {
      if (this.state.playfield[row].every(cell => cell !== null)) {
        // Remove full line
        this.state.playfield.splice(row, 1);
        // Add empty line at top
        this.state.playfield.unshift(Array(CONFIG.gridWidth).fill(null));
        clearedLines++;
      } else {
        row--;
      }
    }

    if (clearedLines > 0) {
      this.state.lines += clearedLines;
      this.state.score += clearedLines * 100;
    }
  }

  spawnNextPiece() {
    this.state.currentPiece = this.state.nextPiece;
    this.state.nextPiece = this.state.getRandomPiece();

    if (!this.isValidMove(this.state.currentPiece, this.state.currentPiece.row, this.state.currentPiece.col)) {
      this.state.gameOver = true;
    }
  }

  movePiece(direction) {
    if (this.state.gameOver || this.state.isPaused) return;

    const piece = this.state.currentPiece;
    const newCol = piece.col + direction;

    if (this.isValidMove(piece, piece.row, newCol)) {
      piece.col = newCol;
    }
  }

  rotatePiece() {
    if (this.state.gameOver || this.state.isPaused) return;

    const piece = this.state.currentPiece;
    const rotated = this.rotate(piece.matrix);

    if (this.isValidMove({ ...piece, matrix: rotated }, piece.row, piece.col)) {
      piece.matrix = rotated;
    }
  }

  softDrop() {
    if (this.state.gameOver || this.state.isPaused) return;

    const piece = this.state.currentPiece;
    if (this.isValidMove(piece, piece.row + 1, piece.col)) {
      piece.row++;
    } else {
      this.placePiece(piece);
    }
  }

  hardDrop() {
    if (this.state.gameOver || this.state.isPaused) return;

    const piece = this.state.currentPiece;
    while (this.isValidMove(piece, piece.row + 1, piece.col)) {
      piece.row++;
    }
    this.placePiece(piece);
  }

  update() {
    if (this.state.gameOver || this.state.isPaused) return;

    this.dropCounter++;
    if (this.dropCounter > this.dropInterval) {
      const piece = this.state.currentPiece;
      if (this.isValidMove(piece, piece.row + 1, piece.col)) {
        piece.row++;
      } else {
        this.placePiece(piece);
      }
      this.dropCounter = 0;
    }
  }

  draw() {
    // Clear canvas
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw playfield
    this.drawPlayfield();

    // Draw current piece
    if (this.state.currentPiece) {
      this.drawPiece(this.state.currentPiece);
    }

    // Draw game over overlay
    if (this.state.gameOver) {
      this.drawGameOver();
    }
  }

  drawPlayfield() {
    for (let row = 0; row < CONFIG.gridHeight; row++) {
      for (let col = 0; col < CONFIG.gridWidth; col++) {
        const piece = this.state.playfield[row][col];
        if (piece) {
          ctx.fillStyle = COLORS[piece];
          ctx.fillRect(col * GRID, row * GRID, GRID - 1, GRID - 1);
          ctx.strokeStyle = '#333';
          ctx.lineWidth = 1;
          ctx.strokeRect(col * GRID, row * GRID, GRID - 1, GRID - 1);
        }
      }
    }
  }

  drawPiece(piece) {
    ctx.fillStyle = COLORS[piece.name];

    for (let row = 0; row < piece.matrix.length; row++) {
      for (let col = 0; col < piece.matrix[row].length; col++) {
        if (piece.matrix[row][col]) {
          const x = (piece.col + col) * GRID;
          const y = (piece.row + row) * GRID;

          if (y >= 0) { // Only draw if on screen
            ctx.fillRect(x, y, GRID - 1, GRID - 1);
            ctx.strokeStyle = '#333';
            ctx.lineWidth = 1;
            ctx.strokeRect(x, y, GRID - 1, GRID - 1);
          }
        }
      }
    }
  }

  drawGameOver() {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = '#FFF';
    ctx.font = 'bold 48px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('GAME OVER', canvas.width / 2, canvas.height / 2 - 40);

    ctx.font = '24px Arial';
    ctx.fillText(`Score: ${this.state.score}`, canvas.width / 2, canvas.height / 2 + 20);
    ctx.fillText(`Lines: ${this.state.lines}`, canvas.width / 2, canvas.height / 2 + 60);
  }

  gameLoop = () => {
    this.update();
    this.draw();
    this.animationId = requestAnimationFrame(this.gameLoop);
  };

  start() {
    this.gameLoop();
    this.setupInput();
    this.updateUI();
  }

  setupInput() {
    document.addEventListener('keydown', (e) => {
      if (this.state.gameOver && e.key !== 'r' && e.key !== 'R') return;

      switch (e.key) {
        case 'ArrowLeft':
          this.movePiece(-1);
          break;
        case 'ArrowRight':
          this.movePiece(1);
          break;
        case 'ArrowDown':
          this.softDrop();
          break;
        case ' ':
          this.hardDrop();
          break;
        case 'ArrowUp':
          this.rotatePiece();
          break;
        case 'Escape':
          this.state.isPaused = !this.state.isPaused;
          break;
        case 'r':
        case 'R':
          if (this.state.gameOver) {
            this.state.reset();
          }
          break;
      }
    });

    // Restart button
    const restartBtn = document.getElementById('restartBtn');
    if (restartBtn) {
      restartBtn.addEventListener('click', () => {
        this.state.reset();
      });
    }
  }

  updateUI() {
    setInterval(() => {
      const nextDiv = document.getElementById('nextFigureDIV');
      const linesDiv = document.getElementById('AllLinesOut');

      if (nextDiv && this.state.nextPiece) {
        nextDiv.textContent = `Next: ${this.state.nextPiece.name}`;
      }

      if (linesDiv) {
        linesDiv.textContent = `Lines: ${this.state.lines}`;
      }
    }, 100);
  }
}

// Initialize and start game
const game = new Tetris();
game.start();
