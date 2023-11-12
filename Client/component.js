class Component {
    // x should be between 0 and 2000
    // y should be between 0 and 1000
    constructor(x, y, name='') {
        this.x = x;
        this.y = y;
        this.name = name;
    }
    
    draw(ctx) {
        // Draw
        console.log('Draw called on Component object. This should not happen.');
    }
}

class Box extends Component {
    constructor(x, y, width, height, name='', filled=false) {
        // x, y is upper left corner
        super(x, y, name);
        this.width = width;
        this.height = height;
        this.filled = filled;
    }

    draw(ctx) {
        ctx[(this.filled?'fillRect':'strokeRect')](this.x, this.y, this.width, this.height);
    }
}

//Swipe Right to throw
class Ball extends Component {
    constructor(x, y, width, height, name='', filled=false) {
        // x, y is upper left corner
        super(x, y, name);
        this.width = width;
        this.height = height;
    }

    draw(ctx) {
        ctx.beginPath();
        ctx.ellipse(this.x, this.y, 50, 50, 0, 0, 2 * Math.PI);//
        ctx.fill();
        ctx.stroke();
    }
}

//crank the wheel in a triangle shape
class JackBox extends Component {
    constructor(x, y, width, height, name='', filled=false) {
        // x, y is upper left corner
        super(x, y, name);
        this.width = width;
        this.height = height;
        this.turnsLeft = 3;
    }

    draw(ctx) {
        if (this.turnsLeft == 0) {
            
        }
        ctx.strokeRect(x, y, 80, 80);
        ctx.strokeRect(x-5, y+35, 5, 10);
        if (this.turnsLeft %2 == 0) {
            ctx.strokeRect(x-10, y+35, 5, 40);
            ctx.strokeRect(x-15, y+65, 5, 10);
        } 
        else {
            ctx.strokeRect(x-10, y+5, 5, 40);
            ctx.strokeRect(x-15, y+5, 5, 10);
        }
        

        strokeStar(x+40,y+40,10,5,2)


        function strokeStar(x, y, r, n, inset) {
            ctx.save();
            ctx.beginPath();
            ctx.translate(x, y);
            ctx.rotate(Math.PI);
            ctx.moveTo(0,0-r);

            for (var i = 0; i < n; i++) {
                ctx.rotate(Math.PI / n);
                ctx.lineTo(0, 0 - (r*inset));
                ctx.rotate(Math.PI / n);
                ctx.lineTo(0, 0 - r);
            }
            ctx.closePath();
            ctx.stroke();
            ctx.restore();
        }
    }
}

//players alternate swiping down
class Pump extends Component {
    
}

//triggered by both players shaking
class Popper extends Component {
    
}

function makeComponent(c) {
    if (c.img === 'ground') {
        return new Box(c.x, c.y, 2000, 200, c.name, true);

    } else if (c.name === '') {
        return new Component(0, 0, '');

    } else {
        return new Component(0, 0, c.name);
    }
}