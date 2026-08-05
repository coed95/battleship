function renderBoard(gameboard, element, hideShips = false, onClick = null) {
    element.innerHTML = "";

    for (let y = 9; y >= 0; y--) {
        for (let x = 0; x < 10; x++) {
            const square = document.createElement("div");

            square.classList.add("square");
            square.dataset.x = x;
            square.dataset.y = y;

            const hasShip = gameboard.ships.some((placedShip) => {
                return placedShip.coordinates.some(([shipX, shipY]) => {
                    return shipX === x && shipY === y;
                });
            });

            const wasAttacked = gameboard.attackedCoordinates.some(
                ([attackedX, attackedY]) => {
                    return attackedX === x && attackedY === y;
            });

            if (hasShip && !hideShips) {
                square.classList.add("ship");
            }

            if (wasAttacked && hasShip) {
                square.classList.add("hit");
            }
            else if (wasAttacked) {
                square.classList.add("miss");
            }

            if (onClick) {
                square.addEventListener("click", () => {
                    onClick(x, y);
                });
            }

            element.appendChild(square);
        }
    }
}

export { renderBoard };