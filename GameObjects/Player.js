import GameObject from "./GameObject.js";
import PlayerProjectile from "./PlayerProjectile.js";
import { playerProjectiles, gameObjects } from "../main.js";

class Player extends GameObject {
  constructor(context, x, y, width, height, CONFIG) {
    super(context, x, y, width, height, CONFIG);
    this.state = {
      velocity: 0, //Vertical Speed
      dx: 0, //Horizontal Move Direction
      lastDx: 1,
      currentKeys: [],
    };

    this.stats = {
      jetFuel: 100,
      speed: 5, //Horizontal Speed
      gravity: 8, //Gravitational Acceleration
    };

    this.shoot = true;

    this.dY = 0;
    this.dX = 0;
  }

  init() {
    //--------------------------
    //Check for Inputs
    //--------------------------

    //Keydown Event
    document.addEventListener("keydown", (event) => {
      this.state.currentKeys[event.code] = true;
      if (
        this.state.currentKeys["ArrowRight"] ||
        this.state.currentKeys["ArrowLeft"] ||
        this.state.currentKeys["Space"] ||
        this.state.currentKeys["KeyZ"]
      ) {
        event.preventDefault();
      }
    });
    //Keyup Event
    document.addEventListener("keyup", (event) => {
      this.state.currentKeys[event.code] = false;
    });

    //--------------------------
    //Set Player Spritesheets
    //--------------------------

    const framesize = {
      frameSize: {
        width: 80,
        height: 80,
      },
    };

    this.sprites = {
      idle: {
        src: "./assets/player/idle.png",
        frames: 4,
        fps: 4,
        ...framesize,
        image: null,
      },
      run: {
        src: "./assets/player/run.png",
        frames: 4,
        fps: 8,
        ...framesize,
        image: null,
      },
      jump: {
        src: "./assets/player/jump.png",
        frames: 6,
        fps: 6,
        ...framesize,
        image: null,
      },
      fall: {
        src: "./assets/player/fall.png",
        frames: 1,
        fps: 1,
        ...framesize,
        image: null,
      },
    };

    Object.values(this.sprites).forEach((sprite) => {
      sprite.image = new Image();
      sprite.image.src = sprite.src;
    });
  }

  update(deltaTime) {
    //--------------------------
    //Handle Input
    //--------------------------

    //Move Right/Left
    if (this.state.currentKeys["ArrowRight"]) {
      this.state.dx = 1;
    } else if (this.state.currentKeys["ArrowLeft"]) {
      this.state.dx = -1;
    } else {
      this.state.dx = 0;
    }

    //check last horizontal movement direction
    if (this.state.dx !== 0) this.state.lastDx = this.state.dx;

    //Jump
    if (this.state.currentKeys["Space"] && this.stats.jetFuel > 2) {
      this.jump = true;
      this.state.velocity = -15;
      this.stats.jetFuel -= 2;

      new Audio("../assets/audio/jump.wav").play();
    } else if (
      !this.state.currentKeys["Space"] &&
      this.stats.jetFuel < 100 &&
      !this.jump
    ) {
      this.stats.jetFuel += 10;
    }

    //Shoot Projectiles
    if (this.state.currentKeys["KeyZ"] && this.shoot) {
      let projectile = new PlayerProjectile(
        context,
        this.x + 30 * this.state.lastDx,
        this.y,
        this.width,
        this.height,
        CONFIG,
        this.state.lastDx
      );
      playerProjectiles.push(projectile);
      gameObjects.push(projectile);
      this.shoot = false;

      new Audio("../assets/audio/shoot.wav").play();

      setTimeout(() => {
        this.shoot = true;
      }, 500);
    }

    //--------------------------
    //Physics Calculation
    //--------------------------

    this.dX = 0;
    this.dY = 0;

    //X-Axis
    this.dX += this.stats.speed * this.state.dx;

    //Y-Axis
    // Gravitation with Euler BW Algorithm
    if (this.state.velocity < 30) {
      this.state.velocity += (this.stats.gravity * deltaTime) / 50;
    } else {
      this.state.velocity = 30;
    }
    this.dY += (this.state.velocity * deltaTime) / 50;

    //--------------------------
    //Set Sprite State
    //--------------------------

    this.spriteState =
      this.state.dx === 0 && !this.jump
        ? "idle"
        : this.state.dx !== 0 && !this.jump
        ? "run"
        : this.jump
        ? "jump"
        : "fall";
  }

  render() {
    super.render();

    //--------------------------
    //Render JetFuel Bar
    //--------------------------

    context.beginPath();
    context.lineWidth = 10;
    if (this.stats.jetFuel > 2) {
      context.strokeStyle = "#8b93af";
      context.arc(this.x, this.y, 12, 0, 2 * Math.PI);
      context.stroke();
      context.beginPath();
      context.strokeStyle = "#9cdb43";
      context.arc(
        this.x,
        this.y,
        12,
        0,
        (2 * Math.PI * this.stats.jetFuel) / 100
      );
      context.stroke();
    } else {
      context.strokeStyle = "#b53c44";
      context.arc(this.x, this.y, 12, 0, 2 * Math.PI);
      context.stroke();
    }

    //--------------------------
    //Render Player
    //--------------------------

    //move canvas origin to x
    if (this.state.lastDx === 1) {
      this.context.translate(this.x, this.y);
    } else {
      this.context.translate(this.x + this.width, this.y);
    }

    this.context.scale(this.state.lastDx, 1); // Turn to current direction

    let coords = this.getImageSpriteCoordinates(this.sprites[this.spriteState]);

    //draw player image
    context.imageSmoothingEnabled = false;
    this.context.drawImage(
      this.sprites[this.spriteState].image, // the image
      coords.sourceX + 10, //source x
      coords.sourceY + 5, //source y
      coords.sourceWidth - 20, //source width
      coords.sourceHeight - 10, //source height
      0, //destination x
      0, //destination y
      this.width, //destination width
      this.height //destination height
    );
    //--------------------------
    //--------------------------

    this.context.resetTransform();
  }

  getBoundingBox() {
    let bb = super.getBoundingBox();

    bb.x = bb.x + this.width / 4;
    bb.y = bb.y + this.height / 4;
    bb.w = bb.w / 2;
    bb.h = bb.h * 0.75;
    return bb;
  }
}

export default Player;
