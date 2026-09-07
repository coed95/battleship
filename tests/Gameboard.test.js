import Gameboard from "../src/Gameboard.js";
import Ship from "../src/Ship.js";

describe("Gameboard", () => {
    test("initialized gameboard should have 0 ships", () => {
        const gameboard = new Gameboard();
        expect(gameboard.ships.length).toBe(0);
    });

    test("a horizontal ship of length 3 placed from [1, 2] should occupy [1, 2], [2, 2], [3, 2]", () => {
        const ship = new Ship(3);
        const gameboard = new Gameboard();

        gameboard.placeShip(ship, [1, 2], "horizontal");

        expect(gameboard.ships[0].coordinates).toEqual([
            [1, 2],
            [2, 2],
            [3, 2]]
        );
    });

    test("a vertical ship of length 3 placed from [1, 2] should occupy [1, 2], [1, 3], [1, 4]", () => {
        const ship = new Ship(3);
        const gameboard = new Gameboard();

        gameboard.placeShip(ship, [1, 2], "vertical");

        expect(gameboard.ships[0].coordinates).toEqual([
            [1, 2],
            [1, 3],
            [1, 4]
        ]);
    });

    test.each([
        [[-1, 2], "horizontal"],
        [[1, -2], "vertical"],
        [[8, 2], "horizontal"],
        [[1, 8], "vertical"]
    ])(
        "a ship should not be placed off the board from %j facing %s",
        (start, orientation) => {
            const ship = new Ship(3);
            const gameboard = new Gameboard();

            expect(() => {
                gameboard.placeShip(ship, start, orientation);
            }).toThrow("Ship cannot be placed off the board");

            expect(gameboard.ships.length).toBe(0);
        }
    );

    test("ships cannot overlap", () => {
        const gameboard = new Gameboard();

        const ship1 = new Ship(3);
        const ship2 = new Ship(2);

        gameboard.placeShip(ship1, [2, 2], "horizontal");

        expect(() => {
            gameboard.placeShip(ship2, [3, 2], "vertical");
        }).toThrow("Ships cannot overlap");

        expect(gameboard.ships).toHaveLength(1);
    });

    test("a ship cannot be placed with an invalid orientation", () => {
        const ship = new Ship(3);
        const gameboard = new Gameboard();

        expect(() => {
            gameboard.placeShip(ship, [1, 2], "diagonal");
        }).toThrow("Invalid orientation");

        expect(gameboard.ships).toHaveLength(0);
    });

    test("receiveAttack() hits a ship at the given coordinate", () => {
        const ship = new Ship(3);
        const gameboard = new Gameboard();

        gameboard.placeShip(ship, [1, 2], "horizontal");
        gameboard.receiveAttack([2, 2]);

        expect(ship.hits).toBe(1);
    });

    test("receiveAttack() records a missed attack", () => {
        const gameboard = new Gameboard();

        gameboard.receiveAttack([4, 5]);

        expect(gameboard.missedAttacks).toEqual([[4, 5]]);
    });

    test("receiveAttack() should not hit the same ship coordinate twice", () => {
        const ship = new Ship(3);
        const gameboard = new Gameboard();

        gameboard.placeShip(ship, [1, 2], "horizontal");
        gameboard.receiveAttack([2, 2]);

        expect(() => {
            gameboard.receiveAttack([2, 2]);
        }).toThrow("Coordinate already attacked");

        expect(ship.hits).toBe(1);
    });

    test("receiveAttack() should not record the same missed attack twice", () => {
        const gameboard = new Gameboard();

        gameboard.receiveAttack([4, 5]);

        expect(() => {
            gameboard.receiveAttack([4, 5]);
        }).toThrow("Coordinate already attacked");

        expect(gameboard.missedAttacks).toEqual([[4, 5]]);
    });

    test("allShipsSunk() returns false when the board has no ships", () => {
        const gameboard = new Gameboard();

        expect(gameboard.allShipsSunk()).toBe(false);
    });

    test("allShipsSunk() returns false when at least one ship is not sunk", () => {
        const gameboard = new Gameboard();
        const ship = new Ship(2);

        gameboard.placeShip(ship, [1, 1], "horizontal");
        gameboard.receiveAttack([1, 1]);

        expect(gameboard.allShipsSunk()).toBe(false);
    });

    test("allShipsSunk() returns true when every ship is sunk", () => {
        const gameboard = new Gameboard();
        const ship = new Ship(2);

        gameboard.placeShip(ship, [1, 1], "horizontal");
        gameboard.receiveAttack([1, 1]);
        gameboard.receiveAttack([2, 1]);

        expect(gameboard.allShipsSunk()).toBe(true);
    });

    test("receiveAttack() returns hit when a ship is hit", () => {
        const gameboard = new Gameboard();
        const ship = new Ship(2);

        gameboard.placeShip(ship, [1, 1], "horizontal");

        const result = gameboard.receiveAttack([1, 1]);

        expect(result).toBe("hit");
    });

    test("receiveAttack() returns miss when no ship is hit", () => {
        const gameboard = new Gameboard();

        const result = gameboard.receiveAttack([4, 4]);

        expect(result).toBe("miss");
    });

    test("receiveAttack() returns sunk when the hit sinks the ship", () => {
        const gameboard = new Gameboard();
        const ship = new Ship(1);

        gameboard.placeShip(ship, [2, 2], "horizontal");

        const result = gameboard.receiveAttack([2, 2]);

        expect(result).toBe("sunk");
    });
});