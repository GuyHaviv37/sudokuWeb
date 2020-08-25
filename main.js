const initGame = (diff)=>{
    container.classList.add('container-game');
    container.innerHTML = `
    <div class="board-container">
    <div class="board">
    </div>
    <div id="sidebar">
        <div id="tools">
        </div>
        <div id="keyboard">
        </div>
    </div>
    </div>
    `;
    createHTMLBoard();
    clearBoard(gameBoard);
    randSolve(gameBoard);
    copyBoards(gameBoard,solvedBoard);
    fixCells(gameBoard,diff);
    clearUnfixed(gameBoard);
    showBoard(gameBoard);
}

