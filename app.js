var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');

var width = canvas.width;
var height = canvas.height;
//Ячейки для сетки
var blockSize = 10;
var widthInBlocks = width / blockSize;
var heightInBlocks = height / blockSize;

//Подсчет очков
var score = 0;

//Рамка для холста
var drawBorder = function () {
    ctx.fillStyle = 'Gray';
    ctx.fillRect(0, 0, width, blockSize);
    ctx.fillRect(0, 0, blockSize, height - blockSize);
    ctx.fillRect(0, height - blockSize, width, blockSize);
    ctx.fillRect(width - blockSize, 0, blockSize,height - blockSize);
};

//Отображение счета
var drawScore = function () {
    ctx.font = '20px Courier'
    ctx.textBaseline = 'top';
    ctx.textAlign = 'left';
    ctx.fillStyle = 'Black';
    ctx.fillText('Счет: ' + score, blockSize, blockSize);
};

//Конец игры
var gameOver = function () {
    animationTime = 0;
    ctx.fillColor = 'Black';
    ctx.font = '60px Courier';
    ctx.textBaseline = 'center';
    ctx.textAlign = 'center';
    ctx.fillText('Game over', width/2, height/2);
};

//Функция для рисования окружностей
var circle = function (x, y, radius, fillCircle) {
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2, false);
    if (fillCircle) {
        ctx.fill();
    } else {
        ctx.stroke();
    }
};


//Конструктор обьекта Блок для создания "сетки"
var Block = function (col, row) {
    this.col = col;
    this.row = row;
};


//Добавление метода для рисования квадрата в ячейке
Block.prototype.drawSquare = function (color) {
    var x = this.col * blockSize;
    var y = this.row * blockSize;
    ctx.fillStyle = color;
    ctx.fillRect(x, y, blockSize, blockSize);
};

//Добавление метода для рисования окружности в ячейке
Block.prototype.drawCircle = function (color) {
    var centerX = this.col * blockSize + blockSize / 2;
    var centerY = this.row * blockSize + blockSize / 2;
    ctx.fillStyle = color;
    circle(centerX, centerY, blockSize / 2, true);
};


//Медод для проверки не находятся ли элементы в одной позиции
Block.prototype.equal = function (otherBlock) {
    return this.col === otherBlock.col && this.row === otherBlock.row;
};


//Конструктор для создания обьекта змейки
var Snake = function () {
    this.segments = [
        new Block(7, 5),
        new Block(6, 5),
        new Block(5, 5)
    ];

    this.direction = 'Right';
    this.nextDirection = 'Right';
};


//Функция, которая рисует змейку
Snake.prototype.draw = function () {
    for(i = 0; i < this.segments.length; i++) {
        if (i === 0) {
        this.segments[i].drawSquare('Black');
        }  else {
            this.segments[i].drawSquare('Orange');
        }
    }
};

//Метод для перемещения змейки
Snake.prototype.move = function () {
    var head = this.segments[0];
    var newHead;

    this.direction = this.nextDirection;

    if (this.direction === 'Right') {
        newHead = new Block(head.col + 1, head.row);
    }   else if (this.direction === 'Left') {
        newHead = new Block(head.col - 1, head.row);
    }   else if (this.direction === 'Up') {
        newHead = new Block(head.col, head.row - 1);
    }   else if (this.direction === 'Down') {
        newHead = new Block(head.col, head.row + 1);
    }
    if (this.checkCollision(newHead)) {
        gameOver();
        return; 
    }

    this.segments.unshift(newHead);
    if (newHead.equal(apple.position)) {
        score++;
        animationTime -= 5;
            apple.move();
    }   else {
        this.segments.pop();
    }
}; 

//Метод для проверки на столкновение
Snake.prototype.checkCollision = function (head) {
    var leftCollision = (head.col === 0);
    var topCollision = (head.row === 0);
    var rightCollision = (head.col === widthInBlocks - 1);
    var bottomCollision = (head.row === heightInBlocks - 1);

    var wallCollision = leftCollision || topCollision || rightCollision || bottomCollision;
    var selfCollision = false;

    for(i = 0; i < this.segments.length; i++) {
        if (head.equal(this.segments[i])) {
            selfCollision = true;
        }
    }
    return selfCollision || wallCollision;
};

//Установка нового направления движения змейки
Snake.prototype.setDirection = function(newDirection) {
    if (this.direction === 'Up' && newDirection === 'Down') {
        return;
    }   else if (this.direction === 'Down' && newDirection === 'Up') {
        return;
    }   else if (this.direction === 'Right' && newDirection === 'Left') {
        return;
    }   else if (this.direction === 'Left' && newDirection === 'Right') {
        return;
    }

    this.nextDirection = newDirection;
};

//Конструктор для яблока
var Apple = function () {
    this.position = new Block(10, 10);
};

//Метод для появления яблока в ячейке
Apple.prototype.draw = function () {
    this.position.drawCircle('LimeGreen');
};

//Перемещение яблока в случайную позицию
Apple.prototype.move = function () {
    var randomCol = Math.floor(Math.random() * (widthInBlocks -2)) + 1;
    var randomRow = Math.floor(Math.random() * (heightInBlocks -2)) + 1;
    this.position = new Block(randomCol, randomRow);
};


var snake = new Snake();
var apple = new Apple();

var animationTime = 120;
var gameLoop = function () {
    ctx.clearRect(0, 0, width, height);
    drawScore();
    snake.move();
    snake.draw();
    apple.draw();
    drawBorder();
    setTimeout(gameLoop, animationTime);
};

gameLoop();


//Коды клавиш клавиатуры
var directions = {
    37: 'Left',
    38: 'Up', 
    39: 'Right', 
    40: 'Down',
};

//Управление змейкой с помощью событий с клавиш
$('body').keydown(function(event) {
    var newDirection = directions[event.keyCode];
    if(newDirection !== undefined) {
        snake.setDirection(newDirection);
    } 
});








