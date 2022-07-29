class Game {
    constructor() {
      this.cardsSrc = [
        "img/cards/cards-1.png",
        "img/cards/cards-2.png",
        "img/cards/cards-3.png",
        "img/cards/cards-4.png",
        "img/cards/cards-5.png",
        "img/cards/cards-6.png",
        "img/cards/cards-7.png",
        "img/cards/cards-8.png",
        "img/cards/cards-9.png",
        "img/cards/cards-10.png",
        "img/cards/cards-11.png",
        "img/cards/cards-12.png",
        "img/cards/cards-13.png",
      ];
      this.sounds = {
        intro: new Audio("sounds/intro.mp3"),
        playing: [
          new Audio("sounds/playing1.mp3"),
          new Audio("sounds/playing2.mp3"),
          new Audio("sounds/playing3.mp3"),
        ],
        flipping: new Audio("sounds/flipping.mp3"),
        hadoken: new Audio("sounds/hadoken.wav"),
        youWin: new Audio("sounds/youWin.wav"),
        youLose: new Audio("sounds/youLose.mp3"),
        endGame: new Audio("sounds/endGame.mp3"),
      };
      this.playing = false;
      this.currentCard = null;
      this.previousCard = null;
      this.flipping = false;
      this.matchedCards = 0;
      this.matchPoints = 100;
      this.attempts = 0;
      this.time = 0;
      this.timeLimit = 2;
      this.timerId = null;
      this.winner = false;
      this.random = 0;
      this.score = document.querySelector(".score span");
      this.timer = document.querySelector(".timer");
      this.board = document.querySelector(".wrapper");
      this.starter = document.querySelector("#starter");
      this.reload = document.querySelector("#reload");
      this.startGame();
    }
  
    getCardTemplate = (img) => {
      let card = `
              <div class="flip-card">
                  <div class="flip-card-inner">
                      <div class="flip-card-front">
                        <img src="img/cards/cover.png" alt="Avatar">
                      </div>
                      <div class="flip-card-back">
                        <img src="${img}" alt="Avatar">
                      </div>
                  </div>
              </div>
          `;
      return card;
    };
  
    generateCard = (board, src) => {
      let card = document.createElement("template");
      card.innerHTML = this.getCardTemplate(src).trim();
      board.appendChild(card.content.firstElementChild);
    };
  
    createBoard = () => {
      this.cardsSrc.forEach((src) => {
        this.generateCard(this.board, src);
        this.generateCard(this.board, src);
      });
    };
  
    shuffleCards = () => {
      let currentIndex = this.board.children.length;
      let randomIndex = 0;
      let board = [...this.board.children];
      // board.forEach((card) => {
      //   console.log(card.children[0].children[0].children[0].src);
      // });
      // While there remain elements to shuffle.
      while (currentIndex != 0) {
        // Pick a remaining element.
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;
  
        // And swap it with the current element.
        [board[currentIndex], board[randomIndex]] = [
          board[randomIndex],
          board[currentIndex],
        ];
      }
      board.forEach((card) => {
        // console.log(card.children[0].children[0].children[0].src);
        this.board.appendChild(card);
      });
    };
  
    addEventListeners = () => {
      const cards = document.querySelectorAll(".flip-card");
      cards.forEach((card) =>
        card.children[0].children[0].children[0].addEventListener(
          "click",
          (e) => {
            if (!this.playing) {
              this.playing = true;
              this.stopSound("intro");
              this.setTimer();
              this.playSound("playing");
            }
            this.flipCard(e);
          }
        )
      );
    };
  
    flipCard = (e) => {
      e.stopPropagation();
      if (this.flipping) return;
      let card = e.target.parentElement.parentElement.parentElement;
      if (this.previousCard == null) {
        this.previousCard = card;
        if (!card.classList.contains("flipped")) {
          card.classList.add("flipped");
        }
      } else if (this.previousCard != card) {
        this.currentCard = card;
        card.classList.add("flipped");
        this.attempts++;
        this.checkForMatch();
      }
      this.playSound("flipping");
    };
  
    checkForMatch = () => {
      this.flipping = true;
      if (
        this.previousCard.children[0].children[1].children[0].src !=
        this.currentCard.children[0].children[1].children[0].src
      ) {
        setTimeout(() => {
          this.hideCards();
        }, 1000);
      } else {
        this.playSound("hadoken");
        this.matchedCards++;
        this.setPoints();
        if (this.matchedCards == this.cardsSrc.length) {
          this.winner = true;
          clearInterval(this.timerId);
          this.gameOver();
        }
        this.previousCard = null;
        this.currentCard = null;
        setTimeout(() => {
          this.flipping = false;
        }, 1000);
      }
    };
  
    hideCards = () => {
      this.previousCard.classList.remove("flipped");
      this.currentCard.classList.remove("flipped");
      this.previousCard = null;
      this.currentCard = null;
      this.flipping = false;
    };
  
    setPoints = () => {
      this.score.innerText = parseInt(this.score.innerText) + this.matchPoints;
    };
  
    setTimer = () => {
      this.timerId = setInterval(() => {
        if (parseInt(this.timer.children[2].innerText) < 9) {
          this.time++;
          this.timer.children[2].innerText = "0" + this.time;
        } else {
          this.time = 0;
          this.timer.children[2].innerText = "00";
          this.time++;
          if (parseInt(this.timer.children[1].innerText) < 9) {
            this.timer.children[1].innerText =
              "0" + (parseInt(this.timer.children[1].innerText) + 1);
          } else {
            if (parseInt(this.timer.children[1].innerText) < 59) {
              this.timer.children[1].innerText =
                parseInt(this.timer.children[1].innerText) + 1;
            } else {
              this.timer.children[1].innerText = "00";
              if (parseInt(this.timer.children[0].innerText) == this.timeLimit) {
                clearInterval(this.timerId);
                this.gameOver();
              }
              if (parseInt(this.timer.children[0].innerText) < 9) {
                this.timer.children[0].innerText =
                  "0" + (parseInt(this.timer.children[0].innerText) + 1);
              } else {
                parseInt(this.timer.children[0].innerText) + 1;
              }
            }
          }
        }
      }, 100);
    };
  
    playSound = (sound) => {
      if (sound == "intro") {
        this.sounds.intro.volume = 0.5;
      }
      if (sound == "playing") {
        this.sounds.playing.forEach((sound) => {
          sound.volume = 0.5;
        });
        this.random = this.generateRandomNumber(
          0,
          this.sounds.playing.length - 1
        );
        this.sounds.playing[this.random].play();
        this.sounds.playing[this.random].loop = true;
      } else {
        if (!this.sounds[sound].ended) {
          this.sounds[sound].pause();
          this.sounds[sound].currentTime = 0;
          setTimeout(() => {
            this.sounds[sound].play();
          }, 0);
        } else {
          this.sounds[sound].play();
        }
      }
    };
  
    stopSound = (sound) => {
      if (sound == "playing") {
        if (!this.sounds.playing[this.random].ended) {
          this.sounds.playing[this.random].pause();
          this.sounds.playing[this.random].currentTime = 0;
        }
      } else {
        if (!this.sounds[sound].ended) {
          this.sounds[sound].pause();
          this.sounds[sound].currentTime = 0;
        }
      }
    };
  
    generateRandomNumber = (min, max) => {
      return Math.floor(Math.random() * (max - min + 1)) + min;
    };
  
    unflipCards = () => {
      const cards = document.querySelectorAll(".flip-card");
      cards.forEach((card) => card.classList.remove("flipped"));
    };
    reloadGame = () => {
      this.unflipCards();
      this.shuffleCards();
      [...this.timer.children].forEach((child) => (child.innerText = "00"));
      this.reload.parentElement.parentElement.classList.add("hidden");
      this.playing = false;
      this.currentCard = null;
      this.previousCard = null;
      this.flipping = false;
      this.matchedCards = 0;
      this.matchPoints = 100;
      this.attempts = 0;
      this.time = 0;
      this.timeLimit = 2;
      this.timerId = null;
      this.winner = false;
      this.random = 0;
    };
  
    gameOver = () => {
      this.stopSound("playing");
      setTimeout(() => {
        this.reload.parentElement.parentElement.classList.remove("hidden");
      }, 2000);
      this.reload.addEventListener("click", () => {
        this.reloadGame();
      });
      this.playSound("endGame");
      if (this.winner) {
        setTimeout(() => {
          this.reload.previousElementSibling.innerText = "You won!";
          this.playSound("youWin");
        }, 2000);
      } else {
        this.reload.previousElementSibling.innerText = "You lost!";
        setTimeout(() => {
          this.playSound("youLose");
        }, 2000);
      }
    };
  
    startGame = () => {
      this.createBoard();
      this.shuffleCards();
      this.addEventListeners();
    };
  }
  
  window.addEventListener("load", () => {
    const game = new Game();
    this.starter.addEventListener("click", () => {
      this.starter.parentElement.parentElement.classList.add("hidden");
      game.playSound("intro");
    });
  });
  