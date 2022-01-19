import Player from "./modules/Player.js";
import Tile from "./modules/Tile.js";

let context;
let lastTickTimestamp;
let player;
let gameObjects = [];
let tiles = [];

const CONFIG = {
  width: 640,
  height: 480,
  debug: true, //TODO fix debug mode
};

const init = () => {
  const canvas = document.getElementById("canvas");
  context = canvas.getContext("2d");

  canvas.setAttribute("width", CONFIG.width);
  canvas.setAttribute("height", CONFIG.height);

  player = new Player(context, 100, 100, 60, 80, CONFIG);
  gameObjects.push(player);

  let levelLayout = [
    [16, 9, 9, 9, 9, 9, 9, 18],
    [6, "-", "-", "-", "-", "-", "-", 4],
    [6, "-", "-", "-", "-", "-", "-", 4],
    [6, "-", "-", 12, 13, 13, 14, 4],
    [6, "-", "-", "-", "-", "-", "-", 4],
    [20, 1, 1, 1, 1, 1, 1, 22],
  ];

  for (let i = 0; i < levelLayout.length; i++) {
    for (let j = 0; j < 8; j++) {
      if (levelLayout[i][j] !== "-") {
        let tile = new Tile(
          context,
          j * 80,
          i * 80,
          80,
          80,
          CONFIG,
          levelLayout[i][j]
        );
        tiles.push(tile);
        gameObjects.push(tile);
      }
    }
  }

  lastTickTimestamp = performance.now();
  gameLoop();
};

const gameLoop = () => {
  //how much time has passed since last render
  let deltaTime = performance.now() - lastTickTimestamp;
  window.deltaTime = deltaTime;

  update(deltaTime);
  render();

  lastTickTimestamp = performance.now();
  requestAnimationFrame(gameLoop);
};

const update = (deltaTime) => {
  player.update(deltaTime);

  tiles.forEach((tile) => {
    checkCollisionBetween(player, tile);
  });
};

const render = () => {
  context.resetTransform();
  context.clearRect(0, 0, CONFIG.width, CONFIG.height);

  gameObjects.forEach((gameObject) => {
    gameObject.render();
  });
};

window.addEventListener("load", () => {
  init();
});

const checkCollisionBetween = (gameObjectA, gameObjectB) => {
  let rbbA = gameObjectA.getRight();
  let lbbA = gameObjectA.getLeft();
  let tbbA = gameObjectA.getTop();
  let bbbA = gameObjectA.getBottom();

  let rbbB = gameObjectB.getRight();
  let lbbB = gameObjectB.getLeft();
  let tbbB = gameObjectB.getTop();
  let bbbB = gameObjectB.getBottom();

  if (
    rbbA.x < lbbB.x + lbbB.w &&
    rbbA.x + rbbA.w > lbbB.x &&
    rbbA.y < lbbB.y + lbbB.h &&
    rbbA.y + rbbA.h > lbbB.y
  ) {
    gameObjectA.colideRight(lbbB.x);
    console.log("colide right");
  }
  if (
    lbbA.x < rbbB.x + rbbB.w &&
    lbbA.x + rbbA.w > rbbB.x &&
    lbbA.y < rbbB.y + rbbB.h &&
    lbbA.y + lbbA.h > rbbB.y
  ) {
    gameObjectA.colideLeft(rbbB.x + 10);
    console.log("colide left");
  }
  if (
    tbbA.x < bbbB.x + bbbB.w &&
    tbbA.x + tbbA.w > bbbB.x &&
    tbbA.y < bbbB.y + bbbB.h &&
    tbbA.y + tbbA.h > bbbB.y
  ) {
    gameObjectA.colideTop(bbbB.y);
    console.log("colide top");
  }
  if (
    bbbA.x < tbbB.x + tbbB.w &&
    bbbA.x + bbbA.w > tbbB.x &&
    bbbA.y < tbbB.y + tbbB.h &&
    bbbA.y + bbbA.h > tbbB.y
  ) {
    gameObjectA.colideBottom(tbbB.y + 10);
    console.log("colide bottom");
  }
};
