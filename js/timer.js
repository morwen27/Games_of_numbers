import { game } from './main.js';

export default class Timer {
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

        if (minutes < 10) minutes = `0${minutes}`;
        if (seconds < 10) seconds = `0${seconds}`;

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