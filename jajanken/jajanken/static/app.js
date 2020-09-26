/* Sensei's version of rock-paper-scissor's : [let's collect the gems!]  -Not complete version's only cool parts!*/

//cache the dom? <stores info in a variable for future reference, save's performance by accessing variable instead of running document process to find elements >
const userScore = 0;
const botScore = 0;
//sensei use's naming convection _ represent's dom variable and the type of element it is "span", that's pretty clever!
const userScore_span = document.getElementById('USER-score');
const botScore_span = document.getElementById('BOT-score');
const scoreboard_div = document.querySelector('.scoreboard');
const result_div = document.querySelector('.output-message');
const rock_div = document.getElementById('rock');
const paper_div = document.getElementById('paper');
const scissor_div = document.getElementById('scissor');

/* 
    Difference between innerHTMl, textContent, and innerText

    - use innerHTMl when you want to keep same format's in a div: "example, spacing, line breaks since it writes to the div in html"
    - use innerText when you just want to see the text and don't care about format 
    - use textContent when you just want to see the text, you can put some styling on it, you can style to a different style than div's
*/

//to add functionality when something happens, we use classes [basically create class in css], get the div element and apply method
//.classlist.add('Class_name which is in css folder')

//setTimeout(function, milliseconds) - delay effect! (in 5 sec do this type of stuff!)

// function(){return info} === ()=>return info


/* from youtube comment's might come helpful

    For those of you getting this error : Uncaught TypeError: Cannot read property 'addEventListener' of null

    Do this: on the first line of app.js add this piece of code : 
    document.addEventListener('DOMContentLoaded', () => {
        // all code goes inside here
    // all code goes inside here
    }) 

*/