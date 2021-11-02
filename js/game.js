import Cell from './cell.js';
import { gameResult, game, timer, modal } from './main.js';
import { getRandomIntInclusive, getRandomColor, getRandomSize, updateData } from './tools.js';

export default class Game {
    constructor(options) {
        this.container = options.container;
        this.maxValue = options.maxValue;

        this._cellsData = {};
        this._cells = [];
        this._numbers = [];

        this.generateNumbers(this.maxValue);
        this.generateCells(this.maxValue);

        this.checkedCellCounter = 0;
        this.prevCheckedCell = null;

        this._checkedCellsHandler = this._checkedCellsHandler.bind(this);
    }

    generateCells() {
        for (let i = 0; i < this._numbers.length; i++) {
            const cell = {
                id: this._numbers[i],
                fontSize: getRandomSize() + 'px',
                fontColor: getRandomColor(),
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
        game._cells = updateData(game._cells, checkedCell);
        game._cellsData[checkedCell.id].init(checkedCell);
    }

    generateNumbers(max) {
        for (let i = 1; i <= max; ++i) {
            this._numbers.push(i);
        }

        this._numbers.sort(() => Math.random() - 0.5);
    }

    createMessage(text, result) {
        const message = modal.querySelector('p');

        message.removeAttribute('class');
        message.classList.add('message', `message__${result}`);
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