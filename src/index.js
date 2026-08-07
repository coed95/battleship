import GameController from "./GameController.js";
import Ship from "./Ship.js";
import { renderBoard } from "./domController.js";

const game = new GameController();

const playerBoardElement = document.querySelector("#player-board");
const computerBoardElement = document.querySelector("#computer-board");

const playerShip = new Ship(3);

game.humanPlayer.gameboard.placeShip(
    playerShip,
    [1, 2],
    "horizontal"
);

function render() {
    renderBoard(
        game.humanPlayer.gameboard,
        playerBoardElement,
        false
    );

    renderBoard(
        game.computerPlayer.gameboard,
        computerBoardElement,
        true,
        (x, y) => {
            if (game.currentTurn !== "human" || game.gameOver) {
                return;
            }
            
            game.attack([x, y]);
            render();

            if (!game.gameOver && game.currentTurn === "computer") {
                game.computerTurn();
                render();
            }
        }
    );
}

render();