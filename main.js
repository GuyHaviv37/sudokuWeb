const createEmptyBoard = ()=>{
    const board = document.querySelector('.board');
        const tools = document.querySelector('#tools');
        for(let i=0;i<81;i++){
            let newInputBox = document.createElement('div');
            newInputBox.classList.add('inputBox');
            newInputBox.innerHTML = `
            <input type="number" max="9" min="0" id="${i}">
            <div class="hints">${i+1}</div>
            `;
            let input = newInputBox.querySelector('input');
            input.addEventListener('focus',(e)=>{
                //Open Dropdown keyboard
                document.querySelector('#tools').style.display = 'initial';
                //save input location. (GLOBAL VARIABLE)
            })
            input.addEventListener('blur',(e)=>{
                //Close Dropdown keyboard
                document.querySelector('#tools').style.display = 'none';
                //clear input location ?
            })
            board.append(newInputBox);
        }
        for(let i=0;i<=9;i++){
            let newButton = document.createElement('button');
            newButton.classList.add('number-button');
            newButton.innerText = i;
            // ADD EVENT LISTENER
            tools.append(newButton)
        }
}

const initGame = (diff)=>{
    container.innerHTML = `
    <div class="board">
    </div>
    <div id="tools">
    </div>
    `;
    createEmptyBoard();
}