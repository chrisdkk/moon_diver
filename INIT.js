import Player from "./modules/Player.js";
import Tile from "./modules/Tile.js";

let context;
let lastTickTimestamp;
let player;
let gameObjects = [];
let tiles = [];

let level;

const CONFIG = {
  width: 640,
  height: 480,
  debug: true,
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
    [6, "-", "-", 12, 13, 14, "-", 4],
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
    if (checkCollisionBetween(player, tile)) {
      player.velocity = 0;
    }
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

let checkCollisionBetween = (gameObjectA, gameObjectB) => {
  let bbA = gameObjectA.getBoundingBox();
  let bbB = gameObjectB.getBoundingBox();

  if (
    bbA.x < bbB.x + bbB.w &&
    bbA.x + bbA.w > bbB.x &&
    bbA.y < bbB.y + bbB.h &&
    bbA.y + bbA.h > bbB.y
  ) {
    // collision happened
    return true;
  } else return false;
};
