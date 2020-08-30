/*
Board generating is reliant upon : https://www.sudokuoftheday.com/about/difficulty/
*/
const ROW_DIM = 9;
const COL_DIM = 9;
const EASY_MODE = 22;
const REG_MODE = 17;
const HARD_MODE = 12;
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
    // if(isValidInput(gameBoard,row,col,Number(value))){ // should I validate ?
    //     gameBoard[row][col].value = Number(value); // string or Number ??
    //     return true;
    // }
    // return false;
    gameBoard[row][col].value = Number(value);
}

const checkParseFixed = (cellID)=>{
    let row = Math.floor(cellID / ROW_DIM);
    let col = cellID % COL_DIM;
    if(gameBoard[row][col].fixed){
        return true;
    }
    return false;
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

const swapRows = (board,rowA,rowB)=>{
    for(let j=0;j<COL_DIM;j++){
        //SWAP;
        let temp = board[rowA][j].value;
        board[rowA][j].value = board[rowB][j].value;
        board[rowB][j].value = temp;
    }
}

const swapCols = (board,colA,colB)=>{
    for(let i=0;i<ROW_DIM;i++){
        //SWAP;
        let temp = board[i][colA].value;
        board[i][colA].value = board[i][colB].value;
        board[i][colB].value = temp;
    }
}

const randomizeBoard = (board)=>{
    const rowSwaps = Math.floor(Math.random()*8);
    const colSwaps = Math.floor(Math.random()*8);
    for(let i=0;i<rowSwaps;i++){
        let randBlock = Math.floor(Math.random()*3);
        let randRowA = Math.floor(Math.random()*3);
        let randRowB = Math.floor(Math.random()*3);
        // SWAP ROWS OF SAME BLOCK
        swapRows(board,randBlock*3 + randRowA,randBlock*3 + randRowB);
    }
    for(let i=0;i<colSwaps;i++){
        let randBlock = Math.floor(Math.random()*3);
        let randColA = Math.floor(Math.random()*3);
        let randColB = Math.floor(Math.random()*3);
        // SWAP COLUMNS OF SAME BLOCK
        swapRows(board,randBlock*3 + randColA,randBlock*3 + randColB);
    }
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
    let pairsToFix = diff === 'Easy' ? EASY_MODE : diff === 'Regular' ? REG_MODE : HARD_MODE;
    while(pairsToFix > 0){
        let randRow = Math.floor(Math.random()*ROW_DIM);
        let randCol = Math.floor(Math.random()*COL_DIM);
        if(randRow === 4 && randCol === 4) continue; // You can always remove the middle cell (no Rot. Counterpart)
        if(!board[randRow][randCol].fixed){
            // Calculate random cell's rotational counterpart and fix him as well.
            let rotCounterRow = (ROW_DIM-1) - randRow;
            let rotCounterCol = (COL_DIM-1) - randCol;
            // Back-end
            board[randRow][randCol].fixed = true;
            board[rotCounterRow][rotCounterCol].fixed = true;
            // Front-end
            let randCellID = randRow * COL_DIM + randCol;
            let rotCounterCellID = rotCounterRow * COL_DIM + rotCounterCol;
            let inputA = document.getElementById(randCellID.toString())
            let inputB = document.getElementById(rotCounterCellID.toString())
            inputA.classList.add('fixed');
            inputB.classList.add('fixed');
            pairsToFix--;
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
    const [emptyRow,emptyCol] = findEmptyCell(gameBoard);
    if((emptyRow==='NA' || emptyCol==='NA')){
        return confirmSolution(gameBoard);
    }
    const tempBoard = createEmptyBoard();
    copyBoards(gameBoard,tempBoard);
    if(btSolve(tempBoard)){
        copyBoards(tempBoard,solvedBoard);
        return true;
    }
    return false;
}

// CONFIRMERS
const isGameOver = (gameBoard,cellID,value)=>{
    const [emptyRow,emptyCol] = findEmptyCell(gameBoard);
    if((emptyRow==='NA' || emptyCol==='NA') && confirmSolution(gameBoard)){
        return true;
    }
    return false;
}

const confirmRows = (board)=>{
    for(let i=0;i<ROW_DIM;i++){
        let rowSet = new Set();
        for(let j=0;j<COL_DIM;j++){
            if(!rowSet.has(board[i][j].value)) rowSet.add(board[i][j].value)
            else return false;
        }
    }
    return true;
}
const confirmCols = (board)=>{
    for(let j=0;j<COL_DIM;j++){
        let colSet = new Set();
        for(let i=0;i<ROW_DIM;i++){
            if(!colSet.has(board[i][j].value)) colSet.add(board[i][j].value)
            else return false;
        }
    }
    return true;
}
const confirmBlocks = (board)=>{
    for(let k=0;k<9;k++){
        let blockSet = new Set();
        // rows : Math.floor(blockNum/3)
        // cols : blockNum % 3  - blockNum%3 + 2
        let rowStart = Math.floor(k/3) * 3;
        let colStart = k%3 * 3;
        for(let i=rowStart;i<rowStart+3;i++){
            for(let j=colStart;j<colStart+3;j++){
                if(!blockSet.has(board[i][j].value)) blockSet.add(board[i][j].value)
                else return false;
            }
        }
    }
    return true;
}

const confirmSolution = (board)=>{
    if(confirmRows(board) && confirmCols(board) && confirmBlocks(board)){
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



