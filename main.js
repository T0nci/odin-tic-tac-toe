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
        return winningCombinations;
    };

    return {board, getCombinations};
})();


// Game State object - IIFE, the Module Pattern
const gameState = (function() {
    const playGame = function() {
        game: while (true) {
            printBoard();

            let playerName;
            if (turn === player1.getMarker()) 
            playerName = player1.getName();
            else if (turn === player2.getMarker()) 
            playerName = player2.getName();
            
            let playerSpot;
            do {
                playerSpot = prompt(
                    `${playerName}, select a spot to play in [1-9]:`
                );
                if (playerSpot === "cancel") break game; // for testing
                playerSpot = parseInt(playerSpot) - 1;
            } while (!checkSpot(playerSpot));
            gameBoard.board[playerSpot] = turn;

            const winner = checkWinner();
            if (winner) {
                printBoard();
                if (winner === "draw") {
                    console.log("Draw!");
                } else {
                    console.log(
                        `${winner.getName()} - ${winner.getMarker()} wins!`
                    );
                    
                }
                break game;
            }

            swapTurns();
        }
    };


    const printBoard = function() {
        console.log(
`\t${gameBoard.board[0]}\t|\t${gameBoard.board[1]}\t|\t${gameBoard.board[2]}
--------|-------|--------
\t${gameBoard.board[3]}\t|\t${gameBoard.board[4]}\t|\t${gameBoard.board[5]}
--------|-------|--------
\t${gameBoard.board[6]}\t|\t${gameBoard.board[7]}\t|\t${gameBoard.board[8]}`
        );
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
        if (turn === "X") turn = "O";
        else if (turn === "O") turn = "X";
    };


    let turn = "X";

    return {playGame};
})();


/*const player1 = createPlayer("Player 1", "X");
const player2 = createPlayer("Player 2", "O");

gameState.playGame();*/


const displayController = (function() {
    const displayBoard = function() {

        for (let i = 0; i < gameBoard.board.length; i++) {
            const spot = document.createElement("div");
            spot.classList.add("spot");
            spot.dataset.index = i;
            
            const btn = document.createElement("button");
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
            document.querySelector(".container .board").appendChild(spot);
        }

    };

    return {displayBoard};
})();


displayController.displayBoard();
