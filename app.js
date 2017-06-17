! function() {
    'use strict';
    var property = {
        matrixWidth: 30,
        matrixHeight: 30,
        idContainer: 'matrix',
        coordinateEat: 0,
        lengthSnake: 3,
        rightWall: [],
        leftWall: [0],
        snake: [],
        speedSnake: 200,
        totalPoints: 0,
        direction: 'right'
    };

    // 
    // Создание матрицы
    // 
    function createMatrix() {
        var matrix = document.getElementById(property.idContainer);
        var n = property.matrixWidth * property.matrixHeight;

        for (var i = 0; i < n; i++) {
            var div = document.createElement('div');
            div.className = 'cell';
            matrix.appendChild(div);

            if (!(i % property.matrixWidth) && i != 0) {
                property.leftWall.push(i);
                property.rightWall.push(i - 1);
            }
        }
        property.rightWall.push(n - 1);
    }

    //
    // Запись ячейки матрицы с едой
    //
    function setCellFood(x, y) {
        if (property.coordinateEat) {
            var el = document.getElementsByClassName('eat')[0];
            if (el) el.classList.remove('eat');
        }

        var min = 0,
            max = property.matrixWidth * property.matrixHeight,
            random = min + Math.random() * (max - min);

        var rand = (y - 1) * property.matrixWidth + (x - 1) || Math.round(random);

        for (var i = 0; i < property.snake.length; i++) {
            if (property.snake[i] == rand) {
                setCellFood();
                return;
            }
        }

        document.getElementById(property.idContainer)
            .children[rand]
            .classList.add('eat');

        property.coordinateEat = rand;
    }

    //
    // Создание поля с очками
    //
    function createFieldTotalPoints(target) {
        var div = document.createElement('div');
        div.id = "totalpoints";
        div.innerHTML = property.totalPoints;
        document.body.insertBefore(div, target);
    }

    //
    // Установка очков 
    //
    function setTotalPoints(points) {
        var points = points || 1;
        var curentText = document.getElementById('totalpoints').innerHTML;
        document.getElementById('totalpoints').innerHTML = Number(curentText) + points;
        property.totalPoints += points;
    }

    function showMess() {
        alert('GAME OVER' + '\n' + 'Total points = ' + property.totalPoints);
        location.reload();
    }

    function setLocalStorage() {
        localStorage.setItem('totalpoints', String(property.totalPoints));
    }

    function getLocalStorage() {
        if (localStorage.getItem('totalpoints'))
            alert('Your before result: ' + localStorage.getItem('totalpoints') + ' points');
    }

    //
    // Запись ячеек матрицы с змейкой
    //
    function Snake(x, y, lengthSnake) {
        var coordinate = (y - 1) * property.matrixWidth + (x - 1) || 0;
        var l = lengthSnake || property.lengthSnake;
        var timer;
        var then = this;
        var target = document.getElementById(property.idContainer);

        createFieldTotalPoints(target);

        then.create = function(arg) {
            var x = arg || coordinate;
            for (var i = 0; i < l; i++) {
                property.snake.push(x++);
                target
                    .children[property.snake[i]]
                    .classList.add('snake-body');
            }
        }

        function coloringCells(arr) {

            var el = document.getElementsByClassName('cell');

            for (var i = 0; i < el.length; i++) {
                el[i].classList.remove('snake-body');
            }

            for (var i = 0; i < arr.length; i++) {
                target
                    .children[arr[i]]
                    .classList.add('snake-body');
            }
        }

        function hasEat(coord) {
            return (coord == property.coordinateEat) ? true : false;
        }

        function hasBody(coord) {
            for (var i = 0; i < property.snake.length; i++) {
                if (coord == property.snake[i]) return true;
            }
            return false;
        }

        function hasWall(arr, coord) {
            for (var i = 0; i < arr.length; i++) {
                if (arr[i] == coord) return true;
            }
            return false;
        }

        then.step = function(direction, then) {

            var snakeHead = property.snake[property.snake.length - 1];

            if (direction == 'right') {
                snakeHead = snakeHead + 1;
                if (hasWall(property.leftWall, snakeHead)) showMess();

                if (property.direction == 'left') return;

            } else if (direction == 'left') {
                snakeHead = snakeHead - 1;
                if (hasWall(property.leftWall, snakeHead + 1)) showMess();

                if (property.direction == 'right') return;

            } else if (direction == 'down') {
                snakeHead = snakeHead + property.matrixWidth;
                if (snakeHead > property.matrixWidth * property.matrixHeight) showMess();

                if (property.direction == 'top') return;

            } else if (direction == 'top') {
                snakeHead = snakeHead - property.matrixWidth;
                if (snakeHead < 0) showMess();

                if (property.direction == 'down') return;

            }

            if (hasBody(snakeHead)) showMess();

            if (hasEat(snakeHead)) {
                property.snake.push(property.snake[property.snake.length - 1]);
                setCellFood();
                property.speedSnake -= 5;
                setTotalPoints(50);
                setLocalStorage();
            }

            property.snake.push(snakeHead);
            property.snake.shift();
            property.direction = direction;
            coloringCells(property.snake);

        }

        then.run = function(direction) {

            var dir = direction || property.direction;
            then.step(dir);
            timer = setTimeout(then.run, property.speedSnake, dir);

        }


        then.stop = function(direction) {

            if (direction == 'left' && property.direction == 'right') return true;
            if (direction == 'right' && property.direction == 'left') return true;
            if (direction == 'top' && property.direction == 'down') return true;
            if (direction == 'down' && property.direction == 'top') return true;

            clearTimeout(timer);
        }
    }

    function getKey(event) {
        var keycode;

        if (event.keyCode) keycode = event.keyCode; // IE
        else if (event.which) keycode = event.which; // all browsers

        switch (keycode) {
            case 13:
                return 'enter';
            case 37:
            case 65:
                return 'left';
            case 38:
            case 87:
                return 'top';
            case 39:
            case 68:
                return 'right';
            case 40:
            case 83:
                return 'down';
            default:
                return false;
        }
    }


    window.onload = function(event) {

        createMatrix();

        var snake = new Snake();

        getLocalStorage();

        setCellFood();

        snake.create();


        document.onkeydown = function(event) {

            switch (getKey(event)) {
                case 'enter':
                    snake.run();
                case 'left':
                    if (snake.stop('left')) return;
                    snake.run('left');
                    break;
                case 'top':
                    if (snake.stop('top')) return;
                    snake.run('top');
                    break;
                case 'right':
                    if (snake.stop('right')) return;
                    snake.run('right');
                    break;
                case 'down':
                    if (snake.stop('down')) return;
                    snake.run('down');
                    break;
                default:
                    return false;
            }
        }

    };
}();
