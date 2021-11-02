import { game, timer } from './main.js';

export default class Cell {
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