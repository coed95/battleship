import Gameboard from "./Gameboard.js";

class Player {
    constructor(type) {
        if (type !== "human" && type !== "computer") {
            throw new Error("Invalid player type");
        }
        
        this.type = type;
        this.gameboard = new Gameboard();
    }
}

export default Player;