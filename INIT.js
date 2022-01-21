import Player from "./GameObjects/Player.js";
import Tile from "./GameObjects/Tile.js";

let context;
let lastTickTimestamp;
let player;
let deltaTime;
let gameObjects = [];
let tiles = [];

const CONFIG = {
  width: 640,
  height: 480,
  debug: true,
};

const levelState = {
  lastTick: undefined,
  delta: 0,
};

const init = () => {
  // getMapData
  // getPlayerData

  // drawCanvas(mapData)
  // drawPlater()

  // startGameLoop()

  const canvas = document.getElementById("canvas");
  context = canvas.getContext("2d");

  canvas.setAttribute("width", CONFIG.width);
  canvas.setAttribute("height", CONFIG.height);

  player = new Player(context, 100, 100, 60, 60, CONFIG);
  gameObjects.push(player);

  let levelLayout = [
    [17, 10, 10, 10, 10, 10, 10, 19],
    [7, 0, 0, 0, 0, 0, 0, 5],
    [7, 0, 0, 0, 0, 0, 0, 5],
    [7, 0, 0, 13, 14, 14, 15, 5],
    [7, 0, 0, 0, 0, 0, 0, 5],
    [21, 2, 2, 2, 2, 2, 2, 23],
  ];

  for (let i = 0; i < levelLayout.length; i++) {
    for (let j = 0; j < 8; j++) {
      if (levelLayout[i][j] !== 0) {
        let tile = new Tile(
          context,
          j * 80,
          i * 80,
          80,
          80,
          CONFIG,
          levelLayout[i][j] - 1
        );
        tiles.push(tile);
        gameObjects.push(tile);
      }
    }
  }

  // levelState.lastTick = performance.now();
  lastTickTimestamp = performance.now();
  gameLoop();
};

const gameLoop = () => {
  //how much time has passed since last render
  deltaTime = performance.now() - lastTickTimestamp;

  update(deltaTime);
  render();

  lastTickTimestamp = performance.now();
  requestAnimationFrame(gameLoop);
};

const update = (deltaTime) => {
  player.update(deltaTime);

  tiles.forEach((tile) => {
    checkTileCollision(player, tile);
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
