function startGame() {
    var url = window.location.href;
    window.location.href = url + "/checkers";
}

// When the elements are loaded
window.onload = function() {
    data = getData({});

    // Display the session id and player names
    /* document.getElementById('session').innerHTML = data.session_id;
    document.getElementById('player1').innerHTML = data.player1;
    document.getElementById('player2').innerHTML = data.player2; */
}