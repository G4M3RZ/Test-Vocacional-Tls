const deltatime = 0.001;

const delay = (ms) => new Promise( resolve => setTimeout(resolve, ms));
async function until(fn) { while(!fn()) { await delay(100); } }

function BoxCast2D(position, target, size, margen)
{
    var width = (size[0] / 2) + margen;
    var hor = position[0] >= target[0] - width && position[0] <= target[0] + width;

    var height = (size[1] / 2) + margen;
    var ver = position[1] >= target[1] - height && position[1] <= target[1] + height;
    
    return hor && ver;
}
function CircleCast(position, r1, target, r2)
{
    var rad = r1 + r2;
    var x = position[0] - target[0];
    var y = position[1] - target[1];

    return (rad > Math.sqrt((x * x) + (y * y)));
}

const Lerp = (a, b, t) => a -= (a - b) * t;
const Clamp = (num, min, max) => Math.min(Math.max(num, min), max);
const Random = (maxValue) => Math.floor(Math.random() * maxValue);

const idArray = array =>
{
    let arr = [];
    for(let i = 0; i < array.length; i++) arr.push(array[i].id);
    return arr;
}
const orderArray = array =>
{
    array.sort(function(a, b) { return a.question_id - b.question_id });
}
const shuffleArray = array =>
{
    for (let i = array.length - 1; i > 0; i--)
    {
        const j = Math.floor(Math.random() * (i + 1));
        const temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
}