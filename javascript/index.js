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

list.forEach(element => element.addEventListener('click', SelectVocation));

//#endregion

//#region Progress Bar
var percent = document.getElementById("amount");
var points = document.getElementsByClassName("progress");
var bar = document.getElementById("fill-amount");
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
        }    
    }
};

//testing
SetProgressBar();
//#endregion

//#region Question Box
var qBox = document.getElementById("question-box");
var box1 = qBox.firstElementChild;
var box2 = qBox.lastElementChild;
let currentBox = 0;

const SetBoxStyle = (element, direction, opacity, time) => {
    element.style.transition = time + "s";
    element.style.transform = "translateX(" + direction * 100 + "px) rotate(" + direction * 10 + "deg)";
    element.style.opacity = opacity;
};
SetBoxStyle(box2, 0, 0, 0);

async function Swipe(dir, opacity, time)
{
    progress+=5;
    SetProgressBar();

    var element1 = currentBox == 0 ? box1 : box2;
    var element2 = currentBox == 0 ? box2 : box1;
    SetBoxStyle(element1, dir, opacity, time);
    SetBoxStyle(element2, 0, 0, 0);

    await delay(time * 100);

    SetBoxStyle(element2, 0, 1, time);
    currentBox = currentBox == 0 ? 1 : 0;
}
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