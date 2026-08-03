import Gameboard from "../src/Gameboard.js";
import Player from "../src/Player.js";

describe("Player", () => {
    test("a player has the provided type", () => {
        const player = new Player("human");

        expect(player.type).toBe("human");
    });

    test("a player has a gameboard", () => {
        const player = new Player("human");

        expect(player.gameboard).toBeDefined();
    });

    test("a player cannot have an invalid type", () => {
        expect(() => {
            new Player("alien");
        }).toThrow("Invalid player type");
    });
});