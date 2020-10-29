/* Created by GazerSuthy 2020-10-18 */

//DOM Caches
let popButton = document.querySelector('.pop-button');
let cancelButton = document.querySelector('.cancel');
let introOverlay = document.querySelector('.intro-overlay');
let outroOverlay1 = document.querySelector('.outro-overlay-1');
let outroOverlay2 = document.querySelector('.outro-overlay-2');
let drawScreen = document.querySelector('.draw');
let column_divs = document.querySelectorAll('.column');

//game class
class Connect4{
    constructor(columns){
        this.columns = columns;
        this.id = {
            'zero':0, 'one':1, 'two':2, 'three':3, 'four':4, 'five':5, 'six':6
        }
        this.rowMax = 6;
        this.colMax = 7;
        this.dropDelay = {0:600, 1:580, 2:520, 3:460, 4:420, 5:380};
        this.currentAnimationDelay = 600;
        this.busyAnimating = false;
        this.turnCount = 0;       
        this.previousPlayerWon = null;
        this.previousDraw = null;
        this.gameModePop = false;
        this.score = {'red':0,'yellow':0};
    }

    startGame(){
        this.playerTurn = {'red':false, 'yellow':false};
        this.playerWon = {'red':false, 'yellow':false};
        this.board = [
            //0 - indicates free slot, 1 - indicates red, 2 - indicates yellow  *[board is rotated right]
            [0,0,0,0,0,0],
            [0,0,0,0,0,0],
            [0,0,0,0,0,0],
            [0,0,0,0,0,0],
            [0,0,0,0,0,0],
            [0,0,0,0,0,0],
            [0,0,0,0,0,0],
        ]
        this.resetBoard();
        this.connect4Cords = [];
        //popState used to differentiate between when a player want's to place a chip or pop a chip
        this.popState = false;
        popButton.classList.remove('appear');

        //if this is a replayed game state, remove win animation effects of previous round
        if(this.previousPlayerWon != null){
            //remove highlight class which makes the winning chip's blink
            let redchips = document.querySelectorAll('.winning-match-red');
            let yellowchips = document.querySelectorAll('.winning-match-yellow');
            redchips.forEach((chip)=>{
                chip.classList.remove('winning-match-red','highlight');
            })
            yellowchips.forEach((chip)=>{
                chip.classList.remove('winning-match-yellow','highlight');
            })

            //remove ghost chip shadows
            this.columns.forEach(column=>{
                let ghostChipRed = column.getElementsByClassName('ghost-chip red');
                ghostChipRed[0].classList.remove('visible');
                let ghostChipYellow = column.getElementsByClassName('ghost-chip yellow');
                ghostChipYellow[0].classList.remove('visible');
            })
        
            //remove outro overlay colour
            if(this.gameModePop == false){
                outroOverlay1.classList.remove(`${this.previousPlayerWon}`);
            }else{
                outroOverlay2.classList.remove(`${this.previousPlayerWon}`);
            }
        }
        //pick's a player to go first 
        this.currentPlayer = this.randomPlayer();    
    }

    clickedColumn(column){
        //check to see if clicked column is not full
        this.availableColumn = this.checkColumn(column);

        if(this.availableColumn == true && this.busyAnimating == false){
            this.row = this.findEmptySpot(column); 
            //updates both this.board (matrix) and grapical board
            if(this.currentPlayer == 'red'){
                this.updateBoard('red',column,this.row,1);
            }else{
                this.updateBoard('yellow',column,this.row,2);
            }
        }
    }

    updateBoard(player,column,row,token){
        //updates chip in matrix 
        this.board[this.id[column.id]][row] = token;

        //adds dropping chip animation for player's move
        let chipDrop = column.querySelector('.dropper');
        chipDrop.classList.add(player,`row-${row}`);
        this.currentAnimationDelay = this.dropDelay[row];
        this.busyAnimating = true;

        //animationDelay is an async function that keep's track of the animation delay, callback is used to "pause" compiler
        this.animationDelay(()=>{   
            /*  
                Without callback the drop animation occur's but chip's doesn't get updated. This is because while the browser is keeping 
                track of the delay, the callstack has already finished compiling the code. With a callback, it pushes a function onto the 
                callstack where the function retrieve's the data from the async function. The callstack is forced to wait until it get's a 
                response from the async function. 
            */

            //update chip on GUI (Graphical board)
            chipDrop.classList.remove(player,`row-${row}`);
            let rowsArray = column.getElementsByClassName('row');
            //grapical board columns are reversed in perspective to matrix columns
            this.adjustedOrder = [5,4,3,2,1,0];
            rowsArray[this.adjustedOrder[row]].classList.add(player);

            //check if current player won
            if(this.turnCount >= 6){
                this.checkWin(player,token);
            }
            //switch turn's if player didn't win
            if(this.playerWon[player] == false){
                this.currentPlayer = this.switchTurn(player);
                this.turnCount++;
                if(this.gameModePop == true){
                    this.popOption();
                }
            }else{
                //win screen (pop game mode and original game mode have different win screen's)
                if(this.gameModePop == false){
                    let winner = document.querySelector('.originalWinner');
                    winner.innerHTML = player;
                    outroOverlay1.classList.add('appear',player);
                }else{
                    popButton.classList.remove('appear');
                    let winner = document.querySelector('.popWinner');
                    winner.innerHTML = player;
                    outroOverlay2.classList.add('appear',player);
                }
                //update score
                this.score[player]++;
                if(player == 'red'){
                    let score_location = document.getElementById('red-score-num');
                    score_location.innerHTML = this.score[player];
                }else{
                    let score_location = document.getElementById('yellow-score-num');
                    score_location.innerHTML = this.score[player];
                }
            }
            //boolean used to prevent other game functionalities from being triggered by user during the animations
            this.busyAnimating = false;
        });
    }

    //check's if player can pop a piece
    popOption(){
        let canPop = null;
        let currentValue = this.findValue();
       
        //if the player's colour chip is on the bottom row that he has option of popping instead of placing a chip
        for(let i = 0; i < this.colMax; i++){
            if(this.board[i][0] == currentValue){
                canPop = true;
            }
        }
        //show pop button
        if(canPop == true){
            popButton.classList.add('appear');
        }else{
            popButton.classList.remove('appear');
        }
    }

    //when user decide's that he want's to pop instead of placing chip
    popMode(){
        this.popState = true;
        popButton.classList.remove('appear');
        cancelButton.classList.add('appear');
        this.value = this.findValue();

        //shows which chips can be popped by player
        for(let i = 0; i < this.colMax; i++){
            if(this.board[i][0] == this.value){
                this.poppableChip = this.columns[i].getElementsByClassName('row');
                this.poppableChip[5].classList.add('poppable');
            }
        }
        //remove ghost shadow of a chip indicating the placing chip state
        this.columns.forEach(column=>{
            let ghostChip = column.getElementsByClassName(`ghost-chip ${this.currentPlayer}`);
            ghostChip[0].classList.remove('visible');
        })
    }

    //user decides he wants to place chip instead of popping
    cancelpopMode(){
        this.popState = false;
        //button disappear's and cancel button appears
        popButton.classList.add('appear');
        cancelButton.classList.remove('appear');

        //add back ghost shadow indicating placing chip state
        this.columns.forEach(column=>{
            let ghostChip = column.getElementsByClassName(`ghost-chip ${this.currentPlayer}`);
            ghostChip[0].classList.add('visible');
        })

        //remove's green glow of poppable chips
        for(let i = 0; i < this.colMax; i++){
            if(this.board[i][0] == this.value){
                let poppableChip = this.columns[i].getElementsByClassName('row');
                poppableChip[5].classList.remove('poppable');
            }
        }
    }

    //user click's a chip to be popped
    popColumn(column){
        //check to see if clicked column contain's a poppable piece (player's colour piece on the bottom row) 
        let validClick = this.checkColumn_toPop(column);
        if(validClick == false){
            return;
        }
        cancelButton.remove('appear');
        //remove green glow 
         for(let i = 0; i < this.colMax; i++){
            if(this.board[i][0] == this.value){
                let poppableChip = this.columns[i].getElementsByClassName('row');
                poppableChip[5].classList.remove('poppable');
            }
        }
       
        //stack store pieces in the column and than pop's off an element (front of stack is the bottom row of the column)
        let stack = [];
        for(let i = this.rowMax-1; i >= 0; i--){
            stack.push(this.board[this.id[column.id]][i]);
        }
        stack.pop();

        //fill in empty spaces formed at end of stack due to popped chip
        while(stack.length != this.rowMax){
            //unshift() add's to beginning of array 
            stack.unshift(0);  
        }

        //update matrix after column has been popped
        let j = 0;
        for(let i = this.rowMax-1; i>= 0; i--){
            this.board[this.id[column.id]][j] = stack[i];
            j++;
        }

        //update grapical board after column has been popped
        let redChips = Array.from(column.getElementsByClassName('row red'));
        let yellowChips = Array.from(column.getElementsByClassName('row yellow'));
        //remove all chip's in column
        redChips.forEach((chip)=>{
            chip.classList.remove('red');
        })
        yellowChips.forEach((chip)=>{
            chip.classList.remove('yellow');
        })

        //match grapical board with matrix 
        let rowsArray = column.getElementsByClassName('row');
        let k = 0;
        //DOM gives array in reverse order so we use k to adjust it
        for(let i = this.rowMax-1; i >= 0; i--){
            //add red chips
            if(this.board[this.id[column.id]][k] == 1){
                rowsArray[i].classList.add('red');
            //add yellow chips
            }else if(this.board[this.id[column.id]][k] == 2){
                rowsArray[i].classList.add('yellow');
            }
            k++;
        }
        
        //case were either player can win after a column has been popped 
        this.checkWin('red',1);
        this.checkWin('yellow',2);

        //draw from a pop
        if(this.playerWon['red'] == true && this.playerWon['yellow'] == true){
            this.previousDraw = true;
            //draw message
            drawScreen.classList.add('appear');
        //a player win from a pop
        }else if(this.playerWon['red'] == true || this.playerWon['yellow'] == true){
            let player;
            if(this.playerWon['red'] == true){
                player = 'red'
            }else{
                player = 'yellow'
            }

            //win message
            popButton.remove('appear')
            let winner = document.querySelector('.popWinner');
            winner.innerHTML = player;
            outroOverlay2.classList.add('appear',player);

            //update score
            this.score[player]++;
            if(player == 'red'){
                let score_location = document.getElementById('red-score-num');
                score_location.innerHTML = this.score[player];
            }else{
                let score_location = document.getElementById('yellow-score-num');
                score_location.innerHTML = this.score[player];
            }
        //switch turn after a pop
        }else{
            if(this.currentPlayer == 'red'){
                this.currentPlayer = 'yellow';
            }else{
                this.currentPlayer = 'red';
            }
    
            //add back ghost chip
            this.columns.forEach(column=>{
                let ghostChip = column.getElementsByClassName(`ghost-chip ${this.currentPlayer}`);
                ghostChip[0].classList.add('visible');
            })

            this.turnCount++;
            this.popOption();

            //set back to place chip state
            this.popState = false;
        }
    }

    checkColumn_toPop(column){
        let value = this.findValue();
        if(this.board[this.id[column.id]][0] == value){
            return true;
        }else{
            return false;
        }
    }

    //return's token value of current player
    findValue(){
        if(this.currentPlayer == 'red'){
            return 1;
        }else{
            return 2;
        }
    }

    //async javascript baby! didn't need promises cause wasn't returning data
    animationDelay(callback){
        setTimeout(()=>{
            callback();
        },this.currentAnimationDelay)
    }

    //check's all the possible win combination's 
    checkWin(player,token){
        this.playerToken = token;
       
        //check for horizontal win (horizontal based on matrix)
        for(let i = 0; i < this.colMax; i++){
            let consecutiveCounter = 0;
            for(let j = 0; j < this.rowMax; j++){
                if(this.board[i][j] == this.playerToken){
                    this.connect4Cords.push([i,j]);
                    consecutiveCounter++;
                }else{
                    //reset counter
                    consecutiveCounter = 0;
                    this.connect4Cords = [];
                }
                //connect 4
                if(consecutiveCounter == 4){
                    this.playerWon[player] = true;
                    this.previousPlayerWon = player;
                    //animation to show which chips made the connect 4
                    this.connect4Cords.forEach((coordinates)=>{
                        let getRows = this.columns[coordinates[0]].getElementsByClassName('row');
                        let chips = getRows[this.adjustedOrder[coordinates[1]]];
                        chips.classList.add(`winning-match-${player}`,'highlight');
                    })
                }
            }
        }
        //check for vertical win (vertical based on matrix)
        for(let i = 0; i < this.colMax; i++){
            let consecutiveCounter = 0;
            for(let j = 0; j < this.colMax; j++){
                if(this.board[j][i] == this.playerToken){
                    this.connect4Cords.push([j,i])
                    consecutiveCounter++;
                }else{
                    //reset counter
                    consecutiveCounter = 0;
                    this.connect4Cords = [];
                }
                //connect 4
                if(consecutiveCounter == 4){
                    this.playerWon[player] = true;
                    this.previousPlayerWon = player;
                    //animation to show which chips made the connect 4
                    this.connect4Cords.forEach((coordinates)=>{
                        let getRows = this.columns[coordinates[0]].getElementsByClassName('row');
                        let chips = getRows[this.adjustedOrder[coordinates[1]]];
                        chips.classList.add(`winning-match-${player}`,'highlight');
                    })
                }
            }
        }
        //check diagonal case 1 
        for(let k = 0; k < 3; k++){
            let consecutiveCounter = 0;
            for(let i = 0; i < this.colMax; i++){
                if(this.board[i][i+k] == this.playerToken){
                    consecutiveCounter++;
                    this.connect4Cords.push([i,i+k]);
                }else{
                    //reset counter
                    consecutiveCounter = 0;
                    this.connect4Cords = [];
                }
                //connect 4
                if(consecutiveCounter == 4){
                    this.playerWon[player] = true;
                    this.previousPlayerWon = player;
                    //animation to show which chips made the connect 4
                    this.connect4Cords.forEach((coordinates)=>{
                        let getRows = this.columns[coordinates[0]].getElementsByClassName('row');
                        let chips = getRows[this.adjustedOrder[coordinates[1]]];
                        chips.classList.add(`winning-match-${player}`,'highlight');
                    })
                }
            }
        }
        //check diagonal case 1 
        for(let k = 1; k <= 3; k++){
            let consecutiveCounter = 0;
            for(let i = 0; i < this.rowMax; i++){
                //makes sure the check's are within the matrix's bounds
                if((i+k) < this.colMax){
                    if(this.board[i+k][i] == this.playerToken){
                        consecutiveCounter++;
                        this.connect4Cords.push([i+k,i]);
                    }else{
                        //reset counter
                        consecutiveCounter = 0;
                        this.connect4Cords = [];
                    }
                    //connect 4
                    if(consecutiveCounter == 4){
                        this.playerWon[player] = true;
                        this.previousPlayerWon = player;
                        //animation to show which chips made the connect 4
                        this.connect4Cords.forEach((coordinates)=>{
                            let getRows = this.columns[coordinates[0]].getElementsByClassName('row');
                            let chips = getRows[this.adjustedOrder[coordinates[1]]];
                            chips.classList.add(`winning-match-${player}`,'highlight');
                        })
                    }
                }
            }
        }
        //check diagonal case 2 
        for(let k = 1; k <= 3; k++){
            let consecutiveCounter = 0;
            for(let i = 0; i < this.rowMax; i++){
                if(this.board[i][this.rowMax-k-i] == this.playerToken){
                    consecutiveCounter++;
                    this.connect4Cords.push([i,this.rowMax-k-i]);
                }else{
                    //reset counter
                    consecutiveCounter = 0;
                    this.connect4Cords = [];
                }
                //connect 4
                if(consecutiveCounter == 4){
                    this.playerWon[player] = true;
                    this.previousPlayerWon = player;
                    //animation to show which chips made the connect 4
                    this.connect4Cords.forEach((coordinates)=>{
                        let getRows = this.columns[coordinates[0]].getElementsByClassName('row');
                        let chips = getRows[this.adjustedOrder[coordinates[1]]];
                        chips.classList.add(`winning-match-${player}`,'highlight');
                    })
                }
            }
        }
        //check diagonal case 2 
        for(let k = 1; k <= 3; k++){
            let j = this.rowMax-1;
            let consecutiveCounter = 0;
            for(let i = 0; i < this.rowMax; i++){
                if((i+k) <= this.rowMax){
                    if(this.board[i+k][j] == this.playerToken){
                        consecutiveCounter++;
                        this.connect4Cords.push([i+k,j]);
                    }else{
                        consecutiveCounter = 0;
                        this.connect4Cords = [];
                    }
                    //connect 4
                    if(consecutiveCounter == 4){
                        this.playerWon[player] = true;
                        this.previousPlayerWon = player;
                        //animation to show which chips made the connect 4
                        this.connect4Cords.forEach((coordinates)=>{
                            let getRows = this.columns[coordinates[0]].getElementsByClassName('row');
                            let chips = getRows[this.adjustedOrder[coordinates[1]]];
                            chips.classList.add(`winning-match-${player}`,'highlight');
                        })
                    }
                    //every i increment we want to decrement j (that's the pattern)
                    j--;
                }
            }
        }
    }

    //find's the first avaliable row of a column
    findEmptySpot(column){
        for(let i = 0; i < this.rowMax; i++){
            if(this.board[this.id[column.id]][i] == 0){
                return i;
            }
        }
    }

    //check's to see if column is full
    checkColumn(column){
        if(this.board[this.id[column.id]][5] != 0){
            return false;
        }else{
            return true;
        }
    }

    switchTurn(player){
        if(player == 'red'){
            this.playerTurn['red'] = false;
            this.playerTurn['yellow'] = true;
            //change player ghostChip to indicate place chip state
            this.columns.forEach(column=>{
                let oldGhostChip = column.getElementsByClassName('ghost-chip red');
                oldGhostChip[0].classList.remove('visible');
                let newghostChip = column.getElementsByClassName('ghost-chip yellow');
                newghostChip[0].classList.add('visible');
            })
            return 'yellow';
        }else{
            this.playerTurn['red'] = true;
            this.playerTurn['yellow'] = false;
            //change player ghostChip to indicate place chip state
            this.columns.forEach(column=>{
                let oldGhostChip = column.getElementsByClassName('ghost-chip yellow');
                oldGhostChip[0].classList.remove('visible');
                let newghostChip = column.getElementsByClassName('ghost-chip red');
                newghostChip[0].classList.add('visible');
            })
            return 'red';
        }
    }

    //chooses random player to start
    randomPlayer(){
        let num = Math.floor(Math.random()*2);
        if(num == 0){
            this.playerTurn['red'] = true;
            //add player's chip shadow
            this.columns.forEach(column=>{
                let ghostChip = column.getElementsByClassName('ghost-chip red');
                ghostChip[0].classList.add('visible');
            })
            return 'red';
        }else{
            this.playerTurn['yellow'] = true;
            //add player's chip shadow
            this.columns.forEach(column=>{
                let ghostChip = column.getElementsByClassName('ghost-chip yellow');
                ghostChip[0].classList.add('visible');
            })
            return 'yellow';
        }
    }

    //remove's red and yellow chips from the grapical board
    resetBoard(){
        let redChips = document.querySelectorAll('.row.red');
        let yellowChips = document.querySelectorAll('.row.yellow');
        redChips.forEach((chip)=>{
            chip.classList.remove('red');
        })
        yellowChips.forEach((chip)=>{
            chip.classList.remove('yellow');
        })
    }
}

//game logic 
function connect4(){
    let game = new Connect4(column_divs);
    
    //intro overlay options
    document.querySelector('.Original').addEventListener('click',()=>{
        introOverlay.classList.add('hide');
        game.startGame();
    })

    document.querySelector('.pop').addEventListener('click',()=>{
        introOverlay.classList.add('hide');
        game.startGame();
        game.gameModePop = true;
    })
    
    //outro overlay 1 options
    document.querySelector('.playAgain-original').addEventListener('click',()=>{
        outroOverlay1.classList.remove('appear');
        game.startGame();
        game.gameModePop = false;
    })

    document.querySelector('.play-pop').addEventListener('click',()=>{
        outroOverlay1.classList.remove('appear');
        game.startGame();
        game.gameModePop = true;
    })

    //outro overlay 2 options
    document.querySelector('.playAgain-pop').addEventListener('click',()=>{
        outroOverlay2.classList.remove('appear');
        game.startGame();
        game.gameModePop = true;
    })

    document.querySelector('.play-original').addEventListener('click',()=>{
        outroOverlay2.classList.remove('appear');
        game.startGame();
        game.gameModePop = false;
    })

    //draw options
    document.querySelector('.draw-playAgain').addEventListener('click',()=>{
        drawScreen.classList.remove('appear');
        game.startGame();
        game.gameModePop = true;
    })

    document.querySelector('.draw-original').addEventListener('click',()=>{
        drawScreen.classList.remove('appear');
        game.startGame();
        game.gameModePop = false;
    })

    //when you click pop button
    popButton.addEventListener('click',()=>{
        game.popMode();
    })

    //when you click cancel button
    cancelButton.addEventListener('click',()=>{
        game.cancelpopMode();
    })

    //player select's a column to either place a chip or pop a chip
    column_divs.forEach( column =>{
        column.addEventListener('click',()=>{
            if(game.popState == true){
                game.popColumn(column);
            }else{
                game.clickedColumn(column);
            }
        });
    })
}

connect4();

/*  
    Error: {function does not exist} 
        - was stacking event listener's (setting a event listener within an event listener)
    
        solution: Instead of adding an eventlistener in the class which was intially triggered by an eventlistener which creates 
        a "calling eventlistener" where the game logic get's messy since eventlistener's use browser memory and javascript function's 
        use the call stack. That's why I got function does not exist error because of the order of execution. 
        **[Browser memory wait's till call stack is free]**.
        Therefore split up the eventlister in the "main" with code linking between them. Also, don't put your entire game in a class, 
        only the [functionality of the game mechanics] should be in the class. Let the main handle the **linking** of functionality 
        between game mechanics.
        code:
        document.querySelector('.Original').addEventListener('click',()=>{
            introOverlay.classList.add('hide');
            game.startGame_Original(); <- in function there is another event listener
        })
        startGame_Original(){
            this.columns.forEach(column => {
            column.addEventListener('click',this.clickedColumn);
        }); 
        }
*/