const GAME_RUNNING_SCREEN = document.querySelector("#game-running");
const GAME_END_SCREEN = document.querySelector("#game-over");
const TIME_SPAN = document.querySelector("#time-remaining");
const GAME_STATUS = document.querySelector("#status");
const GAME_QUESTION = document.querySelector("#question");
const GAME_ANSWERS = document.querySelectorAll("#answers li");
const GAME_SCORE = document.querySelector("#final-score");
const HIGHSCORE_NAME_ENTRY = document.querySelector("#highscore-name-entry");
const HIGHSCORE_NAME_WARNING = document.querySelector("#highscore-name-warning");
const HIGHSCORE_NAME_SUBMIT = document.querySelector("#highscore-name-submit");

const QUESTIONS = [
	new Question(
		"What sound does a cow make?",
		2,
		"Bark",
		"Chirp",
		"Moo",
		"Bleat"),
	new Question(
		"What sound does a dog make?",
		0,
		"Bark",
		"Chirp",
		"Moo",
		"Bleat"),
];

// Constructor for a question
function Question() {
	this.displayQuestion = arguments[0];
	this.answers = [...Array.prototype.slice.call(arguments, 2)];
	this.correctAnswer = arguments[1];
	this.isCorrectAnswer = answer => {
		if (typeof answer == "string") {
			return this.answers.indexOf(answer) === this.correctAnswer;
		}
		else if (typeof answer == "number") {
			return this.correctAnswer === answer;
		}
		else {
			console.error(`Answer type is ${typeof answer}`);
		}
	};
}

/* GAME GLOBALS */
let timeRemaining = 75;
let currentQuestion = 0;
let score = 0;


/* GAME LOGIC */
const tick = () => {
	//Time keeping
	{
		--timeRemaining;
		updateTime(timeRemaining);
	}

	if (timeRemaining === 0) {
		endGame();
		haltTimer();
	}
};


/* GAME UTILITY FUNCTIONS */
const initializeGame = () => {
	updateTime(timeRemaining);
	displayQuestion(getCurrentQuestion());
	displayStatus("");
}

const displayQuestion = (question) => {
	setQuestion(question.displayQuestion);
	for (let i = 0; i < 4; ++i) {
		setAnswer(question.answers[i], i);
	}
};

const showGameOverScreen = () => {
	GAME_RUNNING_SCREEN.style.display = "none";
	GAME_END_SCREEN.style.display = "block";
	showFinalScore(score);
};

const updateTime = time => {
	TIME_SPAN.innerHTML = time;
};

const displayStatus = status => {
	GAME_STATUS.innerHTML = status;
};

const setQuestion = question => {
	GAME_QUESTION.innerHTML = question;
};

const setAnswer = (answer, index) => {
	GAME_ANSWERS[index].innerHTML = answer;
};

const showFinalScore = score => {
	GAME_SCORE.innerHTML = score;
};

const getCurrentQuestion = () => {
	return QUESTIONS[currentQuestion];
};

const nextQuestion = () => {
	++currentQuestion;
	if (currentQuestion < QUESTIONS.length) {
		displayQuestion(getCurrentQuestion());
	} else {
		endGame();
	}
};

const endGame = () => {
	showGameOverScreen();
	haltTimer();
};

const haltTimer = () => {
	clearInterval(handle);
};

const userSelectedCorrectAnswer = () => {
	displayStatus("Correct!");
	++score;

	nextQuestion();
};

const userSelectedWrongAnswer = () => {
	displayStatus("Incorrect!");

	nextQuestion();
};

const setAnswerEventListener = (answerLi, index) => {
	answerLi.addEventListener("click", function (event) {
		event.preventDefault();

		if (getCurrentQuestion().isCorrectAnswer(index)) {
			// Correct
			userSelectedCorrectAnswer();
		}
		else {
			// Incorrect
			userSelectedWrongAnswer();
		}
	});
}

const showError = () => {
	HIGHSCORE_NAME_WARNING.classList.remove("animated-warning");
	// What
	void HIGHSCORE_NAME_WARNING.offsetWidth;
	HIGHSCORE_NAME_WARNING.classList.add("animated-warning");
};

const getScores = () => {
	return JSON.parse(localStorage.getItem("highscores"))
};

const submitName = (name, score) => {
	let scores = getScores();
	if (scores === null) { scores = []; }
	scores.push({
		name: name,
		score: score,
	});
	localStorage.setItem("highscores", JSON.stringify(scores));
};

/* SET UP ALL GAME LISTENERS AND STUFF*/
const handle = setInterval(tick, 1000);
for (let i = 0; i < GAME_ANSWERS.length; ++i) {
	// Pass in i as an argument to capture it
	setAnswerEventListener(GAME_ANSWERS[i], i);
}

HIGHSCORE_NAME_SUBMIT.addEventListener("click", event => {
	const name = HIGHSCORE_NAME_ENTRY.value;

	if (name === "")
		showError();
	else
	{
		submitName(name, score);
		window.location.href = "/highscores";
	}
});

initializeGame();