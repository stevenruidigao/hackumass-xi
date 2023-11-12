
const lineLineCross = require("./collision.js");
const players = [];
const tickables = [];

const PLAYER_REACH = 50;

class Game {
    constructor(lobby) {
        this.players = {};
        this.players[lobby.playerSockets[0]] = new Player(200, 400, "p1");
        this.players[lobby.playerSockets[1]] = new Player(400, 200, "p2");
        this.components = [];
        this.statics = [];
    }
    /*getInput(socket, inputChain) {
        
    }*/
    makeLevel() {
        // For now, we have one hard-coded level
        const obj1 = new Interactable(5, 5, ()=>console.log("success"), "obj1");
        const obj2 = new TimedInteractable(100, 80, ()=>console.log("success"), "obj2");
        const obj3 = new Interactable(200, 400, ()=>console.log("success"), "obj3");
        this.components.push(obj1);
        this.components.push(obj2);
        this.components.push(obj3);
        obj1.addInteractions("horizontalLine");
        obj2.addInteractions("verticalLine, shake");
        obj3.addInteractions("circle");

        const ground = new Component()
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
    constructor(x, y, img=null, name="") {
        this.x = x;
        this.y = y;
        this.img = img; // Name of a type of drawing
        this.name = name; // Name/id of the Interactable
        this.isInteractable = false;

        //bounding box
        this.corners = [];
    }
    collide(p) {
        //check if any boundary line of the two objects cross
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
    }
    addInteractions(...actions) {
        actions.forEach(x=>this.interactions.push(x));
    }
    doInteraction(action) {
        if (action === this.interactionsLeft[0]) {
            this.interactionsLeft.shift();
            if (this.interactionsLeft.length === 0) {
                this.complete();
            }
        } else if (this.reset) {
            this.resetInteractions();
        }
    }
    resetInteractions() {
        this.interactionsLeft = this.interactions.map(x=>x);
    }
}

class TimedInteractable extends Interactable {
    constructor(x, y, onComplete, img=null, name=null, reset=true, time=3) {
        super(x, y, oncomplete, img, name, reset);
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
    constructor(x, y, name="") {
        players.push(this);
        this.name = name;
        this.x = x;
        this.y = y;
        this.vx = 0;
        this.vy = 0;
    }
    update(game) {
        this.x += this.vx;
        this.y += this.vy;
        this.vx *= 0.95; // Fiddle with the number as necessary
        // TODO: Implement gravity for vy
    }
    checkCollisions(game) {
        game.components.forEach((c) => {
            if (c.collide(this)){
                this.x -= this.vx;
                this.vx = 0;
            }
        })
    }
}

module.exports = {Game, Component, Interactable, TimedInteractable, Player, players}