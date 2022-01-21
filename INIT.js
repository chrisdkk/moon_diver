import Player from "./GameObjects/Player.js";
import Tile from "./GameObjects/Tile.js";

let context;
let lastTickTimestamp;
let player;
let deltaTime;
let gameObjects = [];
let tiles = [];
let collisionMap = [];

const CONFIG = {
  width: 320,
  height: 256,
  debug: true,
};

const world = {
  tilesize: 32,
  level: {
    map: [
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [3, 0, 0, 0, 0, 0, 0, 0, 0, 1],
      [2, 2, 2, 2, 2, 2, 2, 2, 2, 2],
    ],
    columns: 8,
  },
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

  loadLevel(world.level.map);

  player = new Player(context, 0, 0, 60, 60, CONFIG);
  gameObjects.push(player);

  collisionMap = levelLayout;

  for (let i = 0; i < levelLayout.length; i++) {
    for (let j = 0; j < 8; j++) {
      if (levelLayout[i][j] !== 0) {
        collisionMap[i][j] = 1;
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

function loadLevel(levelMap) {
  for (let i = 0; i < world.level.map.length; i++) {
    for (let j = 0; j < 8; j++) {
      if (world.level.map[i][j] !== 0) {
        let tile = new Tile(
          context,
          j * 80,
          i * 80,
          80,
          80,
          CONFIG,
          world.level.map[i][j] - 1
        );
        tiles.push(tile);
        gameObjects.push(tile);
      }
    }
  }
}
