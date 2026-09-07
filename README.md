# Battleship

A browser-based implementation of the classic Battleship game, built as part of [The Odin Project](https://www.theodinproject.com/) JavaScript curriculum.

The project focuses on test-driven development, object-oriented design, and separating game logic from the user interface.

## Features

- Manual placement of the player's fleet
- Horizontal and vertical ship placement
- Placement preview
- Validation for overlapping and out-of-bounds ships
- Random placement of the computer fleet
- Turn-based gameplay
- Hit and miss tracking
- Automatic win detection
- Computer opponent with basic targeting logic
- Restart functionality
- Game state messages

## Testing

The core game logic was developed using test-driven development with Jest.

Tests cover:

- Ship creation, hits, and sinking
- Ship placement
- Invalid and overlapping placements
- Gameboard attacks
- Hit and miss detection
- Turn management
- Win conditions
- Fleet placement
- Player ship placement
- Computer targeting behavior

Run the test suite with:

```bash
npm test
```

## Run Locally

Install the dependencies:

```bash
npm install
```

Start the local server:

```bash
npm run dev
```

Then open the local address shown in the terminal.

## Built With

- HTML
- CSS
- JavaScript
- Jest