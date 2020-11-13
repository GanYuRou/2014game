class Game {
    constructor() {
        this.init(4);
    }
    init(col) {
        this.data = [];
        this.score = 0;
        this.column = col;
        let table = document.querySelectorAll(".gameTable");
        localStorage.getItem("maxScore") || localStorage.setItem("maxScore", 0);
        this.maxScore = localStorage.getItem("maxScore");
        //数组全部赋为0
        for (let i = 0; i < this.column; i++) {
            this.data[i] = [];
            for (let j = 0; j < this.column; j++) {
                this.data[i][j] = 0;
            }
        }
        //选择难度面板
        if (this.column === 4) {
            table[1].style.display = "none";
            table[0].style.display = "block";
        }
        else {
            table[1].style.display = "block";
            table[0].style.display = "none";
        }
        //每个方格都清空
        document.querySelectorAll(".grid").forEach((ele) => {
            ele.innerHTML = "<div></div>";
        });
        //界面分数清零
        document.querySelector(".digit").innerHTML = "0";
        //本地获得最高分
        document.querySelector(".max-digit").innerHTML = localStorage.getItem("maxScore");
        //开局给予两个随机方格
        this.giveCell();
        this.giveCell();
    }

    randomNum(col) {
        let num = Math.random() > 0.7 ? 4 : 2;
        let x, y;
        while (true) {
            x = Math.floor(Math.random() * col);
            y = Math.floor(Math.random() * col);
            if (this.data[x][y] === 0) {
                this.data[x][y] = num;
                break;
            }
        }
        this.replaceGrid(num, col, x, y);
        this.background();
    }

    replaceGrid(num, col, x, y) {
        let brandNew = document.querySelector(`.grid${col}-${x}${y}>div`);
        brandNew.innerHTML = `<span>${num}</span>`;
        //替换大方格 或者 小方格
        brandNew.className = (col === 4 ? `brand-new cell-4 ani4` : `brand-new cell-6 ani6`);
    }

    background() {
        let newCells = document.querySelectorAll(".brand-new");
        newCells.forEach(element => {
            switch (element.textContent) {
                case "2":
                    element.style.background = '#fffacd';
                    element.style.color = '#b36d41';
                    break;
                case "4":
                    element.style.color = '#fff';
                    element.style.background = '#ffb366';
                    break;
                case "8":
                    element.style.background = '#ff7f50';
                    break;
                case "16":
                    element.style.background = '#f66';
                    break;
                case "32":
                    element.style.background = '#fa8072';
                    break;
                case "64":
                    element.style.background = '#ff9c75';
                    break;
                case "128":
                    element.style.background = '#ff6347';
                    break;
                case "256":
                    element.style.background = '#ff8800';
                    break;
                case "512":
                    element.style.background = '#ff6600';
                    break;
                case "1024":
                    element.style.background = '#f53';
                    break;
                case "2048":
                    element.style.background = '#f40';
                    break;
            }
        });
    }
    //只有有位置时才产生随机数
    giveCell() {
        for(let a = 0; a < this.column; a++) {
            for(let b = 0; b < this.column; b++) {
                if(this.data[a][b] === 0) {
                    this.randomNum(this.column);
                    return;
                }
            }
        }
    }
    //游戏是否已结束
    isOver() {
        for (let i = 0; i < this.column; i++) {
            for (let j = 0; j < this.column; j++) {
                if (this.data[i][j] === 0) {
                    return false;
                }
                if (i < this.column - 1) {
                    if (this.data[i][j] === this.data[i + 1][j]) {
                        return false;
                    }
                }
                if (j < this.column - 1) {
                    if (this.data[i][j] === this.data[i][j + 1]) {
                        return false;
                    }
                }
            }
        }

        return true;
    }
    overPage() {
        this.score > this.maxScore && (this.maxScore = this.score);
        localStorage.setItem("maxScore", this.maxScore);
        let spans =  document.querySelectorAll(".overpage>p>:first-child");
        spans[0].textContent = this.score + '';
        spans[1].textContent = this.maxScore + '';
        setTimeout(() => {
            document.querySelector(".overpage").style.display = "block";
        }, 1000);
    }

    update(x1, y1, x2, y2, isupdate) {
        let cell1 = document.querySelector(`.grid${this.column}-${x1}${y1}`);
        let cell2 = document.querySelector(`.grid${this.column}-${x2}${y2}`);
        cell1.innerHTML = cell2.innerHTML;
        cell1.firstElementChild.classList.remove(`ani${this.column}`);
        if (isupdate) {
            cell1.firstElementChild.textContent = this.data[x1][y1] + '';
            this.background();
            document.querySelector(".digit").textContent = this.score + '';
            if (this.score > this.maxScore) {
                document.querySelector(".max-digit").textContent = this.score + '';
            }
        }
        cell2.innerHTML = '<div></div>';
    }
    //左移逻辑
    allLeft() {
        for (let x = 0; x < this.column; x++) {
            for (let y = 0; y < this.column; y++) {
                let sub = this.asideLeft(x, y);
                if (sub !== -1) {
                    //方格移动
                    if (this.data[x][y] === 0) {
                        this.data[x][y] = this.data[x][sub];
                        this.data[x][sub] = 0;
                        this.update(x, y, x, sub, false);
                        y -= 1;
                        continue;
                    }
                    //方格合并
                    if (this.data[x][y] === this.data[x][sub]) {
                        this.data[x][y] *= 2;
                        this.data[x][sub] = 0;
                        this.score += this.data[x][y];
                        this.update(x, y, x, sub, true);
                    }
                }
            }
        }
    }
    asideLeft(x, y) {
        for (let j = y + 1; j < this.column; j++) {
            if (this.data[x][j] !== 0) {
                return j;
            }
        }
        return -1;
    }

    //上移
    allUp() {
        for (let y = 0; y < this.column; ++y) {
            for (let x = 0; x < this.column; ++x) {
                let sub = this.asideUp(x, y);
                if (sub !== -1) {
                    if (this.data[x][y] === 0) {
                        this.data[x][y] = this.data[sub][y];
                        this.data[sub][y] = 0;
                        this.update(x, y, sub, y, false);
                        x -= 1;
                        continue;
                    }
                    if (this.data[x][y] === this.data[sub][y]) {
                        this.data[x][y] *= 2;
                        this.data[sub][y] = 0;
                        this.score += this.data[x][y];
                        this.update(x, y, sub, y, true);
                    }
                }
            }
        }
    }
    asideUp(x, y) {
        for (let i = x + 1; i < this.column; i++) {
            if (this.data[i][y] !== 0) {
                return i;
            }
        }
        return -1;
    }

    //右移
    allRight() {
        for (let x = this.column - 1; x >= 0; x--){
            for (let y = this.column - 1; y >= 0; y--) {
                let sub = this.asideRight(x, y);
                if (sub !== -1) {
                    //方格移动
                    if (this.data[x][y] === 0) {
                        this.data[x][y] = this.data[x][sub];
                        this.data[x][sub] = 0;
                        this.update(x, y, x, sub, false);
                        y += 1;
                        continue;
                    }
                    //方格合并
                    if (this.data[x][y] === this.data[x][sub]) {
                        this.data[x][y] *= 2;
                        this.data[x][sub] = 0;
                        this.score += this.data[x][y];
                        this.update(x, y, x, sub, true);
                    }
                }
            }
        }
    }
    asideRight(x, y) {
        for (let j = y - 1; j >= 0; j--) {
            if (this.data[x][j] !== 0) {
                return j;
            }
        }
        return -1;
    }

    //下移
    allDown() {
        for (let y = this.column - 1; y >= 0; y--) {
            for (let x = this.column - 1; x >= 0; x--) {
                let sub = this.asideDown(x, y);
                if (sub !== -1) {
                    if (this.data[x][y] === 0) {
                        this.data[x][y] = this.data[sub][y];
                        this.data[sub][y] = 0;
                        this.update(x, y, sub, y, false);
                        x = x + 1;
                        continue;
                    }
                    if (this.data[x][y] === this.data[sub][y]) {
                        this.data[x][y] *= 2;
                        this.data[sub][y] = 0;
                        this.score += this.data[x][y];
                        this.update(x, y, sub, y, true);
                    }
                }
            }
        }
    }
    asideDown(x, y) {
        for (let i = x - 1; i >= 0; i--) {
            if (this.data[i][y] !== 0) {
                return i;
            }
        }
        return -1;
    }

}

document.addEventListener("DOMContentLoaded", () => {
    let game = new Game();
    //为按钮设置事件委托
    document.addEventListener("click", (e) => {
        if (e.target.textContent === "新游戏") game.init(4);
        if (e.target.textContent === "难度增加") game.init(6);
        if (e.target.textContent === "再来一局") {
            document.querySelector(".overpage").style.display = "none";
            game.init(game.column);
        }
    });
    //为上下左右键设置事件委托
    document.addEventListener("keyup", (e) => {
        switch (e.keyCode) {
            case 37:
                game.allLeft();
                game.giveCell();
                break;
            case 38:
                game.allUp();
                game.giveCell();
                break;
            case 39:
                game.allRight();
                game.giveCell();
                break;
            case 40:
                game.allDown();
                game.giveCell();
                break;
        }  
        //移动后判断游戏是否结束
        if (game.isOver()) {
            game.overPage();
        }     
    });
});