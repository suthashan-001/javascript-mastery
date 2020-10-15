/* Learn the gem's in the youtube tutorial: https://www.youtube.com/watch?v=3uuQ3g92oPQ&t=119s by portEXE sensei */

//audio class which hold's the audio files
class audio{
    //each audio instance will have these audio files
    constructor(){
        this.flipSound = new Audio('Assets/Audio/flip.wav');
        this.matchSound = new Audio('Assets/Audio/match.wav');
        this.victorySound = new Audio('Assets/Audio/victory.wav');
        this.gameOverSound = new Audio('Assets/Audio/gameOver.wav');
    }
}

class HalloweenMatch{
    constructor(time, cards){
        //contains variables that only need to be declared once throughout game
        this.totalTime = time;      
        this.timeRemaining = time;  
        this.timerElement = document.getElementById('time-remaining');
        this.totalFlips = 0;
        this.fliperElement = document.getElementById('flips');
        this.audioController = new audio();        
        this.cardsArray = cards;
    }

    //use function to run game multiple times 
    startGame(){
        this.busyAnimating = false; 
        this.timeRemaining = this.totalTime;
        this.totalFlips = 0;
        this.queue = [];
        this.matched = [];     //keeps track of total array

        //shuffle cards (Fisher_Yates shuffle algorithm)
        for(let i = this.cardsArray.length-1; i > 0; i--){
            let j = Math.floor(Math.random() * (i-1));
            //The order property specifies the order of a flexible item relative to the rest of the flexible items inside the same container.
            this.cardsArray[j].style.order = i;
            this.cardsArray[i].style.order = j;
        }

        //cover cards
        this.cardsArray.forEach((card)=>{
            card.classList.remove('visible');
        })

        //countdown timer, assign setInterval to a variable so that it can be cleared later on
        this.countdown = setInterval(()=>{
            this.timeRemaining--;
            this.timerElement.innerText = this.timeRemaining;
            if(this.timeRemaining == 0){
                this.endGame();
            }
        },1000)

    }

    endGame(){
        //stop's countdown timer
        clearInterval(this.countdown);
        document.getElementById('game-over-text').classList.toggle('visible');
        this.audioController.gameOverSound.play();
    }

    
    victory(){
        //stop's countdown timer
        clearInterval(this.countdown);
        document.getElementById('victory-text').classList.toggle('visible');
        this.audioController.victorySound.play();
    }
    

    flipEvent(card){
        //check to see if click is valid
        this.validFlip = this.checkClick(card)

        //flip counter inceases on click
        if(this.validFlip == true){
            this.totalFlips++;
            this.fliperElement.innerHTML = this.totalFlips;
            this.audioController.flipSound.play();
            card.classList.toggle('visible');
            this.queue.push(card);

            //when user select's two cards
            if(this.queue.length == 2){
                let result = this.checkMatch();
                //animation on an incorrect Match
                if(result == false){
                    this.busyAnimating = true;
                    setTimeout(()=>{
                        //cover back card1 and card2
                        this.queue[0].classList.remove('visible');
                        this.queue[1].classList.remove('visible');
                        this.queue = [];
                        this.busyAnimating = false;
                    },1000)
                }else{
                    this.busyAnimating = true;
                    setTimeout(()=>{
                        this.matched.push(this.queue[0]);
                        this.matched.push(this.queue[1]);
                        //reset queue after a match
                        this.queue = [];
                        console.log(this.matched);
                        console.log(this.cardsArray);
                        //check win
                        if(this.matched.length == this.cardsArray.length){
                            this.victory();
                        }
                        this.busyAnimating = false;   
                    },1000)
                }
            }
        }
    }

    checkMatch(){
        //getElementByClassName return's an array
        let card1 = this.queue[0].getElementsByClassName('card-value');
        let card2 = this.queue[1].getElementsByClassName('card-value');

        if(card1[0].src == card2[0].src){
            return true;
        }else{
            return false;
        }
    }

    checkClick(card){
        this.alreadyMatched = this.compareMatch(card);
        //conditions
        if(this.queue[0] == card){
            return false;
        }else if(this.busyAnimating == true){
            return false;
        }else if(this.alreadyMatched == true){
            return false;
        }else{
            return true
        }
    }

    compareMatch(card){
        //loop through matched array and return true if card not there, else return false
        for(let i = 0; i < this.matched.length;i++){
            if(card == this.matched[i]){
                return true;
            }
        }
        return false;
    }
}

//ready state when DOM successfully loaded content, prevent's page stall's 
function ready(){
    //cache the card's and output overlays from DOM
    let cards = document.querySelectorAll('.card');
    let overlays = document.querySelectorAll('.overlay-text');
    //create game object
    let game = new HalloweenMatch(100,cards);

    //add eventListener's to the cards and overlays
    overlays.forEach(overlay =>{
        overlay.addEventListener('click',()=>{
            overlay.classList.toggle('visible');
            game.startGame();
        })
    })
    cards.forEach(card =>{
        card.addEventListener('click',()=>{
            game.flipEvent(card);
        });
    })

}

//if the page hasn't loaded yet, program will wait until page is loaded
if(document.readyState === "loading"){
    //The DOMContentLoaded event fires when the initial HTML document has been completely loaded and parsed
    document.addEventListener('DOMContentLoaded', ready);
}else{
    ready();
}

