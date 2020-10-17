/*

    Was a lot of fun creating this project, especially figuring out how to set up the random pair's on the board! 

    [topics learned through this project]:
        - oop in javascript
        - relationship between transitions and animations with javascript
        - working with delays
        - css grid, transitions and animations!
 
*/


const slots = document.querySelectorAll('.card');
const play_button = document.querySelector('#play');
let queue = [] 
let matched = []
let busyAnimation = false;
let playStateActivated = false;

//clicking a card
slots.forEach((card)=>{
    card.addEventListener('click',cardClicked);
})

function cardClicked(){
    let selectedCard = this;
    //check to see if a valid click, meaning user only clicked when he is suppost to click
    let validClick = checkClick(selectedCard);

    if(validClick == true){
        //remove cover
        let cover = selectedCard.getElementsByClassName('cover');
        cover[0].classList.add('visible');

        //add card to queue
        queue.push(selectedCard);

        //when user select's two cards compare them to see if match
        if(queue.length == 2){
            let cardA = queue[0];
            let cardB = queue[1]; 
            let result = compareMatch(cardA,cardB);
            
            //incorrect match
            if(result == false){
                //give user time to process the cards
                busyAnimation = true;
                setTimeout(()=>{
                    let cardCoverA = cardA.getElementsByClassName('cover');
                    let cardCoverB = cardB.getElementsByClassName('cover');
                    cardCoverA[0].classList.remove('visible');
                    cardCoverB[0].classList.remove('visible');

                    queue = []
                    busyAnimation = false;
                },1500);
            }else{
                matched.push(cardA);
                matched.push(cardB)
                queue = []
                //check win
                if(slots.length == matched.length){
                    busyAnimation = true;
                    setTimeout(()=>{
                        //add win overlay
                        let overlay = document.querySelector('.win-overlay');
                        overlay.classList.add('visible');
                        //click on overlay will restart the game
                        overlay.addEventListener('click',()=>{
                            overlay.classList.remove('visible');
                            //remove the images in each slot and add back the cover
                            slots.forEach((card)=>{
                                let getImg = card.getElementsByClassName('anime-value');
                                getImg[0].src = "";

                                let getCover = card.getElementsByClassName('cover');
                                getCover[0].classList.remove('visible');
                                play_button.classList.remove('notvisible');
                            })
                            //reset variables
                            matched = [];
                            playStateActivated = false;
                        })
                        busyAnimation = false;
                    },500)
                }
            }
        }
    }
}


function compareMatch(firstCard, secondCard){
    let firstCard_value = firstCard.getElementsByClassName('anime-value');
    let secondCard_value = secondCard.getElementsByClassName('anime-value');

    //if the src is the same for both card's than it's a match
    if(firstCard_value[0].src == secondCard_value[0].src){
        return true;
    }else{
        return false;
    }
}

function checkClick(card){
    //selected card was clicked twice
    if(queue[0] == card){
        return false;
    //user clicked during an animation
    }else if(busyAnimation == true){    
        return false;
    //user clicked a card already matched
    }else if(clickedCardnotMatched == false){
        return false;
    //user click's cards before hitting play button
    }else if(playStateActivated == false){
        return false;
    }else{
        return true;
    }
}
//helper function to checkClick
function clickedCardnotMatched(card){
    for(let i = 0; i < matched.length; i++){
        if(matched[i] == card){
            return false;
        }
    }
    return true;
}

//set up game board
document.querySelector('#play').addEventListener('click', ()=>{
    let cards = ['gin.jpg','hisoka.jpg','jellal.png','jin_mori.jpg','noelle.jpg','rak.jpg','ryuga.jpg','tobi.png','zoro.jpg','beerus.jpg','zuko.jpg','tanjiro.jpg','soma.jpg','escanor.jpg','saitama.jpg','pokemon.png'];
    let slot_avaliable = ['A','B','C','D','E','F','G','H'];
    let slot_index = {'A':0, 'B':1, 'C':2, 'D':3, 'E':4, 'F':5, 'G':6, 'H':7};
    let pair_counter = 0;

    //place's 4 pairs of cards on the board, these 4 pair's are random from the cards array so it's not same set of pictures every game
    while(pair_counter < 4){
        //pick a random card 
        let index = Math.floor(Math.random()*cards.length);
        let card = cards[index];
        //remove card from array to avoid duplicates
        cards.splice(index,1);
        
        //place card in a slot pair (a card in 2 random spots on the board)
        let rand = Math.floor(Math.random()*slot_avaliable.length);
        let position1 = slot_avaliable[rand];
        //remove that slot from array
        slot_avaliable.splice(rand,1);
        let rand2 = Math.floor(Math.random()*slot_avaliable.length);
        let position2 = slot_avaliable[rand2];
        //remove the other slot from array
        slot_avaliable.splice(rand2,1);

        //place images in the appropriate div's
        let position1_image = slots[slot_index[position1]].getElementsByClassName('anime-value');
        position1_image[0].src = `/images/${card}`;
        let position2_image = slots[slot_index[position2]].getElementsByClassName('anime-value');
        position2_image[0].src = `/images/${card}`;

        pair_counter++;
    }
    play_button.classList.add('notvisible');
    playStateActivated = true;
});