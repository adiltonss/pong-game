import Paddle from './scripts/paddle.js';
import Ball from './scripts/ball.js';

let leftPaddle = new Paddle(qs('.left-paddle'));
let rightPaddle = new Paddle(qs('.right-paddle'));
let ball = new Ball(qs('.ball'));

const playerScoreElem = qs('#player-score');
const cpuScoreElem = qs('#cpu-score');
let lastTime;
let GAMETIME = 1;
let STOPED = false;

document.getElementsByName('time-amount-radio').forEach(radio =>{
    radio.addEventListener('change', (e)=>{
        GAMETIME = e.target.value;
    })
})


qs('.return-to-menu').addEventListener('click', ()=>{
   window.location.reload();
})  

qs('.try-again-btn').addEventListener('click', ()=>{
    STOPED = false;
    let board = qs('.end-game-board');
    board.className = 'end-game-board inactive-end-game-board';
    startGame();
})

function qs(selector, parent = document){
    return parent.querySelector(selector);
}

function qsAll(selector, parent = document){
    return parent.querySelectorAll(selector);
}

//start game with mouse click and the keyboard
qs('.start-button').addEventListener('click', startGame);
qs('.start-button').addEventListener('keydown', (e)=>{
    if(e.key === ' ' || e.key === 'Enter'){
        startGame();
    }
});

function startGame(){
    clearBoard();
    startTimer(GAMETIME, qs('.timer-display'));
    qs('.start-menu').style.display = 'none';
    STOPED = false;
    showAndResetElem();
    window.requestAnimationFrame(update);
}

/* display/hide color options on main menu */
/* qs('.start-dropdown').addEventListener('click', (e)=>{
    
}) */

qs('.start-dropdown').addEventListener('click', () =>{
    let dropdownTabs = qs('.dropdown_menu');
    if(dropdownTabs.classList.contains('menu-active')){
        dropdownTabs.classList.replace('menu-active', 'menu-inactive');
    }else{
        dropdownTabs.classList.replace('menu-inactive', 'menu-active');
    }
})

/* display/hide timer options on main menu */
qs('.show-hide-time-options').addEventListener('click', (e)=>{
    let dropdownTabs = qs('.time-options');
    if(dropdownTabs.classList.contains('timeOpt-active')){
        dropdownTabs.classList.replace('timeOpt-active', 'timeOpt-inactive');
    }else{
        dropdownTabs.classList.replace('timeOpt-inactive', 'timeOpt-active');
    }
})


/* change theme color */
qsAll('.dropdown_item').forEach((elem) =>{
    elem.addEventListener('click', (e)=>{
        let divElm = e.target.children;
        document.getElementsByTagName('body')[0].className = `color-${divElm[0].className.match(/(?<=\s).*/g)}`;
    })
})

function update(timing){
    if(STOPED) return;

    if(lastTime != null){
        const delta = timing - lastTime;
        ball.update(delta, [leftPaddle.rect(), rightPaddle.rect()]);
        rightPaddle.update(delta, ball.y);
        rightPaddle.dontOverflow();
        leftPaddle.dontOverflow();
        if(isLose()) handleLose();
    }

    lastTime = timing;
    window.requestAnimationFrame(update);
}

/* comands for the player paddle */
document.addEventListener('keydown', (e)=>{ 
    if(e.key === 'ArrowDown'){
        leftPaddle.position += 10;
    }

    if(e.key === 'ArrowUp'){
        leftPaddle.position -= 10;
    }

    if(e.key === ' '){
        leftPaddle.reset();
    }
})

//give the score
function handleLose(){
    const rect = ball.rect();
    if(rect.right >= window.innerWidth){
        playerScoreElem.textContent = parseInt(playerScoreElem.textContent) + 1;
    }else{
        cpuScoreElem.textContent = parseInt(cpuScoreElem.textContent) + 1;
    }
    ball.reset();
    rightPaddle.reset();
}

function isLose(){
    const rect = ball.rect();
    return rect.right >= window.innerWidth || rect.left <= 0
}

function startTimer(duration, display) {
    duration = duration * 60;
    let timer = duration, minutes, seconds;
    let test = setInterval(function () {
        minutes = parseInt(timer / 60, 10);
        seconds = parseInt(timer % 60, 10);

        minutes = minutes < 10 ? "0" + minutes : minutes;
        seconds = seconds < 10 ? "0" + seconds : seconds;

        display.textContent = minutes + ":" + seconds;

        if (--timer < 0){
            STOPED = true;
            clearInterval(test);
            hideElem();
            checkScore();
            qs('.end-game-board').className = 'end-game-board active-end-game-board';
        }

    }, 1000);
}

function checkScore(){
    let playerScore = qs('#player-score').innerText;
    let cpuScore = qs('#cpu-score').innerText;
    let board = qs('.whos-the-winner');
    

    if(playerScore > cpuScore) board.innerHTML = 'You Win!';

    if(cpuScore > playerScore) board.innerHTML = 'You Lose!';

    if(cpuScore === playerScore) board.innerHTML = 'Drawl!';
}

function clearBoard(){
    qs('#player-score').innerText = 0;
    qs('#cpu-score').innerText = 0;
}

function hideElem(){
    qs('.ball').style.display = 'none';
    qs('.left-paddle').style.display = 'none';
    qs('.right-paddle').style.display = 'none';
}

function showAndResetElem(){
    qs('.ball').style.display = '';
    qs('.left-paddle').style.display = '';
    qs('.right-paddle').style.display = '';
    ball.reset();
    leftPaddle.reset();
    rightPaddle.reset();
}