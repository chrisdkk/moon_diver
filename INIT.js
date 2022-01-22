import Player from "./GameObjects/Player.js";
import Tile from "./GameObjects/Tile.js";

let context;
let player;
let gameObjects = [];
let tiles = [];
let colliders = [];

const CONFIG = {
  width: 576,
  height: 384,
  debug: true,
};

const world = {
  tilesize: 48,
  level: {
    map: [
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 8, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 8, 0, 0, 0, 0],
      [0, 0, "P", 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2],
    ],
    columns: 12,
  },
};

const levelState = {
  lastTick: undefined,
  delta: 0,
};

const init = () => {
  const canvas = document.getElementById("canvas");
  context = canvas.getContext("2d");

  canvas.setAttribute("width", CONFIG.width);
  canvas.setAttribute("height", CONFIG.height);

  loadLevel(world.level, world.tilesize);

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

const update = (deltaTime) => {
  player.update(deltaTime);

  let cPos = {
    x: player.nextPos.x,
    y: player.nextPos.y,
    dx: 10000,
    dy: 10000,
  };
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
      console.log("iscolliding");
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

function loadLevel(level, tilesize) {
  for (let i = 0; i < level.map.length; i++) {
    for (let j = 0; j < level.columns; j++) {
      if (level.map[i][j] === "P") {
        player = new Player(
          context,
          j * tilesize,
          i * tilesize - 1,
          tilesize,
          tilesize,
          CONFIG
        );
        gameObjects.push(player);
      } else if (level.map[i][j] !== 0) {
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
        colliders.push(tile.getBoundingBox);
      }
    }
  }
}

function letCollide(collisionData) {
  let dx = collisionData.dx;
  let dy = collisionData.dy;
  let k = dy / dx;
  console.log("dx:" + dx);
  console.log("dy:" + dy);
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
