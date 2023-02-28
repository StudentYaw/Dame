function getData(uiData) {
    // Send a POST to the flask server and get the data
    fetch('/loadData', {
        method: 'POST',
        body: "session_id:" + uiData.session_id + " player1:" + uiData.name + " player2:" + uiData.player2,
        headers: { 'Content-Type': 'text' }
    })
    .then(response => response.json())
    .then(data => {
        // Return the data
        return data;
    });
}