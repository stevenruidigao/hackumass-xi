class Component {
    // x should be between 0 and 2000
    // y should be between 0 and 1000
    constructor(x, y, name="") {
        this.x = x;
        this.y = y;
        this.name = name;
    }
    draw(ctx) {
        // Draw
        console.log("Draw called on Component object. This should not happen.");
    }
}

class Box extends Component {
    constructor(x, y, width, height, name="", filled=false) {
        // x, y is upper left corner
        super(x, y, name);
        this.width = width;
        this.height = height;
        this.filled = filled;
    }
    draw(ctx) {
        ctx[(this.filled?"fillRect":"strokeRect")](this.x, this.y, this.width, this.height);
    }
}

class Circle extends Component {
    
}

function makeComponent(c) {
    if (c.img === "ground") {
        return new Box(c.x, c.y, 2000, 200, c.name, true);
    } else if (c.name === "") {
        return new Component(0, 0, "");
    } else {
        return new Component(0, 0, c.name);
    }
}