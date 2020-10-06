/*\  Notes (Callbacks, promises, async) :D
|*|     - callback is just passing a function into another function
|*|                ex.     function print(name){
|*|                           console.log(name)
|*|                        }
|*|
|*|                        function hee(func){
|*|                            func('hee')
|*|                        }
|*|
|*|                        hee(print);
|*|
|*|    - Synchronous refers to real-time communication, async refer's to delayed time communication such as email's where you can respond at any time
|*|    - The Promise object represents the eventual completion (or failure) of an asynchronous operation and its resulting value.
|*|    - he async and await keywords enable asynchronous, promise-based behavior to be written in a cleaner style, avoiding the need to explicitly configure promise chains.
|*|    - resolved in plain english simply means "firmly determined to do something." so a promise takes in a ("do something", "or reject")
\*/

const slots = document.querySelectorAll('.card');
const play_button = document.querySelector('#play')
let userPick = [];
let correctPairs = 0;
document.querySelector('#play').addEventListener('click', setGameBoard);

//add event listener's for each card on click
for(let i = 0; i < slots.length; i++){
    slots[i].addEventListener('click',selectCard);
}

function selectCard(){
    //remove cover from the div the user selected and store div in userPick
    let cover = this.getElementsByClassName('cover');   
    cover[0].classList.toggle('toggle_opacity');    //getElementsByClassName returns an array
    userPick.push(this);

    //after two pick's check result to see if it's a correct match
    if(userPick.length == 2){
        let match = checkMatch();
        if(match == true){
            //correct guess
            removePair();
        }else{
            //incorrect guess
            coverCard();
        }
        /*  
            lesson about setTimeout:  **There is no way to completely pause execution for a moment of time!, some tricks to mimic time stop**
            the problem with setTimeout is that the rest of the code underneath get's executed while only setTimeout is delayed
            userPicked = []; this line of code get's executed before the setTimeout function due ot the delay, 
            which messes up the order since i want to empty the userPicked array after the coverCard function!

            solution: create an async function using promises where both removePair and coverCard are async function's that have a delay 
            before executing!
        */
    }
}

//resolve object will set a delay to the card being covered, need more experience on this topic to master :D
function sleep(time){
    //what is this doing, hmm?
    /*  
        promise passes a resolve ("value or function") and a reject incase promise is broken ("which we are ignoring cause we always want the delay")
        and returns setTimeOut which takes the value/func and executes it after a specifc time/delay
    */
    return new Promise(func => setTimeout(func,time));

}

async function coverCard(){
    //delay before covering cards to show the user what card's he guessed before it's covered
    await sleep(1500);

    //userpick[0] is an array that contains the div's of the cards selected
    let cardCover1 = userPick[0].getElementsByClassName('cover');
    let cardCover2 = userPick[1].getElementsByClassName('cover');  
    
    cardCover1[0].classList.toggle('toggle_opacity');
    cardCover2[0].classList.toggle('toggle_opacity');
    userPick = [];
    checkingResult = false;
}

async function removePair(){
    //delay before removing cards, to show user what the card was before removed
    await sleep(1500);

    //getElementsByClassName() return's an array, each div only has 1 picture so img1[0] is that picture element
    let img1_pic = userPick[0].getElementsByClassName('picture');   
    let img2_pic = userPick[1].getElementsByClassName('picture');
    let cover1 = userPick[0].getElementsByClassName('cover');   
    let cover2 = userPick[1].getElementsByClassName('cover');

    //remove pictures
    img1_pic[0].remove();
    img2_pic[0].remove();

    //remove covers
    cover1[0].remove();
    cover2[0].remove();

    correctPairs += 1;
    userPick = [];

    checkingResult = false;

    //win!
    if(correctPairs == 4){
        alert('You Win')
    }
}


function checkMatch(){
    //userPick is the array that contain's the div's of the selected cards, we want the element with class 'picture' of both div's to compare
    let cardA = userPick[0].getElementsByClassName('picture');
    let cardB = userPick[1].getElementsByClassName('picture');

    //if both div's have the same picture src they are a match
    if(cardA[0].src == cardB[0].src){
        return true;
    }else{
        return false;
    }
}

function setGameBoard(){
    let cards = ['gin.jpg','hisoka.jpg','jellal.png','jin_mori.jpg','noelle.jpg','rak.jpg','ryuga.jpg','tobi.png','zoro.jpg','beerus.jpg','zuko.jpg','tanjiro.jpg','soma.jpg','escanor.jpg','saitama.jpg','pokemon.png'];
    let slot_avaliable = ['A','B','C','D','E','F','G','H'];
    let index_table = {
        'A':0, 'B':1, 'C':2, 'D':3, 'E':4, 'F':5, 'G':6, 'H':7
    }
    let pair_counter = 0;

    //place's 4 pairs of cards on the board
    while(pair_counter < 4){
        //pick a random card 
        let index = Math.floor(Math.random()*cards.length);
        let card = cards[index];
        //remove card from array to avoid duplicates
        cards.splice(index,1);
        
        //place card in a slot pair (a card in 2 random spots on the board)
        let pos1_index = Math.floor(Math.random()*slot_avaliable.length);
        let pos1 = slot_avaliable[pos1_index];
        slot_avaliable.splice(pos1_index,1);
        let pos2_index = Math.floor(Math.random()*slot_avaliable.length);
        let pos2 = slot_avaliable[pos2_index];
        slot_avaliable.splice(pos2_index,1);

        //create 2 image elements
        let img1 = document.createElement('img');
        let img2 = document.createElement('img');
        img1.className = 'picture';
        img2.className = 'picture';
        img1.src = `/images/${card}`;
        img2.src = `/images/${card}`;
        img1.style = 'width:150px; height:170px; position: absolute; z-index:0 ';
        img2.style = 'width:150px; height:170px; position: absolute; z-index:0 ';

        //get the div's of the two slot's
        let div1 = slots[index_table[pos1]];
        let div2 = slots[index_table[pos2]];

        //add image and image cover to div
        div1.appendChild(img1);
        div2.appendChild(img2);
        
        pair_counter++;
    }

    //place's cover over card's to keep them 'hidden' from user
    let cover = document.querySelectorAll('.cover');
    cover.forEach((x)=>{
        x.classList.toggle('toggle_opacity');
    })
    //remove's play button
    play_button.remove();

}


