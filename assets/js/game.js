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
const GAME_SCORE_PENALTY = document.querySelector("#score-penalty");

const TIME_PENALTY = 10;

const QUESTIONS = [
	new Question(
		"What symbol do you use to mark the end of a line?",
		1,
		":",
		";",
		".",
		"end"
	),
	new Question(
		"How do you create a new element?",
		0,
		"createElement()",
		"makeElement()",
		"craftElement()",
		"newElement()"
	),
	new Question(
		"What syntax for creating a variable is wrong?",
		3,
		"const price = 12.95;",
		"let cheese = \"mouse\"",
		"var globe = \"Earth\"",
		"int iterator = 7"
	),
	new Question(
		"What does the this keyword represent in the global scope?",
		0,
		"window",
		"document",
		"undefined",
		"null"
	),
	new Question(
		"What is a useful tool for debugging?",
		3,
		"Internet Explorer",
		"react.js",
		"throw new Error()",
		"console.log()"
	),
	new Question(
		"Commonly used data-types do not include:",
		1,
		"numbers",
		"alert",
		"booleans",
		"objects"
	),
	new Question(
		"Strings are enclosed with what symbol?",
		3,
		"`",
		"'",
		"\"",
		"All of the above"
	),
	new Question(
		"Arrays are actually:",
		0,
		"objects",
		"functions",
		"strings",
		"none of the above"
	),
	new Question(
		"Arrays can store:",
		3,
		"arrays",
		"strings",
		"objects",
		"all of the above"
	),
	new Question(
		"How can you print text to the console?",
		1,
		"print(\"hello\")",
		"console.log(\"hello\")",
		"out << \"hello\"",
		"all of the above"
	),
	new Question(
		"How can you remove an element from an array via its index?",
		1,
		"array.remove(index)",
		"array.splice(index, 1)",
		"array.eject()",
		"array.splice(index)"
	),
	new Question(
		"Which line of code will throw an error?",
		2,
		"let one = +1",
		"var lessTaco = \"taco\" - 1",
		"\"a\".toUpperCase()",
		"const err = 12.4 / 0"
	),
	new Question(
		"How can you safely check if two values are the same?",
		2,
		"a == b",
		"a ==== b",
		"a === b",
		"a = b"
	),
	new Question(
		"Which of these is not a valid function declaration or expression?",
		3,
		"var shoot = function() {};",
		"const reload = () => {};",
		"function back() {}",
		"none of the above"
	),
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
let timeRemaining = 90;
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
	randomizeQuestions();
	updateTime(timeRemaining);
	displayQuestion(getCurrentQuestion());
	displayStatus("");
}

const randomizeQuestions = () => {
	//From https://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array
	function shuffleArray(array) {
		for (let i = array.length - 1; i > 0; i--) {
			const j = Math.floor(Math.random() * (i + 1));
			[array[i], array[j]] = [array[j], array[i]];
		}
	}
	shuffleArray(QUESTIONS);
};

const displayQuestion = (question) => {
	clearAnswerFocus();
	setQuestion(question.displayQuestion);
	for (let i = 0; i < 4; ++i) {
		setAnswer(question.answers[i], i);
	}
};

const clearAnswerFocus = () => {
	GAME_ANSWERS.forEach(ANSWER_LI => {
		ANSWER_LI.blur();
	});
};

const showGameOverScreen = () => {
	GAME_RUNNING_SCREEN.style.display = "none";
	GAME_END_SCREEN.style.display = "block";
	score = timeRemaining;
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

const flashScorePenalty = lostScore => {
	GAME_SCORE_PENALTY.classList.remove("lost-score");

	if (lostScore) GAME_SCORE_PENALTY.innerHTML = lostScore;

	void GAME_SCORE_PENALTY.offsetWidth;
	GAME_SCORE_PENALTY.classList.add("lost-score");
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

	timeRemaining -= TIME_PENALTY;
	updateTime(timeRemaining);

	flashScorePenalty(`-${TIME_PENALTY}`);

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
	else {
		submitName(name, score);
		window.location.href = "../highscores";
	}
});

initializeGame();