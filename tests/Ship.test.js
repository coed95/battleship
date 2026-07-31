import Ship from "../src/Ship.js"

describe("Ship", () => {
    test("initialized ship should have its defined length", () => {
        const ship = new Ship(3)
        expect(ship.length).toBe(3)
    });

    test("initialized ship should have 0 hits", () => {
        const ship = new Ship(3);
        expect(ship.hits).toBe(0);
    });

    test("hit() should increase hits by 1", () => {
        const ship = new Ship(3);
        ship.hit();
        expect(ship.hits).toBe(1);
    });

    test("isSunk() returns false if hits are less than ship's length", () => {
        const ship = new Ship(3);

        ship.hit();
        ship.hit();

        expect(ship.isSunk()).toBe(false);
    });

    test("isSunk() returns true if hits are equal to ship's length", () => {
        const ship = new Ship(3);

        ship.hit();
        ship.hit();
        ship.hit();

        expect(ship.isSunk()).toBe(true);
    });
});