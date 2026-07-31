class Gameboard {
    constructor() {
        this.ships = [];
    }

    placeShip(ship, start, orientation) {
        const [x, y] = start;
        const coordinates = [];

        if (orientation !== "horizontal" && orientation !== "vertical") {
            throw new Error("Invalid orientation");
        }

        for (let i = 0; i < ship.length; i++)
        {
            if (orientation === "horizontal") {
                coordinates.push([x + i, y]);
            } else if (orientation === "vertical") {
                coordinates.push([x, y + i]);
            }
        }

        const occupiedCoordinates = this.ships.flatMap(
            (placedShip) => placedShip.coordinates
        );
        
        const isOffBoard = coordinates.some(([x, y]) => {
            return x < 0 || x >= 10 || y < 0 || y >= 10;
        });

        if (isOffBoard) {
            throw new Error("Ship cannot be placed off the board");
        }

        const isOverlapping = coordinates.some((coordinate) =>
            occupiedCoordinates.some((occupiedCoordinate) =>
                coordinate[0] === occupiedCoordinate[0] &&
                coordinate[1] === occupiedCoordinate[1]
            )
        );

        if (isOverlapping) {
            throw new Error("Ships cannot overlap");
        }

        this.ships.push({
            ship,
            coordinates
        });
    }
}

export default Gameboard;