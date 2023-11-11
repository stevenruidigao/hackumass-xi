/* Figure out device via button input
 * Display: Button for starting game
 * Player: Shapes (based on accelerometer calculations)
 * 
 * 
 * 
 * 
 * 
 * 
 */
//msgs
const socket = io();
let type = "";
const players = [];

/* Screen */
socket.on("gameCreated", (data) => {
    console.log(data);
    type = "screen";
    document.getElementById("LOG").innerText= "You are the screen!";
    document.getElementById("id").innerText= data.id;
    document.getElementById("players").innerText= data.playerSockets;
});

socket.on("newJoin", (data) => {
    console.log(data);
    document.getElementById("players").innerText = document.getElementById("players").innerText + " " + data;
});

socket.on("updateScreen", (game) => {
    console.log(game); //
    if (type === "server") {
        Object.values(game.players).forEach(p=> {
            players.forEach(x=> {
                if (x.name === p.name) {
                    x.update(p);
                }
            });
        });
    }
});

/* Player */
socket.on("joinedGame", (lobby) => {
    type = "player";
    document.getElementById("LOG").innerText= "You are a player!";
    document.getElementById("id").innerText= lobby.id;
    document.getElementById("players").innerText= lobby.playerSockets.reduce((acc, e)=>acc + " " + e, "");
});

function movePlayer(vx, vy) {
    socket.emit("move",[vx, vy])
}
function actPlayer(type) {
    socket.emit("action",type)
}

/* Both */
socket.on("gameStart", (lobby) => {
    console.log(lobby);
    if (type === "screen") {
        document.getElementById("LOG").innerText = "You are the screen! THE GAME HAS STARTED!!!";
        Object.values(lobby.game.players).forEach(p=>players.push(new Player(p.x, p.y, p.name)));
        document.getElementById("LOG").innerText += " Game has started.";
        document.getElementById("controls").style.display = "inLine";
    } else {
        // Do player stuff here
    }
});

function joinGame() {
    console.log(document.getElementById("join").value)
    socket.emit("joinGame", document.getElementById("join").value);
}
function newGame() {
    socket.emit("newGame");
}
function startGame() {
    socket.emit("start");
}
/*function move() {
    console.log(document.getElementById("moveX").value);//
    console.log(document.getElementById("moveY").value);//
    const x = document.getElementById("moveX").value * 1;
    const y = document.getElementById("moveY").value * 1;
    if (x * y != NaN) {
        socket.emit("move", [x, y]);
    }
}*/

//graphics
let canvas = document.getElementById("canvas");
canvas.height = window.innerHeight;
canvas.width = window.innerWidth;
let ctx = canvas.getContext("2d");

let x = 300;
let y = 300;
let test = new Player(400,400);
players.push(test);
setInterval(() => {
    ctx.fillStyle = "rgb(200,200,200)"
    ctx.fillRect(0,0,window.innerWidth,window.innerHeight);
    /*players.forEach(p=> {
        p.updatePosition();
        p.updateVerticies();
        p.draw(ctx);
    });*/
    test.updatePosition();
    //test.updateVerticies();
    players.forEach(p =>{
        //p.updatePosition();
        p.updateVerticies();
        p.draw(ctx);
    })
},20)