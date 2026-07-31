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
});