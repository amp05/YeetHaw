export default class Input {
  constructor(game) {
    this.upUp = true;
    this.downUp = true;
    this.leftUp = true;
    this.rightUp = true;
    this.inputArray = [];
    this.go = false;
    this.levelInputs = 0;
    this.falseStart = false;
    this.game = game;
    document.addEventListener("click", (event) => {
      if (this.game.gameState === 2) {
        this.game.start();
    }
        else if (this.game.gameState === 3) {
          this.game.hardReset();
        }
    });
    document.addEventListener("keyup", (event) => {
      if (this.go) {
        switch (event.keyCode) {
          case 38:
            this.upUp = true;
          case 37:
            this.leftUp = true;
          case 39:
            this.rightUp = true;
          case 40:
            this.downUp = true;
        }
      } else {
        this.falseStart = false;
      }
    });
    document.addEventListener("keydown", (event) => {
      if (event.keyCode === 80) {
        game.togglePause();
        return;
      }
      if (this.go && this.inputArray.length < this.levelInputs) {
        switch (event.keyCode) {
          case 38:
            if (this.upUp) {
              this.inputArray.push(38);
              this.upUp = false;
              break;
            }
          case 37:
            if (this.leftUp) {
              this.inputArray.push(37);
              this.leftUp = false;
              break;
            }
          case 39:
            if (this.rightUp) {
              this.inputArray.push(39);
              this.rightUp = false;
              break;
            }
          case 40:
            if (this.downUp) {
              this.inputArray.push(40);
              this.rightUp = false;
              break;
            }
        }
      } else if (!this.go) {
        this.falseStart = true;
      }
    });
  }

  reset() {
    this.upUp = true;
    this.downUp = true;
    this.leftUp = true;
    this.rightUp = true;
    this.inputArray = [];
    this.go = false;
    this.falseStart = false;
  }
}
