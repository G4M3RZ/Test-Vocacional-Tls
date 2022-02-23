//#region Header

const list = document.querySelectorAll('.list');
//SelectVocation(0);
function SelectVocation(/*value*/)
{
    list.forEach((item) => item.classList.remove('active'));
    this.classList.add('active');
    // for(i = 0; i < list.length; i++)
    // {
    //     if(i != value) list[i].classList.remove('active');
    //     else list[i].classList.add('active');
    // }
}

//test
list.forEach(element => element.addEventListener('click', SelectVocation));

//#endregion

//#region Minigame
var interpolate = document.getElementsByClassName("interpolate");
var shootButton = document.getElementById('shoot');
let states = ['enable', 'disable'];

shootButton.addEventListener('click', () => Shoot());

function InterpolateGame()
{
    var current = 0;
    for(i = 0; i < 2; i++)
    {
        for(e = 0; e < states.length; e++)
            interpolate[current].classList.toggle(states[e]);
        current++;
    }
}
//#endregion

//#region Progress Bar
var percent = document.getElementById("amount");
var bar = document.getElementById("fill-amount");
var points = document.getElementsByClassName("progress");
let progress = 0;

const SetProgressBar = () =>
{
    var value = Math.round(Math.min(progress, 100));
    percent.innerHTML = value + "%";
    bar.style.width = value + "%";

    var reach = 100 / (points.length - 1);
    var succed = Math.floor(value / reach);

    for(i = 1; i <= succed; i++)
    {
        if(points[i].classList.contains('uncomplete'))
        {
            points[i].className = points[i].className.replace( /(?:^|\s)uncomplete(?!\S)/g , '');
            points[i].className += " complete";

            //Show Mini Game
            ResetGame('¿Te incluirías en un proyecto nacional de desarrollo de la principal fuente de recursos de tu provincia?');
            InterpolateGame();
        }
    }
};
//#endregion
//#region Question Box

let survey = '';
let questions = '';

LoadSurvey();
async function LoadSurvey()
{
    // fetch('../php/survey.php')
    //     .then(data => console.log(data.text()))
    //     .catch(error => console.error('Error:', error));

    // survey = await fetch('../php/survey.php');
    // console.log(survey);

    const xhttp = new XMLHttpRequest();
    xhttp.onload = function()
    {
        try
        {
            survey = JSON.parse(this.responseText).survey;
            console.log(survey);
        }
        catch(e) { console.log(e); }
    }
    xhttp.open('GET', 'https://tlsvocacional.renzoguido.com/api/survey', false);
    xhttp.send(null);
}

var qBox = document.getElementById("question-box");
var box1 = qBox.firstElementChild;
var box2 = qBox.lastElementChild;
let currentBox = 0;

SetBoxStyle(box2, 0, 0, 0);
async function Swipe(dir, opacity, time)
{
    //Add progress amount
    progress += 100 / survey.questions.length;
    SetProgressBar();

    var element1 = currentBox == 0 ? box1 : box2;
    var element2 = currentBox == 0 ? box2 : box1;
    SetBoxStyle(element1, dir, opacity, time);
    SetBoxStyle(element2, 0, 0, 0);

    await delay(time * 100);

    SetBoxStyle(element2, 0, 1, time);
    currentBox = currentBox == 0 ? 1 : 0;
}
function SetBoxStyle(element, direction, opacity, time)
{
    element.style.transition = time + "s";
    element.style.transform = "translateX(" + direction * 100 + "px) rotate(" + direction * 10 + "deg)";
    element.style.opacity = opacity;
};
//#endregion
//#region Select Buttons
var leftButton = document.getElementById("left");
var rightButton = document.getElementById("right");

leftButton.addEventListener('click', () => Swipe(-1, 0, 0.5));
rightButton.addEventListener('click', () => Swipe(1, 0, 0.5));

document.addEventListener('keydown', (event) =>
{
    var key = event.key;
    if(key === 'ArrowLeft') Swipe(-1, 0, 0.5);
    else if(key === 'ArrowRight') Swipe(1, 0, 0.5);
});
//#endregion