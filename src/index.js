import GameController from "./GameController.js";
import { renderBoard } from "./domController.js";

const game = new GameController();

const playerBoardElement = document.querySelector("#player-board");
const computerBoardElement = document.querySelector("#computer-board");
const statusElement = document.querySelector("#status");

function render() {
    if (game.gameOver) {
        if (game.winner === "human") {
            statusElement.textContent = "You won!";
        }
        else {
            statusElement.textContent = "Computer won!";
        }
    }
    else {
        if (game.currentTurn === "human") {
            statusElement.textContent = "Your turn";
        }
        else {
            statusElement.textContent = "Computer's turn";
        }
    }

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
                setTimeout(() => {
                    game.computerTurn();
                    render();
                }, 500);
            }
        }
    );
}

render();