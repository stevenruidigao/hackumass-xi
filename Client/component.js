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
        //snorlax head!
        if (this.turnsLeft == 0) {
            ctx.strokeRect(x+30, y-40, 20, 80);
            ctx.beginPath();
            ctx.ellipse(x+40,y-40,25,20,0,0,Math.PI*1.15)
            ctx.lineTo(x+14,y-60);
            ctx.ellipse(x+40,y-40,25,20,0,Math.PI*1.3,Math.PI*1.7)
            ctx.lineTo(x+66,y-60);
            ctx.ellipse(x+40,y-40,25,20,0,Math.PI*1.85, Math.PI*2)
            ctx.fill();
            ctx.stroke();

            ctx.beginPath();
            ctx.moveTo(x+25, y-40);
            ctx.lineTo(x+35, y-40);
            ctx.stroke();

            ctx.beginPath();
            ctx.moveTo(x+45, y-40);
            ctx.lineTo(x+55, y-40);
            ctx.stroke();

            ctx.beginPath();
            ctx.moveTo(x+30, y-30);
            ctx.lineTo(x+50, y-30);
            ctx.stroke();
        }
        //box
        ctx.strokeRect(x, y, 80, 80);
        ctx.fillRect(x, y, 80, 80);
        ctx.strokeRect(x-5, y+35, 5, 10);
        //handle
        if (this.turnsLeft %2 == 0) {
            ctx.strokeRect(x-10, y+35, 5, 40);
            ctx.strokeRect(x-15, y+65, 5, 10);
        } 
        else {
            ctx.strokeRect(x-10, y+5, 5, 40);
            ctx.strokeRect(x-15, y+5, 5, 10);
        }
        
        //star pattern
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
    constructor(x, y, width, height, name='', filled=false) {
        // x, y is upper left corner
        super(x, y, name);
        this.width = width;
        this.height = height;
    }

    draw(ctx) {
        ctx.strokeRect(x+20, y-50, 10, 50);
        ctx.strokeRect(x, y-58, 50, 8);
        ctx.strokeRect(x, y, 50, 5);
    }


}

//triggered by both players shaking
class Popper extends Component {
    constructor(x, y, width, height, name='', filled=false) {
        // x, y is upper left corner
        super(x, y, name);
        this.width = width;
        this.height = height;
    }

    draw(ctx) {
        ctx.beginPath();
        ctx.moveTo(x, y); 
        ctx.lineTo(x-30, y-100); 
        ctx.lineTo(x+30, y-100); 
        ctx.closePath();
        ctx.stroke();

        ctx.beginPath();
        ctx.arc(x, y, 15, 0, Math.PI * 2, false); 
        ctx.fill();
        ctx.stroke(); 
    }
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