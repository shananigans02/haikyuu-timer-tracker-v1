localStorage.removeItem('pomodoroList');

// declare variables that can be reassigned later
let timer;
let isRunning = false;
let timeLeft = 0; // start w 0 seconds
let pomodoroList = JSON.parse(localStorage.getItem('pomodoroList')) || [];
const categories = new Set(["read 30 mins+", "code 2 h+", "piano 1 h+"]);

// declare variables whose value CANNOT be reassigned
const timerDisplay = document.getElementById("timer-display");
const durationInput = document.getElementById("duration");

const startButton = document.getElementById("start-button");
const stopButton = document.getElementById("stop-button");


const pomodoroListElement = document.getElementById("pomodoro-list")
const alarmSound = document.getElementById("alarm-sound-oya")

// Add these new event listeners for the custom dropdown
const categoryInput = document.getElementById("category-input");
const dropdownList = document.getElementById("dropdown-list");

categoryInput.addEventListener('focus', function () {
    dropdownList.style.display = 'block';
});

categoryInput.addEventListener('blur', function () {
    setTimeout(() => {
        dropdownList.style.display = 'none';
    }, 200);
});

categoryInput.addEventListener('input', function () {
    const value = categoryInput.value.toLowerCase();
    const items = dropdownList.querySelectorAll('.dropdown-item');
    items.forEach(item => {
        if (item.textContent.toLowerCase().includes(value)) {
            item.style.display = 'block';
        } else {
            item.style.display = 'none';
        }
    });
});

dropdownList.addEventListener('click', function (e) {
    if (e.target.classList.contains('dropdown-item')) {
        categoryInput.value = e.target.textContent;
        dropdownList.style.display = 'none';
    }
});

categoryInput.addEventListener('keypress', function (e) {
    if (e.key === 'Enter') {
        e.preventDefault();
        const category = categoryInput.value;
        if (category && !categories.has(category)) {
            categories.add(category);
            const div = document.createElement("div");
            div.textContent = category;
            div.classList.add("dropdown-item");
            dropdownList.appendChild(div);
            categoryInput.value = '';
        }
    }
});

function updateTimerDisplay() {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    timerDisplay.textContent = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
}

function startTimer() {
    // check to see if its not running rn. if not, do this
    if (!isRunning) {
        const duration = parseInt(durationInput.value);

        if (isNaN(duration) || duration < 1 || duration > 60) {
            alert('pls enter a duration b/w 1 and 60 mins~');
            return;
        }
        
        timeLeft = duration * 60;
        isRunning = true;
        durationInput.disabeled = true;
        startButton.textContent = 'pause';

        // start interval - built-in js fn - that executes arrow fn every 1000 millisec (1 sec)
        timer = setInterval(() => {
            timeLeft--;
            updateTimerDisplay();

            if (timeLeft <= 0) {
                // built-in js fn. stops the interval timer
                clearInterval(timer);

                alarmSound.play();
                alert('Pomodoro completed!');
                // add alert sound here
                

                isRunning = false;
                durationInput.disabeled = false;
                logPomodoro(duration);

                // reset
                timeLeft = duration * 60;
                updateTimerDisplay();
            }
        }, 1000);
    } else {
        pauseTimer();
    }
}

function stopTimer() {
    clearInterval(timer);
    // isRunning = false;
    durationInput.disabeled = false;
    startButton.textContent = 'start';
    timeLeft = 0;
    updateTimerDisplay();
}

function pauseTimer() {
    clearInterval(timer);
    isRunning = false;
    startButton.textContent = 'start'
}

function logPomodoro(duration) {
    const category = categoryInput.value;
    const timestamp = new Date().toLocaleTimeString();
    
    const pomodoro = {
        category, 
        duration,
        timestamp
    };
    
    console.log("Logging pomodoro:", pomodoro);
    // storing pomodoro in the array
    pomodoroList.push(pomodoro);
    localStorage.setItem('pomodoroList', JSON.stringify(pomodoroList));
    console.log("pomodoro list after loggin:", pomodoroList);
    updatePomodoroList();

}

function updatePomodoroList() {
    // sets the <ul> element w/ pomodoro-list id to an empty string
    pomodoroListElement.innerHTML = '';
    pomodoroList.forEach(pomodoro => {
        const listItem = document.createElement('li');
        listItem.textContent = `${pomodoro.timestamp}, ${pomodoro.category}`;
        pomodoroListElement.appendChild(listItem);
    });

    console.log("Updated pomodoro list:", pomodoroListElement.innerHTML);
}

// call startimer function
startButton.addEventListener('click', startTimer);
stopButton.addEventListener('click', stopTimer);

updatePomodoroList();