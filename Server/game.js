
const lineLineCross = require('./collision.js');
const players = [];
//const tickables = [];

const PLAYER_REACH = 125;

class Game {
    constructor(lobby, floorHeight, ratio) {
        this.floorHeight = floorHeight;
        this.ratio = ratio;
        console.log("Floor height is: " + floorHeight);
        this.players = {};

        this.players[lobby.playerSockets[0]] = new Player(800, 400, lobby.playerSockets[0]);
        this.player1 = this.players[lobby.playerSockets[0]];

        this.players[lobby.playerSockets[1]] = new Player(1200, 400, lobby.playerSockets[1]);
        this.player2 = this.players[lobby.playerSockets[1]];

        this.components = [];
        this.level = 1;
        this.makeLevel(1);
    }
    reset() {
        this.components = [];
    }
    update() {
        if (this.level === 1){
            if (this.player1 && this.player1.x > 1900 && this.player2 && this.player2.x < 100) {
                this.level ++;
                this.makeLevel(2);
            }
        } else if (this.level === 2) {
            if (this.components[0].isDone && this.components[1].isDone) {
                this.level ++;
                this.makeLevel(3);
            }
        } else if (this.level === 3) {
            if (this.components[0].x > 1800) { //roll ball to the right
                this.level ++;
                this.makeLevel(4);
            }
        } else if (this.level === 4) {
            if (this.components[0].isDone) {
                this.level++;
                this.makeLevel(5);
                //exit here, trigger confetti
            }
        }
        else if (this.level === 5) {
            console.log("EEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEE")
        }
        
        this.components.forEach(c => {
            c.update();
        })
    }


    // const ball = new Interactable(100, 500, (self)=>self.vx = -10, 'ball');
    // const box = new Interactable(800, 500, (self) => self.vx = 10, 'box');
    
    // game.components.push(ball);
    // game.components.push(box);
    makeLevel(level) {
        this.reset();
        if (level === 1){
            // player 1 moves to the right, player 2 moves to the left

            const flag1 = new Component(1900, this.floorHeight-200, 'flag');
            const flag2 = new Component(100, this.floorHeight-200, 'flag');
            
            this.components.push(flag1);
            this.components.push(flag2);

        } else if (level === 2) {
            // jack box with single vertical line
            this.player1.x = 800;
            this.player1.y = 400;
            this.player2.x = 1200;
            this.player2.y = 400;

            const jackbox1 = new Interactable(200, this.floorHeight-270, 'jackbox', ['vertical line']);
            const jackbox2 = new Interactable(1800, this.floorHeight-270, 'jackbox', ['vertical line']);
            
            this.components.push(jackbox1);
            this.components.push(jackbox2);

        } else if (level === 3) {
            // move ball across screen horizontal line 
            this.player1.x = 200;
            this.player1.y = 400;
            this.player2.x = 400;
            this.player2.y = 400;

            const ball = new Interactable(700, this.floorHeight-235, 'ball',
                    ['horizontal line', 'horizontal line', 'horizontal line'],  (self)=>self.x+=400);
            this.components.push(ball);
        // } else if (level === 4) {
        //     // pump balloon with alternating vertical lines
        //     this.player1.x = 200;
        //     this.player1.y = 400;
        //     this.player2.x = 1800;
        //     this.player2.y = 400;

        //     const balloon = new Interactable(1000, this.floorHeight-200, 'balloon');
        } else if (level === 4) {
            // shake to make party popper go
            this.player1.x = 200;
            this.player1.y = 400;
            this.player2.x = 400;
            this.player2.y = 400;

            const partyPopper = new Interactable(1800, this.floorHeight-200, 'popper', ['shake']);
            this.components.push(partyPopper);
        }
    }

    action(interaction, player) {
        const x = player.x;

        this.components.forEach(c => {
            if (Math.abs(c.x - x) <= PLAYER_REACH && c.isInteractable) {
                c.doInteraction(interaction);
            }
        })
    }
}

class Component {
    constructor(x, y, name='') {
        this.x = x;
        this.y = y;
        this.vx = 0;
        this.vy = 0;
        this.width = 50;
        this.height = 50;
        //this.type = img; // Name of a type of drawing19
        this.type = name; // Name/id of the Interactable
        this.isInteractable = false;
        this.data = {};
    }

    update() {
        this.x += this.vx;
        this.y += this.vy;
    }
    
    collide(p) {
        //check if any boundary line of the two objects cross TODO
        let corners = [[p.x-30, p.y-30],[p.x+30, p.y-30],[p.x-30, p.y+200],[p.x-30, p.y+200]];
        
        for (var c = 0; c < corners.length; c++){
            for (var d = 0; d < this.corners.length; d++){
                var intersect = lineLineCross(corners[c], corners[(c+1)%corners.length],       
                this.corners[d], this.corners[(d+1)%this.corners.length]);
                return true;
            }
        }

        return false;
    }
}

class Interactable extends Component{
    constructor(x, y, name, interactions, onComplete=()=>{}) {
        super(x, y, name);
        this.interactions = interactions;
        this.isInteractable = true;
        this.isDone = false
        this.onComplete = onComplete;
    }

    addInteractions(...actions) {
        actions.forEach(x => this.interactions.push(x));
    }

    doInteraction(action) { // action is a string, either horiz or vert line
        if (this.interactions.length > 0 && action === this.interactions[0]) {
            this.interactions.shift();
            if (this.interactions.length === 0) {
                this.isDone = true;
            }
            if (this.onComplete) {
                this.onComplete(this);
            }
        } 
    }

}

/*class TimedInteractable extends Interactable {
    constructor(game, x, y, onComplete, img=null, name=null, reset=true, time=3) {
        super(game, x, y, oncomplete, img, name, reset);
        // time is in seconds, this.time is in 0.02 seconds
        this.time = time * 50;
        this.active = false;
        this.prevAction = 0;
        tickables.push(this);
    }

    tick() {
        if (this.active && ++this.prevAction > this.time) {
            this.active = false;
            this.resetInteractions();
        }
    }
}*/

class Player {
    constructor(x, y, name) {
        players.push(this);
        this.name = name;
        //this.game = game;
        this.x = x;
        this.y = y;
        this.vx = 0;
        this.vy = 0;
    }

    update(game) {
        this.x += this.vx;
        //prevent out of bounds
        if (this.x < 0 + 60 || this.x > 2000 - 60) {// 60 is approximately half the width of the puppet
            this.x -= this.vx;
            this.vx = 0;
        }
        this.vx *= 0.95; // Fiddle with the number as necessary
        if (Math.abs(this.vx) < 1) this.vx = 0;
        // TODO: Implement gravity for vy
        this.y += this.vy;
        this.vy += 0.80; // Gravity, fiddle with as necessary
        if (this.y >= game.floorHeight - 220 - 200) { // 200 is the height of the ground
            this.vy = 0;
            this.y = game.floorHeight - 220 - 200; // 210 is the height of the puppet, estimated
        }
        
    }

    checkCollisions() {
        // this.game.components.forEach((c) => {
        //     if (c.collide(this)){
        //         this.x -= this.vx;
        //         this.vx = 0;
        //     }
        // });
    }
}

module.exports = {Game, Component, Interactable, Player, players}