const gameResult = {
    win: {
        message: 'Вы выиграли!',
        modifier: 'win'
    },
    lose: {
        message: 'Вы проиграли...',
        modifier: 'lose'
    }
};

const wrapper = document.querySelector('#wrapper');
const startBtn = document.querySelector('#start');
const closeBtn = document.querySelector('.close');
const timerWrapper = document.querySelector('#timer');
const modal = document.querySelector('.modal');

const gameTimePerMin = 0.1;
let game, timer;

function startGame() {
    game = new Game({ container: wrapper, maxValue: 25 });
    timer = new Timer(timerWrapper, gameTimePerMin);
    startBtn.setAttribute('disabled', true);
}

startBtn.addEventListener('click', startGame);

closeBtn.addEventListener('click', () => {
    game.reloadGame();
    modal.classList.add('hide');
    startBtn.removeAttribute('disabled');
});

function getRandomIntInclusive(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min;
}

const updateCell = (items, update) => {
    const index = items.findIndex((item) => item.id === update.id);

    if (index === -1) {
        return items;
    }

    return [
        ...items.slice(0, index),
        update,
        ...items.slice(index + 1)
    ];
};

class Game {
    constructor(options) {
        this.container = options.container;
        this.maxValue = options.maxValue;

        this.fontSizes = [20, 22, 24, 28, 30, 32];
        this.fontColor = ['brown', 'black', 'blue', 'green', 'rgb(240,113,9)', 'rgb(194,33,225)'];

        this._cellsData = {};
        this._cells = [];
        this._numbers = [];

        this.generateNumbers(this.maxValue);
        this.generateCells(this.maxValue);

        this._checkedCellCounter = 0;
        this._prevCheckedCell = null;

        this._checkedCellsHandler = this._checkedCellsHandler.bind(this);
    }

    generateCells() {
        for (let i = 0; i < this._numbers.length; i++) {
            const cell = {
                id: this._numbers[i],
                fontSize: this.fontSizes[getRandomIntInclusive(0, this.fontSizes.length)] + 'px',
                fontColor: this.fontColor[getRandomIntInclusive(0, this.fontColor.length)],
                checked: false,
                bg: this.checked ? 'pink' : 'white',
            }

            const cellView = new Cell(this.container, this._checkedCellsHandler);
            cellView.init(cell);

            this._cellsData[cell.id] = cellView;
            this._cells.push(cell);
        }
    }

    _checkedCellsHandler(checkedCell) {
        game._cells = updateCell(game._cells, checkedCell);
        game._cellsData[checkedCell.id].init(checkedCell);
    }

    generateNumbers(max) {
        for (let i = 1; i <= max; ++i) {
            this._numbers.push(i);
        }

        this._numbers.sort(() => Math.random() - 0.5);
    }

    createMessage(text, result) {
        const message = modal.querySelector('.message');

        message.classList.add(`message__${result}`);
        message.textContent = `${text}`;

        modal.classList.remove('hide');
    }

    reloadGame() {
        this.container.innerHTML = '';
        timer.container.innerHTML = '';
    }

    playerLose() {
        this.createMessage(gameResult.lose.message, gameResult.lose.modifier);
    }

    playerWin() {
        timer.stopTimer();
        this.createMessage(gameResult.win.message, gameResult.win.modifier);
    }

}

class Cell {
    constructor(container, changeData) {
        this.container = container;
        this._updateCell = changeData;

        this.checkCellHanler = this.checkCellHanler.bind(this);
    }

    init(cell) {
        this._cell = cell; // obj

        const prevViewCell = this.container.querySelector(`#cell-${cell.id}`);

        if (prevViewCell === null) {
            this.renderCell(this.createElement(this._cell));
            this.hangEvents(this._cell);
            return;
        } else {
            const newViewCell = this.createElement(this._cell);
            this.container.replaceChild(newViewCell, prevViewCell);
            this.hangEvents(this._cell);
        };

    }

    checkCellHanler(cell) {

        if (game._checkedCellCounter === 0 && cell.id === 1) {
            game._checkedCellCounter++;
            game._prevCheckedCell = cell.id;
            this._updateCell(Object.assign({}, cell, { checked: !cell.checked, bg: !cell.checked ? 'pink' : 'white' }));
            return;
        }

        if (game._checkedCellCounter >= 1 && cell.id === (game._prevCheckedCell + 1)) {
            game._checkedCellCounter++;

            if (game._checkedCellCounter === game.maxValue && timer.isCountdownOn) game.playerWin();

            game._prevCheckedCell = cell.id;
            this._updateCell(Object.assign({}, cell, { checked: !cell.checked, bg: !cell.checked ? 'pink' : 'white' }));
            return;
        }
        console.log(game._checkedCellCounter);
    }

    createElement(cell) {
        const cellElement = document.createElement('p');
        cellElement.textContent = cell.id;
        cellElement.id = `cell-${cell.id}`;
        cellElement.style.fontSize = cell.fontSize;
        cellElement.style.color = cell.fontColor;
        cellElement.style.background = cell.bg;

        return cellElement;
    }

    hangEvents(cell) {
        this.container.querySelector(`#cell-${cell.id}`).addEventListener('click', () => {
            this.checkCellHanler(cell);
        });
    }

    renderCell(el) {
        this.element = el;
        this.container.append(this.element);
    }
}

class Timer {
    constructor(container, duration) {
        this.container = container;
        this.duration = duration * 60 * 1000;
        this.deadline = Date.now() + this.duration;

        this.isCountdownOn = true;

        this.init();
    }

    init() {
        this.getTemplate(this.getRemainingTime());
        this.setTimer();
    }

    getRemainingTime() {
        let remainingTime = this.deadline - Date.now();
        let minutes = Math.floor(remainingTime / (1000 * 60) % 60);
        let seconds = Math.floor(remainingTime / 1000 % 60);

        return { minutes, seconds }
    }

    getTemplate(data) {
        let { minutes, seconds } = data;

        if (+minutes < 10) minutes = `0${minutes}`;
        if (+seconds < 10) seconds = `0${seconds}`;

        const el = document.createElement('p');
        el.innerHTML = `<span id="min">${minutes}</span> : <span id="sec">${seconds}</span>`;
        this.container.append(el);
    }

    setTimer() {
        const minutes = this.container.querySelector('#min');
        const seconds = this.container.querySelector('#sec');

        this.interval = setInterval(() => {
            let time = this.getRemainingTime();

            (time.minutes >= 10) ?
            minutes.innerHTML = time.minutes: minutes.innerHTML = '0' + time.minutes;

            (time.seconds >= 10) ?
            seconds.innerHTML = time.seconds: seconds.innerHTML = '0' + time.seconds;

            if (time.minutes === 0 && time.seconds === 0) {
                clearInterval(this.interval);
                this.isCountdownOn = false;
                game.playerLose();
            };
        }, 1000);
    }

    stopTimer() {
        clearInterval(this.interval);
        this.isCountdownOn = false;
    }
}