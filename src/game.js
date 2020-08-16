import Player from "/src/player.js";
import Input from "/src/input.js";

const GAMESTATE = {
  PAUSED: 0,
  RUNNING: 1,
  MENU: 2,
  GAMEOVER: 3
};

export default class Game {
  constructor(gameWidth, gameHeight, imArray, audioArray) {
    this.gameWidth = gameWidth;
    this.gameHeight = gameHeight;
    this.curLevel = 0;
    this.imageArray = imArray;
    this.audioArray = audioArray;
    this.player = new Player(this, false, this.imageArray[0]);
    this.enemy = new Player(
      this,
      true,
      this.imageArray[Math.floor(Math.random() * 3 + 1)]
    );
    this.input = new Input(this);
    this.gameObjects = [];
    this.gameState = GAMESTATE.MENU;
    this.delay = 0;
    this.ready = 0;
    this.timer = 0;
    this.levelInputs = 0;
    this.correctInput = [];
    this.gameObjects = [this.player, this.enemy];

  }
  hardReset () {
    this.player = new Player(this, false, this.imageArray[0]);
    this.enemy = new Player(
      this,
      true,
      this.imageArray[Math.floor(Math.random() * 3 + 1)]
    );
    this.gameObjects = [this.player, this.enemy];
    
    this.start();
  }
    
  start() {
    this.gameState = GAMESTATE.RUNNING;
    this.reset();
  }
  reset() {
    this.delay = Math.random() * 4000 + 1000;
    this.ready = 0;
    this.input.reset();
    this.levelInputs = Math.ceil(this.curLevel / 2 + 2);
    if (this.curLevel < 2) {
      this.timer = 3000;
    } else {
      this.timer =
        1000 * (this.levelInputs / Math.log(this.levelInputs) - 2) + 500;
    }
    this.correctInput = this.generateInput();

    return;
  }

  update(deltaTime) {
    if (
      this.gameState === GAMESTATE.MENU ||
      this.gameState === GAMESTATE.PAUSED ||
      this.gameState === GAMESTATE.GAMEOVER
    ) {
      return;
    }
    if (!this.player.alive) {
      this.gameState = GAMESTATE.GAMEOVER;
    }
    this.gameObjects.forEach((obj) => obj.update(deltaTime));
    this.input.levelInputs = this.levelInputs;
    if (!this.player.alive) {
      this.gameState = GAMESTATE.GAMEOVER;
    } else if (!this.enemy.alive) {
      this.enemy = new Player(
        this,
        true,
        this.imageArray[Math.floor(Math.random() * 3 + 1)]
      );
      this.gameObjects.push(this.enemy);
      this.curLevel += 1;
    }
    if (
      this.player.introduced &&
      this.enemy.introduced &&
      !this.input.go &&
      this.enemy.lives > 0 &&
      this.player.lives > 0
    ) {
      this.ready += deltaTime;
      if (this.input.falseStart && !this.player.hurt) {
        this.player.lives--;
        this.audioArray[1].play()
        this.player.hurt = true;
        this.reset();
        return;
      }
      if (this.delay <= this.ready) {
        this.ready = 0;
        this.input.go = true;
      }
    } else if (this.input.go) {
      this.ready += deltaTime;
      if (this.ready > this.timer && !this.player.hurt) {
        this.player.lives--;
        this.audioArray[2].play()
        this.player.hurt = true;
        this.reset();
      } else {
        this.compareInputs();
      }
    }
  }
  draw(ctx) {
    if (this.gameState === GAMESTATE.GAMEOVER) {
      ctx.drawImage(this.imageArray[7], 0, 0);
      ctx.fillStyle = "#FFDD38";
      ctx.fillText(this.curLevel, 340, 390);
      return;
    }
    if (this.gameState === GAMESTATE.PAUSED) {
      ctx.drawImage(this.imageArray[4], 0, 0);
      return;
    }
    if (this.gameState === GAMESTATE.MENU) {
      ctx.drawImage(this.imageArray[5], 0, 0);
      return;
    }
    this.gameObjects.forEach((obj) => obj.draw(ctx));
    ctx.font = "bold 40px Courier New";
    ctx.fillStyle = "#FFF00";
    ctx.fillText(this.curLevel, 30, 30);
    if (this.input.go) {
      ctx.drawImage(
        this.imageArray[12],
        this.gameWidth / 2 - 72,
        this.gameHeight / 2
      );
      for (var i = 0; i < this.correctInput.length; i++) {
        switch (this.correctInput[i]) {
          case 37:
            var str = 11;
            break;
          case 38:
            var str = 8;
            break;
          case 39:
            var str = 10;
            break;
          case 40:
            var str = 9;
            break;
          default:
            break;
        }
        ctx.drawImage(
          this.imageArray[str],
          this.gameWidth / 4 + i * 80,
          this.gameHeight / 4
        );
      }
    }
  }
  getInputArray() {
    return this.input.inputArray;
  }
  generateInput() {
    var inp = [];
    let directions = [37, 38, 39, 40];
    var num = this.levelInputs;
    for (var i = 0; i < num; i++) {
      inp.push(directions[Math.floor(Math.random() * directions.length)]);
      //inp.push(directions[0]);
    }
    return inp;
  }
  compareArrays(a, b) {
    if (a === b) return 1;
    if (a == null || b == null) return 0;
    if (a.length > b.length) return -1;
    for (var i = 0; i < a.length; ++i) {
      if (a[i] !== b[i]) return -1;
    }
    if (a.length < b.length) return 0;
    return 1;
  }
  compareInputs() {
    if (!this.player.hurt) {
      switch (this.compareArrays(this.input.inputArray, this.correctInput)) {
        case 1:
          this.enemy.hurt = true;
          this.audioArray[3].play()
          this.enemy.lives--;
          this.reset();
          break;
        case -1:
          this.player.hurt = true;
          this.audioArray[2].play()
          this.player.lives--;
          this.reset();
      }
    }
  }
  togglePause() {
    if (this.gameState === GAMESTATE.RUNNING) {
      this.gameState = GAMESTATE.PAUSED;
    } else if (this.gameState === GAMESTATE.PAUSED) {
      this.gameState = GAMESTATE.RUNNING;
    }
  }
}
