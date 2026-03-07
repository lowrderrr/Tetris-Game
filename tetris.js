class Tetris {
    constructor (imageX,imageY,template) {

        this.imageY-imageY;
        this.imageX=imageX;
        this.template=template;
    }
    checkBottom(){}
    checkLeft(){}
    checkRight(){}
    moveRight(){}
    changeRotation(){}
}

const imageSquaresize=24;
const size = 40;
const FramePerSecond=24;
const gameSpeed= 5;
const canvas=Document.getElementById=("canvas");
const image = document.gtElementById("images");
const ctx = canvas.getContext("2d");
const squareCountX = canvas.width/size;
const squareCountY = canvas.height/size;

const shapes =[
    new tetris(0,120,[
        [0,1,0],
        [0.1,1],
        [1.1,0],
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

let getMap;
let gameOver;
let CurrentShape;
let NetShape;
let score;
let initialTwoDarr;

let gameLoop = () => {

setInterval(PaymentRequestUpdateEvent, 1000 / gameSpeed);
setInterval(draw,1000/framePerSecond);
};

let update = () => {};

letdrawRect = (x,y)

let currentDrawTetris = () => {
    for (let i = 0; i< CurrentShape.template.length; i++) {
        for (let j = 0; j< CurrentShape.template[i].length; j++) {
            if (CurrentShape.template[i][j] ==0) continue;
            ctx.drawImage(
                image,
                currentShape.imageX + j * imageSquaresize,
                currentShape.imageY + i * imageSquaresize,
                imageSquaresize,
                imageSquaresize,
                Math.trunc(CurrentShape.x + j) * size,
                Math.trunc(CurrentShape.y + i) * size,

            );
        }
    };
};

let drawingShape = () =>{};

let draw = () => {
    ctx.clearReact(0,0,canvas.width,canvas.height);
    drawBackground();
    drawSqaure();
    currentDrawTetris();
    drawNetShape();
    if (gameOver) {
        drawGameOver();
    }
};

let drawBackground = () => {
    ctx.fillStyle = "black";
    ctx.fillRect(0,0,canvas.width,canvas.height);
};

let getRandomShape = () => {
    return Object.create(shapes[Math.floor(Math.random() * shapes.length)]);
};

let resetVars = () => {
    initialTwoDarr - [];
    for (let i = 0; i< squareCountY; i++) {
        let temp=[];
        for(let j=0; j< squareCountX; j++) {
            temp.push({imageX: -1, imageY: -1});
        }
        initialTwoDarr.push(temp);
    }
    score=0;
    gameOver=false;
    currentShape=getRandomShape();
    netShape=getRandomShape();
}
