let timeLeft;
let timerId = null;
let isWorkTime = true;
let currentFocusTask = '';

const minutesDisplay = document.getElementById('minutes');
const secondsDisplay = document.getElementById('seconds');
const startButton = document.getElementById('start');
const resetButton = document.getElementById('reset');
const modeText = document.getElementById('mode-text');
const toggleButton = document.getElementById('toggle-mode');
const toggleIcon = toggleButton.querySelector('i');
const addTimeButton = document.getElementById('add-time');
const focusTaskDisplay = document.getElementById('focus-task');

const WORK_TIME = 25 * 60; // 25 minutes in seconds
const BREAK_TIME = 5 * 60; // 5 minutes in seconds
const EXTRA_TIME = 5 * 60; // 5 minutes in seconds

function updateDisplay(timeLeft) {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    const timeString = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    minutesDisplay.textContent = minutes.toString().padStart(2, '0');
    secondsDisplay.textContent = seconds.toString().padStart(2, '0');
    
    // Update browser tab title
    const mode = isWorkTime ? 'Work' : 'Break';
    document.title = `${timeString} - ${mode} | Pomodoro Timer`;
}

function addFiveMinutes() {
    timeLeft += EXTRA_TIME;
    updateDisplay(timeLeft);
}

function switchMode() {
    isWorkTime = !isWorkTime;
    timeLeft = isWorkTime ? WORK_TIME : BREAK_TIME;
    modeText.textContent = isWorkTime ? 'Work Time' : 'Break Time';
    document.body.classList.toggle('break-mode', !isWorkTime);
    
    // Update icon
    toggleIcon.className = isWorkTime ? 'fas fa-sun' : 'fas fa-moon';
    
    updateDisplay(timeLeft);
}

function startTimer() {
    if (timerId !== null) return;
    
    if (!timeLeft) {
        timeLeft = WORK_TIME;
    }

    // Only prompt for focus task during work time
    if (isWorkTime) {
        const task = prompt('What are you focusing on?');
        if (task) {
            currentFocusTask = task;
            focusTaskDisplay.textContent = `Focus: ${task}`;
            focusTaskDisplay.classList.remove('hidden');
        }
    } else {
        focusTaskDisplay.classList.add('hidden');
    }

    startButton.textContent = 'Pause';
    addTimeButton.classList.remove('hidden');
    
    timerId = setInterval(() => {
        timeLeft--;
        updateDisplay(timeLeft);
        
        if (timeLeft === 0) {
            clearInterval(timerId);
            timerId = null;
            startButton.textContent = 'Start';
            addTimeButton.classList.add('hidden');
            switchMode();
            alert(isWorkTime ? 'Break time is over! Time to work!' : 'Work time is over! Take a break!');
        }
    }, 1000);
}

function pauseTimer() {
    clearInterval(timerId);
    timerId = null;
    startButton.textContent = 'Start';
    addTimeButton.classList.add('hidden');
}

function resetTimer() {
    clearInterval(timerId);
    timerId = null;
    isWorkTime = true;
    timeLeft = WORK_TIME;
    startButton.textContent = 'Start';
    modeText.textContent = 'Work Time';
    addTimeButton.classList.add('hidden');
    focusTaskDisplay.classList.add('hidden');
    currentFocusTask = '';
    updateDisplay(timeLeft);
    document.title = 'Pomodoro Timer';
}

startButton.addEventListener('click', () => {
    if (timerId === null) {
        startTimer();
    } else {
        pauseTimer();
    }
});

resetButton.addEventListener('click', resetTimer);

toggleButton.addEventListener('click', () => {
    if (timerId !== null) {
        pauseTimer();
    }
    switchMode();
});

addTimeButton.addEventListener('click', addFiveMinutes);

// Initialize display
timeLeft = WORK_TIME;
updateDisplay(timeLeft); 