import Game from './game.js';
import Timer from './timer.js';

export const gameResult = {
    win: {
        message: 'Вы выиграли!',
        modifier: 'win'
    },
    lose: {
        message: 'Вы проиграли...',
        modifier: 'lose'
    }
};

export let game, timer;
const gameTimePerMin = 1.5;

const wrapper = document.querySelector('#wrapper');
const startBtn = document.querySelector('#start');
const closeBtn = document.querySelector('.close');
const timerWrapper = document.querySelector('#timer');

export const modal = document.querySelector('.modal');

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