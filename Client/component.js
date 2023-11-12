class Component {
    // x should be between 0 and 2000
    // y should be between 0 and 1000
    constructor(x, y, name='') {
        this.x = x;
        this.y = y;
        this.name = name;
    }
    
    // draw(ctx) {
    //     // Draw
    //     console.log('Draw called on Component object. This should not happen.');
    // }
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
class Flag extends Component {
    constructor(x, y, width, height, name='', filled=false) {
        // x, y is upper left corner
        super(x, y, name);
        this.width = width;
        this.height = height;
    }
    draw(ctx) {
        console.log("TESTING")
        ctx.strokeRect(this.x, this.y-100, 100, 50);
        ctx.beginPath();
        ctx.moveTo(this.x,this.y);
        ctx.lineTo(this.x,this.y - 100);
        ctx.stroke();
    }
}

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

        arrow({x: this.x-50, y: this.y+100}, {x: this.x+50, y: this.y+100}, 20);

        function arrow (p1, p2, size) {
            var angle = Math.atan2((p2.y - p1.y) , (p2.x - p1.x));
            var hyp = Math.sqrt((p2.x - p1.x) * (p2.x - p1.x) + (p2.y - p1.y) * (p2.y - p1.y));
          
            ctx.save();
            ctx.translate(p1.x, p1.y);
            ctx.rotate(angle);
            
            // line
            ctx.beginPath();	
            ctx.moveTo(0, 0);
            ctx.lineTo(hyp - size, 0);
            ctx.stroke();
          
            // triangle
            ctx.fillStyle = 'black';
            ctx.beginPath();
            ctx.lineTo(hyp - size, size);
            ctx.lineTo(hyp, 0);
            ctx.lineTo(hyp - size, -size);
            ctx.fill();
          
            ctx.restore();
        }
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
        ctx.fillStyle = 'rgb(200,200,200)';
        //snorlax head!
        if (this.turnsLeft == 0) {
            ctx.strokeRect(this.x+30, this.y-40, 20, 80);
            ctx.beginPath();
            ctx.ellipse(this.x+40,this.y-40,25,20,0,0,Math.PI*1.15)
            ctx.lineTo(this.x+14,this.y-60);
            ctx.ellipse(this.x+40,this.y-40,25,20,0,Math.PI*1.3,Math.PI*1.7)
            ctx.lineTo(this.x+66,this.y-60);
            ctx.ellipse(this.x+40,this.y-40,25,20,0,Math.PI*1.85, Math.PI*2)
            ctx.fill();
            ctx.stroke();

            ctx.beginPath();
            ctx.moveTo(this.x+25, this.y-40);
            ctx.lineTo(this.x+35, this.y-40);
            ctx.stroke();

            ctx.beginPath();
            ctx.moveTo(this.x+45, this.y-40);
            ctx.lineTo(this.x+55, this.y-40);
            ctx.stroke();

            ctx.beginPath();
            ctx.moveTo(this.x+30, this.y-30);
            ctx.lineTo(this.x+50, this.y-30);
            ctx.stroke();
        }
        //box
        ctx.strokeRect(this.x, this.y, 80, 80);
        ctx.fillRect(this.x, this.y, 80, 80);
        ctx.strokeRect(this.x-5, this.y+35, 5, 10);
        //handle
        if (this.turnsLeft %2 == 0) {
            ctx.strokeRect(this.x-10, this.y+35, 5, 40);
            ctx.strokeRect(this.x-15, this.y+65, 5, 10);
        } 
        else {
            ctx.strokeRect(this.x-10, this.y+5, 5, 40);
            ctx.strokeRect(this.x-15, this.y+5, 5, 10);
        }
        
        //star pattern
        strokeStar(this.x+40,this.y+40,10,5,2)

        arrow({x: this.x, y: this.y+200}, {x: this.x, y: this.y+100}, 20);

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

        function arrow (p1, p2, size) {
            var angle = Math.atan2((p2.y - p1.y) , (p2.x - p1.x));
            var hyp = Math.sqrt((p2.x - p1.x) * (p2.x - p1.x) + (p2.y - p1.y) * (p2.y - p1.y));
          
            ctx.save();
            ctx.translate(p1.x, p1.y);
            ctx.rotate(angle);
          
            // line
            ctx.beginPath();	
            ctx.moveTo(0, 0);
            ctx.lineTo(hyp - size, 0);
            ctx.stroke();
          
            // triangle
            ctx.fillStyle = 'black';
            ctx.beginPath();
            ctx.lineTo(hyp - size, size);
            ctx.lineTo(hyp, 0);
            ctx.lineTo(hyp - size, -size);
            ctx.fill();
          
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
        ctx.strokeRect(this.x+20, this.y-50, 10, 50);
        ctx.strokeRect(this.x, this.y-58, 50, 8);
        ctx.strokeRect(this.x, this.y, 50, 5);
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
        ctx.moveTo(this.x, this.y); 
        ctx.lineTo(this.x-30, this.y-100); 
        ctx.lineTo(this.x+30, this.y-100); 
        ctx.closePath();
        ctx.stroke();

        ctx.beginPath();
        ctx.arc(this.x, this.y, 15, 0, Math.PI * 2, false); 
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