//import "./styles.css";
import Game from "./game.js";

let canvas = document.getElementById("gameScreen");
let ctx = canvas.getContext("2d");

const GAME_WIDTH = 600;
const GAME_HEIGHT = 600;

var bgm = document.getElementById("bgm");
var shot = document.getElementById("shot");
var shot2 = document.getElementById("shot2");
var fs = document.getElementById("falseStart");
var bgIm = document.getElementById("bg");
var playerIm = document.getElementById("player");
var enemyIm3 = document.getElementById("enemy3");
var enemyIm4 = document.getElementById("enemy4");
var enemyIm5 = document.getElementById("enemy5");
var pauseIm = document.getElementById("pause");
var mmIm = document.getElementById("mm");
var upIm = document.getElementById("up");
var downIm = document.getElementById("down");
var leftIm = document.getElementById("left");
var rightIm = document.getElementById("right");
var heartIm = document.getElementById("heart");
var gameOverIm = document.getElementById("gameover");
var goIm = document.getElementById("go");

var imageArray = [
                 playerIm, 
                 enemyIm3, 
                 enemyIm4, 
                 enemyIm5,
                 pauseIm,
                 mmIm,
                 heartIm,
                 gameOverIm,
                 upIm,
                 downIm,
                 rightIm,
                 leftIm,
                 goIm
                ];

var audioArray = [bgm, fs, shot, shot2];

let game = new Game(GAME_WIDTH, GAME_HEIGHT, imageArray, audioArray);

let lastTime = 0;


function gameLoop(timestamp) {
  let deltaTime = timestamp - lastTime;
  lastTime = timestamp;

  ctx.drawImage(bgIm, 0, 0);
  game.update(deltaTime);
  game.draw(ctx);

  requestAnimationFrame(gameLoop);
}

var loop = setInterval(checkLoad, 1000);


function checkLoad() {
  if (true) {
    var playPromise = bgm.play();

      if (playPromise !== undefined) {
        playPromise
          .then(_ => {
            // Automatic playback started!
            // Show playing UI.
          })
          .catch(error => {
            // Auto-play was prevented
            // Show paused UI.
          });
      }
    requestAnimationFrame(gameLoop);
  }
}
