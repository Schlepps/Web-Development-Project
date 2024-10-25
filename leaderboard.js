// leaderboard.js

// Function to retrieve leaderboard data from url and display it
function displayLeaderboard() {
    var passedURL = new URLSearchParams(window.location.search);
    var userName = passedURL.get('userName');
    var score = passedURL.get("score");
    var leaderboardData = JSON.parse(localStorage.getItem('leaderboardData')) || [];
    var userData = { userName: userName, score: score };
    leaderboardData.push(userData);

    // Sort leaderboardData by score in descending order
    leaderboardData.sort(function (a, b) {
        return b.score - a.score;
    });

    var leaderboardTable = document.getElementById('Leaderboard');

    // Populate table with leaderboardData
    leaderboardData.forEach(function (entry) {
        var row = leaderboardTable.insertRow(-1);
        var usernameCell = row.insertCell(0);
        var scoreCell = row.insertCell(1);
        usernameCell.textContent = entry.userName;
        scoreCell.textContent = entry.score;
    });

    //Saves the leaderboard in local storage
    localStorage.setItem('leaderboardData', JSON.stringify(leaderboardData));
}



// Call displayLeaderboard and plays end music when the page loads
document.addEventListener("DOMContentLoaded", function () {

    // Creates the background music audio form https://stocktune.com/free-music/sunny-days-adventure-16241-30942
    var LeaderboardMusic = new Audio("LeaderboardMusic.mp3");

    // Retrieve the sound state from session storage
    var soundState = sessionStorage.getItem('soundState');

    // Set the initial state based on session storage
    if (soundState === 'off') {
        LeaderboardMusic.pause();
    } else {
        LeaderboardMusic.play();
    }

    displayLeaderboard();
});
