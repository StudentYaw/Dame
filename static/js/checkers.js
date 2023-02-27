class Piece {
    constructor(color) {
        this.color = color;
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

    setPiece(piece) {
        this.piece = piece;
    }

    removePiece() {
        this.piece = null;
    }

    highlight() {
        this.isHighlighted = true;
    }

    unhighlight() {
        this.isHighlighted = false;
    }

    isOccupied() {
        return this.piece != null;
    }

    isHighlighted() {
        return this.isHighlighted;
    }

    isBlack() {
        return (this.row + this.col) % 2 == 0;
    }

    isWhite() {
        return !this.isBlack();
    }

    getId() {
        return this.id;
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
                this.board[row][col] = new Cell(row, col, (row + col) % 2 == 0 ? "black" : "white");
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
        return this.board[row][col];
    }

    getHTML() {
        var html = "<table>";
        for (var row = 0; row < this.rows; row++) {
            html += "<tr>";
            for (var col = 0; col < this.cols; col++) {
                var cell = this.board[row][col];
                html += this.getCellHTML(row, col);
                html += "</td>";
            }
            html += "</tr>";
        }
        html += "</table>";
        return html;
    }

    getCellHTML(row, col) {
        var cell = this.board[row][col];
        var html = "<td class='cell " + cell.getColor() + "' id=" + cell.getId() + ">";
        if (cell.isOccupied()) {
            html += cell.getPiece().getHTML();
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

    fromCell = null;
    toCell = null;

    displayBoard() {
        document.getElementById("board").innerHTML = this.board.getHTML();
    }

    movePiece(fromCell, toCell) {
        // Move the piece
        toCell.setPiece(fromCell.getPiece());
        fromCell.removePiece();

        // Unhighlight the cells
        fromCell.unhighlight();
        toCell.unhighlight();
    }

    inputMove(e, row, col, checkers) {
        // Check if the cell is highlighted
        if (this.board.getCell(row, col).isHighlighted) {
            alert("Already selected");
            return;
        }

        // Behaviour depending on the selection mode
        if (selectionMode == "from") {
            // Check if the cell is occupied
            if (!this.board.getCell(row, col).isOccupied()) {
                alert("No piece in this cell");
                return;
            }

            // Check if the piece is of the current player
            if (this.board.getCell(row, col).getPiece().getColor() != playerTurn) {
                alert("Not your piece");
                return;
            }

            // Highlight the cell
            this.board.getCell(row, col).highlight();
            this.board.getCell(row, col).element.classList.add("highlighted");

            // Save the cell
            this.fromCell = this.board.getCell(row, col);

            // Change selection mode
            this.changeSelectionMode();
        }
        else if (selectionMode == "to") {
            // Check if the cell is occupied
            if (this.board.getCell(row, col).isOccupied()) {
                alert("Cannot move to an occupied cell");
                return;
            }

            // Check if the move is valid
            if (!this.isValidMove(this.fromCell, this.board.getCell(row, col))) {
                alert("Invalid move");
                return;
            }

            // Move the piece
            this.board.getCell(row, col).setPiece(this.fromCell.getPiece());
            this.fromCell.removePiece();

            // Unhighlight the cell
            this.fromCell.unhighlight();
            this.fromCell.element.classList.remove("highlighted");

            // Save the cell
            this.toCell = this.board.getCell(row, col);

            // Move the piece to the new cell
            this.movePiece(this.fromCell, this.toCell);

            // Change turn
            this.changeTurn();

            // Change selection mode
            this.changeSelectionMode();
        }
    }

    setEventListeners() {
        for (var row = 0; row < this.board.rows; row++) {
            for (var col = 0; col < this.board.cols; col++) {
                // Set click event listener for each cell by id, function parameters are the event itself and the checkers object. Function is inputMove
                document.getElementById(this.board.getCell(row, col).getId()).onclick = this.inputMove(e, row, col, this);
            }
        }
    }

    changeTurn() {
        if (playerTurn == "player1") {
            playerTurn = "player2";
        } else {
            playerTurn = "player1";
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