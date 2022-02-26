//#region Header
const list = document.querySelectorAll('.list');

function SelectVocation(index)
{
    AddCategory(web_questions[index].subcategory.id);

    //Move Slider To Biggest Number
    var max = Math.max.apply(null, web_category);
    var index = web_category.indexOf(max);

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
let progress = 0;

function SetProgressBar()
{
    progress += 100 / totalQuestions;

    let value = Math.round(Math.min(progress, 100));
    percent.innerHTML = bar.style.width = value + "%";

    let reach = 100 / (levels.length - 1);
    let succed = Math.floor(value / reach);

    //Show Mini Game
    for(let i = 1; i <= succed; i++)
    {
        if(levels[i].classList.contains('uncomplete'))
        {
            levels[i].classList.replace('uncomplete', 'complete');

            let start = currentQuestion;
            let end = start + gameQuestions;
            let questions = [];

            //Add Minigame Questions
            for(let j = start; j < end; j++)
            {
                questions.push(web_questions[j]);
                currentQuestion++;
            }

            ResetGame(questions);
            InterpolateGame();
        }
    }
};
//#endregion

//#region Minigame
let playing = false;

const interpolate = document.getElementsByClassName("interpolate");
const shootButton = document.getElementById('shoot');
shootButton.addEventListener('click', () => Shoot());

function InterpolateGame()
{
    for(i = 0; i < interpolate.length; i++)
    {
        let active = interpolate[i].classList.contains('enable');
        interpolate[i].classList.replace(active ? 'enable' : 'disable', active ? 'disable' : 'enable');
    }
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
    if(progress >= 100 || web_questions == null || playing) return;

    //Category Base on Id
    var value = dir > 0;
    if(value) SelectVocation(currentQuestion);
    AddAnswer(web_questions[currentQuestion].id, value ? 1 : 0);

    //Add progress amount
    currentQuestion++;
    SetProgressBar();

    //Swipe effect
    let element1 = currentBox == 0 ? box1 : box2;
    let element2 = currentBox == 0 ? box2 : box1;
    SetBoxStyle(element1, dir, opacity, time);
    SetBoxStyle(element2, 0, 0, 0);

    //Await to complete minigame
    await until(() => playing == false);

    //Swipe Delay
    if(progress >= 100) { PostSurvey(); return; };
    await delay(time * 100);

    currentBox = currentBox == 0 ? 1 : 0;
    SetBoxText(element2, web_questions[currentQuestion].title);
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