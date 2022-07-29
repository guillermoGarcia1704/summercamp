window.addEventListener("load", () => {
  let score = document.querySelector("#score span");
  let board = document.querySelector(".game");
  let modal = document.querySelector(".modal");
  let modalEnd = document.querySelector(".modal-end");
  let startButton = document.querySelector(".modal-content").lastElementChild;
  let gameStarted = false;
  let invadersDestroyed = 0;
  let rowWidth = 10;
  let shotSpeed = 1;
  let invadersSpeed = 1200;

  let sounds = {
    intro: new Audio("sounds/intro.wav"),
    laserL: new Audio("sounds/laserL.ogg"),
    laserR: new Audio("sounds/laserR.ogg"),
    laserS: new Audio("sounds/laserS.ogg"),
    explosion: new Audio("sounds/explosion.ogg"),
    moveUfo: new Audio("sounds/moveUfo.ogg"),
    defeat: new Audio("sounds/defeat.mp3"),
    victory: new Audio("sounds/victory.mp3"),
  };

  let invaderShapes = [
    "fa-dragon",
    "fa-d-and-d",
    "fa-skull-crossbones",
    "fa-bug",
    "fa-spider",
    "fa-virus",
    "fa-virus-covid",
    "fa-jedi",
    "fa-robot",
    "fa-rocket",
    "fa-spaghetti-monster-flying",
    "fa-octopus-deploy",
  ];
  let invaderPoints = {
    "fa-dragon": (Math.floor(Math.random() * 61) + 5) * 5,
    "fa-d-and-d": 10,
    "fa-skull-crossbones": 15,
    "fa-bug": 20,
    "fa-spider": 25,
    "fa-virus": 30,
    "fa-virus-covid": 35,
    "fa-jedi": 40,
    "fa-robot": 45,
    "fa-rocket": 50,
    "fa-spaghetti-monster-flying": 55,
    "fa-octopus-deploy": 60,
  };
  let invaderMoves = {
    direction: "right",
    leftEdge: false,
    rightEdge: false,
    bottomEdge: false,
  };
  // console.log(invaderPoints);
  let colors = ["red", "green", "blue", "yellow", "pink", "cyan"];

  //   console.log(board.offsetWidth);
  //   console.log(board.offsetHeight);

  // determinar las dimensiones de cada cuadro del tablero
  let width = (board.offsetWidth - 2) / 10 + "px";
  // rellenar tablero

  for (let i = 0; i < 200; i++) {
    let square = document.createElement("div");
    square.style.width = width;
    square.style.height = width;

    if (i < 190) {
      square.classList.add(colors[Math.floor(Math.random() * colors.length)]);
    } else {
      square.classList.add("white");
    }
    square.setAttribute("data-index", i);
    if (i < 50 && i % 10 != 0 && (i + 1) % 10 != 0) {
      let invader = document.createElement("i");
      let shape =
        invaderShapes[Math.floor(Math.random() * invaderShapes.length)];
      let type = "fa-solid";
      if (shape == "fa-d-and-d" || shape == "fa-octopus-deploy") {
        type = "fa-brands";
      }
      invader.classList.add(type, shape);
      invader.setAttribute("data-icon", i);
      square.appendChild(invader);
      invadersDestroyed++;
    }
    if (i == 195) {
      let spaceShip = document.createElement("i");
      spaceShip.classList.add("fa-solid", "fa-shuttle-space", "fa-rotate-270");
      square.appendChild(spaceShip);
    }

    board.appendChild(square);
  }

  // cerrar ventana modal y añadir intro
  startButton.addEventListener("click", () => {
    modal.classList.add("hidden");
    sounds.intro.play();
    sounds.intro.loop = true;
  });
  // recarga de página al terminar el juego desde modal de cierre
  modalEnd.lastElementChild.addEventListener("click", () => {
    document.location.reload(true)
  });
  document.addEventListener("keydown", (e) => {
    // evita la acción natural de la tecla
    if (e.key != "F12") {
      e.preventDefault();
    }
    // comprobamos que la partida aún no ha empezado
    if (gameStarted == false) {
      gameStarted = true;
      // mover invasores
      let moveInvadersId = setInterval(() => {
        if (invadersDestroyed == 0) {
          gameStarted = false;
          clearInterval(moveInvadersId);
          sounds.victory.play();
          setTimeout(() => {
            modalEnd.classList.remove("hidden");
          }, 2000);
        } else if (invaderMoves.bottomEdge == true) {
          gameStarted = false;
          clearInterval(moveInvadersId);
          sounds.defeat.play();
          setTimeout(() => {
            modalEnd.classList.remove("hidden");
          }, 2000);
        }
        moveInvaders(board, invaderMoves, rowWidth, sounds);
      }, invadersSpeed);
    }
    // detener sonido intro
    if (!sounds.intro.ended) {
      sounds.intro.pause();
      sounds.intro.currentTime = 0;
    }
    // comprobar que la partida no ha terminado
    if (invadersDestroyed > 0 && invaderMoves.bottomEdge == false) {
      let container = document.querySelector(".fa-shuttle-space").parentElement;
      // console.log(container);
      let spaceShip = "";
      // restringir en caso de 0 invasores o llegar al fondo
      switch (e.key) {
        case "ArrowRight":
          if (container.getAttribute("data-index") < 199) {
            spaceShip = container.innerHTML;
            container.innerHTML = "";
            container.nextElementSibling.innerHTML = spaceShip;
          }
          break;
        case "ArrowLeft":
          if (container.getAttribute("data-index") > 190) {
            spaceShip = container.innerHTML;
            container.innerHTML = "";
            container.previousElementSibling.innerHTML = spaceShip;
          }
          break;
        case "ArrowUp":
          if (!sounds.laserS.ended) {
            sounds.laserS.pause();
            sounds.laserS.currentTime = 0;
            setTimeout(() => {
              sounds.laserS.play();
            }, 0);
          } else {
            sounds.laserS.play();
          }

          let fire = document.createElement("i");
          fire.classList.add("fa-solid", "fa-fire");
          let explosion = document.createElement("i");
          explosion.classList.add("fa-solid", "fa-explosion");
          let position = container.getAttribute("data-index");
          // comienza el disparo
          let shotId = setInterval(() => {
            let currentSquare = document.querySelector(
              `[data-index='${position}']`
            );
            // elimina la clase red creada por el disparo
            if (currentSquare.classList.length == 2) {
              currentSquare.classList.remove("red");
            }
            // si el disparo llega a la primera linea desaparece
            if (position - rowWidth < 0) {
              document.querySelector(`[data-index='${position}']`).innerHTML =
                "";
              clearInterval(shotId);
            } else {
              let previousSquare = document.querySelector(
                `[data-index='${position - rowWidth}']`
              );
              // si la casilla esta vacia pone un disparo
              if (previousSquare.children.length == 0) {
                previousSquare.appendChild(fire);
                previousSquare.classList.add("red");
                position -= rowWidth;

                // previousSquare = document.querySelector(
                //   `[data-index='${position - rowWidth}']`
                // );

                // si no esta vacia:
              } else {
                // - detiene el disparo
                clearInterval(shotId);
                // - vacia la casilla del diparo
                if (
                  position < 190 &&
                  currentSquare.children.length == 1 &&
                  currentSquare.children[0].classList.contains("fa-fire")
                ) {
                  currentSquare.innerHTML = "";
                }
                // - si un dispaaro choca con otro lo elimina
                if (
                  previousSquare.children.length == 1 &&
                  previousSquare.children[0].classList.contains("fa-fire")
                ) {
                  previousSquare.innerHTML = "";
                } else {
                  let iconId =
                    previousSquare.children[0].getAttribute("data-icon");
                  let firedIcon = document.querySelector(
                    `[data-icon='${iconId}']`
                  );
                  // comprueba que no sea una explosión
                  // - cambia el enemigo por una explosión
                  if (!firedIcon.classList.contains("fa-explosion")) {
                    let iconType = firedIcon.classList[1];
                    firedIcon.removeAttribute("class");
                    firedIcon.classList.add("fa-solid", "fa-explosion");
                    invadersDestroyed--;
                    console.log(invadersDestroyed);
                    // si eliminamos un invasor suena la explosión
                    if (!sounds.explosion.ended) {
                      sounds.explosion.pause();
                      sounds.explosion.currentTime = 0;
                      setTimeout(() => {
                        sounds.explosion.play();
                      }, 0);
                    } else {
                      sounds.explosion.play();
                    }
                    score.innerText =
                      parseInt(score.innerText) + invaderPoints[iconType];
                  }
                }
              }
            }
          }, shotSpeed);
          break;
      }
    }
  });
});
// declaración de una función
const moveInvaders = (board, invaderMoves, rowWidth, sounds) => {
  let boardContent = board.children;
  // si los invasores se mueven a la derecha
  if (
    invaderMoves.direction == "right" &&
    invaderMoves.rightEdge == false &&
    invaderMoves.bottomEdge == false
  ) {
    boardContent = [...boardContent].reverse();
    boardContent.forEach((square) => {
      if (
        square.children.length > 0 &&
        !square.children[0].classList.contains("fa-fire") &&
        !square.children[0].classList.contains("fa-shuttle-space")
      ) {
        let child = square.children[0];
        square.innerHTML = "";
        if (!child.classList.contains("fa-explosion")) {
          square.nextElementSibling.innerHTML = "";
          square.nextElementSibling.appendChild(child);
        }
        if (
          (parseInt(square.nextElementSibling.getAttribute("data-index")) + 1) %
            10 ==
          0
        ) {
          invaderMoves.rightEdge = true;
        }
      }
    });
    if (invaderMoves.rightEdge == true) {
      invaderMoves.direction = "bottom";
    }
    // si los invasores se mueven hacia abajo
  } else if (
    invaderMoves.direction == "bottom" &&
    invaderMoves.bottomEdge == false
  ) {
    if (invaderMoves.rightEdge == true) {
      invaderMoves.direction = "left";
      invaderMoves.rightEdge = false;
    } else {
      invaderMoves.direction = "right";
      invaderMoves.leftEdge = false;
    }
    boardContent = [...boardContent].reverse();
    boardContent.forEach((square) => {
      if (
        square.children.length > 0 &&
        !square.children[0].classList.contains("fa-fire") &&
        !square.children[0].classList.contains("fa-shuttle-space")
      ) {
        // comprueba si se ha alcanzado el límite inferior
        if (parseInt(square.getAttribute("data-index")) >= 180) {
          invaderMoves.bottomEdge = true;
        } else if (invaderMoves.bottomEdge == false) {
          let child = square.children[0];
          square.innerHTML = "";
          if (!child.classList.contains("fa-explosion")) {
            let nextSquare = document.querySelector(
              `[data-index='${
                parseInt(square.getAttribute("data-index")) + rowWidth
              }']`
            );
            nextSquare.innerHTML = "";
            nextSquare.appendChild(child);
          }
        }
      }
    });
    // si los invasores se mueven a la izquierda
  } else if (
    invaderMoves.direction == "left" &&
    invaderMoves.leftEdge == false &&
    invaderMoves.bottomEdge == false
  ) {
    boardContent = [...boardContent]; //¿eliminar?
    boardContent.forEach((square) => {
      if (
        square.children.length > 0 &&
        !square.children[0].classList.contains("fa-fire") &&
        !square.children[0].classList.contains("fa-shuttle-space")
      ) {
        let child = square.children[0];
        square.innerHTML = "";
        if (!child.classList.contains("fa-explosion")) {
          square.previousElementSibling.innerHTML = "";
          square.previousElementSibling.appendChild(child);
        }
        if (
          square.previousElementSibling.getAttribute("data-index") % 10 ==
          0
        ) {
          invaderMoves.leftEdge = true;
        }
      }
    });
    if (invaderMoves.leftEdge == true) {
      invaderMoves.direction = "bottom";
    }
  }
  // sonido del movimiento de los invasores
  if (!sounds.moveUfo.ended) {
    sounds.moveUfo.pause();
    sounds.moveUfo.currentTime = 0;
    setTimeout(() => {
      sounds.moveUfo.play();
    }, 0);
  } else {
    sounds.moveUfo.play();
  }
};