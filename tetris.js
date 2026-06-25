class Tetris {
    constructor (imageX,imageY,template) {

        this.imageY=imageY;
        this.imageX=imageX;
        this.template=template;
    }
   }

const size = 40;
const framePerSecond = 24; 
const gameSpeed = 5;
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

const shapes =[
    new Tetris(0,120,[
        [0,1,0],
        [0,1,1],
        [1,1,0],
    ]),
    new Tetris(0.96,[
        [0,0,0],
        [1,1,1],
        [0,1,0],

    ]),
    new Tetris(0,72, [
        [0,1,0],
        [0,1,0],
        [0,1,0],
    ]),
    new Tetris (0,48, [
        [0,0,0],
        [0,1,0],
        [1,0,1],
    ]),
    new Tetris(0,24, [
        [0,1,1,0],
        [0,0,1,0],
        [0,0,1,0],
        [0,0,1,0],
    ]),

    new Tetris(0,0, [
        [1,1],
        [1,1],
    ]),

    new Tetris(0,48, [
    [0,0,0],
    [1,1,0],
    [0,1,1],
    
    ]),
];

let currentShape = shapes[0];

function drawBackground() {
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function currentDrawTetris() {
    for (let i= 0; i < currentShape.template.length; i++) {
        for (;et j = 0; j < currentShape.template[i][j] === 0) continue;
        ctx.fillStyle = "lime";
        ctx.fillRect(
            currentShape.imageX + j * size,
            currentShape.imageY + i * size, 
            size, 
            size, 
       );
    }
  }
}

function draw() {
    drawBackground();
    currentDrawTetris();
}

setInterval(draw, 1000 / framePerSecond); 


