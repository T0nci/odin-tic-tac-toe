// Player objects - Factory Function
function createPlayer(name, marker) {
    const getName = function() {
        return name;
    };

    const getMarker = function() {
        return marker;
    };

    return {getName, getMarker};
}

// Game Board object - IIFE, the Module Pattern
const gameBoard = (function() {
    const board = [
        " ", " ", " ",
        " ", " ", " ",
        " ", " ", " "
    ];

    const winningCombinations = [
        [
            "w", "w", "w",
            " ", " ", " ",
            " ", " ", " "
        ],
        [
            " ", " ", " ",
            "w", "w", "w",
            " ", " ", " "
        ],
        [
            " ", " ", " ",
            " ", " ", " ",
            "w", "w", "w"
        ],
        [
            "w", " ", " ",
            "w", " ", " ",
            "w", " ", " "
        ],
        [
            " ", "w", " ",
            " ", "w", " ",
            " ", "w", " "
        ],
        [
            " ", " ", "w",
            " ", " ", "w",
            " ", " ", "w"
        ],
        [
            "w", " ", " ",
            " ", "w", " ",
            " ", " ", "w"
        ],
        [
            " ", " ", "w",
            " ", "w", " ",
            "w", " ", " "
        ]
    ];

    const getCombinations = function() {
        return winningCombinations.slice();
    };

    return {board, getCombinations};
})();

// Game State object - IIFE, the Module Pattern
const gameState = (function() {
    const playGame = function(playerSpot) {
        if (!checkSpot(playerSpot)) return "invalid";

        gameBoard.board[playerSpot] = turn;

        const winner = checkWinner();
        if (winner) {
            if (winner === "draw") {
                return "draw";
            } else {
                return winner;
            }
        }

        return swapTurns();
    };


    const checkSpot = function(spot) {
        if (
            typeof spot === "number" &&
            spot >= 0 &&
            spot <= 8 &&
            gameBoard.board[spot] === " "
        ) {
            return true;
        }

        return false;
    };


    const checkWinner = function() {
        const { boardX, boardO } = formatBoard();

        const combinations = gameBoard.getCombinations();
        for(const combination of combinations) {
            let winnerX = true;
            let winnerO = true;

            for(let i = 0; i < combination.length; i++) {
                // this ensures skipping of whitespace and extra Xs or Os
                if (combination[i] === " ") {
                    continue;
                } else {
                    // if the space is a spot with "w" check if the formatted
                    // boards don't have "w"(means they are not winners if so)
                    if (combination[i] !== boardX[i]) winnerX = false;
                    if (combination[i] !== boardO[i]) winnerO = false;
                }
            }

            if (winnerX) return player1;
            if (winnerO) return player2;
        };

        let draw = true;
        for (const boardSpot of gameBoard.board) {
            if (boardSpot === " ") {
                draw = false;
                break;
            }
        }
        if (draw) return "draw";

        return false;
    }


    // Callback for checkWinner
    const formatBoard = function() {
        const boardX = gameBoard.board.map(value => {
            if (value === "X") return "w";
            else return " ";
        });

        const boardO = gameBoard.board.map(value => {
            if (value === "O") return "w";
            else return " ";
        });

        return { boardX, boardO };
    };


    const swapTurns = function () {
        if (turn === "X") {
            turn = "O";
            return "O";
        }
        else if (turn === "O") {
            turn = "X";
            return "X";
        }
    };


    let turn = "X";


    const reset = function() {
        turn = "X";

        gameBoard.board.forEach((value, index, arr) => {
            arr[index] = " ";
        });
    }

    return {playGame, reset};
})();

const displayController = (function() {

    const displayBoard = function() {

        const boardDiv = document.querySelector(".container .board");
        boardDiv.textContent = ''; // ensure boardDiv is empty

        for (let i = 0; i < gameBoard.board.length; i++) {
            const spot = document.createElement("div");
            spot.classList.add("spot");
            
            const btn = document.createElement("button");
            btn.dataset.index = i;
            listenForClicks(btn);

            const img = document.createElement("img");
            if (gameBoard.board[i] === "X") {
                img.setAttribute("src", "./images/x.svg");
                img.setAttribute("alt", "X");
                btn.appendChild(img);
            } else if (gameBoard.board[i] == "O") {
                img.setAttribute("src", "./images/o.svg");
                img.setAttribute("alt", "O");
                btn.appendChild(img);
            }

            spot.appendChild(btn);

            boardDiv.appendChild(spot);
        }

    };


    const listenForClicks = function(button) {

        const output = document.querySelector("output");

        button.addEventListener("click", event => {
            const index = parseInt(event.currentTarget.dataset.index);

            const result = gameState.playGame(index);
            if (result === "invalid") return;

            if (result === "X")
            output.textContent = "Turn: X";
            else if (result === "O")
            output.textContent = "Turn: O";
            else if (result === "draw")
            output.textContent = "Draw!";
            else
            output.textContent = 
            `${result.getMarker()} - ${result.getName()} wins!`;

            displayBoard(); // Display(update) the board after updating it
        });

    }


    return {displayBoard};
})();


displayController.displayBoard();
let player1, player2;


const dialogStart = document.querySelector("dialog.start");
const dialogForm = document.querySelector("dialog.start form");
const player1Name = document.querySelector("#player1");
const player2Name = document.querySelector("#player2");

dialogStart.showModal();

dialogStart.addEventListener("keydown", (event) => {
    // Make sure the user submits the form
    if (event.key === "Escape") event.preventDefault();
});

dialogForm.addEventListener("submit", (event) => {
    event.preventDefault();
    player1 = createPlayer(player1Name.value, "X");
    player2 = createPlayer(player2Name.value, "O");
    dialogStart.close();
});


const restartButton = document.querySelector("button.restart");

restartButton.addEventListener("click", () => {
    gameState.reset();

    displayController.displayBoard();

    dialogStart.showModal();

    document.querySelector("output").textContent = "Turn: X";
});
