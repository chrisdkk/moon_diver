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
let colliders = [];
let collectibles = [];
let interval = true;

const hud = {};

const world = {
  tilesize: 80,
  level: {
    map: [
      [6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6],
      [6, 6, 6, 6, 6, 17, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10],
      [17, 10, 10, 10, 10, 11, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [7, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [7, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [7, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [7, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [21, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2],
    ],
    colliders: [
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [2, 0, 0, 0, 0, 3, 0, 0, 0, 0, 0, 0],
      [2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    ],
    columns: 18,
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
    world.tilesize * 3,
    world.tilesize * 6 - 1,
    world.tilesize,
    world.tilesize,
    CONFIG
  );
  gameObjects.push(player);

  let collectible = new Collectible(
    context,
    world.tilesize * 8,
    world.tilesize * 6,
    world.tilesize,
    world.tilesize,
    CONFIG
  );
  collectibles.push(collectible);
  gameObjects.push(collectible);
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
      player.state.lastDx
    );
    gameObjects.push(projectile);
  }

  let cPos = {
    x: player.nextPos.x,
    y: player.nextPos.y,
    dx: 10000,
    dy: 10000,
  };

  console.log(tiles);
  tiles.forEach((tile) => {
    setPlayerVertices(player, player.nextPos);
    ob = { x: tile.x, y: tile.y, w: tile.width, h: tile.height };
    obVertices = [
      { x: ob.x, y: ob.y },
      { x: ob.x + ob.w, y: ob.y },
      { x: ob.x + ob.w, y: ob.y + ob.h },
      { x: ob.x, y: ob.y + ob.h },
    ];
    let c = hasCollided(obVertices);
    // console.log(newPos);
    if (typeof c.dx === "number") {
      if (pythagoras(c.dx, c.dy) < pythagoras(cPos.dx, cPos.dy)) {
        cPos.dx = c.dx;
        cPos.dy = c.dy;

        cPos.x = player.x + cPos.dx;
        cPos.y = player.y + cPos.dy;
      }
    }
  });
  if (cPos.dx !== 10000) {
    letCollide(cPos);
  }
  player.x = cPos.x;
  player.y = cPos.y;

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

function loadLevel(level, tilesize) {
  for (let i = 0; i < level.map.length; i++) {
    for (let j = 0; j < level.columns; j++) {
      if (level.map[i][j] !== 0) {
        let tile = new Tile(
          context,
          j * tilesize,
          i * tilesize,
          tilesize,
          tilesize,
          CONFIG,
          level.map[i][j] - 1
        );
        tiles.push(tile);
        gameObjects.push(tile);
      }
    }
  }
}

function letCollide(collisionData) {
  let dx = collisionData.dx;
  let dy = collisionData.dy;
  let k = dy / dx;
  if (player.state.dx === 0 || Math.abs(k * dy) > Math.abs(dx)) {
    if (dy < 0) {
      player.state.velocity = 1;
      collisionData.y += 0.05;
      console.log("up");
    } else if (dy > 0) {
      player.state.dy = 0;
      collisionData.y -= 0.05;
      console.log("down");
    }
  } else if (player.state.dy === 0 || Math.abs(k * dy) < Math.abs(dx)) {
    if (dx > 0) {
      collisionData.x -= 1;
      console.log("right");
    } else if (dx < 0) {
      collisionData.x += 1;
      console.log("left");
    } else {
      console.log("dunno");
    }
  }
}

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

window.addEventListener("load", () => {
  canvas.setAttribute("width", CONFIG.width);
  canvas.setAttribute("height", CONFIG.height);
  init();
});
