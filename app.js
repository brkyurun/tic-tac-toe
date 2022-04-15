const gameBoard = (function () {
  let gameBoardAreas = ["", "", "", "", "", "", "", "", ""];

  function getArea(index) {
    return gameBoardAreas[index];
  }

  function setArea(index, sign) {
    gameBoardAreas[index] = sign;
  }

  function reset() {
    for (let i = 0; i < gameBoardAreas.length; i++) {
      gameBoardAreas[i] = "";
    }
  }

  return { getArea, setArea, reset };
})();

const displayController = (function () {
  const tiles = [...document.querySelectorAll(".game-area")];
  const restart = document.querySelector("#resetGame");
  const messageArea = document.querySelector(".winner-announcement");

  for (let tile of tiles) {
    tile.addEventListener("click", (element) => {
      if (gameController.isGameOver() || element.target.textContent !== "") {
        return;
      }
      gameController.playRound(Number(element.target.dataset.index));
      render();
    });
  }

  restart.addEventListener("click", () => {
    gameBoard.reset();
    gameController.reset();
    render();
    changeMessageArea("Player X's turn");
  });

  function render() {
    for (let i = 0; i < tiles.length; i++) {
      tiles[i].textContent = gameBoard.getArea(i);
    }
  }

  function changeMessageArea(text) {
    messageArea.textContent = text;
  }

  function showWinner(winner) {
    if (winner === "tie") {
      changeMessageArea("It's a tie.");
    } else {
      changeMessageArea(`${winner} wins!`);
    }
  }
  return { changeMessageArea, showWinner };
})();

const gameController = (function () {
  const playerX = Player("X", prompt("First player: ", "Player X"));
  const playerO = Player("O", prompt("Second player: ", "Player O"));
  let round = 1;
  let roundOver = false;

  function playRound(index) {
    gameBoard.setArea(index, getCurrentSign());
    if (checkWinner(index)) {
      displayController.showWinner(getCurrentSign());
      roundOver = true;
      return;
    } else if (round === 9) {
      displayController.showWinner("tie");
      roundOver = true;
      return;
    }
    round++;
    displayController.changeMessageArea(`${getCurrentSign()}'s turn`);
  }

  function getCurrentSign() {
    return round % 2 === 1 ? playerX.getSign() : playerO.getSign();
  }

  function checkWinner(index) {
    const winningConditions = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];

    return winningConditions
      .filter((combination) => combination.includes(index))
      .some((possibleCombo) =>
        possibleCombo.every(
          (index) => gameBoard.getArea(index) === getCurrentSign()
        )
      );
  }

  function isGameOver() {
    return roundOver;
  }

  function reset() {
    round = 1;
    roundOver = false;
  }

  return { playRound, isGameOver, reset };
})();

function Player(sign, name) {
  this.sign = sign;

  function getSign() {
    return sign;
  }

  return { name, getSign };
}
