class Gameboard {
    constructor() {
        this.ships = [];
        this.missedAttacks = [];
        this.attackedCoordinates = [];
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

    receiveAttack(coordinates) {
        const [x, y] = coordinates;

        if (x < 0 || x >= 10 || y < 0 || y >= 10) {
            throw new Error("Invalid coordinates");
        }

        const wasAlreadyAttacked = this.attackedCoordinates.some(
            ([attackedX, attackedY]) => {
                return attackedX === x && attackedY === y;
            }
        );

        if (wasAlreadyAttacked) {
            throw new Error("Coordinate already attacked");
        }

        this.attackedCoordinates.push(coordinates);

        const shipHit = this.ships.find((placedShip) => {
            return placedShip.coordinates.some((coordinate) => {
                return coordinate[0] === x && coordinate[1] === y;
            });
        });

        if (shipHit) {
            shipHit.ship.hit();

            if (shipHit.ship.isSunk()) {
                return "sunk";
            }
            
            return "hit";
        }
        else {
            this.missedAttacks.push(coordinates);
            return "miss";
        }
    }

    allShipsSunk() {
        return this.ships.length > 0 &&
            this.ships.every((placedShip) => placedShip.ship.isSunk());
    }
}

export default Gameboard;