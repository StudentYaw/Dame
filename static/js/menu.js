function sendImage() {
    var canvas = document.getElementById('canvas');
    var imgData = canvas.toDataURL("image/jpeg");
    //removing the prefix
    imgData = imgData.replace('data:image/jpeg;base64,','');
    // sending the base64 data to the server
    fetch('/predict', {
        method: 'POST',
        body: imgData,
        headers: { 'Content-Type': 'application/octet-stream' }
    })
    .then(response => response.json())
    .then(data => {
        document.getElementById('prediction').innerHTML = "Prediction: " + data;
        document.getElementById('input').value = document.getElementById('input').value + data;
    });
}

function startLocally() {
    // get url
    var url = window.location.href;
    window.location.href = url + "checkers";
}

function startSession() {
    var sessionId = document.getElementById('session_id').value;
    fetch('/startSession', {
        method: 'POST',
        body: sessionId + " " + document.getElementById('name').value,
        headers: { 'Content-Type': 'text' }
    })
    .then(response => response.json())
    .then(data => {
        document.getElementById('session').innerHTML = data["session_id"];
        document.getElementById('player').innerHTML = data["player1"];
    });

    var url = window.location.href;
    window.location.href = url + "session";//sessionId;
}

function joinSession() {
    var sessionId = document.getElementById('session_id').value;
    fetch('/joinSession', {
        method: 'POST',
        body: "session_id:" + sessionId + " name:" + document.getElementById('name').value,
        headers: { 'Content-Type': 'text' }
    })
    .then(response => response.json())
    .then(data => {
        document.getElementById('session').innerHTML = data["session_id"];
        document.getElementById('opponent').innerHTML = data["player2"];
    });

    var url = window.location.href;
    window.location.href = url + "session";
}

let uiData = {
    "session_id": "",
    "name": "",
}

function checkButtonStatus() {
    // Check if sessionid and name are filled
    if (uiData.session_id != "" && uiData.name != "") {
        document.getElementById('start_session').disabled = false;
        document.getElementById('join_session').disabled = false;

        // Send a POST to the flask server so that the data gets saved
        fetch('/saveData', {
            method: 'POST',
            body: JSON.stringify(uiData),
            headers: { 'Content-Type': 'application/json' }
        })
        .then(response => response.json())
        .then(data => {
            // Return the data
            return data;
        });
    }
}

function submitSessionId() {
    var sessionId = document.getElementById('session_id').value;
    // Check if sessionid is correct and not taken
    // missing
    uiData.session_id = sessionId;
    checkButtonStatus();
}

function submitName() {
    var username = document.getElementById('name').value;
    // Check if username is correct and not taken
    // missing
    uiData.name = username;
    checkButtonStatus();
}