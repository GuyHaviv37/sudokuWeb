const container = document.querySelector('.container');
const playGameBtn = document.querySelector('#play-game');
let selectedInput;

playGameBtn.addEventListener('click',()=>{
    playGameBtn.remove();
    createDifficultyBtns();
})

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

const createInputBoxes = (board)=>{
    for(let i=0;i<81;i++){
        let newInputBox = document.createElement('div');
        newInputBox.classList.add('inputBox');
        newInputBox.innerHTML = `
        <input type="number" max="9" min="0" id="${i}" readonly>
        <div class="hints">${i}</div>
        `;
        let input = newInputBox.querySelector('input');
        input.addEventListener('focus',(e)=>{
            //Open Dropdown keyboard
            document.querySelector('#keyboard').style.display = 'flex';
            //save input location. (GLOBAL VARIABLE)
            selectedInput = e.target;
        })
        // input.addEventListener('blur',(e)=>{
        //     Close Dropdown keyboard - SHOULD MOVE TO AFTER KEYBOARD CLIICK
        //     document.querySelector('#keyboard').style.display = 'none';
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
            // Front-End
            selectedInput.value = Number(this.value);
            parent.style.display = 'none';
            parseInput(selectedInput.id,selectedInput.value);
        }.bind(numberBtn))
        parent.append(numberBtn)
    }
}

const createClearButton = (parent)=>{
    let clearBtn = document.createElement('button');
    clearBtn.id = "clear-button";
    clearBtn.innerText = 'CLEAR';
    // EVENT LISTENER;
    clearBtn.addEventListener('click',function(e){
        // Front-end
        selectedInput.value = '';
        parent.style.display = 'none';
        // Back-end
        parseInput(selectedInput.id,0);
    });
    parent.append(clearBtn)
}

const createValidateButton = (parent)=>{
    let validateBtn = document.createElement('button');
    validateBtn.id = "validate-button";
    validateBtn.innerText = "Validate Board";
    validateBtn.addEventListener('click',(e)=>{
        console.log(validateBoard(gameBoard,solvedBoard));
    })
    parent.append(validateBtn);
}

const createHTMLBoard = ()=>{
    const board = document.querySelector('.board');
    const keyboard = document.querySelector('#keyboard');
    const tools = document.querySelector('#tools');
    createInputBoxes(board);
    createValidateButton(tools); // will move this to different div; (manage sidebar);
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