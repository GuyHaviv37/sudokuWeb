const ROW_DIM = 9;
const COL_DIM = 9;
const EASY_MODE = 50;
const REG_MODE = 35;
const HARD_MODE = 25;
class Cell{
    constructor(value){
        this.value = value;
        this.fixed = false;
    }
}
const gameBoard = createEmptyBoard();
const solvedBoard = createEmptyBoard();



// PARSING
const parseInput = (cellID,value)=>{
    let row = Math.floor(cellID / ROW_DIM);
    let col = cellID % COL_DIM;
    gameBoard[row][col].value = Number(value); // string or Number ??
}

// AUX
function createEmptyBoard(){
    const board = []
    for(let i=0;i<ROW_DIM;i++){
        board.push([]);
        for(let j=0;j<COL_DIM;j++){
            board[i].push(new Cell(0)) //change to Cell Object
        }
    }
    return board;
}

const clearBoard = (board)=>{
    for(let i=0;i<ROW_DIM;i++){
        for(let j=0;j<COL_DIM;j++){
            board[i][j].value = 0;
            board[i][j].fixed = false; 
        }
    }
}

const findEmptyCell = (gameBoard)=>{
    for(let i=0;i<ROW_DIM;i++){
        for(let j=0;j<COL_DIM;j++){
            if(gameBoard[i][j].value === 0 && !gameBoard[i][j].fixed){
                return [i,j];
            }
        }
    }
    return ['NA','NA']
}

const copyBoards = (oldBoard,newBoard)=>{
    for(let i=0;i<ROW_DIM;i++){
        for(let j=0;j<COL_DIM;j++){
            newBoard[i][j].value = oldBoard[i][j].value;
            newBoard[i][j].fixed = oldBoard[i][j].fixed;
        }
    }
}

const fixCells = (board,diff)=>{
    let toFix = diff === 'Easy' ? EASY_MODE : diff === 'Regular' ? REG_MODE : HARD_MODE;
    while(toFix > 0){
        let randRow = Math.floor(Math.random()*9);
        let randCol = Math.floor(Math.random()*9);
        if(!board[randRow][randCol].fixed){
            board[randRow][randCol].fixed = true;
            toFix--;
        }
    }
}

const clearUnfixed = (board)=>{
    for(let i=0;i<ROW_DIM;i++){
        for(let j=0;j<COL_DIM;j++){
            if(!board[i][j].fixed){
                board[i][j].value = 0;
            }
        }
    }
}

// VALIDATORS

const isValidRow = (board,row,value)=>{
    if(value === 0) return true;
    for(let j=0;j<COL_DIM;j++){
        if(board[row][j].value === value) return false;
    }
    return true;
}

const isValidCol = (board,col,value)=>{
    if(value === 0) return true;
    for(let i=0;i<ROW_DIM;i++){
        if(board[i][col].value === value) return false;
    }
    return true;
}

const isValidBlock = (board,row,col,value)=>{
    let rowStart = Math.floor(row / 3) * 3;
    let rowEnd = rowStart + 2;
    let colStart = Math.floor(col / 3) * 3;
    let colEnd = colStart + 2;
    if(value === 0) return true;
    for(let i=rowStart;i<=rowEnd;i++){
        for(let j=colStart;j<=colEnd;j++){
            if(board[i][j].value === value) return false;
        }
    }
    return true;
}
const isValidInput = (board,row,col,value)=>{
    let currentValue = board[row][col].value;
    board[row][col].value = 0;
    const valid = (isValidRow(board,row,value) && isValidCol(board,col,value) && isValidBlock(board,row,col,value))
    board[row][col].value = currentValue;
    return valid;
}

const validateBoard = (gameBoard,solvedBoard)=>{
    const tempBoard = createEmptyBoard();
    copyBoards(gameBoard,tempBoard);
    if(btSolve(tempBoard)){
        copyBoards(solvedBoard,tempBoard);
        return true;
    }
    return false;
}

// SOLVERS
const randSolve = (board)=>{
    let [emptyRow,emptyCol] = findEmptyCell(board);
    if(emptyRow==='NA' || emptyCol==='NA'){
        return 1; // board is solved, no more empty cells
    }
    const validNumbers = [];
    // collect valid numbers for this spot
    for(let value = 1; value <=9 ; value++){
        if(isValidInput(board,emptyRow,emptyCol,value)){
            validNumbers.push(value);
        }
    }
    // while there are valid numbers
    while(validNumbers.length > 0){
        // randomly pick one of those (save it)
        let randIndex = Math.floor(Math.random()*validNumbers.length);
        let pickedNumber = validNumbers[randIndex];
        // assign the cell to it
        board[emptyRow][emptyCol].value = pickedNumber;
        // try randSolve with new board - if good return 1
        if(randSolve(board)) return 1;
        // if no good - remove number picked from valid numbers
        validNumbers.splice(validNumbers.indexOf(pickedNumber),1);
        // clear cell
        board[emptyRow][emptyCol].value = 0;
    }
    return 0;
}
const btSolve = (board)=>{
    let [emptyRow,emptyCol] = findEmptyCell(board);
    if(emptyRow==='NA' || emptyCol==='NA'){
        return 1; // board is solved, no more empty cells
    }
    for(let i=1;i<=9;i++){ //try every valid input
        if(isValidInput(board,emptyRow,emptyCol,i)){
            board[emptyRow][emptyCol].value = i;
            if(btSolve(board)) return 1;
        }
        // board was not solved, reset this cell and try next number
        board[emptyRow][emptyCol].value = 0; 
    }
    return 0;
}


