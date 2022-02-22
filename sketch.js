let width = 280, height = 450;
let play = false;
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
    canonImg = loadImage('assets/canon-game/canon.png');
    baseImg = loadImage('assets/canon-game/base.png');
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

    message = new Message(width / 2, 16);
    canon = new Canon(width / 2, height, canonImg, baseImg);
}
function draw()
{
    if(!play) return;

    clear();
    
    message.show();
    
    itemsLeft.show(bullet);
    itemsRight.show(bullet);
    
    //#region Bullet
    if(bullet != null)
    {
        bullet.show();

        //Destroy
        if(!BoxCast2D([bullet.x, bullet.y], [width/2, height/2], [width, height], bullet.radius))
            bullet = null;
    }
    //#endregion

    canon.show();
    canon.update(bullet);

    //#region Complete Game
    if((!itemsLeft.enable.includes(1) || !itemsRight.enable.includes(1)) && !stopDelay)
    {
        stopDelay = true;
        StopGame();
    }
    //#endregion
}

//Input Key
function keyPressed()
{
    if (keyCode === 32 && play) Shoot();
}
function Shoot()
{
    if(bullet == null && !stopDelay) 
    {
        var angle = canon.angle;
        bullet = new Bullet(canon.x, canon.y, angle, 20);
    }
}

function ResetGame(question)
{
    message.wrap(question, 25);
    
    itemsLeft = new Items('No', '#ef416f', 0, width);
    itemsRight = new Items('Si', '#31bd38', width/2, width);
    
    stopDelay = false;
    play = true;
}
async function StopGame()
{
    await delay(1000);
    InterpolateGame();
    play = false;
}