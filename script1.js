const board = [
  ['0', '0', '0', '0', '0', '0', '0', '0', '0'],
  ['0', '0', '0', '0', '0', '0', '0', '0', '0'],
  ['0', '0', '0', '0', '0', '0', '0', '0', '0'],
  ['0', '0', '0', '0', '0', '0', '0', '0', '0'],
  ['0', '0', '0', '0', '0', '0', '0', '0', '0'],
  ['0', '0', '0', '0', '0', '0', '0', '0', '0'],
  ['0', '0', '0', '0', '0', '0', '0', '0', '0'],
  ['0', '0', '0', '0', '0', '0', '0', '0', '0'],
  ['0', '0', '0', '0', '0', '0', '0', '0', '0']
];

let energyPlayer = 1000;
let currentPlayer = 1;
let timerInterval;
let redCircleCounter = 0;
let gameEnded = false;


const boardElement = document.getElementById('board');
for (let i = 0; i < 9; i++) {
  for (let j = 0; j < 9; j++) {
    const square = document.createElement('div');
    square.classList.add('square');
    square.setAttribute('data-row', i);
    square.setAttribute('data-col', j);

    if (board[i][j] === '0') {
      const circle = document.createElement('div');
      circle.classList.add('circle');
      circle.setAttribute('data-timer', 0); // Add timer data attribute
      circle.addEventListener('click', function () {
        if (!gameEnded && !circle.classList.contains('red') && energyPlayer >= 10) {
          circle.classList.add('red');
          redCircleCounter++;
          energyPlayer -= 10;
          document.getElementById('player-energy').textContent = `Energie: ${energyPlayer}`;
          startRedTimer(circle); // Start the timer for the red circle
          checkWinCondition();
        }
      });
      square.appendChild(circle);
    }

    boardElement.appendChild(square);
  }
}

const randomizeButton = document.getElementById('randomize-button');
randomizeButton.addEventListener('click', function () {
  if (energyPlayer >= 15) {
    randomizeCircles();
    energyPlayer -= 15;
    document.getElementById('player-energy').textContent = `Energie: ${energyPlayer}`;
  } else {
    console.log('Nu aveti suficienta energie pentru a randomiza!');
  }
});


function computerHeal() {
  const circles = document.getElementsByClassName('circle');
  const violetCircles = [];
  const redCircles = [];

  for (let i = 0; i < circles.length; i++) {
    if (circles[i].classList.contains('red')) {
      redCircles.push(circles[i]);
    }
    if (circles[i].classList.contains('violet')) {
      violetCircles.push(circles[i]);
    }
  }

  let circleToHeal;
  if (violetCircles.length > 0) {
    const randomIndex = Math.floor(Math.random() * violetCircles.length);
    circleToHeal = violetCircles[randomIndex];
  } else if (redCircles.length > 0) {
    const randomIndex = Math.floor(Math.random() * redCircles.length);
    circleToHeal = redCircles[randomIndex];
  }

  if (circleToHeal) {
    circleToHeal.classList.remove('red', 'violet');
    circleToHeal.removeAttribute('data-start-time'); // Remove timer data attribute
    redCircleCounter--;
  }
}


function startRedTimer(circle) {
  const startTime = new Date().getTime(); // Get the current time in milliseconds
  circle.setAttribute('data-start-time', startTime);
}

function checkWinCondition() {
  const circles = document.getElementsByClassName('circle');
  const currentTime = new Date().getTime(); // Get the current time in milliseconds
  

  for (let i = 0; i < circles.length; i++) {
    const circle = circles[i];

    if (circle.classList.contains('red') || circle.classList.contains('violet')) {
      const startTime = parseInt(circle.getAttribute('data-start-time'));
      const elapsedTime = currentTime - startTime;
      const elapsedTimeInSeconds = Math.floor(elapsedTime / 1000); // Convert the time to seconds

      if (elapsedTimeInSeconds >=  18*3 - 15) { // If the circle is in its last 3 seconds
        if (circle.classList.contains('red')) {
          circle.classList.remove('red'); // Remove the red class
          circle.classList.add('violet'); // Add the violet class
        }
      }

      if (elapsedTimeInSeconds >= 18 * 3) {
        // End the game with the player winning
        endGame(true);
        return;
      }
    }
  }
}



function endGame(playerWins) {
  clearInterval(timerInterval);
  let result;
  if (playerWins) {
      result = 'Bravo! Ai castigat!!';
  } else {
      result = 'Ai fost aproape, vrei sa mai incerci o data?';
  }

  // Salveaza rezultatul in sessionStorage si directioneaza utilizatorul catre pagina de rezultate
  sessionStorage.setItem('gameResult', result);
  window.location.href = 'rezultat.html';  // Inlocuieste cu numele fisierului tau HTML
}


function updateTime() {
  const timerElement = document.getElementById('timer');
  let seconds = 0;

  timerInterval = setInterval(() => {
    seconds++;

    if (seconds <= 180) {
      timerElement.textContent = `Timp rămas: ${180 - seconds} secunde`;


      if (seconds % 2.5 == 0) {
        computerHeal();
      }

      if (seconds % 1 == 0) {
        computerTurnGray();
      }
      const numRedCircles = countRedCircles();
      if (numRedCircles === 0 && energyPlayer < 10) {
        gameEnded = true;
        endGame(false);
      }
      checkWinCondition();

    } else {
      clearInterval(timerInterval);
      gameEnded = true;
      endGame(false);
    }
  }, 1000);
}

function randomizeCircles() {
  const squares = Array.from(document.querySelectorAll('.square'));
  const circles = Array.from(document.querySelectorAll('.circle'));

  const shuffledCircles = shuffleArray(circles);

  // Remove all circles from the board
  circles.forEach(circle => circle.remove());

  // Add the shuffled circles back to the board
  for (let i = 0; i < shuffledCircles.length; i++) {
    squares[i].appendChild(shuffledCircles[i]);
  }
}

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}




function resetCircleAttributes() {
  const circles = document.getElementsByClassName('circle');

  for (let i = 0; i < circles.length; i++) {
    const circle = circles[i];
    circle.classList.remove('red');
    circle.removeAttribute('data-start-time');
    circle.removeAttribute('data-timer');
  }

  redCircleCounter = 0;
}

updateTime();

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

let initialCircle, finalCircle;

// Adăugați listener pentru 'mousedown' și 'mouseup'
boardElement.addEventListener('mousedown', function(e) {
    if (!gameEnded && e.target.classList.contains('circle') && energyPlayer > 0) {
        initialCircle = e.target;
    }
});

boardElement.addEventListener('mouseup', function(e) {
    if (!gameEnded && e.target.classList.contains('circle') && energyPlayer >= 5) {
        finalCircle = e.target;

        // Verificăm dacă cercurile sunt adiacente
        if (areAdjacentCircles(initialCircle, finalCircle)) {
            // Începem procesul de 'comunicare'
            energyPlayer -= 5;
            document.getElementById('player-energy').textContent = `Energie: ${energyPlayer}`;
            if (!initialCircle.classList.contains('blue')) {
              startCommunicationProcess(initialCircle, finalCircle);
            }
            
        }
    }
});

// Funcție care verifică dacă două cercuri sunt adiacente
function areAdjacentCircles(circle1, circle2) {
    const row1 = parseInt(circle1.parentElement.getAttribute('data-row'));
    const col1 = parseInt(circle1.parentElement.getAttribute('data-col'));
    const row2 = parseInt(circle2.parentElement.getAttribute('data-row'));
    const col2 = parseInt(circle2.parentElement.getAttribute('data-col'));

    return Math.abs(row1 - row2) + Math.abs(col1 - col2) === 1;
}

// Funcție care inițiază procesul de 'comunicare'

function startCommunicationProcess(circle1, circle2) {
  circle1.classList.add('blue');
  circle2.classList.add('blue');

  // Check if each circle was black before the communication process
  const wasCircle1Black = circle1.classList.contains('red');
  const wasCircle2Black = circle2.classList.contains('red');

  setTimeout(function (){
    if (circle1.classList.contains('blue') && circle2.classList.contains('blue')) {
      // Verifică dacă calculatorul întrerupe comunicarea sau nu
      computerInterruptCommunication(circle1, circle2);}
    },1000);

  setTimeout(function () {
    circle1.classList.remove('blue');
    circle2.classList.remove('blue');

    if (circle1.classList.contains('red') || circle2.classList.contains('red')) {
      circle1.classList.remove('black');
      circle2.classList.remove('black');
      circle1.classList.add('red');
      circle2.classList.add('red');

      // Check each circle separately and start the timer if it was black and is now red
      if (!wasCircle1Black && circle1.classList.contains('red')) {
        startRedTimer(circle1);
      }
      if (!wasCircle2Black && circle2.classList.contains('red')) {
        startRedTimer(circle2);
      }
    } 
  }, 5000);
}



function updateEnergyBar() {
  const energyBar = document.getElementById('energy-bar');
  energyBar.style.height = `${energyPlayer / 10}%`;
}

// Actualizăm tubul de energie ori de câte ori energia jucătorului se schimbă
document.getElementById('player-energy').addEventListener('DOMSubtreeModified', updateEnergyBar);

// Inițializăm tubul de energie
updateEnergyBar();


function computerInterruptCommunication(circle1, circle2) {
  // Decide la întâmplare dacă calculatorul întrerupe comunicarea sau nu
  const shouldInterrupt = Math.random() < 0.5; // 50% șanse de întrerupere

  if (shouldInterrupt) {
    // Întrerupe comunicarea și colorează cercurile în maro pentru 2 secunde
    circle1.classList.add('yellow');
    circle2.classList.add('yellow');

    setTimeout(function () {
      circle1.classList.remove('yellow');
      circle2.classList.remove('yellow');
      circle1.classList.remove('blue');
      circle2.classList.remove('blue');
      circle1.classList.remove('red');
      circle2.classList.remove('red');
    }, 2000);
  }
}

function computerTurnGray() {
  const circles = Array.from(document.getElementsByClassName('circle'));
  const redCircles = circles.filter(circle => circle.classList.contains('red'));
  const grayCircles = circles.filter(circle => circle.classList.contains('gray'));

  const numberOfCirclesToTurnGray = Math.floor(redCircles.length / 3);
  let grayedCircles = grayCircles.length; // start with the number of gray circles

  // Shuffle the array of circles
  circles.sort(() => Math.random() - 0.5);

  // Iterate over all the circles
  for (let i = 0; i < circles.length && grayedCircles < numberOfCirclesToTurnGray; i++) {
    const circle = circles[i];

    if (!circle.classList.contains('gray') && !circle.classList.contains('blue') && !circle.classList.contains('yellow')) {
      circle.classList.add('gray');
      circle.setAttribute('data-grayed-time', Date.now());
      grayedCircles++;

      // Start the timer for this gray circle
      setTimeout(returnGrayToBlack.bind(null, circle), 15000);
    }
  }
}

function returnGrayToBlack(circle) {
  // Check if the circle is still gray
  if (circle.classList.contains('gray')) {
    // Check if it's been at least 15 seconds since the circle turned gray
    const grayedTime = parseInt(circle.getAttribute('data-grayed-time'));
    if (Date.now() - grayedTime >= 15000) {
      circle.classList.remove('gray');
      circle.classList.remove('red');
      circle.removeAttribute('data-grayed-time');
    }
  }
}

function countRedCircles() {
  const redCircles = document.getElementsByClassName('red');
  return redCircles.length;
}