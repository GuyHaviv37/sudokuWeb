const main = ()=>{
    const container = document.querySelector('.container');
    container.innerHTML = `
    <button id="play-game" class="menuBtn">Play Game</button>
    `;
    const playBtn = container.querySelector('#play-game');
    playBtn.addEventListener('click',playGameEventListener);
}

const initGame = (diff)=>{
    container.classList.add('container-game');
    container.innerHTML = `
    <div class="board-container">
    <div class="board">
    </div>
    <div id="sidebar">
        <div id="tools">
        </div>
        <div class="keyboard">
        </div>
        <div id="ui-messages">
        </div>
    </div>
    </div>
    `;
    createHTMLBoard();
    clearBoard(gameBoard);
    randSolve(gameBoard);
    randomizeBoard(gameBoard);
    copyBoards(gameBoard,solvedBoard);
    fixCells(gameBoard,diff);
    clearUnfixed(gameBoard);
    showBoard(gameBoard);
}

main();

