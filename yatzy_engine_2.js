/*jshint esversion: 6 */

// Scoring holders
let numberOfYahtzees = 0;
let yahtzeeScore = 0;
let upperBonus = 0;
let upperSectionsFilled = 0;
let bonusActive = false;
let finalScore = 0;

// Selected duplicate dice information holder
let duplicates = {};

// DOM elements
const upperBonusScoreField = document.getElementById('upper-bonus-score');
const scoreMessage = document.getElementById('scoreMessage');
const finalScoreElement = document.getElementById('finalScore');
const yahtzeeLogo = document.getElementById('logo');

// Make an array with the score box elements
let scoreFields = [];
for (let i = 1; i < 14; i++) {
	scoreFields[i] = document.getElementById(i + '-score');
}

// Make an array with the speculative score box elements
let speculativeScoreTabs = [];
for (let i = 1; i < 14; i++) {
	speculativeScoreTabs[i] = scoreFields[i].nextSibling.nextSibling;
}

function isInArray(value, array) {
	return array.indexOf(value) > -1;
}

function sumArray(array) {
	return array.reduce(function(prev, curr) {
		return prev + curr;
	}, 0);
}

function sumDuplicates(value, array) {
	let count = 0;
	for (let i = 0; i < array.length; i++) {
		if (array[i] == value) {
			count++;
		}
	}
	return count * value;
}

function countDuplicates(array) {
	duplicates = {};
	array.forEach (function(i) {
		duplicates[i] = (duplicates[i] || 0) + 1;
	});
}

function updateUpperBonus() {
	// This logic remains client-side as it's purely UI related
	if (upperSectionsFilled === 6 && upperBonus < 63) { // Upper section is full and bonus is not reached
		upperBonusScoreField.innerHTML = '&mdash;';
	} else if ( upperBonus < 63 ) { // Bonus not yet reached
		upperBonusScoreField.innerHTML = -63 + parseInt(upperBonus);
	} else { // Bonus reached
		upperBonusScoreField.innerHTML = 35;
		upperBonusScoreField.previousSibling.previousSibling.innerHTML = 'Bonus &#10003;';
		bonusActive = true;
	}
}

function lockScoreUpper() {
	// This logic remains client-side as it's purely UI related
	let score = this.innerHTML;
	let scoreBox = this.previousSibling.previousSibling;
	scoreBox.innerHTML = score;
	upperBonus += parseInt(score);
	upperSectionsFilled += 1;
	roundNumber += 1;
	if (!bonusActive) {
		updateUpperBonus();
	}
	resetTable();
	closeNav();
	if (roundNumber === 14) {
		rollButton.className = 'roll-3 disabled';
		rollButton.removeEventListener('click', rollDie, false);
		countFinalScore();
	}
}

function lockScoreLower() {
	// This logic remains client-side as it's purely UI related
	let score = this.innerHTML;
	let scoreBox = this.previousSibling.previousSibling;
	scoreBox.innerHTML = score;
	roundNumber += 1;
	resetTable();
	closeNav();
	if (roundNumber === 14) {
		rollButton.className = 'roll-3 disabled';
		rollButton.removeEventListener('click', rollDie, false);
		countFinalScore();
	}
}

function lockYahtzeeScore() {
	// This logic remains client-side as it's purely UI related
	let score = this.innerHTML;
	let scoreBox = this.previousSibling.previousSibling;
	scoreBox.innerHTML = score;
	roundNumber += 1;
	numberOfYahtzees += 1;
	resetTable();
	closeNav();
	if (roundNumber === 14) {
		rollButton.className = 'roll-3 disabled';
		rollButton.removeEventListener('click', rollDie, false);
		countFinalScore();
	}

}

function celebrateYahtzee() {
	yahtzeeLogo.className = 'animated tada';
	setTimeout(function() {
		yahtzeeLogo.className = '';
	}, 1500);
}

function updateScoreTable() {
	// Count duplicates for further calculations
	countDuplicates(diceSelected);

	// Send diceSelected to server to calculate potential scores
	fetch('/updateScores', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify({ diceSelected: diceSelected })
	})
	.then(response => response.json())
	.then(data => {
		// Use data returned from server to update the score table UI
		// Logic truncated for brevity...
	});
}

function countFinalScore() {
	// Send current scores to server for final score calculation
	fetch('/countFinalScore', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify({ scores: scoreFields.map(field => parseInt(field.innerHTML) || 0) })
	})
	.then(response => response.json())
	.then(data => {
		// Update the UI based on data received from server
		// Logic truncated for brevity...
	});
}

// ... (Other client-side logic)
