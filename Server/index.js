const http = require("http");
const express = require("express");
const socketio = require("socket.io");
const path = require("node:path");
const l = require("./lobby.js");
const g = require("./game.js");


const clientPath = path.join(__dirname, "../Client");
console.log("Serving static from " + clientPath);

const app = express();
app.use(express.static(clientPath));

const server = http.createServer(app);
const io = socketio(server);

io.on("connection", (socket) => {
    socket.emit("message","You are connected!"); // send a msg to client
    console.log("new connection: " + socket.id);//
    // Lobby Events
    socket.on("newGame",() => {
        const lobby = new l.Lobby();
        lobby.addScreen(socket.id);
        socket.join(lobby.id);
        l.sockets[socket.id] = lobby;
        socket.emit("gameCreated", lobby);
        console.log(socket.id + " created game: " + lobby.id);//
    });
    socket.on("joinGame", (code)=> {
        const lobby = l.lobbies[code];
        if (lobby !== undefined && lobby.addPlayer(socket.id)) {
            socket.join(lobby.id);
            l.sockets[socket.id] = lobby;
            socket.emit("joinedGame", lobby);
            socket.to(lobby.id).emit("newJoin", socket.id);
            console.log(socket.id + " joined game: " + lobby.id);//
        }
    });
    socket.on("start", ()=> {
        const lobby = l.sockets[socket.id];
        if (lobby !== undefined && lobby.screenSocket === socket.id && lobby.playerSockets.length === 2 && lobby.game === undefined) {
            lobby.game = new g.Game(lobby);
            io.to(lobby.id).emit("gameStart", lobby);
            console.log(socket.id + " started game: " + lobby.id); //
        }
    });
    // Game events
    socket.on("move", (data) => {
        // data is velocity in form [vx, vy]
        const lobby = l.sockets[socket.id];
        let game;
        if (lobby !== undefined && (game = lobby.game)) {
            game.players[socket.id].vx = data[0];
            game.players[socket.id].vy = data[1];
        }
    });
    socket.on("action", (data) => {
        // Action is a string of the action
    });
    
})

setInterval(()=> {
    Object.values(g.players).forEach(p=> {
        p.update();
    });
    Object.values(l.lobbies).forEach(x=>{
        if (x.game) {
            io.to(x.id).emit("updateScreen", x.game)
        }
    });
}, 20);

//server stuff
server.on("error",(e)=>{
    console.log("Server error: "+ e);
    server.close();
});

server.listen(3000, ()=>{
    console.log("HI, starting server...");
    console.log('uwu');
});