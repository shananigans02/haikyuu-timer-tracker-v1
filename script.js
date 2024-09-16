// localStorage.removeItem('pomodoroList');

// declare variables (can be reassigned later)
let timer;
let isRunning = false;
let timeLeft = 0;
let duration;
let pomodoroList = JSON.parse(localStorage.getItem('pomodoroList')) || [];
let startTime;

// declare variables (can't be reassigned) 
const timerDisplay = document.getElementById("timer-display");
const durationInput = document.getElementById("duration");

const startButton = document.getElementById("start-button");
const stopButton = document.getElementById("stop-button");
const recordButton = document.getElementById("record-button")
const statsButton = document.getElementById("stats-button")

const pomodoroListElement = document.getElementById("pomodoro-list")
const setsCheckBox = document.getElementById("sets-checkbox");
const alarmSound = document.getElementById("alarm-sound-s2-commercial")

const categoryInput = document.getElementById("category-input");
const dropdownList = document.getElementById("dropdown-list");

// when categoryInput field gains focus (user clicks on it), dropdown list is displayed
categoryInput.addEventListener('focus', function () {
    dropdownList.style.display = 'block';
});

// when user clicks away (loses focus), dropdown list is hidden after a short delay
categoryInput.addEventListener('blur', function () {
    setTimeout(() => {
        dropdownList.style.display = 'none';
    }, 200);
});

// filters dropdown list based on user input 
categoryInput.addEventListener('input', function () {
    const category = categoryInput.value.toLowerCase();
    const dropDownItems = dropdownList.querySelectorAll('.dropdown-item');
   
    dropDownItems.forEach(dropDownItem => {
         // if dropdown item matches category input value, keep dropdown value shown
        if (dropDownItem.textContent.toLowerCase().includes(category)) {
            dropDownItem.style.display = 'block';
        }
    });
});

// add new category to dropdown list when user presses enter
categoryInput.addEventListener('keypress', function (e) {
    if (e.key === 'Enter') {
        // prevent default events like submitting a form / moving to next input field
        e.preventDefault();
        const category = categoryInput.value.trim().toLowerCase();
        const dropDownItems = dropdownList.querySelectorAll('.dropdown-item');

        // check if category already exists in dropdown items
        let categoryExists = false;
        dropDownItems.forEach(item => {
            if(item.textContent.trim().toLowerCase() === category) {
                categoryExists = true;
            }
        });

        // if we have DONT have a category
        if (!categoryExists) {   
            const div = document.createElement("div");
            div.textContent = category; // use orginial case
            div.classList.add("dropdown-item");
            dropdownList.appendChild(div);
            categoryInput.value = '';
        }
    }
});

// clicked dropdown item becomes category input, dropdown list hides
dropdownList.addEventListener('click', function (e) {
    if (e.target.classList.contains('dropdown-item')) {
        categoryInput.value = e.target.textContent;
        dropdownList.style.display = 'none';
    }
});

// update timer display in the style of mm:ss
function updateTimerDisplay() {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    timerDisplay.textContent = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    document.title = `${minutes}:${seconds < 10 ? '0' : ''}${seconds} left ᕙ(  •̀ ᗜ •́  )ᕗ`;
}

// start timer and update display per sec. when theres no time left, play alarm sound and log completed pomodoro.
function startTimer() {
    if (!isRunning) {
        // make sure inputs are not empty
        duration = parseInt(durationInput.value);
        const category = categoryInput.value.trim();
        if (isNaN(duration) || duration < 0 || duration > 1440) {
            alert('pls enter a duration b/w 0 mins & 24 hrs ~');
            return;
        }
        if (!category) {
            alert('pls enter a category for the focus session ~');
            return;
        }
       
        // if its a fresh pomodoro
        if (timeLeft === 0) {
            timeLeft = duration * 60;
        }
       
        isRunning = true;
        durationInput.disabled = true;
        categoryInput.disabled = true;
        recordButton.style.display = 'block';
        startButton.textContent = 'pause';
        startTime = new Date();
        
        console.log("pre-timer timeleft:", timeLeft);

        // start interval that executes arrow fn every 1000 millisec (1 sec)
        timer = setInterval(() => {
            timeLeft--;
            updateTimerDisplay();

            if (timeLeft <= 0) {
                recordTime();
            }
        }, 1000);
    } else {
        pauseTimer();
    }
}

function recordTime() {
    // built-in js fn. stops the interval timer
    clearInterval(timer);

    // add alert sound here
   alarmSound.play();
   startButton.textContent = 'start';

   // custom alert banner
   const alertBanner = document.createElement('div');
   alertBanner.textContent = 'you did it! ♫ヽ( •̀ᴗ•́)人(´∇｀๑)ノ♩♪';
   alertBanner.style.position = 'fixed';
   alertBanner.style.top = '20px';
   alertBanner.style.left = '50%';
   alertBanner.style.transform = 'translateX(-50%)';
   alertBanner.style.backgroundColor = '#333';
   alertBanner.style.color = '#fff';
   alertBanner.style.padding = '10px 20px';
   alertBanner.style.borderRadius = '5px';
   alertBanner.style.boxShadow = '0 0 10px rgba(0, 0, 0, 0.1)';
   document.body.appendChild(alertBanner);

   // Remove banner after 7 seconds
   setTimeout(() => {
       document.body.removeChild(alertBanner);
   }, 7000);

   startButton.textContent = 'start';

   isRunning = false;
   durationInput.disabled = false;
   categoryInput.disabled = false;
   
   recordButton.style.display = 'none';

   logPomodoro(duration);
}

function stopTimer() {
    clearInterval(timer);
    durationInput.disabled = false;
    categoryInput.disabled = false;
    startButton.textContent = 'start';
    timeLeft = 0;
    updateTimerDisplay();
}

function pauseTimer() {
    clearInterval(timer);
    isRunning = false;
    startButton.textContent = 'start';
    recordButton.style.display = 'none';
}

function logPomodoro(duration) {
    const endTime = new Date();

    console.log("end time:", endTime)
    
    const formatTime = (date) => {
        let hours = date.getHours();
        const mins = date.getMinutes();
        const ampm = hours >= 12 ? 'PM': 'AM';
        
        hours = hours % 12;
        hours = hours ? hours : 12;
        const minDisplay = mins < 10 ? '0' + mins : mins;

        return `${hours}:${minDisplay} ${ampm}`;
    }

    cleanStart = formatTime(startTime);
    cleanEnd = formatTime(endTime);
    
    startTimeSeconds = startTime.getSeconds();
    endTimeSeconds  = endTime.getSeconds()
    durationElapsed = (endTimeSeconds - startTimeSeconds) / 60;
    
    
    console.log("startTime: ", startTime)
    console.log("endTime: ", endTime)
    console.log("cleanStart: ", cleanStart)
    console.log("cleanEnd: ", cleanEnd)
    console.log("duration elapsed: ", durationElapsed)

    const timestamp = `${cleanStart} - ${cleanEnd}`;
    const category = categoryInput.value;
    
    const pomodoro = {
        category, 
        duration,
        durationElapsed,
        timestamp
    };
    
    console.log("Logging pomodoro:", pomodoro);

    // storing pomodoro in the array
    pomodoroList.push(pomodoro);
    localStorage.setItem('pomodoroList', JSON.stringify(pomodoroList));
    console.log("pomodoro list after logging:", pomodoroList);
    updatePomodoroList();

}

function deletePomodoro(timestamp) {
    // if user presses ok, its like if(true)
    if (confirm("Are you sure you want to delete this entry?")) {
        // Filter out the pomodoro with the specified timestamp
        pomodoroList = pomodoroList.filter(pomodoro => pomodoro.timestamp !== timestamp);
        // Save the updated list to local storage
        localStorage.setItem('pomodoroList', JSON.stringify(pomodoroList));
        updatePomodoroList();
    } else {
        // If the user cancels, re-check the checkbox
        const checkbox = document.querySelector(`.pomodoro-checkbox[data-timestamp="${timestamp}"]`);
        checkbox.checked = true;
    }
}

function updatePomodoroList() {
    pomodoroListElement.innerHTML = '';
    pomodoroList.forEach(pomodoro => {
        const listItem = document.createElement('li');
        listItem.classList.add('pomodoro-list-item'); 

        // Add a checkbox to each list item
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.classList.add('pomodoro-checkbox');
        checkbox.dataset.timestamp = pomodoro.timestamp;
        checkbox.checked = true;

        checkbox.addEventListener('change', function () {
            if (!this.checked) {
                deletePomodoro(pomodoro.timestamp);
            }
        });
        
        const text = document.createElement('span');
        text.textContent = `${pomodoro.timestamp} (${pomodoro.durationElapsed} mins): ${pomodoro.category}`;

        // Append checkbox and text to the list item
        listItem.appendChild(checkbox);
        listItem.appendChild(text);

        // Append the list item to the pomodoro list element
        pomodoroListElement.appendChild(listItem);
    });

    if (pomodoroList.length == 1) {
        setsCheckBox.checked = true;
    }

    console.log("Updated pomodoro list:", pomodoroListElement.innerHTML);
}

// warning for stats pg while timer is running
function navigateToStats() {
    if (isRunning) {
        const confirmation = confirm("viewing the stats page while the timer is running will RESTART the timer - would you be ok with that?")
        if (confirmation) {
            window.location.href = "progress.html";
        } else {
            window.location.href = "index.html";
        }
    } else {
        window.location.href = "progress.html";
    }
}

statsButton.addEventListener("click", navigateToStats);

// button event listeners
startButton.addEventListener('click', startTimer);
stopButton.addEventListener('click', stopTimer);
recordButton.addEventListener('click', recordTime)

updatePomodoroList();


setsCheckBox.addEventListener('change', function () {
    if (!this.checked) {
        if (confirm("clear all past set entries?")) {
            localStorage.removeItem('pomodoroList');
            pomodoroList = [];
            updatePomodoroList(); 
        } else {
            this.checked = true;
        } 
    }
});
