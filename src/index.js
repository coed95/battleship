import GameController from "./GameController.js";
import { renderBoard } from "./domController.js";

const game = new GameController();

const playerBoardElement = document.querySelector("#player-board");
const computerBoardElement = document.querySelector("#computer-board");
const statusElement = document.querySelector("#status");
const rotateButton = document.querySelector("#rotate-button");

let placementOrientation = "horizontal";

function render() {
    rotateButton.hidden = game.phase !== "placement";

    if (game.phase === "placement") {
        const currentLength =
            game.fleetToPlace[game.currentShipIndex];

        statusElement.textContent =
            `Place ship length ${currentLength} (${placementOrientation})`;
    }
    else if (game.gameOver) {
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
        false,
        game.phase === "placement"
            ? (x, y) => {
                try {
                    game.placeHumanShip(
                        [x, y],
                        placementOrientation
                    );
                }
                catch (error) {
                    statusElement.textContent = error.message;
                }

                render();
            }
            : null
    );

    renderBoard(
        game.computerPlayer.gameboard,
        computerBoardElement,
        true,
        (x, y) => {
            if (game.phase !== "playing" ||
                game.currentTurn !== "human" ||
                game.gameOver)
            {
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

rotateButton.addEventListener("click", () => {
    placementOrientation =
        placementOrientation === "horizontal"
            ? "vertical"
            : "horizontal";

    rotateButton.textContent = `Rotate (${placementOrientation})`;

    render();
});

render();