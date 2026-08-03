import Player from "../src/Player.js";

class GameController {
    constructor() {
        this.humanPlayer = new Player("human");
        this.computerPlayer = new Player("computer");
        this.currentTurn = "human";
        this.gameOver = false;
        this.winner = null;
    }

    switchTurn() {
        if (this.currentTurn === "human") {
            this.currentTurn = "computer";
        }
        else {
            this.currentTurn = "human";
        }
    }

    attack(coordinates) {
        if (this.gameOver) {
            throw new Error("Game is already over");
        }
        
        let targetBoard;

        if (this.currentTurn === "human") {
            targetBoard = this.computerPlayer.gameboard;
        }
        else {
            targetBoard = this.humanPlayer.gameboard;
        }

        targetBoard.receiveAttack(coordinates);

        if (targetBoard.allShipsSunk()) {
            this.gameOver = true;
            this.winner = this.currentTurn;

            return;
        }

        this.switchTurn();
    }
}

export default GameController;