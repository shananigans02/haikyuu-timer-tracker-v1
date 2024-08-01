localStorage.removeItem('pomodoroList');

// retrieve from local storage pomodoro objects, if null retrieve empty array
const pomodoroList = JSON.parse(localStorage.getItem('pomodoroList')) || [];
console.log("Pomo list in progress from local storage:", pomodoroList);

// declare reading, coding, piano progress variables
const codingProgress = document.getElementById("coding-progress")
const readingProgress = document.getElementById("reading-progress")
const pianoProgress = document.getElementById("piano-progress")

// update variable values
function calculateProgress() {

    // calculate progress for each
    let codingTime = 0;
    let readingTime = 0;
    let pianoTime = 0;

    pomodoroList.forEach(pomodoro => {
        const duration = parseFloat(pomodoro.duration) || 0;
        console.log("Duration parsed:", duration, "Category:", pomodoro.category); // Debug log

        if(!isNaN(duration)) {
            if (pomodoro.category == "coding") {
                codingTime += duration;
            }
            else if (pomodoro.category == "reading") {
                readingTime += duration;
            }
            else if (pomodoro.category == "piano") {
                pianoTime += duration;
            }
        }
    });

    console.log("coding time:", codingTime);
    console.log("reading time:", readingTime);
    console.log("piano time:", pianoTime);

    readingProgress.value = readingTime;
    codingProgress.value = codingTime;
    pianoProgress.value = pianoTime;  
}

//  call calculateProgress function
calculateProgress();