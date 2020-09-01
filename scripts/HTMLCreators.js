const container = document.querySelector('.container');
let selectedInput;

const playGameEventListener = ()=>{
    const playGameBtn = document.querySelector('#play-game');
    playGameBtn.remove();
    createDifficultyBtns(); 
}

const createDifficultyBtns = ()=>{
    const difficulties = ['Easy','Regular','Hard'];
    for(let diff of difficulties){
        let btn = document.createElement('button');
        btn.innerText = diff;
        btn.value = diff;
        btn.classList.add('menuBtn');
        btn.addEventListener('click',()=>{
            initGame(diff);
        })
        container.append(btn);
    }
}

const createInputBoxBorders = (newInputBox,i)=>{
    // DEFAULT
    // newInputBox.style.border = '1px solid rgba(43, 42, 42, 0.3)';
    newInputBox.classList.add('border-all');
    // TOPS
    if( i%27>=0 && i%27<= 8){
        // newInputBox.style.borderTop = '2px solid black'
        newInputBox.classList.add('border-bold-top');
    }
    // RIGHTS
    if( i%3 === 2){
        // newInputBox.style.borderRight = '2px solid black'
        newInputBox.classList.add('border-bold-right');
    }
    // LEFTS
    if(i%9 === 0){
        // newInputBox.style.borderLeft = '2px solid black'
        newInputBox.classList.add('border-bold-left');
    }
    // BOTTOMS
    if(i>=72 && i<=80){
        // newInputBox.style.borderBottom = '2px solid black'
        newInputBox.classList.add('border-bold-bottom');
    }
    
}


const createInputBoxes = (board)=>{
    for(let i=0;i<81;i++){
        let newInputBox = document.createElement('div');
        newInputBox.classList.add('inputBox');
        newInputBox.innerHTML = `
        <input type="number" max="9" min="0" id="${i}" readonly>
        <!-- <div class="hints">${i}</div> -->
        `;
        createInputBoxBorders(newInputBox,i);
        let input = newInputBox.querySelector('input');
        input.addEventListener('focus',(e)=>{
            //Open Dropdown keyboard
            if(selectedInput){
                selectedInput.parentElement.classList.remove('selected')
            }
            document.querySelector('.keyboard').style.display = 'grid';
            //save input location. (GLOBAL VARIABLE)
            selectedInput = e.target;
            selectedInput.parentElement.classList.add('selected')
            //clear ui-messages
            document.querySelector('#ui-messages').innerText = '';
        })
        // input.addEventListener('blur',(e)=>{
        //     Close Dropdown keyboard - SHOULD MOVE TO AFTER KEYBOARD CLIICK
        //     document.querySelector('.keyboard').style.display = 'none';
        //     clear input location ? (maybe when clicking the body and prevent propagation)
        // })
        board.append(newInputBox);
    }
}

const createNumberButtons = (parent)=>{
    for(let i=1;i<=9;i++){
        let numberBtn = document.createElement('button');
        numberBtn.classList.add('number-button');
        numberBtn.innerText = i;
        numberBtn.value = i;
        // EVENT LISTENER
        numberBtn.addEventListener('click',function(e){
            if(checkParseFixed(selectedInput.id)){
                document.querySelector('#ui-messages').innerText = "Can't change a fixed cell";
                return;
            }
            // Front-End
            let value = this.value;
            parseInput(selectedInput.id,value);
            selectedInput.value = Number(value);
            //parent.style.display = 'none'; KEYBOARD DISAPPEAR ?
            if(isGameOver(gameBoard)){
                // SUCCESS MESSAGE + RESET OPTIONS ONLY (Maybe an alert ??);
                setTimeout(()=>{
                    if(confirm('Congratulations! You finished the puzzle. Click OK to play a new game.')){
                        main();
                    } 
                },200)
            }
        }.bind(numberBtn))
        parent.append(numberBtn)
    }
}

const createClearButton = (parent)=>{
    let clearBtn = document.createElement('button');
    clearBtn.id = "clear-button";
    clearBtn.innerText = 'Clear';
    // EVENT LISTENER;
    clearBtn.addEventListener('click',function(e){
        if(checkParseFixed(selectedInput.id)){
            document.querySelector('#ui-messages').innerText = "Can't change a fixed cell";
            return;
        }   
        // Front-end
        selectedInput.value = '';
        //parent.style.display = 'none'; KEYBOARD DISAPPEAR ?
        // Back-end
        parseInput(selectedInput.id,0);
    });
    parent.append(clearBtn)
}

const createHintButton = (parent)=>{
    let hintBtn = document.createElement('button');
    hintBtn.id = "hint-button";
    hintBtn.innerText = "Hint";
    hintBtn.addEventListener('click',(e)=>{
        // DO I WANT TO VALIDATE AND GET A NEW SOLVED BOARD OR NOT ??
        // if(validateBoard(gameBoard,solvedBoard)){
        //     let cellID = Number(selectedInput.id)
        //     let row = Math.floor(cellID / ROW_DIM);
        //     let col = cellID % COL_DIM;
        //     selectedInput.value = solvedBoard[row][col].value;
        //     parent.style.display = 'none';
        // } else{
        //     console.log('BOARD NOT SOLVABLE');
        // }
        let cellID = Number(selectedInput.id)
        let row = Math.floor(cellID / ROW_DIM);
        let col = cellID % COL_DIM;
        selectedInput.value = solvedBoard[row][col].value;
        gameBoard[row][col].value = solvedBoard[row][col].value;
        //parent.style.display = 'none'; KEYBOARD DISAPPEAR ?
        if(isGameOver(gameBoard)){
            // SUCCESS MESSAGE + RESET OPTIONS ONLY (Maybe an alert ??);
            setTimeout(()=>{
                if(confirm('Congratulations! You finished the puzzle. Click OK to play a new game.')){
                    main();
                } 
            },200)
        }
    })
    parent.append(hintBtn);
}

const createValidateButton = (parent)=>{
    let validateBtn = document.createElement('button');
    validateBtn.id = "validate-button";
    validateBtn.innerText = "Validate Board";
    validateBtn.classList.add('tools-button');
    validateBtn.addEventListener('click',(e)=>{
        const ui = document.querySelector('#ui-messages');
        if(validateBoard(gameBoard,solvedBoard)){
            ui.innerText = 'Board is Solvable';
        } else {
            ui.innerText = 'Board is Not Solvable';
        }
    })
    parent.append(validateBtn);
}

const createResetButton = (parent)=>{
    const container = document.querySelector('.container');
    container.classList.remove('container-game');
    let resetBtn = document.createElement('button');
    resetBtn.id = "reset-button";
    resetBtn.innerText = "Reset Game";
    resetBtn.classList.add('tools-button');
    resetBtn.addEventListener('click',(e)=>{
        const container = document.querySelector('.container');
        container.innerHTML = `
        <button id="play-game" class="menuBtn">PLAY GAME</button>
        `;
        const playBtn = container.querySelector('#play-game');
        playBtn.addEventListener('click',playGameEventListener);
    })
    parent.append(resetBtn);
}



const createHTMLBoard = ()=>{
    const board = document.querySelector('.board');
    const keyboard = document.querySelector('.keyboard');
    const tools = document.querySelector('#tools');
    createInputBoxes(board);
    createResetButton(tools);
    createValidateButton(tools); // will move this to different div; (manage sidebar);
    createHintButton(keyboard);
    createNumberButtons(keyboard);
    createClearButton(keyboard);
}

const showBoard = (gameBoard)=>{
    for(let i=0;i<ROW_DIM;i++){
        for(let j=0;j<COL_DIM;j++){
            let cellID = i*COL_DIM + j;
            let input = document.getElementById(cellID.toString())
            input.value = gameBoard[i][j].value > 0 ? gameBoard[i][j].value : '';
        }
    }
}