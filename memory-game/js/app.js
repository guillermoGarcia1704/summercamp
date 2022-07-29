window.addEventListener("load", () => {
  // start game
  const game = new Game();
  game.startGame();
});

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
    this.playing = false;
    this.previousCard = null;
    this.currentCard = null;
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
  }
  //arfc
  //generar plantilla para la card
  getCardTemplate = (img) => {
    let card = `
    <!-- new card template -->
    <div class="flip-card">
      <div class="flip-card-inner">
        <div class="flip-card-front">
          <img src="img/cards/cover.png" alt="cover">
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
    //   console.log(card.children[0].children[1].children[0].src);
    // });
    //mientras queden cartas por mezclar,
    // ejecuta el siguiente código
    while (currentIndex != 0) {
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;

      [board[currentIndex], board[randomIndex]] = [
        board[randomIndex],
        board[currentIndex],
      ];
    }
    board.forEach((card) => {
    //   console.log(card.children[0].children[1].children[0].src);
      this.board.appendChild(card);
    });
  };

  // preparar todas las imágenes para que reaccionen
  // al evento click
  addEventListeners = () => {
    const cards = document.querySelectorAll(".flip-card");
    cards.forEach((card) => {
      card.children[0].children[0].children[0].addEventListener(
        "click",
        (e) => {
          if (!this.playing) {
            this.playing = true;
            // desactivar sonido intro
            // iniciar el temporizador
            // activar música aleatoria
          }
          this.flipCard(e);
        }
      );
    });
  };

  // girar las imágenes
  flipCard = (e) => {
    
  };

  startGame = () => {
    this.createBoard();
    this.shuffleCards();
    this.addEventListeners();
  };
}
