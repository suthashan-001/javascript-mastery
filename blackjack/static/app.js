//what happens when a button is clicked
document.querySelector("#hit-button").addEventListener('click',hit);
document.querySelector("#stand-button").addEventListener('click',stand);
document.querySelector("#deal-button").addEventListener('click',deal);
const hitSound = new Audio('static/sounds/swish.m4a')

//object holds info of id-tags for both user and bot
let info = {    
    //since we made these keys up they have to be string values, if not it will try to look for key among code
    'user': {'div':'#user-column', 'score_location':'#user-result', 'score':0, 'bust':false, 'ace':0,'betterhand':false},
    'bot': {'div':'#bot-column', 'score_location':'#bot-result', 'score':0, 'bust':false, 'ace:':0,'betterhand':false}
}

/*
Big lesson: use github so that you can track changes made to your code, if it randomly stop working you can go to a previous version
- turns out I typed betterHand instead of betterhand and caused whole program to stop, use github to backtrack code
*/

//creating objects so its easy to access info dict
const USER = info['user'];
const BOT = info['bot'];
let gameOver = false;
let winCount = 0;
let drawCount = 0;
let loseCount = 0;

//when user clicks hit
function drawCard(player){
    //if player busted, he can't draw any more cards
    if(player['score'] >= 21){
        return;
    }
   
    let face = ['King','Queen','jack','Ace','2','3','4','5','6','7','8','9','10'];
    const table = {
        'King':10,'Queen':10,'jack':10,'Ace':11,'2':2,'3':3,'4':4,'5':5,'6':6,'7':7,'8':8,'9':9,'10':10
    }
    let card = face[Math.floor(Math.random()*13)];

    //ace card can either be a 11 or a 1, whatever favors the player
    if(card == 'Ace'){
        let aceInDeck = player['ace'];
        player['ace'] = aceInDeck + 1;
    }

    //display image
    let picture = document.createElement("img");    
    //instead of string concatenation use string templating (instead of ' use backtick ` to indicate its a template), it's alot nicer
    picture.src = `static/images/${card}.png`; 
    picture.height = 114;
    picture.width = 91;
    //get the div where you want to append element (where using queryselector instead of getelementbyid)
    document.querySelector(player['div']).appendChild(picture);
    hitSound.play();

    //update score 
    let updateScore = table[card]
    player['score'] += updateScore;

    
    //if the player score is greater than 21, it checks to see if there are any ace's in his deck to change score, and will update score accordingly
    if(player['score'] <= 21){
        document.querySelector(player['score_location']).textContent=player["score"];
    }else{
        //since ace's are 11 or 1, we can change the score value if the player has a ace in his deck
        if(player['ace'] > 0){
            player['betterhand'] = checkDeck(player);
            if(player['betterhand'] == false){
                document.querySelector(player['score_location']).textContent="BUST!";
                document.querySelector(player['score_location']).style.color="red";
                player['bust'] = true;
            }else{
                document.querySelector(player['score_location']).textContent=player['score'];

            }
        }else{
            document.querySelector(player['score_location']).textContent="BUST!";
            //styling the text
            document.querySelector(player['score_location']).style.color="red";
            player['bust'] = true;
        }
    }
}

function checkDeck(player){
    //reduce the score of each ace until the player does not bust
    for(let i = 0; i < player['ace'];i++){
        //the difference between the ace value is 10
        let temp = player['score'];
        player['score'] = temp - 10;

        //check to see if player is still bust, if so we change score value of next ace card
        if(player['score'] <= 21){
            return true;
        }
    }

    //even after changing value of ace the player still bust, thats tuff
    if(player['score'] > 21){
        return false;
    }
}


function checkmove(score){
    //if score is less than 17, the bot will still draw, if its greater than 17 the bot will take a 10% chance to draw again.
    if(score < 17){
        return true;
    }else{
        //take a chance if bot should risk a draw
        let gamling_percent = Math.floor((Math.random()*100)+1);
        if(gamling_percent <= 10){
            return true;
        }else{
            return false;
        }
    }
}

//sleeper function which give's delay affect
function sleep(millisecond){
    /*
        The Promise is an object that represents either completion or failure of a user task. 
        A promise in JavaScript can be in three states pending, fulfilled or rejected.

    */
    return new Promise(resolve => setTimeout(resolve,millisecond));
}

//bot logic
/*  
    JavaScript is a single-threaded programming language which means only one thing can happen at a time.
    Using asynchronous JavaScript (such as callbacks, promises, and async/await),
    you can perform long network requests without blocking the main thread. 
*/
//async bascially stop's the whole browser from freezing during the sleeper function, only the function stand() if frozen for a few seconds
async function stand(){ 
    //if the game is over you can't click stand again
    if(gameOver == true){
        return
    }
    let shouldDraw = true;
    //the user should have atleast hit once, bot can't go first, part of rules
    if(USER['score'] == 0){
        return;
    }

    //await sleep(800);  //adds 1 second delay
    
    //will continue to draw until the bot decides that drawing will be a bad move
    while(shouldDraw == true && BOT['betterhand'] == false){
        //check to see if it is a smart move to draw card
        shouldDraw = checkmove(BOT['score']);
        if(shouldDraw == true && BOT['betterhand'] == false){
            //to add delay when adding card's were gonna add a sleep function :O {its getting intereting}
            drawCard(BOT);
            //i like game better without delay 
            //await sleep(1000);  //adds 1 second delay
        }else{
            shouldDraw = false;
        }
    }

    //check result
    gameResult();
    gameOver = true;
}

function hit(){
    //user can't hit after the dealer's turn is done
    if(gameOver == false && USER['betterhand'] == false){
        drawCard(USER);
    }else{
        return;
    }
    //if user bust, its automatically the bot's turn
    if(USER['bust'] == true || USER['score'] == 21 || USER['betterhand'] == true){
        stand();
    }
}

function gameResult(){
    //boolean conditions to see who won the game
    if((USER['bust'] && BOT['bust']) == true || USER['score'] == BOT['score']){
        //draw
        drawCount+=1;
        document.querySelector("#game-result").textContent="Draw";
        document.querySelector("#game-result").style.color="goldenrod"
        //update table
        document.querySelector("#draw").textContent=drawCount;

    }else if((BOT['bust'] == true && USER['bust'] == false)||(USER['score'] > BOT['score'] && USER['bust'] == false)){
        //win
        winCount+=1;
        document.querySelector("#game-result").textContent="Win";
        document.querySelector("#game-result").style.color="green";
        document.querySelector("#win").textContent=winCount;
    }else{
        //loss
        loseCount+=1;
        document.querySelector("#game-result").textContent="Loss";
        document.querySelector("#game-result").style.color="red";
        document.querySelector("#loss").textContent=loseCount;
    }
}

//reset's game board so we dont have to refresh page 
function deal(){
    //con only deal after bot has played 
    if(BOT['score'] == 0){
        return;
    }
    //reset game state
    gameOver = false;
    USER['score'] = 0;
    BOT['score'] = 0;
    USER['bust'] = false;
    BOT['bust'] = false;
    USER['ace'] = 0;
    BOT['ace'] = 0;
    USER['betterhand'] = false;
    BOT['betterhand'] = false;
    document.querySelector(USER['score_location']).style.color="white";
    document.querySelector(BOT['score_location']).style.color="white";

    // //clear card's div's
    // var userCards = document.querySelector(USER['div']).getElementsByTagName("img");
    // while(userCards.length > 0){
    //     for(let i = 0; i < userCards.length; i++){
    //         userCards[i].parentNode.removeChild(userCards[i]);
    //     }
    // }

    // var botCards = document.querySelector(BOT['div']).getElementsByTagName("img");
    // while(botCards.length > 0){
    //     for(let i = 0; i < botCards.length; i++){
    //         botCards[i].parentNode.removeChild(botCards[i]);
    //     }
    // }

    /* way better version of removing images in div and a lot cleaner too - credit to cleverprogrammer on youtube */
    //clear card's div's
    let userImages = document.querySelector(USER['div']).querySelectorAll("img");
    for(let i = 0; i < userImages.length; i++){
        userImages[i].remove();
    }
    let botImages = document.querySelector(BOT['div']).querySelectorAll("img");
    for(let i = 0; i < botImages.length; i++){
        botImages[i].remove();
    }

    //reset score board
    document.querySelector("#game-result").textContent="BlackJack";  
    document.querySelector("#game-result").style.color="black";
    document.querySelector(USER['score_location']).textContent=USER["score"];
    document.querySelector(BOT['score_location']).textContent=BOT["score"];   
}



/*  The querySelector() method returns the first element that matches the specified css selectors. 
    The getElementById() method returns the first element that matches the given id in the DOM. For example: document.

    Advantages: We dont have to write onclick and onChange in html and leave all the functionality of buttons in the javascript,
    more organized since we dont have to back and forth checking html and javascript, and makes html cleaner to read
*/


