import Gameboard from "../src/Gameboard.js";
import GameController from "../src/GameController.js";
import Ship from "../src/Ship.js";

describe("GameController", () => {
    test("a new game creates a human and a computer player", () => {
        const game = new GameController();

        expect(game.humanPlayer.type).toBe("human");
        expect(game.computerPlayer.type).toBe("computer");
    });

    test("the human player starts first", () => {
        const game = new GameController();

        expect(game.currentTurn).toBe("human");
    });

    test("switchTurn() changes from human to computer", () => {
        const game = new GameController();

        game.switchTurn();

        expect(game.currentTurn).toBe("computer");
    });

    test("switchTurn() changes from computer to human", () => {
        const game = new GameController();

        game.currentTurn = "computer";

        game.switchTurn();

        expect(game.currentTurn).toBe("human");
    });

    test("attack() sends the human attack to the computer gameboard", () => {
        const game = new GameController();

        game.attack([2, 3]);

        expect(game.computerPlayer.gameboard.attackedCoordinates)
            .toEqual([[2, 3]]);

        expect(game.currentTurn).toBe("computer");
    });

    test("attack() sends the computer attack to the human gameboard", () => {
        const game = new GameController();
        game.currentTurn = "computer";

        game.attack([4, 5]);

        expect(game.humanPlayer.gameboard.attackedCoordinates)
            .toEqual([[4, 5]]);

        expect(game.currentTurn).toBe("human");
    });

    test("attack() does not switch human turn when the attack is invalid", () => {
        const game = new GameController();

        game.attack([2, 3]);
        game.currentTurn = "human";

        expect(() => {
            game.attack([2, 3]);
        }).toThrow("Coordinate already attacked");

        expect(game.currentTurn).toBe("human");
    });

    test("attack() does not switch computer turn when the attack is invalid", () => {
        const game = new GameController();
        game.currentTurn = "computer";

        game.attack([2, 3]);

        game.currentTurn = "computer";

        expect(() => {
            game.attack([2, 3]);
        }).toThrow("Coordinate already attacked");

        expect(game.currentTurn).toBe("computer");
    });

    test("human wins when the computer fleet is sunk", () => {
        const game = new GameController();
        const ship = new Ship(1);

        game.computerPlayer.gameboard.placeShip(ship, [0, 0], "horizontal");
        game.currentTurn = "human";

        game.attack([0, 0]);

        expect(game.gameOver).toBe(true);
        expect(game.winner).toBe("human");
    });

    test("computer wins when the human fleet is sunk", () => {
        const game = new GameController();
        const ship = new Ship(1);

        game.humanPlayer.gameboard.placeShip(ship, [0, 0], "horizontal");
        game.currentTurn = "computer";

        game.attack([0, 0]);

        expect(game.gameOver).toBe(true);
        expect(game.winner).toBe("computer");
    });

    test("attack() throws if the game is already over", () => {
        const game = new GameController();
        const ship = new Ship(1);

        game.computerPlayer.gameboard.placeShip(
            ship,
            [0, 0],
            "horizontal"
        );

        game.attack([0, 0]);

        expect(() => {
            game.attack([1, 1]);
        }).toThrow("Game is already over");
    });

    test("a ship of length 1 can be placed and hit", () => {
        const gameboard = new Gameboard();
        const ship = new Ship(1);

        gameboard.placeShip(ship, [5, 5], "horizontal");
        gameboard.receiveAttack([5, 5]);

        expect(ship.isSunk()).toBe(true);
    });

    test("allShipsSunk() returns false when only some ships are sunk", () => {
        const gameboard = new Gameboard();
        const firstShip = new Ship(1);
        const secondShip = new Ship(2);

        gameboard.placeShip(firstShip, [0, 0], "horizontal");
        gameboard.placeShip(secondShip, [3, 3], "horizontal");

        gameboard.receiveAttack([0, 0]);

        expect(firstShip.isSunk()).toBe(true);
        expect(secondShip.isSunk()).toBe(false);
        expect(gameboard.allShipsSunk()).toBe(false);
    });

    test("allShipsSunk() returns true when multiple ships are sunk", () => {
        const gameboard = new Gameboard();
        const firstShip = new Ship(1);
        const secondShip = new Ship(2);

        gameboard.placeShip(firstShip, [0, 0], "horizontal");
        gameboard.placeShip(secondShip, [3, 3], "horizontal");

        gameboard.receiveAttack([0, 0]);
        gameboard.receiveAttack([3, 3]);
        gameboard.receiveAttack([4, 3]);

        expect(gameboard.allShipsSunk()).toBe(true);
    });

    test("placeFleet() places all 5 ships", () => {
        const game = new GameController();
        const gameboard = game.humanPlayer.gameboard;

        game.placeFleet(gameboard);

        expect(gameboard.ships).toHaveLength(5);
    });

    test("placeFleet() places the correct ship lengths", () => {
        const game = new GameController();
        const gameboard = game.computerPlayer.gameboard;

        game.placeFleet(gameboard);

        const lengths = gameboard.ships.map(
            (placedShip) => placedShip.ship.length
        );

        expect(lengths).toEqual([5, 4, 3, 3, 2]);
    });
});