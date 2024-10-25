
document.addEventListener("DOMContentLoaded", function () {
    //The url fetched from the top of the window
    var passedURL = new URLSearchParams(window.location.search);
    //The scope object that follows the player's mouse
    var scope = document.querySelector(".scope");
    //The html element of the ammunition count
    var ammoCount = document.querySelector("#ammoCount");
    //The current value of how much ammunition the player has
    var ammoCountValue = 6;
    //A boolean to signal whether the player is out of ammo
    var outOfAmmo = false;
    //the html timer element
    var timer = document.querySelector('#timer');
    //the current value of the player's score
    var scoreValue = 0;
    //the html element of the player's score
    var score = document.querySelector('#score');
    //The username passed via the URL from the previous page
    var userName = passedURL.get('userName');
    //the difficulty passed from the previous slide via the url
    var difficulty = parseInt(passedURL.get('difficulty'));
    //The interval between the creation of balloons. Affects how  quickly balloons are created.
    var bCInterval = 0;
    //The speed at which the balloons travel
    var bSpeed = 0;

    // Creates the background music audio from https://stocktune.com/free-music/arcade-antics-15663-15229
    var backgroundMusic = new Audio("backgroundMusic.mp3");

    // Retrieve the sound state from session storage
    var soundState = sessionStorage.getItem('soundState');

    // Set the initial state based on session storage
    if (soundState === 'off') {
        backgroundMusic.pause();
    } else {
        backgroundMusic.play();
    }

    //This sets the difficulty by controlling the bCInterval and bSpeed,
    //based on the difficulty passed via the URL
    switch (difficulty) {
        case 1:
            bCInterval = 1000;
            bSpeed = 500;
            break;
        case 2:
            bCInterval = 700;
            bSpeed = 700;
            break;
        case 3:
            bCInterval = 500;
            bSpeed = 1000;
            break;
    }

    //cTime is the current time left, it's decremented until it reaches 0
    //Once it reaches 0, the player's username and scre are passed to the leaderboard via url
    //And it is opened
    var cTime = 60;
    var countdown = setInterval(() => {
        cTime--;
        timer.textContent = cTime;
        if (cTime <= 0) {
            leaderboardLink = "leaderboard.html?userName=" + userName + "&score=" + scoreValue;
            window.open(leaderboardLink, "_self");
        }
    }, 1000)

    //This gets the current position of the user's mouse
    //And then move the scope element to follow it
    //It is offset so that the scope element is centred on the mouse
    window.addEventListener("mousemove", function (e) {
        var x = e.clientX;
        var y = e.clientY;

        scope.style.left = `${x - 67}px`;
        scope.style.top = `${y - 67}px`
    })

    //Sounds effects for losing and gunshots
    //VERY LOUD BY DEFAULT, keep volume as is
    var loseSound = new Audio("loseSoundEffect.mp3");
    loseSound.volume = 0.3;

    var gunshot = new Audio("gunshot.mp3");
    gunshot.volume = 0.25;

    //this operates the gun. Plays sound effects and decrements ammo until it needs to reload
    window.addEventListener("click", e => {
        if (outOfAmmo == false) {
            gunshot.play();
            gunshot.currentTime = 0;
            ammoCountValue--;
            ammoCount.textContent = "Ammo: " + ammoCountValue;
        }
        if (ammoCountValue == 0) {
            ammoCount.textContent = "RELOAD!!!"
            outOfAmmo = true;
        }
    })

    var reload = new Audio("reload.mp3");
    reload.volume = 0.25;

    //Reloading sound effect
    //Ammo value is set to 7 because the click where the player clicks on reload
    //Counts as using one ammo
    //Thus after reloading, the player will have 6 ammo as per usual
    ammoCount.addEventListener("click", e => {
        ammoCountValue = 7;
        ammoCount.textContent = "Ammo: " + ammoCountValue;
        reload.play();
        outOfAmmo = false;
    })

    var balloonPop = new Audio("balloonPop.mp3");
    balloonPop.volume = 0.25;

    //The code for creating and operating the balloons
    function createBalloon() {
        var balloon = document.createElement("div");
        balloon.className = "balloon";
        document.body.appendChild(balloon);
        var balloonDeleted = false;

        //If the balloon is clicked and the player's isn't out of ammo
        //plays the sound effect and delets the ballooon
        balloon.addEventListener("click", e => {
            if (outOfAmmo != true) {
                balloonPop.play();
                //this makes it so the sound effect can be played multiple times
                balloonPop.currentTime = 0;
                //this flags that the balloon has been deleted
                //I didn't think this would be necessary, but when it is deleted
                //the game still counts deleted balloons for the win condition
                balloonDeleted = true;
                balloon.remove();
                scoreValue++;
                score.textContent = "Score: " + scoreValue;
            }
        });

        //Creates the balloon on one of three randomly determined height levels
        var cXPos = -150;
        var cYPos = 0;
        switch (Math.floor(Math.random() * 3) + 1) {
            case 1:
                cYPos = 400;
                break;
            case 2:
                cYPos = 550;
                break;
            case 3:
                cYPos = 780;
                break;
        }


        //The current position of the balloon
        var iPos = 5;
        //The value to increment the position

        //this code moves the balloon across the screen
        //if it reaches the end, it appends the userName and scoreValue to the leaderboard url
        //and opens hte link
        balloon.style.top = cYPos + "px";
        var moveBalloon = function () {
            var width = window.innerWidth - 100;

            cXPos += iPos;
            balloon.style.left = cXPos + "px";
            if (cXPos - balloon.offsetWidth < width) {
                requestAnimationFrame(moveBalloon);
            }
            else if (balloonDeleted == false) {
                loseSound.play();
                setTimeout(function () {
                    leaderboardLink = "leaderboard.html?userName=" + userName + "&score=" + scoreValue;
                    window.open(leaderboardLink, "_self");
                }, bSpeed);
            }
        };
        moveBalloon();
    }
    setInterval(createBalloon, bCInterval);
});