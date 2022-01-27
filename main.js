import Player from "./GameObjects/Player.js";
import Tile from "./GameObjects/Tile.js";
import Collectible from "./GameObjects/Collectible.js";
import Interface from "./GameObjects/Interface.js";
import Enemy from "./GameObjects/Enemy.js";
import EnemyProjectile from "./GameObjects/EnemyProjectile.js";
import Exit from "./GameObjects/Exit.js";
import { world } from "./map.js";

let player;
let end;
let gameUI;
let reset = false;
let win = false;
let gameAudio = new Audio("./assets/audio/SR388.mp3");

let gameObjects = [];
let tiles = [];
let collectibles = [];
let playerProjectiles = [];
let enemyProjectiles = [];
let enemies = [];

//--------------------------
//Initialize
//--------------------------

function init() {
  loadLevel(world.level, world.tilesize);

  //--------------------------
  //Load Entities
  //--------------------------

  player = new Player(
    context,
    CONFIG.width / 2,
    world.tilesize * 6,
    world.tilesize - 10,
    world.tilesize - 10,
    CONFIG
  );
  gameObjects.push(player);

  //--------------------------
  //Set up UI
  //--------------------------
  gameUI = new Interface(context, 20, 20);
  gameObjects.push(gameUI);

  //--------------------------
  //Start Music
  //--------------------------

  gameAudio.play();
  //--------------------------

  levelState.lastTick = performance.now();
  gameLoop();
}

function gameLoop() {
  //how much time has passed since last render
  levelState.deltaTime = performance.now() - levelState.lastTick;

  update(levelState.deltaTime);
  render();

  if (reset) {
    reset = false;
    resetGame();
    return;
  }

  if (win) {
    endScreen();
    return;
  }

  levelState.lastTick = performance.now();
  requestAnimationFrame(gameLoop);
}

//--------------------------
//Update
//--------------------------
function update(deltaTime) {
  gameObjects.forEach((gameObject) => {
    gameObject.update(deltaTime);
  });

  console.log(tiles);

  //Level bounds collision
  player.colDX = 0;
  player.colDY = 0;

  // Box collisions
  tiles.forEach((tile) => {
    collisionTop(
      player,
      tile.y - tile.height / 2,
      tile.x - tile.width / 2,
      tile.x + tile.width / 2,
      10
    );
    collisionBottom(
      player,
      tile.y + tile.height / 2,
      tile.x - tile.width / 2,
      tile.x + tile.width / 2,
      10
    );
    collisionLeft(
      player,
      tile.x - tile.width / 2,
      tile.y - tile.height / 2,
      tile.y + tile.height / 2,
      10
    );
    collisionRight(
      player,
      tile.x + tile.width / 2,
      tile.y - tile.height / 2,
      tile.y + tile.height / 2,
      10
    );
  });

  //move objects on screen
  gameObjects.forEach((obj) => {
    obj.x -= player.dX;
  });

  // Move the player
  player.y += player.dY;

  //keep objects at screen position
  player.x += player.dX;
  gameUI.x += player.dX;

  //check for collision between collectibles and player
  collectibles.forEach((collectible) => {
    if (checkCollisionBetween(player, collectible)) {
      collectibles.splice(collectibles.indexOf(collectible), 1);
      gameObjects.splice(gameObjects.indexOf(collectible), 1);
      gameUI.increase();

      new Audio("./assets/audio/pickup.wav").play();
    }
  });

  //remove colliding items from collectibles and gameObjects arrays

  playerProjectiles.forEach((proj) => {
    if (proj.x > CONFIG.width || proj.x < -proj.width) {
      removeItem(playerProjectiles, proj);
    } else {
      enemies.forEach((enemy) => {
        if (checkCollisionBetween(enemy, proj)) {
          removeItem(playerProjectiles, proj);
          removeItem(enemies, enemy);
        }
      });
    }
  });

  enemies.forEach((enemy) => {
    if (enemy.x < CONFIG.width && enemy.x > -enemy.width) {
      if (
        enemy.y < player.y &&
        enemy.y + enemy.height > player.y + player.height
      ) {
        if (enemy.shoot) {
          let projectile = new EnemyProjectile(
            context,
            enemy.x,
            enemy.y,
            world.tilesize,
            world.tilesize,
            CONFIG,
            enemy.dir
          );
          enemyProjectiles.push(projectile);
          gameObjects.push(projectile);
        }
      }
    }
  });

  if (player.y > CONFIG.height) {
    reset = true;
  }

  enemyProjectiles.forEach((proj) => {
    if (proj.x > CONFIG.width || proj.x < -proj.width) {
      removeItem(enemyProjectiles, proj);
    }
    if (checkCollisionBetween(player, proj)) {
      removeItem(enemyProjectiles, proj);
      gameUI.health--;
      if (gameUI.health === 0) {
        reset = true;
      }
    }
  });

  if (checkCollisionBetween(player, end)) {
    win = true;
  }
}

//--------------------------
//Render
//--------------------------

const render = () => {
  context.resetTransform();
  context.clearRect(0, 0, CONFIG.width, CONFIG.height);

  gameObjects.forEach((gameObject) => {
    gameObject.render();
  });
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
        case "X":
          end = new Exit(
            context,
            j * tilesize,
            i * tilesize,
            2 * tilesize,
            2 * tilesize,
            CONFIG
          );
          gameObjects.push(end);
          break;
        case "C":
          let collectible = new Collectible(
            context,
            j * tilesize,
            i * tilesize,
            tilesize,
            tilesize,
            CONFIG
          );
          collectibles.push(collectible);
          gameObjects.push(collectible);
          break;
        case "E":
          let enemy = new Enemy(
            context,
            j * tilesize,
            i * tilesize,
            tilesize,
            tilesize,
            CONFIG
          );
          enemies.push(enemy);
          gameObjects.push(enemy);
          break;
        default:
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
          break;
      }
    }
  }
}

function startScreen() {
  let intro = document.getElementById("start-screen");
  intro.style.width = `${CONFIG.width}px`;
  intro.style.height = `${CONFIG.height}px`;
  document.getElementById("start-game").onclick = () => {
    intro.style.display = "none";
    canvas.style.display = "block";
    init();
  };
}

function endScreen() {
  gameAudio.pause();
  let outro = document.getElementById("end-screen");
  outro.style.width = `${CONFIG.width}px`;
  outro.style.height = `${CONFIG.height}px`;

  canvas.style.display = "none";
  outro.style.display = "block";

  let score = document.getElementById("score");
  score.innerHTML = `Collected: ${gameUI.points} / ${world.level.collectibles}`;

  context.resetTransform();
  context.clearRect(0, 0, CONFIG.width, CONFIG.height);
  gameObjects = [];
  tiles = [];
  collectibles = [];
  playerProjectiles = [];
  enemyProjectiles = [];
  enemies = [];
}

function resetGame() {
  context.resetTransform();
  context.clearRect(0, 0, CONFIG.width, CONFIG.height);
  gameObjects = [];
  tiles = [];
  collectibles = [];
  playerProjectiles = [];
  enemyProjectiles = [];
  enemies = [];

  init();
}

//What happens when page is loaded
window.addEventListener("load", () => {
  canvas.setAttribute("width", CONFIG.width);
  canvas.setAttribute("height", CONFIG.height);
  startScreen();
});

function removeItem(itemArray, item) {
  itemArray.splice(itemArray.indexOf(item), 1);
  gameObjects.splice(gameObjects.indexOf(item), 1);
}

export { gameObjects, playerProjectiles };
