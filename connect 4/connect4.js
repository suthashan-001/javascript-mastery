/* Created by GazerSuthy 2020-10-18 */
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
        
    }

    startGame_Original(){
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
        //stores the connect 4 coordinates
        this.connect4Cords = [];
        //decides who goes first and adds the player's drop chip
        this.randomPlayer();
    }

    //functionality when player click's a column
    clickedColumn(column){
        //check to see whether column is full or not
        this.validColumn = this.checkColumn(column);

        if(this.validColumn == true && this.busyAnimating == false){
            //locates the row's index number where the chip will go
            this.row = this.findSpot(column); 
            //update board
            if(this.playerTurn['red'] == true){
                this.updateBoard('red',column,this.row);
            }else{
                this.updateBoard('yellow',column,this.row);
            }
        }
    }

    //updates the game board based on the player's move
    updateBoard(player,column,row){
        //store move in matrix
        if(player == 'red'){
            this.board[this.id[column.id]][row] = 1;
        }else{
            this.board[this.id[column.id]][row] = 2;
        }

        //add chip drop animation for player's move
        this.dropperDiv = column.querySelector('.dropper');
        this.dropperDiv.classList.add(player,`row-${row}`);
        this.currentAnimationDelay = this.dropDelay[row];
        this.busyAnimating = true;

        //animationDelay keep's track of the delay and a callback is used to execute the code ("place chip") after the delay
        this.animationDelay(()=>{   
            /*  Without callback the drop animation occur's but chip's doesn't get updated in the appropriate posistion
                With a callback the chip's get updated
            */
            this.dropperDiv.classList.remove(player,`row-${row}`);
            this.rowsArray = column.getElementsByClassName('row');
            //the row element's grabbed from the dom are in reverse order compared to our convention with the board so adjust the order
            this.adjustedOrder = [5,4,3,2,1,0];
            //change's colour of the hole based on the player (from white to red)
            this.rowsArray[this.adjustedOrder[row]].classList.add(player);

            //check if player won after making move 
            if(this.turnCount >= 6){
                this.checkWin(player);
            }

            //if current player did not win, switch player turn's
            if(this.playerWon[player] == false){
                this.switchTurn(player);
                this.turnCount++;
            }else{
                this.showConnect4(()=>{
                    // this.resetBoard();
                    //connect 4 coord's are empty
                    this.connect4Cords.forEach((coordinates)=>{
                        coordinates.classList.add(player);
                    })
                })
                this.resultPage(()=>{
                    //win message
                    this.winOverlay = document.querySelector('.outro-overlay');
                    this.winner = document.querySelector('.player');
                    this.winner.innerHTML = player;
                    this.winner.style.color = `'${player}'`;
                    this.winOverlay.classList.add('appear',player);
                })
            }
            this.busyAnimating = false;
        });

        
    }

    //game will pause and show the connect 4
    showConnect4(callback){
        setTimeout(()=>{
            callback();
        },1000)
    }

    //after showing the connect 4 the game will exit to outro screen
    resultPage(callback){
        setTimeout(()=>{
            callback();
        },3000)
    }

    animationDelay(callback){
        //understand how this works
        setTimeout(()=>{
            callback();
        },this.currentAnimationDelay)
    }

    checkWin(player){
        this.playerToken = 0;
        if(player == 'red'){
            this.playerToken = 1;
        }else{
            this.playerToken = 2;
        }
        //check for horizontal win (horizontal based on board array)
        for(let i = 0; i < this.colMax; i++){
            this.consecutiveCounter = 0;
            for(let j = 0; j < this.rowMax; j++){
                if(this.board[i][j] == this.playerToken){
                    this.connect4Cords.push([i,j]);
                    this.consecutiveCounter++;
                }else{
                    //reset counter
                    this.consecutiveCounter = 0;
                    this.connect4Cords = [];
                }
                //if consecutive counter = 4 then there is a connect 4
                if(this.consecutiveCounter == 4){
                    this.playerWon[player] = true;
                }
            }
        }
        //check for vertical win
        for(let i = 0; i < this.colMax; i++){
            this.consecutiveCounter = 0;
            for(let j = 0; j < this.rowMax; j++){
                if(this.board[j][i] == this.playerToken){
                    this.connect4Cords.push([j,i])
                    this.consecutiveCounter++;
                }else{
                    //reset counter
                    this.consecutiveCounter = 0;
                    this.connect4Cords = [];
                }
                //if consecutive counter = 4 then there is a connect 4
                if(this.consecutiveCounter == 4){
                    this.playerWon[player] = true;
                }
            }
        }
        //check diagonal case 1 (diagonal's left of middle - going from bottom left to top right)
        for(let k = 0; k < 3; k++){
            //k check's the middle diagonal and the diagonal's left to the middle that are capable of getting a connect 4
            this.consecutiveCounter = 0;
            for(let i = 0; i < this.colMax; i++){
                if(this.board[i][i+k] == this.playerToken){
                    this.consecutiveCounter++;
                    this.connect4Cords.push([i,i+k]);
                }else{
                    //reset counter
                    this.consecutiveCounter = 0;
                    this.connect4Cords = [];
                }
                //if consecutive counter = 4 then there is a connect 4
                if(this.consecutiveCounter == 4){
                    this.playerWon[player] = true;
                }
            }
        }
        //check diagonal case 1 (diagonal's right of middle)
        for(let k = 1; k <= 3; k++){
            //k is the patterned increment that check's the right diagonal's
            this.consecutiveCounter = 0;
            for(let i = 0; i < this.rowMax; i++){
                //makes sure the check's are within the matrix's bounds
                if((i+k) < this.colMax){
                    if(this.board[i+k][i] == this.playerToken){
                        this.consecutiveCounter++;
                        this.connect4Cords.push([i+k,i]);
                    }else{
                        //reset counter
                        this.consecutiveCounter = 0;
                        this.connect4Cords = [];
                    }
                    //if consecutive counter = 4 then there is a connect 4
                    if(this.consecutiveCounter == 4){
                        this.playerWon[player] = true;
                    }
                }
            }
        }
        //check diagonal case 2 (diagonal middle and left of middle - going from top left to bottom right)
        for(let k = 1; k <= 3; k++){
            this.consecutiveCounter = 0;
            for(let i = 0; i < this.rowMax; i++){
                if(this.board[i][this.rowMax-k-i] == this.playerToken){
                    this.consecutiveCounter++;
                    this.connect4Cords.push([i,this.rowMax-k-i]);
                }else{
                    //reset counter
                    this.consecutiveCounter = 0;
                    this.connect4Cords = [];
                }
                //if consecutive counter = 4 then there is a connect 4
                if(this.consecutiveCounter == 4){
                    this.playerWon[player] = true;
                }
            }
        }
        //check diagonal case 2 (diagonal's right of middle)
        for(let k = 1; k <= 3; k++){
            this.j = this.rowMax-1;
            this.consecutiveCounter = 0;
            for(let i = 0; i < this.rowMax; i++){
                if((i+k) <= this.rowMax){
                    if(this.board[i+k][this.j] == this.playerToken){
                        this.consecutiveCounter++;
                        this.connect4Cords.push([i+k,this.j]);
                    }else{
                        this.consecutiveCounter = 0;
                        this.connect4Cords = [];
                    }

                    //if consecutive counter = 4 then there is a connect 4
                    if(this.consecutiveCounter == 4){
                        this.playerWon[player] = true;
                    }
                    //every i increment we want to decrement j (that's the pattern)
                    this.j--;
                }
            }
        }
    }

    //find's the first avaliable row for a specific column
    findSpot(column){
        for(let row = 0; row < this.rowMax; row++){
            if(this.board[this.id[column.id]][row] == 0){
                return row;
            }
        }
    }

    //check's to see if column passes is full
    checkColumn(column){
        // 0 indicates empty spot on board
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
            //change ghostChip colour
            this.columns.forEach(column=>{
                this.ghostChip = column.getElementsByClassName('ghost-chip red');
                this.ghostChip[0].classList.remove('visible');
                this.newghostChip = column.getElementsByClassName('ghost-chip yellow');
                this.newghostChip[0].classList.add('visible');
            })
        }else{
            this.playerTurn['red'] = true;
            this.playerTurn['yellow'] = false;
            //change ghostChip colour
            this.columns.forEach(column=>{
                this.ghostChip = column.getElementsByClassName('ghost-chip yellow');
                this.ghostChip[0].classList.remove('visible');
                this.newghostChip = column.getElementsByClassName('ghost-chip red');
                this.newghostChip[0].classList.add('visible');
            })
        }
    }

    //chooses random player to start
    randomPlayer(){
        let num = Math.floor(Math.random()*2);
        if(num == 0){
            this.playerTurn['red'] = true;
            //add player's chip shadow
            this.columns.forEach(column=>{
                this.ghostChip = column.getElementsByClassName('ghost-chip red');
                this.ghostChip[0].classList.add('visible');
            })
        }else{
            this.playerTurn['yellow'] = true;
            //add player's chip shadow
            this.columns.forEach(column=>{
                this.ghostChip = column.getElementsByClassName('ghost-chip yellow');
                this.ghostChip[0].classList.add('visible');
            })
        }
    }

    //changes all the hole colour's back to white
    resetBoard(){
        //get red and yellow chips
        this.redChips = document.querySelectorAll('.row.red');
        this.yellowChips = document.querySelectorAll('.row.yellow');
        this.redChips.forEach((chip)=>{
            chip.classList.remove('red');
        })
        this.yellowChips.forEach((chip)=>{
            chip.classList.remove('yellow');
        })
    }
}

let introOverlay = document.querySelector('.intro-overlay');
let outroOverlay = document.querySelector('.outro-overlay');
let column_divs = document.querySelectorAll('.column');

//game logic of original connect 4 (linking of game mechanic's)
function connect4(){
    let game = new Connect4(column_divs);
    
    //intro overlay options
    document.querySelector('.Original').addEventListener('click',()=>{
        introOverlay.classList.add('hide');
        game.startGame_Original();
    })

    //outro overlay options
    document.querySelector('.reset-Original').addEventListener('click',()=>{
        outroOverlay.classList.remove('appear');
        game.startGame_Original();
    })

    //player select's a column
    column_divs.forEach( column =>{
        column.addEventListener('click',()=>{
            game.clickedColumn(column);
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

