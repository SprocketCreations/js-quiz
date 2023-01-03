const GAME_RUNNING_SCREEN = document.querySelector("#game-running");
const GAME_END_SCREEN = document.querySelector("#game-over");
const TIME_SPAN = document.querySelector("#time-remaining");
const GAME_STATUS = document.querySelector("#status");
const GAME_QUESTION = document.querySelector("#question");
const GAME_ANSWERS = document.querySelectorAll("#answers li")


const timeRemaining


const showGameOverScreen = () =>
{
	GAME_RUNNING_SCREEN.style.display = "none";
	GAME_END_SCREEN.style.display = "block";
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
