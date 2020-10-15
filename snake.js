/*
Snake Game

https://playsnake.org/

Snake is played on a NxM rectangular board where you control a "snake".
At any given time, there is a single fruit on the board that you can eat
with your snake by colliding with it. Eating fruit will grow your snake
by 1. Upon eating a fruit, a new fruit will be generated at a random
unoccupied position on the board. 
The snake is always moving in the current direction it is facing. The snake
can only be controlled by 4 inputs - up, down, left, and right - which will
change the current direction the snake is facing. However, the snake can
only change to an adjacent direction (can't do a 180).
You win when the entire board is filled by your snake.
You lose when the snake runs into a wall or into itself.
    i
The implementation of the game can be considered as a 2 step process:
1. Update the current game state (snake position, fruit location, snake size, etc)
2. Render the new game state (draw the board, the snake, and the fruit)

Implement a single update cycle of the snake game, which takes the current direction to
update the game state and then display the new game state.
You can ignore user input for this question and assume it is part of the game state.

ie. If the game state looks like this
Current Direction: Righ     t
. . . . .                   . . . . .                   . . . . .
. . . . .  updateGameState  . . . . .  updateGameState  . . . . .
. S . F . ----------------> . S S F . ----------------> . S S S .
. S . . .                   . S . . .                   . S . . .
. S S S .                   . S S . .                   . S S . .

every second, pop the end of the snake array, move the snake array in the direction that has been pressed
snake starts off moving down 
(1, 0) = S
(-1, 0) = N
(0, 1) = E
(0, -1) = W

Design:

Game state:
Needs board, snake position, snake direction, fruit position
To update: snake head, snake direction, snake tail
=> manage state of game
=> board object, snake object

Board object:
=> 2D array of Square objects
===> Square: hasSnake, hasFruit
=> printBoard, setSnake, setFruit

Snake object
head, tail, direction
=> cannot go in 180 degrees
=> have head member? (x, y) coordinate

need to tie in the javascript functions and the html

*/

// CLASS FUNCTIONS
const TIME_INTERVAL = 200;

const DIRECTIONS = {
    "up":       [ -1, 0 ],
    "down":     [ 1,  0 ],
    "left":     [ 0, -1 ],
    "right":    [ 0,  1 ]
};

class GameState {
    constructor(n, m) {
        this.board = new Board(n, m);
        // this.snake = new Snake(0, 0);
        // this.board.setSnake([0, 0]);
        /*
        JANKY WAY to setup the snake 
        */
        this.snake = new Snake(Math.floor(n/2), Math.floor(m/2));
        // this.snake.popSnakeTail();
        // this.board.setSnake([Math.floor(n/2)-2, Math.floor(m/2)]);
        // this.snake.snakeArray.push([Math.floor(n/2)-2, Math.floor(m/2)]);
        this.board.setSnake([Math.floor(n/2), Math.floor(m/2)]);
        this.board.setFruit([Math.floor(n/2)+1, Math.floor(m/2)+1]);
        this.board.setFruit([Math.floor(n/2)+3, Math.floor(m/2)-1]);
        this.board.setFruit([Math.floor(n/2)-1, Math.floor(m/2)+3]);
        this.board.setFruit([Math.floor(n/2)+2, Math.floor(m/2)+4]);
        this.board.setFruit([Math.floor(n/2)-2, Math.floor(m/2)-2]);
        this.board.setFruit([Math.floor(n/2)+4, Math.floor(m/2)-4]);
        // this.snake.snakeArray.push([Math.floor(n/2)-1, Math.floor(m/2)]);
        // this.board.setSnake([Math.floor(n/2)-1, Math.floor(m/2)]);
        // this.snake.snakeArray.push([Math.floor(n/2), Math.floor(m/2)]);
        this.playing = true;
        this.interval = '';
    }

    getBoard() {
        return this.board.getBoard();
    }

    printBoard() {
        this.board.printBoard();
    }

    /*
    Main gameplay function, this is all hardcoded
    change direction is just hardcoded for now but will be based on user input (arrow keys)
    */
    start() { // function name TBD
        this.interval = setInterval(() => {
            // render(this);
            // this.printBoard();
            this.moveSnake();
            // this.snake.changeDirection("right");
            // this.printBoard();
            // console.log();
        }, TIME_INTERVAL);
        // setInterval(this.playGame, 1000); 
        /*
        * why does this not work but an anonymous function works?
        * the member variables aren't instantited for some reason when calling this.playGame
        */
    }

    playGame() {
        // this.printBoard();
        this.moveSnake();
        // this.printBoard();
        // console.log();
    }

    moveSnake() {
        /*
        some functionality to end the game when it hits a snake or out of bounds
        */
        this.snake.move(); // move the snake 1 step in direction
        let [snakeX, snakeY] = this.snake.getSnakeHead();
        if (this.verifyMove(snakeX, snakeY)) {           // touching snake check
            this.playing = false;
            console.log("Game over!");
            clearInterval(this.interval);
        } else {
            this.board.setHTML([snakeX, snakeY], 'S');
            this.board.setSnake([snakeX, snakeY]); // update board w/ snake head
            /*
            some functionality when adding the fruit to the snake
            */
            if (this.board.getBoard()[snakeX][snakeY].hasFruit) {
                this.board.setHTML([snakeX, snakeY], 'S');
                this.board.getBoard()[snakeX][snakeY].removeFruit();
            } else {
                this.board.setHTML(this.snake.getSnakeTail(), '.'); 
                this.board.removeSnake(this.snake.popSnakeTail()); // remove snake tail   
            }
        }
    }

    verifyMove(snakeX, snakeY) {
        return (snakeX >= this.board.getDimensions()[0] || snakeX < 0 ||        // out of bounds check
            snakeY >= this.board.getDimensions()[1] || snakeY < 0 ||    // out of bounds check
            this.board.getBoard()[snakeX][snakeY].hasSnake);
    }

    changeDirection(direction) {
        this.snake.changeDirection(direction);
    }
}

class Snake {
    constructor(x, y) {
        this.head = [x, y];
        this.direction = [1, 0]; // width = y | height = x
        this.snakeArray = [[x,y]];
    }

    move() {
        let x = this.head[0] + this.direction[0];
        let y = this.head[1] + this.direction[1];
        this.head = [x, y];
        this.snakeArray.push([x, y]);
    }

    changeDirection(direction) {
        direction = DIRECTIONS[direction];
        if ((direction[0] + this.direction[0]) === 0 && // if it's opposite direction, ignore
            (direction[1] + this.direction[1]) === 0) return;
        this.direction = direction;
    }

    getSnakeHead() {
        return this.head;
    }

    getSnakeArray() {
        return this.snakeArray;
    }
    
    getSnakeTail() {
        return this.snakeArray[0];
    }

    popSnakeTail() {
        return this.snakeArray.shift();
    }
}

class Board {
    constructor(n, m) {
        this.arr = new Array(n);
        for (let i = 0; i < n; i++) {
            this.arr[i] = new Array(m);
            for (let j = 0; j < m; j++) {
                this.arr[i][j] = new Square();
            }
        }
        this.dimensions = [n, m];
    }

    printBoard() {
        let line = [];
        for (let i = 0; i < this.dimensions[0]; i++) {
            for (let j = 0; j < this.dimensions[1]; j++) {
                let square = this.arr[i][j];
                if (square.hasSnake) line.push('S ');
                else if (square.hasFruit) line.push('F ');
                else line.push('. ');
            }
            console.log(line.join(''));
            line = [];
        }
    }

    getBoard() {
        return this.arr;
    }

    setSnake(position) {
        this.arr[position[0]][position[1]].setSnake();
    }

    setFruit(position) {
        this.arr[position[0]][position[1]].setFruit();
    }

    setHTML(position, str) {
        this.arr[position[0]][position[1]].setHTML(str);
    }

    removeSnake(position) {
        this.arr[position[0]][position[1]].removeSnake();
    }

    removeFruit(position) {
        this.arr[position[0]][position[1]].removeFruit();
    }

    getDimensions() {
        return this.dimensions;
    }
}

class Square {
    constructor() {
        this.hasSnake = false;
        this.hasFruit = false;
        this.html = null;
    }

    setSnake() {
        this.hasSnake = true;
        // this.html.innerText = 'S';
    }

    setHTML(str) {
        this.html.innerText = str;
    }
    
    setFruit() {
        this.hasFruit = true;
        // this.html.innerText = 'F';
    }
    
    removeSnake() {
        this.hasSnake = false;
        // this.html.innerText = '';
    }

    removeFruit() {
        this.hasFruit = false;
        // this.html.innerText = '';
    }
}

function Main() {
    gameState = new GameState(10,10);
    gameState.start(); // This will output to terminal
}


// HTML FUNCTIONS
const snakeDiv = document.querySelector("#snake_div");
const playButton = document.querySelector("#play_button");
var gameState = null;

document.onkeydown = checkKey;
playButton.addEventListener('click', play);

function checkKey(e) {
    e = e || window.event;
    
    if (e.keyCode == '38') {
        // up arrow
        gameState.changeDirection("up");
    }
    else if (e.keyCode == '40') {
        // down arrow
        gameState.changeDirection("down");
    }
    else if (e.keyCode == '37') {
       // left arrow
       gameState.changeDirection("left");
    }
    else if (e.keyCode == '39') {
       // right arrow
       gameState.changeDirection("right");
    }
}

function render(gameState) {
    snakeDiv.innerHTML = '';
    let [dX, dY] = gameState.board.getDimensions();
    let snakeTable = document.createElement("table");
    for (let i = 0; i < dX; i++) {
        let snakeRow = document.createElement("tr");
        for (let j = 0; j < dY; j++) {
            let snakeCell = document.createElement("td");
            snakeCell.classList.add("snakeCell");
            let square = gameState.board.arr[i][j];
            if (square.hasSnake) snakeCell.innerText = 'S';
            else if (square.hasFruit) snakeCell.innerText = 'F';
            else snakeCell.innerText = '.';
            snakeRow.appendChild(snakeCell);
            gameState.getBoard()[i][j].html = snakeCell;
        }
        snakeTable.appendChild(snakeRow);
    }
    snakeDiv.appendChild(snakeTable);
    console.log(gameState.getBoard());
}

function play() {
    gameState = new GameState(10,10);
    render(gameState);
    gameState.start();
}

// Main();