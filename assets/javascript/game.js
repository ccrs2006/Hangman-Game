var winCount = 0;
var loseCount = 0;
var timeOut;

var hangman = {
    words: ["bottle","jazz","elephant","glasses","oxygen","zombie","Woodchuck","fox","Elephant","people","cozy","Penguin","House","skate","disco",],
    letters: ["A", "B", "C", "D", "E","F", "G", "H", "I", "J", "K","L", "M", "N", "O", "P", "Q","R", "S", "T", "U", "V", "W","X", "Y", "Z"],
    lifes: 7,
    userInputs: [],
    userInput: "",
    computerWord: "",
    wordWithMatchedLetters: "",
    computerWordLength: 0,
    matchedLettersCount: 0,
    gameOver: false,
    winOrLose: false,

    init:function() {
        this.lifes = 7;
        this.userInputs = [];
        this.matchedLettersCount = 0;
        this.userInput = "";
        this.wordWithMatchedLetters = "";
        this.gameOver = false;
        this.winOrLose = false;
        this.computerWord = this.guessAWord();
        this.computerWordLength = this.calculateWordLength();

        var initialWordToPrint = this.createInitialWordToPrint();
        this.printWord(initialWordToPrint);

      
        document.querySelector("#loadingMessage").innerHTML = "";
        document.querySelector("#lifes").innerHTML = this.lifes;
        document.querySelector("#winCount").innerHTML = winCount;
        document.querySelector("#loseCount").innerHTML = loseCount;
        document.querySelector("#winLose").style.display = 'inline-block';
        document.querySelector("#hangman-img").src = 'assets/images/animals.png';
    },
   
    startGame: function() {
        if (this.gameOver === false && this.isAlphabet()) {
            this.checkRules();
        }
    },

    checkRules: function() {
        if (!this.checkInputAlreadyTried()) { 
            this.disableLetterBtn();
            this.pushToTriedValues();
           

            if (!this.checkWordContainsUserInput()) { 
                this.printLifesLeft();
                this.showHangmanImage();
                this.winLoseCountAndAudioOnGameEnd();               
                this.startNewOnGameOver();

            } else { 
                this.createWordWithMatchedLetters();
                this.winLoseCountAndAudioOnGameEnd(); 
                this.startNewOnGameOver();
                document.querySelector("#word").innerHTML = this.wordWithMatchedLetters;
            }
        }
    },
  
    guessAWord: function() {
        var computerRandomNumber = Math.floor(Math.random() * this.words.length);
        return this.words[computerRandomNumber];
        console.log(this.computerWord);
    },

    calculateWordLength: function() {
        return this.computerWord.length;
    },

    createInitialWordToPrint: function() {
        var word = "";
        for (var i = 0; i < this.computerWordLength; i++) {
            word += '_ ';
        }
        this.wordWithMatchedLetters = word;
        return word;
    },

    checkInputAlreadyTried: function() {
        if (this.userInputs.length !== 0) {
            var result = this.userInputs.indexOf(this.userInput) < 0 ? false : true;
            return result;
        } else {
            return false;
        }
    },

    pushToTriedValues: function() {
        this.userInputs.push(this.userInput);
    },

    isAlphabet: function() {
        var pattern = /[a-z]/i;
        return this.userInput.match(pattern);
    },

    checkWordContainsUserInput: function() {
        var contains = false;
        for (var i = 0; i < this.computerWordLength; i++) {
            if (this.computerWord.charAt(i).toUpperCase() == this.userInput) {
                contains = true;
            }
        }
        return contains;
    },

    createWordWithMatchedLetters: function() {
        for (var i = 0; i < this.computerWordLength; i++) {
            if (this.computerWord.charAt(i).toUpperCase() == this.userInput) {
                if (i === 0) {
                    this.wordWithMatchedLetters = this.wordWithMatchedLetters.substring(0, i * 2) +
                        this.userInput.toUpperCase() + this.wordWithMatchedLetters.substring((i * 2 + 1));
                } else {
                    this.wordWithMatchedLetters = this.wordWithMatchedLetters.substring(0, i * 2) +
                        this.userInput.toLowerCase() + this.wordWithMatchedLetters.substring((i * 2 + 1));
                }
                this.matchedLettersCount++;
            }
        }
    },

    printWord: function(word) {
        document.querySelector("#word").innerHTML = word;
    },

    printLifesLeft: function() {
        this.lifes--;
        document.querySelector("#lifes").innerHTML = this.lifes;
    },

    winLoseCountAndAudioOnGameEnd: function() {
        if (this.lifes === 0) {
            this.playAudio('assets/sounds/gameLost.mp3');
            loseCount++;
            this.gameOver = true;
            this.winOrLose = false;
        }

        if (this.matchedLettersCount == this.computerWordLength) {
            this.playAudio('assets/sounds/gameWon.mp3');
            winCount++;
            this.winOrLose = true;
            this.gameOver = true;
        }
    },

    startNewOnGameOver: function() {
        if (this.gameOver === true) {
            var html = "";
            document.querySelector("#winLose").style.display = 'none';

            if (this.winOrLose) {
                html += '<div class="message">You Won !!!</div>';
            } else {
                html += '<div class="message">You Lost !!!</div>';
            }
            html += '<div class="load">New Word will load in 4 seconds. ';
            html += ' <i class="fa fa-spinner fa-spin" aria-hidden="true"></i> </div>';

            document.querySelector("#loadingMessage").innerHTML = html;
            timeOut = setTimeout(this.loadGame.bind(this), 4000);
        }
    },

    loadGame: function() {
        var t = this;
        for (var i = 0; i < this.letters.length; i++) {
            var id = "#li-" + this.letters[i];
            document.querySelector(id).className = "liActive";
        };
        this.init();
    },

    playAudio: function(gameAudio) {
        var audio = new Audio(gameAudio);
        audio.play();
        audio.volume = .5;
    },

    showHangmanImage: function() {
        if (this.lifes != 7) {
            document.querySelector("#hangman-img").src = "assets/images/hangman-" + (7 - this.lifes) + ".png";
        } else {
            document.querySelector("#hangman-img").src = "assets/images/animals.png";
        }
    },

    letterClick: function(letter) {
        this.userInput = letter.toUpperCase();
        this.disableLetterBtn();
        this.startGame();
    },

    disableLetterBtn: function() {
        var id = "#li-" + this.userInput;
        document.querySelector(id).className = "liDisabled"
    },

    addLetterButtons: function() {
        var html = "<ul>";
        for (var i = 0; i < this.letters.length; i++) {
            html += '<li id="li-' + this.letters[i] + '" class="liActive"';
            html += 'onclick="hangman.letterClick(\'' + this.letters[i] + '\')">';
            html += this.letters[i] + "</li>";
        };
        html += "</ul>";
        document.querySelector("#letterBtn").innerHTML = html;
    },
}

window.onload = function(event) {
        hangman.addLetterButtons();
        hangman.init();

        document.onkeyup = function(e) {
            hangman.userInput = String.fromCharCode(e.keyCode).toUpperCase();
            hangman.startGame();
        }        
    } 
