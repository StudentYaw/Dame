class Piece {
    constructor(color) {
        this.color = color;
        this.king = false;
        // set id and event listener
        /* this.id = "piece-" + row + "-" + col;
        this.element = document.getElementById(this.id);
        this.element.addEventListener("click", function() {
            alert("Piece clicked");
        }); */
    }

    getColor() {
        return this.color;
    }

    getHTML() {
        return "<div class='piece " + this.color + "'></div>";
    }

    setKing() {
        this.king = true;
    }

    isKing() {
        return this.king;
    }
}

let selectionMode = "from" // from, to; Move the piece FROM the cell, TO the cell
let playerTurn = "white" // brown, white

class Cell {
    // Constructor
    constructor(row, col, color) {
        this.row = row;
        this.col = col;
        this.color = color;
        this.piece = null;
        this.isHighlighted = false;
        // set id and event listener
        this.id = "cell-" + row + "-" + col;
    }

    // Methods
    getId() {
        return this.id;
    }

    setEventListener() {
        // get object reference
        var self = this;
        this.element = document.getElementById(this.id);
        this.element.addEventListener("click", function() {
            self.onClick();
        });
    }

    onClick() {
        /* if (this.isHighlighted) {
            this.unhighlight();
            this.element.classList.remove("highlighted");
        } else {
            this.highlight();
            this.element.classList.add("highlighted");
        } */
        // Check if the cell is highlighted
        if (this.isHighlighted) {
            // Already selected
            return;
        }

    }

    getPiece() {
        return this.piece;
    }

    getColor() {
        return this.color;
    }

    setNewPiece(fromCell) {
        let piece = fromCell.getPiece()
        // Change the piece id
        piece.id = "piece-" + this.row + "-" + this.col;
        // Set the piece    
        this.piece = piece;
    }

    setPiece(piece) {
        this.piece = piece;
    }


    removePiece() {
        this.piece = null;
    }

    highlight() {
        this.isHighlighted = true;
        document.getElementById(this.id).classList.add("highlighted");
    }

    unhighlight() {
        this.isHighlighted = false;
        document.getElementById(this.id).classList.remove("highlighted");
    }

    isOccupied() {
        return this.piece != null;
    }

    isHighlighted() {
        return this.isHighlighted;
    }

    isBlack() {
        return (this.row + this.col) % 2 != 0;
    }

    isWhite() {
        return !this.isBlack();
    }
}

class Board {
    init() {
        this.rows = 8;
        this.cols = 8;
        this.board = [];
        this.createBoard();
    }

    createBoard() {
        for (var row = 0; row < this.rows; row++) {
            this.board[row] = [];
            for (var col = 0; col < this.cols; col++) {
                this.board[row][col] = new Cell(row, col, (row + col) % 2 == 0 ? "white" : "black");
                //this.board[row][col].setPiece(new Piece((row + col) % 2 == 0 ? "grey" : "white"))
                // Set white pieces in first three rows
                // Set black pieces in last three rows
                if (row < 3 && this.board[row][col].isBlack()) {
                    this.board[row][col].setPiece(new Piece("brown"));
                } else if (row > 4 && this.board[row][col].isBlack()) {
                    this.board[row][col].setPiece(new Piece("white"));
                }
            }
        }
    }

    getCell(row, col) {
        let value;
        try {
            value = this.board[row][col];
        } catch (e) {
            alert(e);
            value = "error"
        }
        return value;
    }

    getHTML() {
        var html = "<table>";
        for (var row = 0; row < this.rows; row++) {
            html += "<tr>";
            for (var col = 0; col < this.cols; col++) {
                var cell = this.board[row][col];
                let content = this.getCellHTML(row, col);
                html += content;
                html += "</td>";
            }
            html += "</tr>";
        }
        html += "</table>";
        return html;
    }

    getCellHTML(row, col) {
        var cell = this.board[row][col];
        var html = "<td class='cell " + cell.getColor() + "' id='" + cell.getId() + "'>";
        if (cell.isOccupied()) {
            try {
                html += cell.getPiece().getHTML();
            } catch (e) {
                html += "";
            }
        }
        html += "</td>";
        return html;
    }
}

class Checkers {
    init() {
        this.board = new Board();
        this.board.init();
    }

    player1pieces = 12;
    player2pieces = 12;
    fromCell = null;
    toCell = null;

    displayBoard() {
        document.getElementById("board").innerHTML = this.board.getHTML();
    }

    isJumpAvailable(fromCell) {
        // Check if any jump is available
        let piece = fromCell.getPiece();
        let row = fromCell.row;
        let col = fromCell.col;
        let color = piece.getColor();
        let jumpAvailable = false;
        if (color == "brown") {
            if (this.board.getCell(row - 1, col - 1).isOccupied() && this.board.getCell(row - 2, col - 2).isOccupied() == false) {
                jumpAvailable = true;
            } else if (this.board.getCell(row - 1, col + 1).isOccupied() && this.board.getCell(row - 2, col + 2).isOccupied() == false) {
                jumpAvailable = true;
            }
        } else if (color == "white") {
            if (this.board.getCell(row + 1, col - 1).isOccupied() && this.board.getCell(row + 2, col - 2).isOccupied() == false) {
                jumpAvailable = true;
            } else if (this.board.getCell(row + 1, col + 1).isOccupied() && this.board.getCell(row + 2, col + 2).isOccupied() == false) {
                jumpAvailable = true;
            }
        }

        return jumpAvailable;
    }

    canJump(fromCell, toCell) {
        // Bug: true, but there is no valid jump when the target cell (toCell) is occupied...
        if (fromCell == undefined || toCell == undefined) {
            return false;
        }
        if (Math.abs(fromCell.row - toCell.row) == 2 && Math.abs(fromCell.col - toCell.col) == 2) {
            let row = (fromCell.row + toCell.row) / 2;
            let col = (fromCell.col + toCell.col) / 2;
            if (this.board.getCell(row, col).isOccupied() && this.board.getCell(row, col).getPiece().getColor() != fromCell.getPiece().getColor()) {
                return true;
            }
        }
        return false;
    }

    isValidMove(fromCell, toCell) {
        let status = [false, ""];
        let playerColor = fromCell.getPiece().getColor();


        // Check if the move is diagonal
        if (Math.abs(fromCell.row - toCell.row) != Math.abs(fromCell.col - toCell.col)) {
            return false;
        }

        // Check if the move is forward, doesn't check if king piece
        if (fromCell.getPiece().isKing() == false) {
            if (playerColor == "brown" && fromCell.row > toCell.row) {
                return false;
            } else if (playerColor == "white" && fromCell.row < toCell.row) {
                return false;
            }
        }

        // Check if the move is one cell
        if (Math.abs(fromCell.row - toCell.row) == 1 && Math.abs(fromCell.col - toCell.col) == 1) {
            status = [true, "moved"];
        }

        // Check if the move is two cells
        if (this.canJump(fromCell, toCell)) {
            let row = (fromCell.row + toCell.row) / 2;
            let col = (fromCell.col + toCell.col) / 2;
            // Check which piece to be removed, possible win condition
            this.board.getCell(row, col).removePiece();
            if (playerColor == "brown") { // Attacker is brown, so the white player loses a piece
                this.player1pieces -= 1;
                if (this.player2pieces == 0) {
                    alert("Player 1 won! Player 2 lost!");
                    // Change to score page
                    window.location.href = url + "/score";
                }
            }
            else if (playerColor == "white") { // Attacker is white, so the brown player loses a piece
                this.player2pieces -= 1;
                if (this.player1pieces == 0) {
                    alert("Player 2 won! Player 1 lost!");
                    // Change to score page
                    window.location.href = url + "/score";
                }
            }
            status = [true, "jumped"];
        }

        return status;
    }

    movePiece(fromCell, toCell) {
        // Unhighlight the cells
        fromCell.unhighlight();
        toCell.unhighlight();

        // Move the piece
        toCell.setNewPiece(fromCell);
        fromCell.removePiece();

        this.displayBoard();
        this.setEventListeners();
    }

    inputMove(e, checkers) {
        let row = e.currentTarget.id.split("-")[1];
        let col = e.currentTarget.id.split("-")[2];

        // Behaviour depending on the selection mode
        if (selectionMode == "from") {
            // Check if the cell is occupied
            if (!checkers.board.getCell(row, col).isOccupied()) {
                alert("No piece in this cell");
                return;
            }

            // Check if the piece is of the current player
            if (checkers.board.getCell(row, col).getPiece().getColor() != playerTurn) {
                alert("Not your piece");
                return;
            }

            // Highlight the cell
            checkers.board.getCell(row, col).highlight();

            // Save the cell
            checkers.fromCell = checkers.board.getCell(row, col);

            // Change selection mode
            checkers.changeSelectionMode();
        }
        else if (selectionMode == "to") {
            // Check if the cell is highlighted, revert to selection mode "from"
            if (checkers.board.getCell(row, col).isHighlighted) {
                checkers.board.getCell(row, col).unhighlight();
                checkers.changeSelectionMode();
                return;
            }

            // Check if the cell is occupied
            if (checkers.board.getCell(row, col).isOccupied()) {
                alert("Cannot move to an occupied cell");
                return;
            }

            // Check if the move is valid
            let move = checkers.isValidMove(checkers.fromCell, checkers.board.getCell(row, col));
            if (!move[0]) {
                alert("Invalid move");
                return;
            }

            // Move the piece
            checkers.board.getCell(row, col).setPiece(checkers.fromCell.getPiece());

            // Unhighlight the cell
            checkers.fromCell.unhighlight();

            // Save the cell
            checkers.toCell = checkers.board.getCell(row, col);

            // Move the piece to the new cell
            checkers.movePiece(checkers.fromCell, checkers.toCell);

            // Test if there is another possible jump
            // Bug: doesn't work for king piece?
            let nextJumpPossible = false;
            if (move[1] == "jumped") {
                let nextCells;
                let rowOffset = 2;
                if (playerTurn == "white") {
                    rowOffset = -2;   
                }
                nextCells = [checkers.board.getCell(parseInt(row)+rowOffset, parseInt(col)-2), checkers.board.getCell(parseInt(row)+rowOffset, parseInt(col)+2)];
                nextCells.forEach(function (element) {
                    if (checkers.canJump(checkers.board.getCell(row, col), element)) {
                        nextJumpPossible = true;
                    }
                });
            }

            // Test if the piece reached the subjectively last row and turns
            if (playerTurn == "white" && row == 0) {
                checkers.board.getCell(row, col).getPiece().setKing();
            }
            else if (playerTurn == "brown" && row == 7) {
                checkers.board.getCell(row, col).getPiece().setKing();
            }
            
            if (!nextJumpPossible) {
                // Change turn
                checkers.changeTurn();

                // Change selection mode
                checkers.changeSelectionMode();
            }
            else {
                checkers.toCell.highlight();
                checkers.fromCell = checkers.toCell;
            }
        }
    }

    setEventListeners() {
        for (var row = 0; row < this.board.rows; row++) {
            for (var col = 0; col < this.board.cols; col++) {
                // Set click event listener for each cell by id, function parameters are the event itself and the checkers object. Function is inputMove
                let checkers = this;
                document.getElementById(this.board.getCell(row, col).getId()).addEventListener('click', (event) => {
                    this.inputMove(event, this);
                });
            }
        }
    }

    changeTurn() {
        if (playerTurn == "white") {
            playerTurn = "brown";
        } else {
            playerTurn = "white";
        }
    }

    changeSelectionMode() {
        // FROM, TO
        if (selectionMode == "from") {
            selectionMode = "to";
        }
        else if (selectionMode == "to") {
            selectionMode = "from";
        }
    }
}

// When document is ready
window.onload = function() {
    var game = new Checkers();
    game.init();
    game.displayBoard();
    game.setEventListeners();
};

/* todo:
- Queen
- Multiple jumps */