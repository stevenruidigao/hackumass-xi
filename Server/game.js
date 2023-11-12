
const lineLineCross = require('./collision.js');
const players = [];
const tickables = [];

const PLAYER_REACH = 50;

class Game {
    constructor(lobby, floorHeight, ratio) {
        this.floorHeight = floorHeight;
        this.ratio = ratio;
        console.log("Floor height is: " + floorHeight);
        this.players = {};

        this.players[lobby.playerSockets[0]] = new Player(800, 400, lobby.playerSockets[0]);
        this.getPlayer1 = () => this.players[lobby.playerSockets[0]];

        this.players[lobby.playerSockets[1]] = new Player(1200, 400, lobby.playerSockets[1]);
        this.getPlayer2 = () => this.players[lobby.playerSockets[1]];

        this.components = [];
        this.level = 1;
        this.makeLevel(1);
    }
    reset() {
        this.components = [];
    }
    update() {
        if (this.level === 1){
            if (this.getPlayer1().x > 1900 && this.getPlayer2().x < 100) {
                this.makeLevel(++this.level);
            }
        } else if (this.level === 2) {
            if (this.components[0].isDone) {
                this.makeLevel(this.level++);
            }
        } else if (this.level === 3) {
            if (this.components[0].x > 1800) { //roll ball to the right
                this.makeLevel(this.level++);
            }
        } else if (this.level === 4) {
            if (this.components[0].isDone) {
                this.makeLevel(this.level++);
            }
        }
        else if (this.level === 5) {
            if (this.components[0].isDone){
                // exit the game
            }
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

            const flag1 = new Component(1900, this.floorHeight-200, ()=>console.log('success'), 'flag');
            const flag2 = new Component(100, this.floorHeight-200, ()=>console.log('success'), 'flag');
            
            this.components.push(flag1);
            this.components.push(flag2);

        } else if (level === 2) {
            // jack box with single vertical line
            this.getPlayer1().x = 800;
            this.getPlayer1().y = 400;
            this.getPlayer2().x = 1200;
            this.getPlayer2().y = 400;

            const jackbox1 = new Interactable(200, 5, ()=>console.log('success'), 'jackbox');
            const jackbox2 = new Interactable(1800, 5, ()=>console.log('success'), 'jackbox');
            
            this.components.push(jackbox1);
            this.components.push(jackbox2);

        } else if (level === 3) {
            // move ball across screen horizontal line 
            this.getPlayer1().x = 200;
            this.getPlayer1().y = 400;
            this.getPlayer2().x = 400;
            this.getPlayer2().y = 400;

            const ball = new Interactable(700, 5, ()=>console.log('success'), 'ball');
            
        } else if (level === 4) {
            // pump balloon with alternating vertical lines
            this.getPlayer1().x = 200;
            this.getPlayer1().y = 400;
            this.getPlayer2().x = 1800;
            this.getPlayer2().y = 400;

            const balloon = new Interactable(1000, 5, ()=>console.log('success'), 'balloon');

        } else if (level === 5) {
            // shake to make party popper go
            this.getPlayer1().x = 200;
            this.getPlayer1().y = 400;
            this.getPlayer2().x = 400;
            this.getPlayer2().y = 400;

            const partyPopper = new Interactable(1800, 5, ()=>console.log('success'), 'partyPopper');

        }
    }

    action(interaction, player) {
        const x = player.x;

        this.components.forEach(c=> {
            if (Math.abs(c.x - x) <= PLAYER_REACH) {
                c.dointeraction(interaction);
            }
        })
    }
}

class Component {
    constructor(x, y, img=null, name='') {
        this.x = x;
        this.y = y;
        this.vx = 0;
        this.vy = 0;
        this.width = 50;
        this.height = 50;
        this.type = img; // Name of a type of drawing
        this.name = name; // Name/id of the Interactable
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
    constructor(x, y, onComplete, img=null, name=null, reset=true) {
        super(x, y, img, name);
        this.interactions = [];
        this.interactionsLeft = [];
        this.complete = onComplete;
        this.isInteractable = true;
        this.reset = reset;
        this.isDone = false;
    }

    addInteractions(...actions) {
        actions.forEach(x=>this.interactions.push(x));
    }

    doInteraction(action) {
        if (action === this.interactionsLeft[0]) {
            this.interactionsLeft.shift();

            if (this.interactionsLeft.length === 0) {
                this.isDone = true;
                this.complete(this);
            }

        } else if (this.reset) {
            this.resetInteractions();
        }

        this.game.changes.push(this);
    }

    resetInteractions() {
        this.interactionsLeft = this.interactions.map(x=>x);
        this.game.changes.push(this);
    }
}

class TimedInteractable extends Interactable {
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
}

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

module.exports = {Game, Component, Interactable, TimedInteractable, Player, players}