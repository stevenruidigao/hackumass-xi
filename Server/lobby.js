const lobbies = {};
const sockets = {};

class Lobby {
    constructor() {
        this.screenSocket = "";
        this.playerSockets = [];
        this.id = this.generateID();
        lobbies[this.id] = this;
        this.game = undefined;
    }

    // Generate an unused lobbyID (four random capital letters)
    generateID() {
        const genLetter = () => (Math.floor(Math.random() * 26) + 10).toString(36);
        //const genLetter = () => (Math.floor(Math.random() * 36) + 0).toString(36);

        const mkString = (n) => {
            let str = '';

            for (let i = 0; i < n; i ++) {
                str += genLetter();
            }

            return str.toUpperCase();
        }

        let id;
        while (lobbies[id = mkString(5)] !== undefined);
        return id;
    }

    addScreen(socket) {
        this.screenSocket = socket;
    }

    addPlayer(id) {
        if (this.playerSockets.length < 2 && this.playerSockets[0] !== id) {
            this.playerSockets.push(id);
            return true;
        }

        return false;
    }
}

module.exports = {lobbies, sockets, Lobby}