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
            
            let playerSpot = null;
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

            boardX.forEach((value, index) => {
                if (value !== combination[index]) winnerX = false;
            });
            if (winnerX === true) return player1;

            boardO.forEach((value, index) => {
                if (value !== combination[index]) winnerO = false;
            });
            if (winnerO === true) return player2;

        };

        let draw = true;
        gameBoard.board.forEach(value => {
            if (value === " ") draw = false;
        });
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


const player1 = createPlayer("Player 1", "X");
const player2 = createPlayer("Player 2", "O");

gameState.playGame();
