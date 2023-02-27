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

session = {}
sessions = []

@app.route("/")
def index():
    return render_template("menu.html", board=board)

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

# Set session id for two players
#@app.route("/session", methods=["POST"])

# Start locally
@app.route("/checkers")
def display_checkers():
    # Change the html to checkers.html with flask
    return render_template("checkers.html")

@app.route("/session/checkers")
def display_checkers_session():
    # Change the html to checkers.html with flask
    return render_template("checkers.html")

@app.route("/session")
def display_session():
    # Change the html to checkers.html with flask
    return render_template("session.html")

@app.route("/score")
def display_score():
    # Change the html to checkers.html with flask
    return render_template("score.html")

# Start session with two players
@app.route("/startSession", methods=["POST"])
def start_session():
    print("Starting session")
    data = request.get_data()
    # create session
    session = {
        "session_id": data.decode("ascii").split(" ")[0],
        "player1": data.decode("ascii").split(" ")[1],
        "player2": "",
        "board": board
    }
    sessions.append(session)
    print(sessions)
    return session

# Join session
@app.route("/joinSession", methods=["POST"])
def join_session():
    print("Joining session")
    data = request.get_data()
    # join session
    for session in sessions:
        if session["session_id"] == data.decode("ascii").split(" ")[0]:
            session["player2"] = data.decode("ascii").split(" ")[1]
            print(sessions)
            return session

if __name__ == "__main__":
    app.run(debug=True)