//初始版本
window.onload = function() {
    newGame();
    newGameButton();
    keyBoard();
}

//将游戏中的所有数据存储于对象中
var gameData = {
    data: [],
    score: 0,
    maxScore: 0,
    running: false,
    isMove: false,
    reseat: function () {
        var cells = document.getElementsByClassName('grid');
        for (var i = 0; i < cells.length; i++) {
            cells[i].innerHTML = '<div></div>';
        }
    },
    start: function() {
        this.score = 0;
        this.running = true;
        this.isMove = false;
        document.getElementsByClassName('digit')[0].innerHTML = this.score + '';
        for (var i = 0; i < 4; i++) {
            this.data[i] = [];
            for (var j = 0; j < 4; j++) {
                this.data[i][j] = 0;
            }
        }
        this.reseat();
    },
}

//创建一个格子，css属性与.grid一样
var createGrid = function(num, x, y) {
    var newgrid = document.getElementsByClassName('grid-' + x + y)[0].getElementsByTagName('div')[0];
    newgrid.innerHTML = '<span>' + num + '</span>';
    //将新建的div添加一个class类名
    newgrid.classList.add('new-gride');
}

//数字为2或4，位置随机生成,将创建的格子放置在对应的位置上
var giveRandomNum = function() {

    var num, x, y;
    //数字2的出现概率更高
    num = Math.random() > 0.7 ? 4 : 2;
    //需解决，若没有空位将产生死循环
    while (true) {
        x = Math.floor(Math.random() * 4);
        y = Math.floor(Math.random() * 4);
        //判断该位置上是否有格子（带数字的）
        if (gameData.data[x][y] === 0) {
            gameData.data[x][y] = num;
            createGrid(num, x, y);
            numBackColor();
            break;
        }
    }
}
//获得每个格子的dom元素
var allGrids = function() {
    var all = [];
    for (var i = 0; i < 4; i++) {
        all[i] = [];
        for (var j = 0; j < 4; j++) {
            all[i][j] = document.getElementsByClassName('grid-' + i + j)[0].getElementsByTagName('div')[0];
        }
    }
    return all;
}
//更新类名
var updateClass = function() {
    var all = allGrids();
    for (var i = 0; i < 4; i++) {
        for (var j = 0; j < 4; j++) {
            if(all[i][j].classList.contains('new-gride')) {
                all[i][j].classList.remove('new-gride');
                all[i][j].classList.add('move-grid')
            } 
        }
    }
}
//根据格子中的数字设置相应的背景颜色以及字体颜色
var numBackColor = function() {
    var allCells = allGrids();
    for (var i = 0; i < 4; i++) {
        for (var j = 0; j < 4; j++) {
            allCells[i][j].style.color = '#fff';
            switch (gameData.data[i][j]) {
                case 2:
                    allCells[i][j].style.background = '#fffacd';
                    allCells[i][j].style.color = '#b36d41';
                    break;
                case 4:
                    allCells[i][j].style.background = '#ffb366';
                    break;
                case 8:
                    allCells[i][j].style.background = '#ff7f50';
                    break;
                case 16:
                    allCells[i][j].style.background = '#f66';
                    break;
                case 32:
                    allCells[i][j].style.background = '#fa8072';
                    break;
                case 64:
                    allCells[i][j].style.background = '#ff9c75';
                    break;
                case 128:
                    allCells[i][j].style.background = '#ff6347';
                    break;
                case 256:
                    allCells[i][j].style.background = '#ff8800';
                    break;
                case 512:
                    allCells[i][j].style.background = '#ff6600';
                    break;
                case 1024:
                    allCells[i][j].style.background = '#f53';
                    break;
                case 2048:
                    allCells[i][j].style.background = '#f40';
                    break;
            }
        }
    }
}

//开始新游戏(清除界面数据，随机生成一个格子，)
var newGame = function() {
    gameData.start();
    giveRandomNum();
    numBackColor();
    document.getElementsByClassName('digit')[1].innerHTML = gameData.maxScore + '';
}


//点击按钮"新游戏"或"再来一局"
var newGameButton = function() {
    var button = document.getElementsByClassName('new-game')[0];
    var againButton = document.getElementsByClassName('again')[0]
    button.addEventListener('click', function () {
        newGame();
    })

    againButton.addEventListener('click', function() {
        document.getElementsByClassName('overpage')[0].style.display = 'none';
        newGame();
    })
}

//移动过程中清除格子
var update = function(x1, y1, x2, y2, isupdate, sc) {
    var cell1 = document.getElementsByClassName('grid-' + x1 + y1)[0];
    var cell2 = document.getElementsByClassName('grid-' + x2 + y2)[0];
    var score = document.getElementsByClassName('digit')[0];
    cell1.innerHTML = cell2.innerHTML;
    if(isupdate) {
        cell1.getElementsByTagName('span')[0].innerHTML = gameData.data[x1][y1] + '';
        if(sc > gameData.maxScore) {
            document.getElementsByClassName('digit')[1].innerHTML = sc + '';
        }
        score.innerHTML = sc + '';       
    }
    gameData.isMove = true;
    cell2.innerHTML = '<div></div>';
}

//游戏结束后显示结束界面
var showOver = function() {
    if(gameData.score > gameData.maxScore) {
        gameData.maxScore = gameData.score;
    }
    var page = document.getElementsByClassName('overpage')[0];
    page.getElementsByTagName('p')[1].getElementsByTagName('span')[0].innerHTML = gameData.score + '';
    page.getElementsByTagName('p')[2].getElementsByTagName('span')[0].innerHTML = gameData.maxScore + '';
    page.style.display = 'block';
}

//判断游戏是否结束
var isRun = function() {
    //判断数组是否有0
    for(var i = 0; i < 4; i++) {
        for(var j = 0; j < 4; j++) {
            if(gameData.data[i][j] === 0) {
                return true;
            }         
            if(i < 3) {
                if (gameData.data[i][j] === gameData.data[i+1][j]) {
                    return true;
                }
        }
        if (j < 3) {
            if (gameData.data[i][j] === gameData.data[i][j+1]) {
                return true;
                }
            }
        }
    }
    return false;
}

//向左移动
var towardLeft = function() {
    updateClass();
    for(var x = 0; x < 4; x++) {
        moveLeft(x);
    }
    if(gameData.isMove) {
        gameData.isMove = false;
        giveRandomNum();
    }
    gameData.running = isRun();
    if(gameData.running === false) {
        setTimeout('showOver()', 1000);
    }
}

var moveLeft = function(x) {
    for(var y = 0; y < 4; y++) {
        var next = getLeftNext(x, y);
        if(next !== -1) {
            if(gameData.data[x][y] === 0) {
                gameData.data[x][y] = gameData.data[x][next]; 
                gameData.data[x][next] = 0;
                update(x, y, x, next, false);
                y -= 1;
            }
            else if(gameData.data[x][y] === gameData.data[x][next]) {
                gameData.data[x][y] *= 2;
                gameData.data[x][next] = 0;
                gameData.score += gameData.data[x][y];
                update(x, y, x, next, true, gameData.score);
            }
        }
    }
}

var getLeftNext = function(x, y) {
    for(var j = y+1; j < 4; j++) {
        if(gameData.data[x][j] !== 0) {
            return j;
        }
    }
    return -1;
}

//向右移动
var towardRight = function() {
    updateClass();
    for(var x = 3; x >= 0; x--) {
        moveRight(x);
    }
    if(gameData.isMove) {
        gameData.isMove = false;
        giveRandomNum();
    }
    gameData.running = isRun();
    if(gameData.running === false) {
        setTimeout('showOver()', 1000);
    }
}

var moveRight = function(x) {
    for(var y = 3; y >= 0; y--) {
        var next = getRightNext(x, y);
        if(next !== -1) {
            if(gameData.data[x][y] === 0) {
                gameData.data[x][y] = gameData.data[x][next];
                gameData.data[x][next] = 0;
                update(x, y, x, next, false);
                y += 1;
            }
            else if(gameData.data[x][y] === gameData.data[x][next]) {
                gameData.data[x][y] *= 2;
                gameData.data[x][next] = 0;
                gameData.score += gameData.data[x][y];
                update(x, y, x, next, true, gameData.score);
            }
        }
    } 
}

var getRightNext = function(x, y) {
    for(var j = y-1; j >=0; j--) {
        if(gameData.data[x][j] !== 0) {
            return j;
        }
    }
    return -1;
}

//向上移动
var towardUp = function() {
    updateClass();
    for (var y = 0; y < 4; y++) {
        moveUp(y);
    }
    if(gameData.isMove){
        gameData.isMove = false;
        giveRandomNum();
    }
    gameData.running = isRun();
    if(gameData.running === false){
        setTimeout('showOver()', 1000);
    }
}

var moveUp = function(y) {
    for (var x = 0; x < 4; x++) {
        var next = getUpNext(x, y);        
        if (next !== -1) {
            if (gameData.data[x][y] === 0) {
                gameData.data[x][y] = gameData.data[next][y];
                gameData.data[next][y] = 0;
                update(x, y, next, y, false);
                x -= 1;
            }
            else if (gameData.data[x][y] === gameData.data[next][y]) {
                gameData.data[x][y] *= 2;
                gameData.data[next][y] = 0;
                gameData.score += gameData.data[x][y];
                update(x, y, next, y, true, gameData.score);
            }           
        }
    }
}

var getUpNext = function(x, y) {
    for (var i = x + 1; i < 4; i++) {
        if (gameData.data[i][y] !== 0) {
            return i;
        }
    }
    return -1
}

//向下移动
var towardDown = function() {
    updateClass();
    for (var y = 3; y >= 0; y--) {
        moveDown(y);
    }
    if(gameData.isMove) {
        gameData.isMove = false;
        giveRandomNum();
    }
    gameData.running = isRun();
    if(gameData.running === false) {
        setTimeout('showOver()', 1000);
    }
}

var moveDown = function(y) {
    for (var x = 3; x >= 0; x--) {
        var next = getDownNext(x, y);      
        if (next !== -1) {
            if(gameData.data[x][y] === 0) {
                gameData.data[x][y] = gameData.data[next][y];
                gameData.data[next][y] = 0;
                update(x, y, next, y, false);
                x += 1;
            }
            else if(gameData.data[x][y] === gameData.data[next][y]) {
                gameData.data[x][y] *= 2;
                gameData.data[next][y] = 0;
                gameData.score += gameData.data[x][y];
                update(x, y, next, y, true, gameData.score);
            }           
        }
    }
}

var getDownNext = function (x, y) {
    for (var i = x - 1; i >= 0; i--) {
        if (gameData.data[i][y] !== 0) {
            return i;
        }
    }
    return -1
}

//键盘监听上下左右键
var keyPress = function (keyCode) {
    switch (keyCode) {
        case 37:
            towardLeft();
            break;
        case 38:
            towardUp();
            break;
        case 39:
            towardRight();
            break;
        case 40:
            towardDown();
            break;
    }
}

var keyBoard = function () {
    //在document中添加监听事件 
    document.onkeyup = function (e) {
        keyPress(e.keyCode);
    }
}


