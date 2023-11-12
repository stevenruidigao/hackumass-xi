const lobbies = {};
const sockets = {};

class Lobby {
    constructor() {
        this.screenSocket = "";
        this.playerSockets = [];
        this.id = this.generateId();
        lobbies[this.id] = this;
        this.game = undefined;
    }
    // Generate an unused lobbyId (four random capital letters)
    generateId() {
        const genLetter = () => (Math.floor(Math.random() * 26) + 10).toString(36);
        const mkString = () => (genLetter() + genLetter() + genLetter() + genLetter()).toUpperCase();
        let id;
        while (lobbies[id = mkString()] !== undefined);
        return id;
    }
    addScreen(socket) {
        this.screenSocket = socket;
    }
    addPlayer(socket) {
        if (this.playerSockets.length < 2) {
            this.playerSockets.push(socket);
            return true;
        }
        return false;
    }
}

module.exports = {lobbies, sockets, Lobby}