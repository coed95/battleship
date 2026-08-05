function renderBoard(gameboard, element, hideShips = false) {
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

            if (hasShip && !hideShips) {
                square.classList.add("ship");
            }

            element.appendChild(square);
        }
    }
}

export default renderBoard;