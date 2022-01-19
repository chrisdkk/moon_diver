import GameObject from "./GameObject.js";

class Player extends GameObject {
  constructor(context, x, y, width, height, CONFIG) {
    super(context, x, y, width, height, CONFIG);
    this.velocity = 0;
    this.gravity = 10;
    this.currentKeys = [];
    this.dx = 0;
    this.speed = 0.5;
  }

  init() {
    document.addEventListener("keydown", (event) => {
      this.currentKeys[event.code] = true;

      if (
        this.currentKeys["ArrowRight"] ||
        this.currentKeys["ArrowLeft"] ||
        this.currentKeys["Space"]
      ) {
        event.preventDefault();
      }
    });
    document.addEventListener("keyup", (event) => {
      this.currentKeys[event.code] = false;
    });
  }

  update(deltaTime) {
    //Gravitation with Euler BW Algorithm
    this.velocity += (this.gravity * deltaTime) / 50;
    this.y += (this.velocity * deltaTime) / 50;

    if (this.y + this.height > this.CONFIG.height) {
      //set object to ground level
      this.y = this.CONFIG.height - this.height;
      this.velocity = 0;
    }

    if (this.currentKeys["ArrowRight"]) {
      //move on x-axis
      this.dx = 1;
    } else if (this.currentKeys["ArrowLeft"]) {
      this.dx = -1;
    } else {
      this.dx = 0;
    }

    if (this.currentKeys["Space"] && this.velocity === 0) {
      this.velocity = -60;
    }

    console.log(this.velocity);

    this.x += this.speed * deltaTime * this.dx;
  }

  render() {
    super.render();

    this.context.fillStyle = "red";

    this.context.fillRect(this.x, this.y, this.width, this.height);

    this.context.resetTransform();
  }

  getBoundingBox() {
    let bb = super.getBoundingBox();

    //TODO: change bounding box
    bb.w = bb.w + 2;
    bb.x = bb.x - 1;
    bb.h = bb.h + 2;
    bb.y = bb.y - 1;
    return bb;
  }
}

export default Player;
