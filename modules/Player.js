import GameObject from "./GameObject.js";

class Player extends GameObject {
  constructor(context, x, y, width, height, CONFIG) {
    super(context, x, y, width, height, CONFIG);
    this.state = {
      velocity: 0,
      direction: 0,
      dx: 0,
      dy: 0,
      currentKeys: [],
      movement: {
        grounded: true,
        right: undefined,
        left: undefined,
        up: undefined,
        down: undefined,
      },
    };

    this.stats = {
      speed: 1,
      gravity: 10,
    };

    this.nextPosition;
    this.nextvelocity;
  }

  init() {
    document.addEventListener("keydown", (event) => {
      this.state.currentKeys[event.code] = true;

      if (
        this.state.currentKeys["ArrowRight"] ||
        this.state.currentKeys["ArrowLeft"] ||
        this.state.currentKeys["Space"]
      ) {
        event.preventDefault();
      }
    });
    document.addEventListener("keyup", (event) => {
      this.state.currentKeys[event.code] = false;
    });
  }

  update(deltaTime) {
    if (this.state.velocity < 0) this.state.movement.grounded = false;
    if (this.state.currentKeys["ArrowRight"]) {
      //move on x-axis
      this.state.direction = 1;
    } else if (this.state.currentKeys["ArrowLeft"]) {
      this.state.direction = -1;
    } else {
      this.state.direction = 0;
    }

    if (this.state.currentKeys["Space"] && this.state.velocity === 0) {
      this.state.velocity = -60;
    }

    this.x += this.stats.speed * deltaTime * this.state.direction;

    if (this.state.movement.grounded === false || this.state.velocity < 0) {
      //Gravitation with Euler BW Algorithm
      this.state.velocity += (this.stats.gravity * deltaTime) / 50;
      this.y += (this.state.velocity * deltaTime) / 50;
    } else this.state.velocity = 0;

    this.nextVelocity =
      this.state.velocity + (this.stats.gravity * deltaTime) / 50;

    this.nextPos = {
      x: this.x + this.stats.speed * deltaTime * this.state.direction,
      y: this.y + (this.nextVelocity * deltaTime) / 50,
    };
  }

  render() {
    super.render();

    this.context.fillStyle = "red";

    this.context.fillRect(this.x, this.y, this.width, this.height);

    this.context.resetTransform();
  }

  getBoundingBox() {
    let bb = {
      x: undefined,
      y: undefined,
      w: undefined,
      h: undefined,
    };

    if (this.x !== this.nextPos.x && this.y !== this.nextPos.y) {
      if (this.nextPos.x > this.x && this.nextPos.y > this.y) {
        //next position to the TOP RIGHT
        bb.x = this.x;
        bb.y = this.nextPos.y;
        bb.w = this.nextPos.x - this.x + this.width;
        bb.h = this.y - this.nextPos.y + this.height;

        this.state.movement.up = 1;
        this.state.movement.down = 0;
        this.state.movement.left = 0;
        this.state.movement.right = 1;
      } else if (this.nextPos.x > this.x && this.nextPos.y < this.y) {
        //next position to the BOTTOM RIGHT
        bb.x = this.x;
        bb.y = this.y;
        bb.w = this.nextPos.x - this.x + this.width;
        bb.h = this.nextPos.y - this.y + this.height;
        this.state.movement.up = 0;
        this.state.movement.down = 1;
        this.state.movement.left = 0;
        this.state.movement.right = 1;
      } else if (this.nextPos.x < this.x && this.nextPos.y > this.y) {
        //next position to the TOP LEFT
        bb.x = this.nextPos.x;
        bb.y = this.nextPos.y;
        bb.w = this.x - this.nextPos.x + this.width;
        bb.h = this.y - this.nextPos.y + this.height;
        this.state.movement.up = 1;
        this.state.movement.down = 0;
        this.state.movement.left = 1;
        this.state.movement.right = 0;
      } else if (this.nextPos.x < this.x && this.nextPos.y < this.y) {
        //next position to the BOTTOM LEFT
        bb.x = this.nextPos.x;
        bb.y = this.y;
        bb.w = this.x - this.nextPos.x + this.width;
        bb.h = this.nextPos.y - this.y + this.height;
        this.state.movement.up = 0;
        this.state.movement.down = 1;
        this.state.movement.left = 1;
        this.state.movement.right = 0;
      }
    } else if (this.x === this.nextPos.x && this.y !== this.nextPos.y) {
      if (this.y < this.nextPos.y) {
        //next position BELOW
        bb.x = this.x;
        bb.y = this.y;
        bb.w = this.width;
        bb.h = this.nextPos.y - this.y + this.height;

        this.state.movement.up = 0;
        this.state.movement.down = 1;
        this.state.movement.left = 0;
        this.state.movement.right = 0;
      } else {
        //next position ABOVE
        bb.x = this.x;
        bb.y = this.nextPos.y;
        bb.w = this.width;
        bb.h = this.y - this.nextPos.y + this.height;
        this.state.movement.up = 1;
        this.state.movement.down = 0;
        this.state.movement.left = 0;
        this.state.movement.right = 0;
      }
    } else if (this.x !== this.nextPos.x && this.y === this.nextPos.y) {
      if (this.x < this.nextPos.x) {
        //next position RIGHT
        bb.x = this.x;
        bb.y = this.y;
        bb.w = this.nextPos.x - this.x + this.width;
        bb.h = this.height;
        this.state.movement.up = 0;
        this.state.movement.down = 0;
        this.state.movement.left = 0;
        this.state.movement.right = 1;
      } else {
        //next position LEFT
        bb.x = this.nextPos.x;
        bb.y = this.y;
        bb.w = this.x - this.nextPos.x + this.width;
        bb.h = this.height;
        this.state.movement.up = 0;
        this.state.movement.down = 0;
        this.state.movement.left = 1;
        this.state.movement.right = 0;
      }
    }
    return bb;
  }
}

export default Player;
