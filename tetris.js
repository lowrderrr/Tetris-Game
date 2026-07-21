const CONFIG = {
    
    imageSquareSize: 24,
    blockSize: 40,
    frameRate: 24,
    gameSpeed: 5,
};

    

const imageSquaresize = 24;
const size = 40;
const FramePerSecond = 24;
const gameSpeed = 5;

//DOM SETUP

const canvas = document.getElementById("canvas");
const spriteSheet = document.getElementById("images");
const ctx = canvas.getContext("2d");


const gridWidth = Math.floor(canvas.width / CONFIG.blockSize);
const gridHeight = Math.floor(canvas.heught / CONFIG.blockSize);


class TetrisShape {
    constructor (spriteX, spriteY, template) {

        this.spriteY = imageY;
        this.spriteX = imageX;
        this.template = template;
        this.gridX = 0;
        this.gridY = 0; 
        this.rotation = 0; 
    }

 /**
   * Check if this shape can move down
   * @param {Array} gameMap - 2D array representing placed blocks
   * @returns {boolean}
   */
  canMoveDown(gameMap) {
    // TODO: Implement collision detection
    return true;
  }

  /**
   * Check if this shape can move left
   * @param {Array} gameMap - 2D array representing placed blocks
   * @returns {boolean}
   */
  canMoveLeft(gameMap) {
    // TODO: Implement collision detection
    return true;
  }

  /**
   * Check if this shape can move right
   * @param {Array} gameMap - 2D array representing placed blocks
   * @returns {boolean}
   */
  canMoveRight(gameMap) {
    // TODO: Implement collision detection
    return true;
  }

  /**
   * Rotate the shape 90 degrees clockwise
   * @param {Array} gameMap - 2D array representing placed blocks
   */
  rotate(gameMap) {
    // TODO: Implement rotation logic with collision detection
    this.rotation = (this.rotation + 1) % 4;
  }

  /**
   * Move shape down one block
   */
  moveDown() {
    if (this.canMoveDown(gameMap)) {
      this.gridY++;
    }
  }

  /**
   * Move shape left one block
   */
  moveLeft() {
    if (this.canMoveLeft(gameMap)) {
      this.gridX--;
    }
  }

  /**
   * Move shape right one block
   */
  moveRight() {
    if (this.canMoveRight(gameMap)) {
      this.gridX++;
    }
  }

  /**
   * Draw this shape on the canvas
   */
  draw() {
    for (let row = 0; row < this.template.length; row++) {
      for (let col = 0; col < this.template[row].length; col++) {
        // Skip empty cells (0s)
        if (this.template[row][col] === 0) continue;

        // Draw sprite from sprite sheet onto canvas
        ctx.drawImage(
          spriteSheet,
          this.spriteX + col * CONFIG.imageSquareSize,  // Source X
          this.spriteY + row * CONFIG.imageSquareSize,  // Source Y
          CONFIG.imageSquareSize,                        // Source width
          CONFIG.imageSquareSize,                        // Source height
          (this.gridX + col) * CONFIG.blockSize,        // Canvas X
          (this.gridY + row) * CONFIG.blockSize,        // Canvas Y
          CONFIG.blockSize,                              // Canvas width
          CONFIG.blockSize                               // Canvas height
        );
      }
    }
  }
}

//Tetromino Shapes

const SHAPES = {
   S: new TetrisShape(0, 120, [
        [0,1,0],
        [0,1,1],
        [1,1,0],
    ]),
    T: new TetrisShape(0, 96, [
        [0, 0, 0],
        [1, 1, 1],
        [0, 1, 0],
    ]),
    I: new TetrisShape(0, 72, [
        [0, 1, 0],
        [0, 1, 0],
        [0, 1, 0],
    ]),
   L: new TetrisShape (0, 48, [
        [0, 0, 0],
        [0, 1, 0],
        [1, 0, 1],
    ]),
    J: new TetrisShape(0, 24, [
        [0,1,1,0],
        [0,0,1,0],
        [0,0,1,0],
        [0,0,1,0],
    ]),

   O:  new TetrisShape(0, 0, [
        [1, 1],
        [1, 1],
    ]),
    Z: new TetrisShape(0,48, [
    [0, 0, 0],
    [1, 1, 0],
    [0, 1, 1],
    ]),
};

//Game State

class GameState {
    constructor() {
        this.reset();
    }
    reset(){
        this.gameMap = this.createEmptyMap();
        this.CurrentShape = this.getRandomShape();
        this.NextShape =  this.getRandomShape();
        this.score = 0; 
        this.isGameOver = false;
    }
    /**
   * Create an empty game map
   * @returns {Array} 2D array with cells initialized to {x: -1, y: -1}
   */
  createEmptyMap() {
    const map = [];
    for (let row = 0; row < gridHeight; row++) {
      const newRow = [];
      for (let col = 0; col < gridWidth; col++) {
        newRow.push({ spriteX: -1, spriteY: -1 });
      }
      map.push(newRow);
    }
    return map;
  }

  /**
   * Get a random shape and clone it
   * @returns {TetrisShape}
   */
  getRandomShape() {
    const shapeKeys = Object.keys(SHAPES);
    const randomKey = shapeKeys[Math.floor(Math.random() * shapeKeys.length)];
    // Clone the shape so each piece is independent
    const original = SHAPES[randomKey];
    return new TetrisShape(original.spriteX, original.spriteY, original.template.map(row => [...row]));
  }

  /**
   * Move to next piece
   */
  spawnNewPiece() {
    this.currentShape = this.nextShape;
    this.nextShape = this.getRandomShape();
  }
}

//Rendering 
class GameRender{
    /**
    * DRaw the grid line (opitional, helps see game play area)
    */
    static drawGrid() {
        ctx.strokeStyle = "#333333";
        ctx.lineWidth = 1;

        //Vertical lines 
        for (let x = 0; x <= canvas.wdith; x += CONFIG.blockSise) {
            ctx.beginPath();
            ctx.moveTo(x, 0); 
            ctx.lineTo(x, canvas.height);
            ctx.stroke();
        }

        //horizontal line
        for (lwt y = 0; y <=canvas.height; y +=Config.blovkSize) 
        ctx.beignPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke(); 
    }
}
/**
* DRaww current falling shape 
*/
static drawNextShape(shape) { 
    //TODO: Implement next shape preview in a dedicated area
}

/**
*Draw placed blocks from the game map
*/
static drawPlacedBlocks(gameMap) {
    for (let row = 0; row < gameMap.length; row++) { 
        for(let col = 0; col < gameMap[row].length; col++)
            const cell = gameMap [row] [col];
        if (cell.spriteX === -1) continue; //skip empty cells
        
        ctx.drawImage(
            spriteSheet,
            cell.spriteX,
            cell.spriteY,
            CONFIG.imageSquareSize, 
            CONFIG.imageSquareSize, 
              col * CONFIG.blockSize,
          row * CONFIG.blockSize,
          CONFIG.blockSize,
          CONFIG.blockSize
        );
      }
    }
  }

  /**
   * Draw game over screen
   */
  static drawGameOver() {
    ctx.fillStyle = "rgba(0, 0, 0, 0.7)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = "#FFFFFF";
    ctx.font = "48px Arial";
    ctx.textAlign = "center";
    ctx.fillText("GAME OVER", canvas.width / 2, canvas.height / 2);
  }
}

//Game Logic
class Game{
    constructor () { 
        this.state = new GameState();
        this.lastUpdateTime = 0; 
    }

    /**
   * Update game logic (called at gameSpeed rate)
   */
  update(currentTime) {
    if (this.state.isGameOver) return;

    // TODO: Implement game updates:
    // - Move current piece down
    // - Detect line clears
    // - Handle collisions
  }

  /**
   * Render everything (called at frameRate)
   */
  draw() {
    GameRenderer.drawBackground();
    GameRenderer.drawGrid();
    GameRenderer.drawPlacedBlocks(this.state.gameMap);
    GameRenderer.drawCurrentShape(this.state.currentShape);
    GameRenderer.drawNextShape(this.state.nextShape);

    if (this.state.isGameOver) {
      GameRenderer.drawGameOver();
    }
  }

    /**
    * Handle keyboard Input
    */
    handleInput(key) { 
        switch(key) { 
            case "Arrowleft": 
                this.state.currentShape.moveLeft();
                break; 
            case "ArrowRight":
                this.state.currentShape.moveDown();
                break; 
            case " ": //space bar 
                this.state.currentShape.rotate(this.state.gameMap);
                break;
        }
    }

    /**
    * Start the gmae loop 
    */
    start() {
        setInterval(() => this.update(Date.now()), 1000 / CONFIG.gameSpeed);
        setInterval(() => this.draw(), 1000 / CONFIG.frameRate);

        //listen for keyboard input
        document.addEventListener("keydown", (e) => this.handleInput(e.key));
    }
}

// ============================================
// INITIALIZE GAME
// ============================================
const game = new Game();
game.start();
                
    


let getMap;
let gameOver;
let CurrentShape;
let NextShape;
let score;
let initialTwoDarr;

let gameLoop = () => {

setInterval(update, 1000 / gameSpeed);
setInterval(draw, 1000 / FramePerSecond);
};

let update = () => {};

letDrawRect = (x,y) => {};

let currentDrawTetris = () => {
    for (let i = 0; i< CurrentShape.template.length; i++) {
        for (let j = 0; j< CurrentShape.template[i].length; j++) {
            if (CurrentShape.template [i][j] === 0) continue;
            ctx.drawImage(
                image,
                CurrentShape.imageX + j * imageSquaresize,
                CurrentShape.imageY + i * imageSquaresize,
                imageSquaresize,
                imageSquaresize,
                Math.trunc(CurrentShape.x + j) * size,
                Math.trunc(CurrentShape.y + i) * size,

            );
        }
    };
};

let drawingShape = () => {};

let draw = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBackground();
    drawSquare();
    currentDrawTetris();
    drawNextShape();
    if (gameOver) {
        drawGameOver();
    }
};

let drawBackground = () => {
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
};

let getRandomShape = () => {
    return Object.create(shapes [ Math.floor ( Math.random () * shapes.length)]);
};

let resetVars = () => {
    initialTwoDarr = [];
    for (let i = 0; i < squareCountY; i++) {
        let temp= [];
        for(let j = 0; j < squareCountX; j++) {
            temp.push({imageX: -1, imageY: -1});
        }
        initialTwoDarr.push(temp);
    }
    score = 0;
    gameOver = false;
    CurrentShape = getRandomShape();
    nextShape = getRandomShape();
}
