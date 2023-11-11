const players = [];

class Game {
    constructor(lobby) {
        this.players = {};
        this.players[lobby.playerSockets[0]] = new Player(200, 400, "p1");
        this.players[lobby.playerSockets[1]] = new Player(400, 200, "p2");
        this.interactables = [];
    }
    /*getInput(socket, inputChain) {
        
    }*/
    makeLevel() {
        // For now, we have one hard-coded level
        const obj1 = new Interactable(5, 5, "obj1");
        const obj2 = new Interactable(100, 80, "obj2");
        const obj3 = new Interactable(200, 400, "obj3");
        this.interactables.push(obj1);
        this.interactables.push(obj2);
        this.interactables.push(obj3);
        obj1.addInteractions("horizontalLine");
        obj2.addInteractions("verticalLine, shake");
        obj3.addInteractions("circle");
    }
}

class Interactable {
    constructor(x, y, img=null, name=null) {
        this.x = x;
        this.y = y;
        this.img = img; // Name of a type of drawing
        this.name = name; // Name/id of the Interactable
        this.interactions = [];
        // array of completion effects in the form of functions
        // Remove console.log in actual game?
        this.completions = [()=>console.log(this.name + " has completed!")]; 
    }
    addInteractions(...actions) {
        actions.forEach(x=>this.interactions.push(x));
    }
    doInteraction(action) {
        if (action === this.interactions[0]) {
            this.interactions.shift();
            if (this.interactions.length === 0) {
                this.complete();
            }
        }
    }
    complete() {
        this.completions.forEach(x=>x());
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
    update() {
        this.x += this.vx;
        this.y += this.vy;
        this.vx *= 0.9; // Fiddle with the number as necessary
        // TODO: Implement gravity for vy
    }
}

module.exports = {Game, Interactable, Player, players}