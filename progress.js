// localStorage.removeItem('pomodoroList');

// Retrieve from local storage pomodoro objects, if null retrieve empty array
const pomodoroList = JSON.parse(localStorage.getItem('pomodoroList')) || [];
console.log("Pomo list in progress from local storage:", pomodoroList);


// warning for stats pg while timer is running
function navigateToTracker() {
        window.location.href = "index.html";
}

const trackerButton = document.getElementById("tracker-button")
trackerButton.addEventListener("click", navigateToTracker);


function generateProgressBars() {
    const progressContainer = document.getElementById('progress-bars');
    progressContainer.innerHTML = ''; // Clear existing content

    // Group pomodoros by category
    const categoryMap = new Map();
    pomodoroList.forEach(pomodoro => {
        if (!categoryMap.has(pomodoro.category)) {
            categoryMap.set(pomodoro.category, { totalDuration: 0, goalDuration: 0 });
        }
        categoryMap.get(pomodoro.category).totalDuration += pomodoro.duration;
        if (pomodoro.goalDuration > categoryMap.get(pomodoro.category).goalDuration) {
            categoryMap.get(pomodoro.category).goalDuration = pomodoro.goalDuration;
        }
    });

    // Create progress bars for each category
    categoryMap.forEach((data, category) => {
        const progressBarDiv = document.createElement('div');
        progressBarDiv.classList.add('progress-bar');

        const label = document.createElement('label');
        label.textContent = `${category}`;
        progressBarDiv.appendChild(label);

        const progress = document.createElement('progress');
        progress.max = data.goalDuration;
        progress.value = data.totalDuration;
        progress.dataset.category = category;
        progressBarDiv.appendChild(progress);

        const totalDurationSpan = document.createElement('span');
        totalDurationSpan.textContent = `${data.totalDuration} /`;
        totalDurationSpan.classList.add('total-duration');
        progressBarDiv.appendChild(totalDurationSpan);

        // show goal duration
        const input = document.createElement('input');
        input.type = 'number';
        input.placeholder = 'Set goal duration (mins)';
        input.value = data.goalDuration;
        input.addEventListener('change', updateGoalDuration);
        input.dataset.category = category;
        progressBarDiv.appendChild(input);

        // show progress completed percentage
        const percentage = document.createElement('span');
        const percentageCompleted = Math.min((data.totalDuration / data.goalDuration) * 100, 100).toFixed(0);
        percentage.textContent = `${percentageCompleted}%`;
        percentage.classList.add('percentage-completed');
        progressBarDiv.appendChild(percentage);

        progressContainer.appendChild(progressBarDiv);
    });
}

// Function to update goal duration in local storage
function updateGoalDuration(event) {
    const category = event.target.dataset.category;
    const newGoalDuration = parseInt(event.target.value);
    
    pomodoroList.forEach(pomodoro => {
        if (pomodoro.category === category) {
            pomodoro.goalDuration = newGoalDuration;
        }
    });
    
    localStorage.setItem('pomodoroList', JSON.stringify(pomodoroList));
    
    generateProgressBars();
}

generateProgressBars();
