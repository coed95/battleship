import GameController from "./GameController.js";
import renderBoard from "./domController.js";
import Ship from "./Ship.js";

const game = new GameController();
const ship = new Ship(3);

const playerBoardElement = document.querySelector("#player-board");
const computerBoardElement = document.querySelector("#computer-board");

game.humanPlayer.gameboard.placeShip(
    ship,
    [1, 2],
    "horizontal"
);

renderBoard(
    game.humanPlayer.gameboard,
    playerBoardElement,
    false
);

renderBoard(
    game.computerPlayer.gameboard,
    computerBoardElement,
    true
);