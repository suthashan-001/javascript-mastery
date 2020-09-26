/* Jajaken: Gon's special move [rock-paper-scissors] */
document.querySelector("#rock").addEventListener("click",choiceRock);
document.querySelector("#paper").addEventListener("click",choicePaper);
document.querySelector("#scissor").addEventListener("click",choiceScissor);

//cache info to save performance and make code easier to read {before caching: 7722 ms,  after caching: 5091 ms }
const output_message = document.querySelector('.output-message');
const user_score = document.querySelector('#USER-score');
const bot_score = document.querySelector('#BOT-score');
const options_div = document.querySelector('.options');
const header = document.querySelector('#title');

//saving original element's, these element's include the image src and classes's related to the image
let original_rock = document.querySelector("#rock");
let orginal_paper = document.querySelector('#paper');
let orginal_scissor = document.querySelector('#scissor');

var global_result = ""


player_info = {
    'user':{'score':0, 'score_location':'#user-score'},
    'bot':{'score':0, 'score_location':'#bot-score'}
}

img_link = {
    'rock':"https://img.icons8.com/office/80/000000/hand-rock.png",
    'paper':"https://img.icons8.com/officel/80/000000/hand.png",
    'scissor':"https://img.icons8.com/color/96/000000/hand-scissors.png"
}

let options = ['rock','paper','scissor'];
const USER = player_info['user'];
const BOT = player_info['bot'];

//user's selection
function choiceRock(){
    let userPicked = "rock";
    gameLogic(userPicked);
}
function choicePaper(){
    let userPicked = "paper";
    gameLogic(userPicked);
}
function choiceScissor(){
    let userPicked = "scissor";
    gameLogic(userPicked);
}

//handle's the display and logic of the game
function gameLogic(selection){
    //generate random bot choice
    let bot_selection = options[Math.floor(Math.random()*3)];;
    let result = calculateOutput(selection,bot_selection);
    global_result = result;

    //clear the images in the diplay div
    var remove_image = document.querySelector(".options").querySelectorAll('div');
    for(let i = 0; i < remove_image.length; i++){
        remove_image[i].remove();
    }
    //add the images of the two choice's picked by the user and the bot in the display div
    var user_choice_image = document.createElement("img");
    user_choice_image.src = img_link[selection];
    user_choice_image.style.padding = "0px 100px";
    options_div.appendChild(user_choice_image);
    var bot_choice_image = document.createElement("img");
    bot_choice_image.src = img_link[bot_selection];
    bot_choice_image.style.padding = "0px 100px";
    options_div.appendChild(bot_choice_image);

    //output a result msg and update score
    if(result == "User Won!"){
        //since were using consistant styling we can use innerhtml to retain the orginal style, use textContent if you want to modify 
        output_message.innerHTML=`${selection} beats ${bot_selection}, You Win!`;
        USER['score']++;
        user_score.textContent=USER['score'];
        user_score.style.color = "lime";
        //add green colour effect to header
        header.classList.add('header-win');
    }else if(result == "Bot Won!"){
        output_message.innerHTML=`${bot_selection} beats ${selection}, You Lose!`;
        BOT['score']++;
        bot_score.textContent=BOT['score'];
        bot_score.style.color="#E2584D";
        //add red coulour effect to header
        header.classList.add('header-lose');
    }else{
        output_message.innerHTML=`${bot_selection} ties with ${selection}, You Draw!`;
        //add yellow colour effect to header
        header.classList.add('header-draw');
    }

    //after an interval of time we want to go back to the original view of the game for the next rounds
    setTimeout(refresh,2000);
}


function refresh(){
    //clear current images in display div (they currently contain the previous round's user and bot picks )
    images = options_div.querySelectorAll("img");
    for(let i = 0; i < images.length; i++){
        images[i].remove();
    }

    //add back orginal images for the user to select
    options_div.appendChild(original_rock);
    options_div.appendChild(orginal_paper);
    options_div.appendChild(orginal_scissor);

    output_message.innerHTML='"Make your move!"'

    //reset header to original colour white
    if(global_result === "User Won!"){
        header.classList.remove('header-win');
    }else if(global_result === "Bot Won!"){
        header.classList.remove('header-lose');
    }else{
        header.classList.remove('header-draw');
    }

    //reset colour of scoreboard
    bot_score.style.color="white";
    user_score.style.color="white";
}

//calculate result
function calculateOutput(user, bot){
    if(user == bot){
        return 'Draw';
    }else if(user == 'rock' &&  bot == 'scissor'){
        return 'User Won!';
    }else if(user == 'rock' &&  bot == 'paper'){
        return 'Bot Won!';
    }else if(user == 'paper' &&  bot == 'rock'){
        return 'User Won!';
    }else if(user == 'paper' && bot == 'scissor'){
        return 'Bot Won!';
    }else if(user == 'scissor' && bot == 'rock'){
        return 'Bot Won!';
    }else{
        return 'User Won!';
    }
}
