//code up jajanken (gon's rock-paper-scissor move) :D
document.querySelector("#rock").addEventListener("click",choiceRock);
document.querySelector("#paper").addEventListener("click",choicePaper);
document.querySelector("#scissor").addEventListener("click",choiceScissor);

//cache info to save performance and make code easier to read {before caching: 7722 ms,  after caching: 5091 ms }
//the bigger the program the more efficent caching becomes!
const output_message = document.querySelector('.output-message');
const user_score = document.querySelector('#USER-score');
const bot_score = document.querySelector('#BOT-score');
const options_div = document.querySelector('.options');
const play_again_div = document.querySelector('.play');


/*  Right now you have to refresh the page inorder to play again, therefore the score will also be reset... Will come back to this project
    to add finishihng touches when I earn more rep/experience :D */

player_info = {
    'user':{'score':0, 'score_location':'#user-score'},
    'bot':{'score':0, 'score_location':'#bot-score'}
}

img_link = {
    'rock':"https://img.icons8.com/office/80/000000/hand-rock.png",
    'paper':"https://img.icons8.com/officel/80/000000/hand.png",
    'scissor':"https://img.icons8.com/color/96/000000/hand-scissors.png"
}

//learn how to automatically reset game and learn javascript techniques from sensei :D

const USER = player_info['user'];
const BOT = player_info['bot'];

//user select's rock
function choiceRock(){
    let userPicked = "rock";
    gameLogic(userPicked);
}
//user select's paper
function choicePaper(){
    let userPicked = "paper";
    gameLogic(userPicked);
}
//user select's scissor
function choiceScissor(){
    let userPicked = "scissor";
    gameLogic(userPicked);
}

//repetitive code for each option
function gameLogic(selection){
    let bot_selection = botChoice();
    let result = calculateOutput(selection,bot_selection);

    //clear the images in the div
    var remove_image = document.querySelector(".options").querySelectorAll('div');
    for(let i = 0; i < remove_image.length; i++){
        remove_image[i].remove();
    }

    //add the two choice's picked by the user and the bot
    var user_choice_image = document.createElement("img");
    user_choice_image.src = img_link[selection];
    user_choice_image.style.padding = "0px 100px";
    options_div.appendChild(user_choice_image);
    var bot_choice_image = document.createElement("img");
    bot_choice_image.src = img_link[bot_selection];
    bot_choice_image.style.padding = "0px 100px";
    options_div.appendChild(bot_choice_image);

    //result msg 
    if(result == "User Won!"){
        //since were using consistant styling we can use innerhtml to retain the orginal style, use textContent if you want to modify 
        output_message.innerHTML=`${selection} beats ${bot_selection}, You Win!`;
    }else if(result == "Bot Won!"){
        output_message.innerHTML=`${bot_selection} beats ${selection}, You Lose!`;
    }else{
        output_message.innerHTML=`${bot_selection} ties with ${selection}, You Draw!`;
    }
   
    //update score
    if(result == "Draw"){
        return;
    }else if(result === "User Won!"){
        USER['score']++;
        //change score board
        user_score.textContent=USER['score'];
    }else{
        BOT['score']++;
        //change score board
        bot_score.textContent=BOT['score'];
    }

}

//random bot choice
function botChoice(){
    let options = ['rock','paper','scissor'];
    let choice = options[Math.floor(Math.random()*3)];
    return choice
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
