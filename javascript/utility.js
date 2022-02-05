//#region Mathematics
const deltatime = 0.001;
const delay = (ms) => new Promise( resolve => setTimeout(resolve, ms));

function ColisionEnter2D(playerM, playerY, playerSize, objX, objY, objSize)
{
    var row = playerM >= objX && playerM <= objX + objSize; 
    var line = objY <= playerY + playerSize && objY + objSize > playerY;
    
    return row && line;
}

const Lerp = (a, b, t) => a -= (a - b) * t;
const Clamp = (num, min, max) => Math.min(Math.max(num, min), max);
const Random = (maxValue) => Math.floor(Math.random() * maxValue);
//#endregion