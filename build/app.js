const grid = document.querySelector('.grid');
let width = 10;
let squares = [];
let bombAmount = 20;
let isGameOver = false;
let flags = 0;

//Create Board
function createBoard() {
  //Get shuffled game array with random bombs
  const bombsArray = Array(bombAmount).fill('bomb');
  const emptyArray = Array(width * width - bombAmount).fill('valid');
  const gameArray = [...emptyArray, ...bombsArray];
  const shuffledArray = gameArray.sort(() => Math.random() - Math.random());

  for (let i = 0; i < width * width; i++) {
    const square = document.createElement('div');
    square.setAttribute('id', i);
    square.classList.add(shuffledArray[i]);
    grid.appendChild(square);
    squares.push(square);

    // Normal Click
    square.addEventListener('click', function (e) {
      click(square);
    });
    //Control Left and Right click
    square.oncontextmenu = function (e) {
      e.preventDefault();
      addFlag(square);
    };
  }

  //Add Numbers
  for (let i = 0; i < squares.length; i++) {
    let total = 0;
    const isLeftEdge = i % width === 0;
    const isRightEdge = i % width === width - 1;

    if (squares[i].classList.contains('valid')) {
      //W
      if (i > 0 && !isLeftEdge && squares[i - 1].classList.contains('bomb'))
        total++;
      //NE
      if (
        i > 9 &&
        !isRightEdge &&
        squares[i + 1 - width].classList.contains('bomb')
      )
        total++;
      //N
      if (i > 10 && squares[i - width].classList.contains('bomb')) total++;
      //NW
      if (
        i > 11 &&
        !isLeftEdge &&
        squares[i - 1 - width].classList.contains('bomb')
      )
        total++;
      //E
      if (i < 98 && !isRightEdge && squares[i + 1].classList.contains('bomb'))
        total++;
      //Sw
      if (
        i < 90 &&
        !isLeftEdge &&
        squares[i - 1 + width].classList.contains('bomb')
      )
        total++;
      //SE
      if (
        i < 88 &&
        !isRightEdge &&
        squares[i + 1 + width].classList.contains('bomb')
      )
        total++;
      //S
      if (i < 89 && squares[i + width].classList.contains('bomb')) total++;

      squares[i].setAttribute('data', total);
    }
  }
}

createBoard();

//Add flag with right click
function addFlag(square) {
  if (isGameOver) return;
  if (!square.classList.contains('checked') && flags < bombAmount) {
    if (!square.classList.contains('flag')) {
      square.classList.add('flag');
      square.innerHTML = '🎌';
      square.classList.add('flagstyle');
      flags++;
      checkForWin();
    } else {
      square.classList.remove('flag');
      square.innerHTML = '';
      flags--;
    }
  }
}

//Click on Square functions
function click(square) {
  let currentId = square.id;
  if (isGameOver) {
    return;
  }
  if (
    square.classList.contains('checked') ||
    square.classList.contains('flag')
  ) {
    return;
  }
  if (square.classList.contains('bomb')) {
    gameOver(square);
  } else {
    let total = square.getAttribute('data');
    if (total > 0) {
      square.classList.add('checked');
      square.innerHTML = total;
      return;
    }
    checkSquare(square, currentId);
  }
  square.classList.add('checked');
}

//Check neighbouring squares once square is clicked
function checkSquare(square, currentId) {
  const isLeftEdge = currentId % width === 0;
  const isRightEdge = currentId % width === width - 1;

  setTimeout(() => {
    if (currentId > 0 && !isLeftEdge) {
      const newId = squares[parseInt(currentId) - 1].id;
      const newSquare = document.getElementById(newId);
      click(newSquare);
    }
    if (currentId > 9 && !isRightEdge) {
      const newId = squares[parseInt(currentId) + 1 - width].id;
      const newSquare = document.getElementById(newId);
      click(newSquare);
    }
    if (currentId > 10) {
      const newId = squares[parseInt(currentId - width)].id;
      const newSquare = document.getElementById(newId);
      click(newSquare);
    }
    if (currentId > 11 && !isLeftEdge) {
      const newId = squares[parseInt(currentId) - 1 - width].id;
      const newSquare = document.getElementById(newId);
      click(newSquare);
    }
    if (currentId < 98 && !isRightEdge) {
      const newId = squares[parseInt(currentId) + 1].id;
      const newSquare = document.getElementById(newId);
      click(newSquare);
    }
    if (currentId < 90 && !isLeftEdge) {
      const newId = squares[parseInt(currentId) - 1 + width].id;
      const newSquare = document.getElementById(newId);
      click(newSquare);
    }
    if (currentId < 88 && !isRightEdge) {
      const newId = squares[parseInt(currentId) + 1 + width].id;
      const newSquare = document.getElementById(newId);
      click(newSquare);
    }
    if (currentId < 89) {
      const newId = squares[parseInt(currentId) + width].id;
      const newSquare = document.getElementById(newId);
      click(newSquare);
    }
  }, 10);
}

//Game Over
function gameOver(square) {
  alert('BOOOOMMMM!!!!');
  isGameOver = true;

  //Show All the Bomb locations
  squares.forEach((square) => {
    if (square.classList.contains('bomb')) {
      square.innerHTML = '💣';
      square.classList.add('boom');
    }
  });
}

//Check for win
function checkForWin() {
  let matches = 0;
  for (let i = 0; i < squares.length; i++) {
    if (
      squares[i].classList.contains('flag') &&
      squares[i].classList.contains('bomb')
    ) {
      matches++;
    }
  }
  if (matches === bombAmount) {
    alert('YOU WON');
    isGameOver = true;
  }
}
