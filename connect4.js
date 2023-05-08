/** Connect Four
 *
 * Player 1 and 2 alternate turns. On each turn, a piece is dropped down a
 * column until a player gets four-in-a-row (horiz, vert, or diag) or until
 * board fills (tie)
 */
window.addEventListener('load', function(){
const WIDTH = 7;
const HEIGHT = 6;

let currPlayer = 1; // active player: 1 or 2
let board = []; // array of rows, each row is array of cells  (board[y][x])

/** makeBoard: create in-JS board structure:
 *    board = array of rows, each row is array of cells  (board[y][x])
 */

function makeBoard() {
  // TODO: set "board" to empty HEIGHT x WIDTH matrix array
  //y=height === 6
  //x = width === 7

  //create a loop for the [y]
  //dynamic means {} board is an array, array.from() & push will be needed
  for (let y = 0; y < HEIGHT; y++){
    board.push(Array.from({ length: WIDTH }));
  }
}

/** makeHtmlBoard: make HTML table and row of column tops. */

function makeHtmlBoard() {
  // TODO: get "htmlBoard" variable from the item in HTML w/ID of "board"
  const htmlBoard = document.getElementById('board');

  // TODO: Create column top / clickable area for the player's piece "to fall"

  const top = document.createElement('tr');
  top.setAttribute('id', 'column-top');
  top.addEventListener('click', handleClick);

  for (let x = 0; x < WIDTH; x++) {
    const headCell = document.createElement('td');
    headCell.setAttribute('id', x);
    top.append(headCell);
  }
  htmlBoard.append(top);

  // main part of the playing board - the actual game board where the placed pieces are shown
  
  for (let y = 0; y < HEIGHT; y++) {
    const row = document.createElement('tr');

    for (let x = 0; x < WIDTH; x++) {
      const cell = document.createElement('td');
      cell.setAttribute('id', `${y}-${x}`);
      row.append(cell);
    }
    htmlBoard.append(row);
  }
}

/** findSpotForCol: given column x, return top empty y (null if filled) */

function findSpotForCol(x) {
  // TODO: create a function that accepts a {x} and finds the lowest empty {y} or null if {y}!==0
  for (let y = HEIGHT - 1; y >=0; y--){
    if(!board[y][x]){
      return y;
    }
  }
  return null;
}

/** placeInTable: update DOM to place piece into HTML table of board */

function placeInTable(y, x) {
  // TODO: make a div and insert into correct table cell
  const piece = document.createElement('div');
  //add the class lists "piece" and the current player p1 or p2 (string temp)
  piece.classList.add('piece');
  piece.classList.add(`p${currPlayer}`);

  //animate the piece so that it "drops" vertically 
  //style formate with top
  //cant be a set rate because then all pieces would fall to that location
  piece.style.top = -50 * (y + 2); 
  

  //piece isn't showing up? //how do I capture this location?
  //location is unique {y} changes whereas {x} is constant
  //to pull an unique location we need Id & a string // seperate with a - no spaces to show coordinates
  const location = document.getElementById(`${y}-${x}`);

  //add the location to the string. It can't be a class value because the {x} will constantly change
  location.append(piece);
}

/** endGame: announce game end */
function endGame(msg) {
  // TODO: pop up alert message
  //QA: need to prevent alert from popping up before the piece is
  setTimeout(()=>{
    alert(msg)
  }, 750);
  
}


/** handleClick: handle click of column top to play piece */

function handleClick(e) {
  // get x from ID of clicked cell
  const x = + e.target.id;

  // get next spot in column (if none, ignore click)
  const y = findSpotForCol(x);
  if (y === null) {
    return;
  }

  // place piece in board and add to HTML table
  // TODO: add line to update in-memory board where is the currPlayer's location within the matrix via the placeInTable function
  //last postion played ===currplayer
  board[y][x] = currPlayer;
  placeInTable(y, x);

  // check for win
  
  if (checkForWin()) {
    return endGame(`Player ${currPlayer} won!`);
  }

  // check for tie
  // TODO: check if all cells in board are filled; if so call, call endGame
  // using the every method will be necessary here. We need all of the cells of all the rows [a filled board] to be "not in play" 
      if (board.every(row => row.every(cell => cell))) {
        return endGame("TIE! No player won!");
      }
  
  // switch players
  // TODO: switch currPlayer 1 <-> 2
  //ternary operator currPlayer = 1 or 2
  //if default(off=false) is 1, then  on(true) will be 2
  currPlayer = currPlayer === 1? 2:1;
  //currPlayer = currPlayer === currPlayer ? 2:1;
}

/** checkForWin: check board cell-by-cell for "does a win start here?" */

function checkForWin() {
  function _win(cells) {
    // Check four cells to see if they're all color of current player
    //  - cells: list of four (y, x) cells
    //  - returns true if all are legal coordinates & all match currPlayer

    return cells.every(
      //all of the cells within the matrix
      ([y, x]) =>
      //when the row isn't empty
        y >= 0 &&
        //and the row values are less than the height dimensions
        y < HEIGHT &&
        //and x is a full column
        x >= 0 &&
        //and the column values are less than the width dimensions
        x < WIDTH &&
        //and the last position played belongs to the current player
        board[y][x] === currPlayer
    );
  }

  // creates the loop to check for a win
  //[
    //[first set of coordinates that are the beginning /first clicked]],
    //[second set: first set of coordinates plus/ (diagDL) minus 1]
    //[third set: first set of coordinates plus/(diagDL) minus 2]
    //[second set: first set of coordinates plus/(diagDL) minus 3]


  for (let y = 0; y < HEIGHT; y++) {
    for (let x = 0; x < WIDTH; x++) {
      const horiz = [[y, x], [y, x + 1], [y, x + 2], [y, x + 3]];
      const vert = [[y, x], [y + 1, x], [y + 2, x], [y + 3, x]];
      const diagDR = [[y, x], [y + 1, x + 1], [y + 2, x + 2], [y + 3, x + 3]];
      const diagDL = [[y, x], [y + 1, x - 1], [y + 2, x - 2], [y + 3, x - 3]];
    
      //only checks for winner by possibility, once found, it closes the game
      if (_win(horiz) || _win(vert) || _win(diagDR) || _win(diagDL)) {
        return true;
      }
    }
  }
}

makeBoard();
makeHtmlBoard();
})