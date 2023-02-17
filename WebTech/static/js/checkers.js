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
        if (this.isHighlighted) {
            this.unhighlight();
            this.element.classList.remove("highlighted");
        } else {
            this.highlight();
            this.element.classList.add("highlighted");
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

    displayBoard() {
        document.getElementById("board").innerHTML = this.board.getHTML();
    }

    setEventListeners() {
        for (var row = 0; row < this.board.rows; row++) {
            for (var col = 0; col < this.board.cols; col++) {
                this.board.getCell(row, col).setEventListener();
            }
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