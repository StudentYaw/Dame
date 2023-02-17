from flask import Flask, render_template, request

app = Flask(__name__)

board = [
    ["W", " ", "W", " ", "W", " ", "W", " "],
    [" ", "W", " ", "W", " ", "W", " ", "W"],
    ["W", " ", "W", " ", "W", " ", "W", " "],
    [" ", " ", " ", " ", " ", " ", " ", " "],
    [" ", " ", " ", " ", " ", " ", " ", " "],
    ["B", " ", "B", " ", "B", " ", "B", " "],
    [" ", "B", " ", "B", " ", "B", " ", "B"],
    ["B", " ", "B", " ", "B", " ", "B", " "]
]

@app.route("/")
def index():
    return render_template("index.html", board=board)

@app.route("/move", methods=["POST"])
def move():
    start_row = int(request.form["start_row"])
    start_col = int(request.form["start_col"])
    end_row = int(request.form["end_row"])
    end_col = int(request.form["end_col"])

    piece = board[start_row][start_col]
    board[start_row][start_col] = " "
    board[end_row][end_col] = piece

    return render_template("index.html", board=board)

if __name__ == "__main__":
    app.run()