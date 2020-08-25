const container = document.querySelector('.container');
const playGameBtn = document.querySelector('#play-game');

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