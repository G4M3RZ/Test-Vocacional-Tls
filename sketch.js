let width = 260, height = 350;
let stopDelay = false;

//#region Elements
let message;
let canon;
let bullet;
let itemsLeft;
let itemsRight;
//#endregion
//#region Images
let canonImg;
let baseImg;
//#endregion

function preload()
{
    canonImg = loadImage('assets/canon-game/canon.svg');
    baseImg = loadImage('assets/canon-game/base.svg');
}
function setup()
{
    //#region Canvas
    var canvas = createCanvas(width, height);
    canvas.parent("game");
    angleMode(DEGREES);
    pixelDensity(1);
    noStroke();
    //#endregion

    message = new Message(width / 2);
    canon = new Canon(width / 2, height, canonImg, baseImg);
}
function draw()
{
    if(!json_session.playing) return;

    clear();
    
    message.show();
    
    itemsRight.show();
    itemsLeft.show();
    
    //#region Bullet
    if(bullet != null)
    {
        bullet.show();

        //Destroy Bullet
        if(!BoxCast2D([bullet.x, bullet.y], [width/2, height/2], [width, height], bullet.radius)) bullet = null;
    }
    //#endregion

    canon.show();
    canon.update();

    //#region Complete Game
    if(message.current >= message.text.length && !stopDelay)
    {
        stopDelay = true;
        StopGame();
    }
    //#endregion
}

//Input Key
function keyPressed()
{
    if (keyCode === 32 && json_session.playing) Shoot();
}
function Shoot()
{
    if(bullet == null && !stopDelay) 
    {
        var angle = canon.angle;
        bullet = new Bullet(canon.x, canon.y, angle, 20);
    }
}

function ResetGame(questions)
{
    message.wrap(questions, 25);
    
    itemsRight = new Items(1, '#31bd38', width/2, width);
    itemsLeft = new Items(0, '#ef416f', 0, width);
    
    stopDelay = false;
}
async function StopGame()
{
    await delay(500);
    
    json_session.current += gameQuestions;
    json_session.playing = false;
    ChangeViewState(game, questionary);
}