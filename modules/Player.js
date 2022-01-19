import GameObject from "./GameObject.js";

class Player extends GameObject {
  constructor(context, x, y, width, height, CONFIG) {
    super(context, x, y, width, height, CONFIG);
    this.velocity = 0.1;
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

    console.log(this.velocity);

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

    this.x += this.speed * deltaTime * this.dx;
  }

  render() {
    super.render();

    this.context.fillStyle = "red";

    this.context.fillRect(this.x, this.y, this.width, this.height);

    this.context.resetTransform();
  }

  getRight() {
    let rbb = super.getRight();
    rbb.h = rbb.h - 0.2;
    rbb.y = rbb.y + 0.1;
    return rbb;
  }

  getLeft() {
    let lbb = super.getLeft();
    lbb.h = lbb.h - 0.2;
    lbb.y = lbb.y + 0.1;
    return lbb;
  }

  getTop() {
    let tbb = super.getTop();
    return tbb;
  }

  getBottom() {
    let bbb = super.getBottom();
    return bbb;
  }

  colideRight(leftXBound) {
    this.x = leftXBound - this.width;
  }

  colideLeft(rightXBound) {
    this.x = rightXBound;
  }

  colideTop(bottomYBound) {
    this.y = bottomYBound;
    this.velocity = 10;
  }

  colideBottom(topYBound) {
    this.y = topYBound - 10 - this.height;
    this.velocity = 0;
  }
}

export default Player;
