
const getScores = () => {
	return JSON.parse(localStorage.getItem("highscores"));
};

const makeLI = (player) => {
	const li = document.createElement("li");
	li.innerHTML = `${player.name} - ${player.score}`;
	document.querySelector("#highscore-ol").appendChild(li);
};

document.querySelector("#clear-all-scores").addEventListener("click", (e) => {
	localStorage.removeItem("highscores");
	const lis = [...document.querySelector("#highscore-ol").children]
	while (lis.length) lis.pop().remove();
	document.querySelector("#no-highscores-warning").style.display = "block";
});

const scores = getScores();
if (scores !== null) {
	document.querySelector("#no-highscores-warning").style.display = "none";
	
	scores.sort((a, b) => {
		if(a.score > b.score) return -1;
		if(a.score < b.score) return 1;
		return 0;
	});
	
	scores.forEach(player => {
		makeLI(player)
	});
}