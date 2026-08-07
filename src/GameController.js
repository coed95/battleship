import Player from "../src/Player.js";
import Ship from "../src/Ship.js";

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

    computerTurn() {
        if (this.currentTurn !== "computer") {
            throw new Error("It is not the computer's turn");
        }

        let coordinates;
        const targetBoard = this.humanPlayer.gameboard;

        do {
            coordinates = [
                Math.floor(Math.random() * 10),
                Math.floor(Math.random() * 10)
            ];
        } while (
            targetBoard.attackedCoordinates.some(
                ([attackedX, attackedY]) =>
                    attackedX === coordinates[0] &&
                    attackedY === coordinates[1]
            )
        );

        this.attack(coordinates);

        return coordinates;
    }

    placeFleet(gameboard) {
        const fleet = [5, 4, 3, 3, 2];

        for (const length of fleet) {
            const ship = new Ship(length);
            let placed = false;

            do {
                const x = Math.floor(Math.random() * 10);
                const y = Math.floor(Math.random() * 10);
                const orientation = Math.random() < 0.5
                    ? "horizontal"
                    : "vertical";

                try {
                    gameboard.placeShip(
                        ship,
                        [x, y],
                        orientation
                    );

                    placed = true;
                }
                catch (error) {
                    // Invalid random position: try again.
                }
            } while (!placed);
        }
    }
}

export default GameController;