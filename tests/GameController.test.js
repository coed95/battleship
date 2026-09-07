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

    test("a new game starts in placement phase", () => {
        const game = new GameController();

        expect(game.phase).toBe("placement");
    });

    test("startGame() throws if the human fleet is incomplete", () => {
        const game = new GameController();

        expect(() => {
            game.startGame();
        }).toThrow("Human fleet is incomplete");
    });

    test("startGame() changes phase to playing when the human fleet is complete", () => {
        const game = new GameController();

        game.placeFleet(game.humanPlayer.gameboard);

        game.startGame();

        expect(game.phase).toBe("playing");
    });

    test("the first ship to place has length 5", () => {
        const game = new GameController();

        expect(
            game.fleetToPlace[game.currentShipIndex]
        ).toBe(5);
    });

    test("placeHumanShip() places the current ship on the human board", () => {
        const game = new GameController();

        game.placeHumanShip([0, 0], "horizontal");

        expect(game.humanPlayer.gameboard.ships).toHaveLength(1);
        expect(game.humanPlayer.gameboard.ships[0].ship.length).toBe(5);
    });

    test("placeHumanShip() advances to the next ship after successful placement", () => {
        const game = new GameController();

        game.placeHumanShip([0, 0], "horizontal");

        expect(game.currentShipIndex).toBe(1);
        expect(game.fleetToPlace[game.currentShipIndex]).toBe(4);
    });

    test("placeHumanShip() does not advance after an invalid placement", () => {
        const game = new GameController();

        expect(() => {
            game.placeHumanShip([8, 0], "horizontal");
        }).toThrow();

        expect(game.currentShipIndex).toBe(0);
        expect(game.humanPlayer.gameboard.ships).toHaveLength(0);
    });

    test("placeHumanShip() throws outside placement phase", () => {
        const game = new GameController();
        game.phase = "playing";

        expect(() => {
            game.placeHumanShip([0, 0], "horizontal");
        }).toThrow("Game is not in placement phase");
    });

    test("placing the last human ship starts the game", () => {
        const game = new GameController();

        game.placeHumanShip([0, 0], "horizontal"); // 5
        game.placeHumanShip([0, 1], "horizontal"); // 4
        game.placeHumanShip([0, 2], "horizontal"); // 3
        game.placeHumanShip([0, 3], "horizontal"); // 3
        game.placeHumanShip([0, 4], "horizontal"); // 2

        expect(game.phase).toBe("playing");
        expect(game.computerPlayer.gameboard.ships).toHaveLength(5);
    });

    test("computerTurn() uses a queued target before choosing a random coordinate", () => {
        const game = new GameController();
        game.currentTurn = "computer";

        game.computerTargets = [[3, 4]];

        const coordinates = game.computerTurn();

        expect(coordinates).toEqual([3, 4]);
    });

    test("computerTurn() adds adjacent targets after a hit", () => {
        const game = new GameController();
        game.currentTurn = "computer";

        const ship = new Ship(2);
        game.humanPlayer.gameboard.placeShip(ship, [4, 4], "horizontal");

        game.computerTargets = [[4, 4]];

        game.computerTurn();

        expect(game.computerTargets).toContainEqual([5, 4]);
        expect(game.computerTargets).toContainEqual([3, 4]);
        expect(game.computerTargets).toContainEqual([4, 5]);
        expect(game.computerTargets).toContainEqual([4, 3]);
    });

    test("computerTurn() does not add targets outside the board", () => {
        const game = new GameController();
        game.currentTurn = "computer";

        const ship = new Ship(2);
        game.humanPlayer.gameboard.placeShip(
            ship,
            [0, 0],
            "horizontal"
        );

        game.computerTargets = [[0, 0]];

        game.computerTurn();

        expect(game.computerTargets).toContainEqual([1, 0]);
        expect(game.computerTargets).toContainEqual([0, 1]);

        expect(game.computerTargets).not.toContainEqual([-1, 0]);
        expect(game.computerTargets).not.toContainEqual([0, -1]);
    });

    test("computerTurn() clears queued targets when a ship is sunk", () => {
        const game = new GameController();
        game.currentTurn = "computer";

        const ship = new Ship(1);
        game.humanPlayer.gameboard.placeShip(
            ship,
            [4, 4],
            "horizontal"
        );

        game.computerTargets = [
            [4, 4],
            [5, 4],
            [3, 4]
        ];

        game.computerTurn();

        expect(game.computerTargets).toEqual([]);
    });

    test("computerTurn() skips queued targets that were already attacked", () => {
        const game = new GameController();
        game.currentTurn = "computer";

        const ship = new Ship(2);
        game.humanPlayer.gameboard.placeShip(
            ship,
            [5, 5],
            "horizontal"
        );

        game.humanPlayer.gameboard.receiveAttack([2, 2]);

        game.computerTargets = [
            [2, 2],
            [5, 5]
        ];

        const coordinates = game.computerTurn();

        expect(coordinates).toEqual([5, 5]);
    });
});