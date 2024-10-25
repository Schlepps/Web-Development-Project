//This code will add the userName and difficulty selected, to url, so the main game and leaderboard can acces them
function setDifficulty(difficulty) {
    // Gets the userName that the user enterd 
    var userName = document.getElementById('userName').value;

    //This adds the userName and difficulity together so the game knows who to link the score with
    var url = 'mainGame.html?userName=' + userName + '&difficulty=' + difficulty;
    window.location.href = url;
}

// Creates the background music audio from https://stocktune.com/free-music/arcade-antics-15663-15229
var backgroundMusic = new Audio("backgroundMusic.mp3");

// Function to toggle background music on and off
function toggleSound() {
    
    var soundButton = document.getElementById("soundButton");

    if (backgroundMusic.paused) {
        backgroundMusic.play();
        soundButton.textContent = "Sound Off";
        // Store the sound state in session storage
        sessionStorage.setItem('soundState', 'on');
    } else {
        backgroundMusic.pause();
        soundButton.textContent = "Sound On";
        // Store the sound state in session storage
        sessionStorage.setItem('soundState', 'off');
    }
}









