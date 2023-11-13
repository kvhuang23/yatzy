/*jshint esversion: 6 */

// Scoring holders
let upperBonus = 0;
let upperSectionsFilled = 0;
let bonusActive = false;

// DOM elements
const upperBonusScoreField = document.getElementById('upper-bonus-score');
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

async function lockScoreUpper() {
    let score = this.innerHTML;
    let scoreBox = this.previousSibling.previousSibling;
    scoreBox.innerHTML = score;
    upperBonus += parseInt(score);
    upperSectionsFilled += 1;

    // If bonus is not active, update the upper bonus.
    if (!bonusActive) {
        updateUpperBonus();
    }

    // Update the roll and round number on the server side after a score is locked
    try {
        await updateRollOnServer();
    } catch (error) {
        console.error("Error updating roll on server:", error);
    }

    // Fetch the updated game state from the server
    try {
        let response = await fetch('/gameState');
        let data = await response.json();
        roundNumber = data.roundNumber;
        checkGameState();
    } catch (error) {
        console.error("Error fetching game state:", error);
    }

    resetTable();
    closeNav();
}

function checkGameState() {
    if (roundNumber === 14) {
        rollButton.className = 'roll-3 disabled';
        rollButton.removeEventListener('click', rollDie, false);
        countFinalScore();
    }
}
async function lockScoreLower() {
    let score = this.innerHTML;
    let scoreBox = this.previousSibling.previousSibling;
    scoreBox.innerHTML = score;

    // Update the roll and round number on the server side after a score is locked
    try {
        await updateRollOnServer();
    } catch (error) {
        console.error("Error updating roll on server:", error);
    }

    // Fetch the updated game state from the server
    try {
        let response = await fetch('/gameState');
        let data = await response.json();
        roundNumber = data.roundNumber;
        checkGameState();
    } catch (error) {
        console.error("Error fetching game state:", error);
    }

    resetTable();
    closeNav();
}

function celebrateYahtzee() {
	yahtzeeLogo.className = 'animated tada';
	setTimeout(function() {
		yahtzeeLogo.className = '';
	}, 1500);
}

function updateScoreTable() {
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
        const scores = data.scores;

        // Update speculative score tabs based on scores returned from server
        for (let key in scores) {
            let scoreValue = scores[key];
            let tabElement;

            switch (key) {
                case 'number1':
                case 'number2':
                case 'number3':
                case 'number4':
                case 'number5':
                case 'number6':
                    tabElement = speculativeScoreTabs[parseInt(key.replace('number', ''))];
                    break;
                case 'threeOfAKind':
                    tabElement = speculativeScoreTabs[7];
                    break;
                case 'fourOfAKind':
                    tabElement = speculativeScoreTabs[8];
                    break;
                case 'fullHouse':
                    tabElement = speculativeScoreTabs[9];
                    break;
                case 'smallStraight':
                    tabElement = speculativeScoreTabs[10];
                    break;
                case 'largeStraight':
                    tabElement = speculativeScoreTabs[11];
                    break;
                case 'chance':
                    tabElement = speculativeScoreTabs[13];
                    break;
                case 'yahtzee':
                    tabElement = speculativeScoreTabs[12];
                    break;
                default:
                    break;
            }

            if (tabElement) {
                tabElement.style.display = 'table-cell';
                tabElement.className = 'speculative-score';
                tabElement.innerHTML = scoreValue;
                
                if (key.startsWith('number')) {
                    tabElement.addEventListener('click', lockScoreUpper, false);
                } else {
                    tabElement.addEventListener('click', lockScoreLower, false);
                }
            }
        }
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
        const finalScoreElement = document.getElementById('final-score'); // Assuming you have an element with id 'final-score' to display the final score
        if (finalScoreElement) {
            finalScoreElement.innerHTML = `Final Score: ${data.finalScore}`;
        }
        
        // Optionally, you can display some kind of congratulatory message or animation depending on the final score
        if (data.finalScore >= 200) {  // Assuming 200 is a high score
            alert("Congratulations! You've scored above 200!");
        }
    });
}


// ... (Other client-side logic)
