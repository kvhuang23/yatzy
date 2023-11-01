// Dice information holders
let diceAnywhere = []; // All dice currently in play array
let diceOnTable = []; // On-table die array
let diceSelected = []; // Selected die array
let currentDieIndex; // Keep track of die selection/deselection
let dieIndexHolder = [0,1,2,3,4];
let selectedDiceElements; // HTMLCollection

// DOM elements
const diceArea = document.getElementById('diceArea');
const selectedDiceArea = document.getElementById('selectedDiceArea');

// Event listener for the roll button
document.getElementById('rollDiceButton').addEventListener('click', function() {
    fetch('/rollDice', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            diceSelected: diceSelected.length
        })
    })
    .then(response => response.json())
    .then(data => {
        diceOnTable = data;
        drawDiceOnTable();
        updateDiceAnywhere();
        // updateScoreTable(); // Assuming there's a function for updating scores
    });
});

function drawDiceOnTable() {
    dieIndexHolder = [0,1,2,3,4]; // Reset die index holder

    for (let i = diceOnTable.length - 1; i >= 0; i--) {
        drawDieOnTable(diceOnTable[i], dieIndexHolder[i]);
    }

    // Assign new indices for dice left over from the last roll
    updateSelectedDiceElements();
    if (selectedDiceElements) {
        for (let j = 0; j < selectedDiceElements.length; j++) {
            selectedDiceElements[j].setAttribute('die-index', diceOnTable.length + j);
        }
    }
}

function selectDieFromTable() {
    let diceValue = parseInt(this.getAttribute('die-value'), 10);
    currentDieIndex = parseInt(this.getAttribute('die-index'), 10);
    let position = diceOnTable.indexOf(diceValue);
    diceOnTable.splice(position, 1);
    this.parentNode.removeChild(this);
    diceSelected.push(diceValue);
    drawSelectedDice(diceValue, currentDieIndex);
    updateDiceAnywhere();
    // updateScoreTable();
}

function drawSelectedDice(value, index) {
    let dieDiv = document.createElement('div');
    dieDiv.className += 'die-selected';
    selectedDiceArea.appendChild(dieDiv);
    dieDiv.setAttribute('die-value', value);
    dieDiv.setAttribute('die-index', index);
    dieDiv.addEventListener('click', removeDieSelection, false);
}

function removeDieSelection() {
    let diceValue = parseInt(this.getAttribute('die-value'), 10);
    currentDieIndex = parseInt(this.getAttribute('die-index'), 10);
    let position = diceSelected.indexOf(diceValue);
    diceSelected.splice(position, 1);
    diceOnTable.push(diceValue);
    drawDieOnTable(diceValue, currentDieIndex);
    this.parentNode.removeChild(this);
    updateDiceAnywhere();
    // updateScoreTable();
}

function drawDieOnTable(value, index) {
    let dieDiv = document.createElement('div');
    dieDiv.className += 'die';
    diceArea.appendChild(dieDiv);
    dieDiv.style.transform = 'rotate(' + randomizeRotation() + 'deg)';
    dieDiv.setAttribute('die-value', value);
    dieDiv.setAttribute('die-index', index);
    dieDiv.addEventListener('click', selectDieFromTable, false);
}

function randomizeRotation() {
    return Math.floor(Math.random() * (360 - 1) + 1);
}

function updateSelectedDiceElements() {
    if (selectedDiceArea.innerHTML !== '') {
        selectedDiceElements = document.getElementsByClassName('die-selected');
    }
}

function updateDiceAnywhere() {
    if (diceSelected) {
        diceAnywhere = diceOnTable.concat(diceSelected);
    } else {
        diceAnywhere = diceOnTable;
    }
}
