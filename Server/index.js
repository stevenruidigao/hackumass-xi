const http = require('http');
const express = require('express');
const socketio = require('socket.io');
const path = require('node:path');
const l = require('./lobby.js');
const g = require('./game.js');

const clientPath = path.join(__dirname, '../Client');
console.log('Serving static from ' + clientPath);

const app = express();
app.use(express.static(clientPath));

const server = http.createServer(app);
const io = socketio(server);

io.on('connection', (socket) => {
    socket.emit('message','You are connected!'); // send a msg to client
    console.log('new connection: ' + socket.id); //

    // Handle Disconnect
    socket.on('disconnect', ()=> {
        console.log(socket.id + " disconnected.");
        const lobby = l.sockets[socket.id];
        if (lobby) {
            l.sockets[socket.id] = undefined;
            // If server owner, close the lobby
            if(socket.id === lobby.screenSocket) {
                // Delete lobby, send signal to players, remove them from the room
                io.to(lobby.id).emit("lobby-closed", lobby.id); // Host has left the lobby, players should leave the room
                delete l.lobbies.game;
                delete l.lobbies[lobby.id];
                delete lobby; // Hopefully this won't cause problems
            } else {
                lobby.playerSockets = lobby.playerSockets.filter(x=>x!==socket.id);
                io.to(lobby.id).emit("newDisconnect", lobby.playerSockets.length);
            }
        }
        // Otherwise, nothing to do
    });
    
    socket.on('leave', (room)=> {
        console.log(socket.id + " has left room " + room);//
        socket.leave(room);
    });

    // Lobby Events
    socket.on('newGame', () => {
        const lobby = new l.Lobby();
        lobby.addScreen(socket.id);
        socket.join(lobby.id);
        l.sockets[socket.id] = lobby;
        socket.emit('gameCreated', lobby);
        console.log(socket.id + ' created game: ' + lobby.id);//
    });

    socket.on('joinGame', (code)=> {
        if (!code) return;

        const lobby = l.lobbies[code.toUpperCase().trim()];
        if (lobby !== undefined && lobby.addPlayer(socket.id)) {
            socket.join(lobby.id);
            l.sockets[socket.id] = lobby;
            socket.emit('joinedGame', lobby);
            socket.to(lobby.id).emit('newJoin', lobby.playerSockets.length);
            console.log(socket.id + ' joined game: ' + lobby.id);//
        }
    });

    socket.on('start', (data)=> {
        if (!data) return;
        
        // data: {height: window.innerHeight, ratio: ratio}
        const lobby = l.sockets[socket.id];
        if (lobby !== undefined && lobby.screenSocket === socket.id && lobby.playerSockets.length >= 1 && lobby.game === undefined) {//
        //if (lobby !== undefined && lobby.screenSocket === socket.id && lobby.playerSockets.length === 2 && lobby.game === undefined) {
            lobby.game = new g.Game(lobby, data.height/data.ratio, data.ratio);
            io.to(lobby.id).emit('gameStart', lobby);
            lobby.game.changes = [];
            console.log(socket.id + ' started game: ' + lobby.id); //
        }
    });

    // Game events
    socket.on('move', (movement) => {
        // movement is a number between -50 and 50
        const lobby = l.sockets[socket.id];
        let game;
        if (lobby !== undefined && (game = lobby.game)) {
            console.log(socket.id + " is moving " + movement);
            game.players[socket.id].vx = - movement / 2.5;
        }
    });

    socket.on('action', (data) => {
        // Action is a string of the action
        console.log(socket.id + " has performed action: " + data);
        const lobby = l.sockets[socket.id];
        let game;
        if (lobby !== undefined && (game = lobby.game)) {
            game.action(data, game.players[socket.id]);
        }
    });
})

setInterval(()=> {
    Object.values(g.players).forEach(p=> {
        const lobby = l.sockets[p.name];
        if (lobby !== undefined && lobby.game !== undefined) { // This should not happen in 2 player games
            p.update(lobby.game);
        }
        
    });

    Object.values(l.lobbies).forEach(x=>{
        if (x.game) {
            io.to(x.id).emit('updateScreen', x.game)
            x.game.update();
        }
    });

}, 20);

//server stuff
server.on('error',(e)=>{
    console.log('Server error: '+ e);
    server.close();
});

server.listen(3000, ()=>{
    console.log('HI, starting server...');
    console.log('uwu');
});