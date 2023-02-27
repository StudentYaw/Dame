function getData() {
    // Send a POST to the flask server and get the data
    fetch('/data', {
        method: 'POST',
        body: "data",
        headers: { 'Content-Type': 'text' }
    })
    .then(response => response.json())
    .then(data => {
        // Return the data
        return data;
    });
}