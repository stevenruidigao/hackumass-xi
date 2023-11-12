/* Figure out device via button input
 * Display: Button for starting game
 * Player: Shapes (based on accelerometer calculations)
 */
//msgs
const socket = io();
let type = ''; //screen or player
const players = []; // Players in the game
const components = []; // Components in the game
let ratio;

/* Screen */
socket.on('gameCreated', (data) => {
    console.log(data);
    type = 'screen';
    document.getElementById('game-id').innerText = data.id;
});

socket.on('newJoin', (length) => {
    console.log(length);
    document.getElementById('num-players').innerText = length;
    document.getElementById('num-players-2').innerText = length;
});

socket.on('updateScreen', (game) => {
    if (type === 'screen') {
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
socket.on('joinedGame', (lobby) => {
    type = 'player';
    // Show joined game display
    document.getElementsByClassName('player-lobby')[0].style.display='none';
    document.getElementsByClassName('waiting-room')[0].style.display='inline';
    document.getElementById('game-id-2').innerText = lobby.id;
    document.getElementById('num-players-2').innerText = lobby.playerSockets.length;
});

socket.on('lobby-closed', (lobbyId) => {
    socket.emit('leave', lobbyId);
    document.getElementsByClassName('waiting-room')[0].style.display='none';
    document.getElementsByClassName('center-buttons')[0].style.display='inline';
    alert('Host has left the lobby.');
});

function move() {
    const x = document.getElementById('moveX').value * 1;
    const y = document.getElementById('moveY').value * 1;
    console.log(x);
    console.log(y);

    if (x * y !== NaN) {
        movePlayer(x, y);
    }
}

function movePlayer(vx, vy) {
    socket.emit('move',[vx, vy]);
}

function actPlayer(type) {
    socket.emit('action',type);
}

/* Both */
socket.on('gameStart', (lobby) => {
    console.log(lobby);
    if (type === 'screen') {
        //document.getElementById('LOG').innerText = 'You are the screen! THE GAME HAS STARTED!!!';
        Object.values(lobby.game.players).forEach(p=>players.push(new Player(p.x, p.y, p.name)));

        lobby.game.components.forEach(c=>{
            components.push(makeComponent(c));
        });

        document.getElementById('start-menu').style.display = 'none';
        
    } else {
        // Do player stuff here
        document.getElementById('controls').style.display = 'inline';
    }
});

function showReq() {
    document.getElementsByClassName('center-buttons')[0].style.display='none';
    document.getElementsByClassName('permissions')[0].style.display='inline';

    let three = document.createElement('script');
    three.src = 'https://cdnjs.cloudflare.com/ajax/libs/three.js/0.158.0/three.min.js';
    document.body.appendChild(three);

    three.onload = function () {
        qdollar = document.createElement('script');
        qdollar.src = './qdollar.js';
        document.body.appendChild(qdollar);

        qdollar.onload = () => {
            script = document.createElement('script');
            script.src = './detection.js';
            document.body.appendChild(script);
        }
    }

}

function showJoin() {
    document.getElementsByClassName('permissions')[0].style.display='none';
    document.getElementsByClassName('player-lobby')[0].style.display='inline';
}

function joinGame() {
    console.log(document.getElementById('join-code').value);
    socket.emit('joinGame', document.getElementById('join-code').value);
    document.getElementById('join-code').value = "";
}

function newGame() {
    document.getElementsByClassName('center-buttons')[0].style.display='none';
    document.getElementsByClassName('screen-lobby')[0].style.display='inline';
    socket.emit('newGame');
}

function startGame() {
    socket.emit('start');
}

//graphics
let canvas = document.getElementById('canvas');
// H: 1075, W: 1920
// Width of player is about 50 Width, around 150 Height?
// Lets try W:H to be 2:1 and playerWidth to be 1/20 of the width
// Currently, we are just using full screen, which means that relative height might vary between computers
let h = window.innerHeight;
let w = window.innerWidth;
ratio = w/2000;
canvas.height = h;
canvas.width = w;
let ctx = canvas.getContext('2d');
ctx.scale(ratio, ratio);

setInterval(() => {
    ctx.fillStyle = 'rgb(200,200,200)';
    ctx.fillRect(0,0,window.innerWidth/ratio,window.innerHeight/ratio);

    players.forEach(p =>{
        p.updateVerticies();
        p.draw(ctx);
    })

    components.forEach(c => {
        c.draw(ctx);
    });
},20)