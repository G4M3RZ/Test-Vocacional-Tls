//#region Web Scenes


//Main
const loginView = document.getElementById('login');
const tutorialView = document.getElementById('tutorial');
const surveyView = document.getElementById('survey');
const resultView = document.getElementById('result');

//Sub
const questionary = document.getElementById('questionary');
const game = document.getElementById('minigame');

function ChangeViewState(from, to)
{
    from?.classList.replace('enable', 'disable');
    to?.classList.replace('disable', 'enable');
}


//#endregion


//#region Header


const list = document.querySelectorAll('.list');

function SelectVocation()
{
    const max = Math.max.apply(null, json_session.amount);
    const index = json_session.amount.indexOf(max);

    for(i = 0; i < list.length; i++)
    {
        if(i != index) list[i].classList.remove('active');
        else list[i].classList.add('active');
    }
}


//#endregion


//#region Progress Bar


const percent = document.getElementById("amount");
const levels = document.getElementsByClassName("progress");
const bar = document.getElementById("fill-amount");

function SetProgressBar(validate)
{
    const value = Math.round(Math.min(json_session.progress, 100));
    percent.innerHTML = bar.style.width = value + "%";

    const reach = 100 / (levels.length - 1);
    const succed = Math.floor(value / reach);

    for(let i = succed; i >= 1; i--)
    {
        if(levels[i].classList.contains('uncomplete'))
        {
            levels[i].classList.replace('uncomplete', 'complete');
            if(validate) json_session.playing = true;
        }
    }
}


//#endregion


//#region Minigame


//Shoot Button
document.getElementById('shoot').addEventListener('click', () => Shoot());

function SetMiniGame()
{
    if(!json_session.playing) return;

    const start = json_session.current;
    const end = start + gameQuestions;
    let questions = [];

    for(let j = start; j < end; j++) questions.push(json_session.questions[j]);

    ResetGame(questions);
    ChangeViewState(questionary, game);
}


//#endregion


//#region Question Box


const qBox = document.getElementById("question-box");
const box1 = qBox.firstElementChild;
const box2 = qBox.lastElementChild;
let currentBox = 0;

SetBoxStyle(box2, 0, 0, 0);
async function Swipe(dir, opacity, time)
{
    if(json_session.progress >= 100 || json_session.questions.length === 0 || json_session.playing) return;

    var value = dir > 0;
    //Category Base on Id
    if(value) AddCategory(json_session.questions[json_session.current].subcategory.link.area.id);
    AddAnswer(json_session.questions[json_session.current].id, value ? 1 : 0);

    //Add progress amount
    json_session.current++;
    json_session.progress += 100 / json_session.total;
    SetProgressBar(true);
    SetMiniGame();

    //Swipe effect
    let element1 = currentBox == 0 ? box1 : box2;
    let element2 = currentBox == 0 ? box2 : box1;
    SetBoxStyle(element1, dir, opacity, time);
    SetBoxStyle(element2, 0, 0, 0);

    //Await to complete minigame
    await until(() => json_session.playing == false);

    //Swipe Delay
    if(json_session.progress >= 100) { SendSurvey(); return; };
    await delay(time * 100);

    //Save Json Progress
    SaveProgress();

    currentBox = currentBox == 0 ? 1 : 0;
    SetBoxText(element2, json_session.questions[json_session.current].title);
    SetBoxStyle(element2, 0, 1, time);
}
function SetBoxText(box, text)
{
    box.firstElementChild.innerHTML = text;
}
function SetBoxStyle(element, direction, opacity, time)
{
    element.style.transition = time + "s";
    element.style.transform = "translateX(" + direction * 100 + "px) rotate(" + direction * 10 + "deg)";
    element.style.opacity = opacity;
};


//#endregion


//#region Select Buttons
const leftButton = document.getElementById("left");
const rightButton = document.getElementById("right");

leftButton.addEventListener('click', () => Swipe(-1, 0, 0.5));
rightButton.addEventListener('click', () => Swipe(1, 0, 0.5));

document.addEventListener('keydown', (event) =>
{
    let key = event.key;
    if(key === 'ArrowLeft') Swipe(-1, 0, 0.5);
    else if(key === 'ArrowRight') Swipe(1, 0, 0.5);
});
//#endregion