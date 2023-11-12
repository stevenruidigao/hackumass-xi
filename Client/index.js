/* Figure out device via button input
 * Display: Button for starting game
 * Player: Shapes (based on accelerometer calculations)
 */
// msgs
const socket = io();
let type = ""; // screen or player
const players = [];
let ratio;

/* Screen */
socket.on("gameCreated", (data) => {
  console.log(data);
  type = "screen";
  // document.getElementById("LOG").innerText= "You are the screen!";
  document.getElementById("game-id").innerText = data.id;
  document.getElementById("players").innerText = data.playerSockets;
});

socket.on("newJoin", (data) => {
  console.log(data);
  document.getElementById("players").innerText =
    document.getElementById("players").innerText + " " + data;
});

socket.on("updateScreen", (game) => {
  if (type === "screen") {
    Object.values(game.players).forEach((p) => {
      players.forEach((x) => {
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
  // document.getElementById("LOG").innerText= "You are a player!";
  document.getElementById("id").innerText = lobby.id;
  document.getElementById("players").innerText = lobby.playerSockets.reduce(
    (acc, e) => acc + " " + e,
    "",
  );
});

function move() {
  const x = document.getElementById("moveX").value * 1;
  const y = document.getElementById("moveY").value * 1;
  console.log(x);
  console.log(y);
  if (x * y !== NaN) {
    movePlayer(x, y);
  }
}

function movePlayer(vx, vy) {
  socket.emit("move", [vx, vy]);
}
function actPlayer(type) {
  socket.emit("action", type);
}

/* Both */
socket.on("gameStart", (lobby) => {
  console.log(lobby);
  if (type === "screen") {
    // document.getElementById("LOG").innerText = "You are the screen! THE GAME
    // HAS STARTED!!!";
    Object.values(lobby.game.players).forEach((p) =>
      players.push(new Player(p.x, p.y, p.name)),
    );
    document.getElementById("start-menu").style.display = "none";
    // document.getElementById("LOG").innerText += " Game has started.";
  } else {
    // Do player stuff here
    document.getElementById("controls").style.display = "inLine";
  }
});

function showJoin() {
  document.getElementsByClassName("center-buttons")[0].style.display = "none";
  document.getElementsByClassName("player-lobby")[0].style.display = "inline";
}
function joinGame() {
  console.log(document.getElementById("join-code").value);
  socket.emit("joinGame", document.getElementById("join-code").value);
}
function newGame() {
  document.getElementsByClassName("center-buttons")[0].style.display = "none";
  document.getElementsByClassName("screen-lobby")[0].style.display = "inline";
  socket.emit("newGame");
}
function startGame() {
  socket.emit("start");
}

// graphics
let canvas = document.getElementById("canvas");
// H: 1075, W: 1920
// Width of player is about 50 Width, around 150 Height?
// Lets try W:H to be 2:1 and playerWidth to be 1/20 of the width
/*let h = window.innerHeight;
let w = window.innerWidth;
if (w > 2 * h) {
    w = 2 * h;
} else {
    h = 0.5 * w;
}
ratio = w/2000;
console.log("Width: " + w);
console.log("ratio: " + ratio);*/
canvas.height = window.innerHeight;
canvas.width = window.innerWidth;

let ctx = canvas.getContext("2d");
// ctx.scale(ratio, ratio);

setInterval(() => {
  ctx.fillStyle = "rgb(200,200,200)";
  // ctx.fillRect(0,0,2000,1000);
  ctx.fillRect(0, 0, window.innerWidth, window.innerHeight);
  players.forEach((p) => {
    p.updateVerticies();
    p.draw(ctx);
  });
}, 20);
