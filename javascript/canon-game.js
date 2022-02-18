class Message
{
    constructor(x, size)
    {
        this.x = x;
        this.y = 10;
        this.text = "";
        this.size = size;
    }
    show()
    {
        fill(0);
        textStyle(BOLD);
        textAlign(CENTER, TOP);
        textSize(this.size);
        text(this.text, this.x, this.y);
    }
    wrap(text, maxWidth)
    {
        var line = '';
        var split = 0;

        for(var i = 0; i < text.length; i++)
        {
            var c = text.charAt(i);
            
            if(split < maxWidth) split ++;
            else if(c == ' ')
            {
                c = '\n';
                split = 0;
            }

            line += c;
        }

        this.text = line;
    }
}
class Items
{
    constructor(text, color, x, canvas)
    {
        this.text = text;
        this.color = color;

        this.x = x;
        this.enable = [1, 1, 1, 1, 1, 1];
        this.radius = canvas / this.enable.length;
    }
    show()
    {
        var index = 0;
        var base = 3;
        var x = this.x + this.radius / 2;
        var y = this.radius / 2 + 100;

        for(var i = 0; i < 3; i++)
        {
            for(var e = 0; e < base; e++)
            {
                fill(this.color);

                if(this.enable[index] != 0)
                {
                    var xPos = x + this.radius * e;
                    var yPos = y + (this.radius - 5) * i;
                    
                    circle(xPos, yPos, this.radius);
                    
                    //Collision Enter
                    if(bullet != null)
                    {
                        if(CircleCast([xPos, yPos], this.radius/2, [bullet.x, bullet.y], bullet.radius/2))
                        {
                            this.enable[index] = 0;
                            bullet = null;
                        }
                    }
                    
                    fill(255);
                    textStyle(NORMAL);
                    textAlign(CENTER, CENTER);
                    text(this.text, xPos, yPos + 1);
                }

                index++;
            }
            
            base--;
            x += this.radius / 2;
        }
    }
}
class Canon
{
    constructor(x, y, canon, base)
    {
        this.width = 40;
        this.height = 80;
        
        this.x = x;
        this.y = y - this.height / 2;

        this.angle = 0;
        this.speed = 2;
        this.maxAngle = 45;
        this.direction = 1;

        this.canon = canon;
        this.base = base;
    }
    show()
    {
        translate(this.x, this.y);
        rotate(this.angle);
        imageMode(CENTER);
        image(this.canon, 0, -this.height/3, this.width, this.height);

        rotate(-this.angle);
        image(this.base, 0, 10, 60, 50);
    }
    update(bullet)
    {
        // if(bullet != null) return;

        if(this.angle > this.maxAngle || this.angle < -this.maxAngle) 
            this.direction = (this.direction == 1) ? -1 : 1;
        
        this.angle += this.speed * this.direction;
    }
}
class Bullet
{
    constructor(x, y, angle, radius)
    {
        this.x = x;
        this.y = y;
        this.angle = angle;
        this.radius = radius;
    }
    show()
    {
        fill('#8f3680');
        
        var speed = deltaTime * 0.8;
        var dir = (this.angle / 45.0) * speed;
        
        this.x += dir;
        this.y -= speed;
        
        circle(this.x, this.y, this.radius);
    }
}