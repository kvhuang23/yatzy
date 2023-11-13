/*jshint esversion: 6 */

// Throw and round number information holders
let rollNumber = 0;
let roundNumber = 1;

// DOM elements
const rollButton = document.getElementById('rollDiceButton');
const openScoreSheet = document.getElementById('openScoreSheetButton');
const closeScoreSheet = document.getElementById('closeScoreSheetButton');
const roundNumberElement = document.getElementById('round-number');
const siteWrapper = document.getElementById('site-wrapper');
const siteCanvas = document.getElementById('site-canvas');
const speculativeScoreTab = document.getElementsByClassName('speculative-score');

openScoreSheet.addEventListener('click', openNav, false);
closeScoreSheet.addEventListener('click', closeNav, false);
window.addEventListener('resize', windowResize, false);

checkRollNumber();

const windowWidth = document.documentElement.clientWidth;

// Re-draw the dice on window resize to reset the element style transform done with JS (rotation),
// which are overriding responsive CSS transform scale styling
function windowResize() {
	if (diceOnTable.length && windowWidth !== document.documentElement.clientWidth) { // Prevent mobile Chrome from triggering this on scroll
		diceArea.innerHTML = '';
		drawDiceOnTable();
	}
}

function checkRollNumber() {
    fetch('/gameState')
        .then(response => response.json())
        .then(data => {
            rollNumber = data.rollNumber;
            roundNumber = data.roundNumber;

            // The rest of the logic remains largely unchanged
            switch (rollNumber) {
                case 0:
                    rollButton.className = '';
                    break;
                case 1:
                    rollButton.className = 'roll-1';
                    break;
                case 2:
                    rollButton.className = 'roll-2';
                    break;
                case 3:
                    rollButton.className = 'roll-3';
                    rollButton.removeEventListener('click', rollDie, false);
                    setTimeout(function() {
                        rollButton.className = 'roll-3 disabled';
                    }, 500);
                    break;
                default:
                    console.log("Roll number error");
            }
        });
}

function updateRollOnServer() {
    fetch('/updateRoll', {
        method: 'POST'
    })
    .then(response => response.json())
    .then(data => {
        rollNumber = data.rollNumber;
        roundNumber = data.roundNumber;
    });
}

function hideSpeculativeScores() {
	for (let i = 0; i < speculativeScoreTab.length; i++) {
		speculativeScoreTab[i].style.display = 'none';
	}
}

function updateRoundNumber() {
    roundNumberElement.innerHTML = Math.min(roundNumber, 13);
}

async function resetTable() {
    diceOnTable = []; // Reset on-table die array
    diceSelected = []; // Reset selected die array
    dieIndexHolder = [0,1,2,3,4]; // Reset die index holder
    updateDiceAnywhere(); // Reset dice in play array
    
    checkRollNumber();
    hideSpeculativeScores();
    updateRoundNumber();
    rollButton.addEventListener('click', rollDie, false);
    selectedDiceArea.innerHTML = '';
    diceArea.innerHTML = '';
 }
 

function resetGame() {
    fetch('/resetGame', {
        method: 'POST'
    })
    .then(() => {
        window.location.reload(false);
    });
}

function openNav() {
	siteWrapper.className = 'show-nav';
	openScoreSheet.style.opacity = 0;
}

function closeNav() {
	siteWrapper.className = '';
	scroll(0,0);
	openScoreSheet.style.opacity = 1;
}
