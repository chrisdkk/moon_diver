import Player from "./GameObjects/Player.js";
import Tile from "./GameObjects/Tile.js";
import Collectible from "./GameObjects/Collectible.js";
import PointsDisplay from "./GameObjects/PointsDisplay.js";
import Scene from "./Scene.js";
import PlayerProjectile from "./GameObjects/Projectiles.js";

let player;
let pointUI;
let gameObjects = [];
let tiles = [];
let collectibles = [];

const hud = {};

const camera = {
  x: 0,
  y: 0,
};

const world = {
  tilesize: 80,
  level: {
    map: [
      [
        6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 17,
        10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 19, 6,
        6, 6, 6, 6, 6,
      ],
      [
        6, 6, 6, 6, 6, 6, 6, 6, 6, 17, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10,
        10, 10, 10, 11, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 5, 6, 6,
        6, 6, 6, 6,
      ],
      [
        6, 6, 6, 6, 6, 6, 6, 6, 6, 7, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 5, 6, 6, 6, 6, 6, 6,
      ],
      [
        6,
        6,
        6,
        6,
        6,
        17,
        10,
        10,
        10,
        11,
        0,
        "C",
        0,
        0,
        0,
        16,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        "C",
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        5,
        6,
        6,
        6,
        6,
        6,
        6,
      ],
      [
        6, 6, 6, 6, 6, 7, 0, 0, 0, 0, 0, 13, 15, 0, 0, 0, 0, 0, 13, 15, 0, 0, 4,
        0, 0, 0, 0, 0, 13, 14, 14, 15, 0, 0, 0, 0, 0, 0, 0, 0, 5, 6, 6, 6, 6, 6,
        6,
      ],
      [
        6, 6, 6, 6, 6, 7, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 16, 0, 0, 0, 0, 0, 8, 1,
        3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 3, 0, 0, 1, 2, 23, 6, 6, 6, 6, 6, 6,
      ],
      [
        6,
        6,
        6,
        6,
        6,
        7,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        4,
        0,
        0,
        13,
        15,
        0,
        0,
        "C",
        8,
        9,
        11,
        16,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        1,
        2,
        2,
        3,
        0,
        5,
        6,
        6,
        6,
        6,
        6,
        6,
        6,
        6,
      ],
      [
        6, 6, 6, 6, 6, 21, 2, 2, 2, 2, 3, 0, 4, 0, 8, 0, 0, 0, 0, 0, 1, 2, 22,
        2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 23, 6, 6, 6, 6, 6, 6, 6, 6,
      ],
    ],
    columns: 47,
  },
};

const CONFIG = {
  width: 80 * 12,
  height: 80 * 8,
  debug: 1,
};

const levelState = {
  lastTick: undefined,
  delta: 0,
};

//--------------------------
//Initialize
//--------------------------

const init = () => {
  loadLevel(world.level, world.tilesize);

  //--------------------------
  //Load Entities
  //--------------------------

  player = new Player(
    context,
    CONFIG.width / 2,
    world.tilesize * 6,
    world.tilesize - 4,
    world.tilesize - 4,
    CONFIG,
    camera
  );
  gameObjects.push(player);

  //--------------------------
  //Set up UI
  //--------------------------
  pointUI = new PointsDisplay(context, 20, 20);
  gameObjects.push(pointUI);
  //--------------------------

  levelState.lastTick = performance.now();
  gameLoop();
};

const gameLoop = () => {
  //how much time has passed since last render
  levelState.deltaTime = performance.now() - levelState.lastTick;

  update(levelState.deltaTime);
  render();

  levelState.lastTick = performance.now();
  requestAnimationFrame(gameLoop);
};

//--------------------------
//Update
//--------------------------
const update = (deltaTime) => {
  gameObjects.forEach((gameObject) => {
    gameObject.update(deltaTime);
  });

  if (player.shoot) {
    let projectile = new PlayerProjectile(
      context,
      player.x,
      player.y,
      world.tilesize,
      world.tilesize,
      CONFIG,
      camera,
      player.state.lastDx
    );
    gameObjects.push(projectile);
  }

  //Level bounds collision
  player.colDX = 0;
  player.colDY = 0;
  collisionTop(CONFIG.height, 0, CONFIG.width, 100);
  collisionBottom(0, 0, CONFIG.width, 100);
  collisionLeft(CONFIG.width, 0, CONFIG.height, 100);
  collisionRight(0, 0, CONFIG.height, 100);

  // Box collisions
  tiles.forEach((tile) => {
    collisionTop(
      tile.y - tile.height / 2,
      tile.x - tile.width / 2,
      tile.x + tile.width / 2,
      10
    );
    collisionBottom(
      tile.y + tile.height / 2,
      tile.x - tile.width / 2,
      tile.x + tile.width / 2,
      10
    );
    collisionLeft(
      tile.x - tile.width / 2,
      tile.y - tile.height / 2,
      tile.y + tile.height / 2,
      10
    );
    collisionRight(
      tile.x + tile.width / 2,
      tile.y - tile.height / 2,
      tile.y + tile.height / 2,
      10
    );
  });

  gameObjects.forEach((obj) => {
    obj.x -= player.dX;
  });

  //Move Camera
  camera.x += player.dX;
  pointUI.x += player.dX;

  // Move the player
  player.x += player.dX;
  player.y += player.dY;
  player.x += player.colDX;
  player.y += player.colDY;

  //check for collision between collectibles and player
  let removeItems = [];
  collectibles.forEach((collectible) => {
    if (checkCollisionBetween(player, collectible)) {
      removeItems.push(collectible);
      pointUI.increase();
    }
  });
  //remove colliding items from collectibles and gameObjects arrays
  removeItems.forEach(removeCollectible);
};

//--------------------------
//Render
//--------------------------

const render = () => {
  context.resetTransform();
  context.clearRect(0, 0, CONFIG.width, CONFIG.height);

  gameObjects.forEach((gameObject) => {
    gameObject.render();
  });

  context.imageSmoothingEnabled = false;
  context.scale(4, 4);
};

//--------------------------
//Utilities
//--------------------------

//Load Level Map
function loadLevel(level, tilesize) {
  for (let i = 0; i < level.map.length; i++) {
    for (let j = 0; j < level.columns; j++) {
      switch (level.map[i][j]) {
        case 0:
          break;
        case "C":
          let collectible = new Collectible(
            context,
            j * tilesize,
            i * tilesize,
            world.tilesize,
            world.tilesize,
            CONFIG,
            camera
          );
          collectibles.push(collectible);
          gameObjects.push(collectible);
          break;
        default:
          let tile = new Tile(
            context,
            j * tilesize,
            i * tilesize,
            tilesize,
            tilesize,
            CONFIG,
            camera,
            level.map[i][j] - 1
          );
          tiles.push(tile);
          gameObjects.push(tile);
          break;
      }
    }
  }
}

/// COLLISION FUNCTIONS
function collisionTop(y, xMin, xMax, boxHeight) {
  if (
    player.x - player.width / 2 < xMax &&
    player.x + player.width / 2 > xMin
  ) {
    if (
      player.y + player.dY > y - player.height / 2 &&
      player.y + player.dY < y + boxHeight - player.height / 2
    ) {
      if (player.dY > 1) {
        player.dY = 0;
        player.state.velocity = 0;
        player.jump = false;
      } else {
        player.dY = 0;
        player.state.velocity = 0;
        player.jump = false;
      }
      if (player.y + player.dY > y - player.height / 2) {
        player.colDY = player.y + player.dY - y - player.height / 2;
      }
    }
  }
}

function collisionBottom(y, xMin, xMax, boxHeight) {
  if (
    player.x - player.width / 2 < xMax &&
    player.x + player.width / 2 > xMin
  ) {
    if (
      player.y + player.dY < y + player.height / 2 &&
      player.y + player.dY > y - boxHeight - player.height / 2
    ) {
      player.dY = 0;
      player.state.velocity = 1;
      if (player.y + player.dY < y + player.height / 2) {
        player.colDY = player.y + player.dY - y + player.height / 2;
      }
    }
  }
}

function collisionLeft(x, yMin, yMax, boxWidth) {
  if (
    player.y - player.height / 2 < yMax &&
    player.y + player.height / 2 > yMin
  ) {
    if (
      player.x + player.dX > x - player.width / 2 &&
      player.x + player.dX < x - player.width / 2 + boxWidth
    ) {
      player.dX = 0;
      if (player.x + player.dX > x - player.width / 2) {
        player.colDX = player.x + player.dX - x - player.width / 2;
      }
    }
  }
}

function collisionRight(x, yMin, yMax, boxWidth) {
  if (
    player.y - player.height / 2 < yMax &&
    player.y + player.height / 2 > yMin
  ) {
    if (
      player.x + player.dX < x + player.width / 2 &&
      player.x - player.dX > x + player.width / 2 - boxWidth
    ) {
      player.dX = 0;
      if (player.x + player.dX < x + player.width / 2) {
        player.colDX = player.x + player.dX - x + player.width / 2;
      }
    }
  }
}

//Simple check for AABB Overlap
let checkCollisionBetween = (gameObjectA, gameObjectB) => {
  let bbA = gameObjectA.getBoundingBox();
  let bbB = gameObjectB.getBoundingBox();

  if (
    //go through criteria that exclude collision
    bbA.x > bbB.x + bbB.w ||
    bbA.x + bbA.w < bbB.x ||
    bbA.y > bbB.y + bbB.h ||
    bbA.y + bbA.h < bbB.y
  ) {
    return false;
  } else return true;
};

let removeCollectible = (collectible) => {
  collectibles.splice(collectibles.indexOf(collectible), 1);
  gameObjects.splice(gameObjects.indexOf(collectible), 1);
};

//What happens when page is loaded
window.addEventListener("load", () => {
  canvas.setAttribute("width", CONFIG.width);
  canvas.setAttribute("height", CONFIG.height);
  init();
});
