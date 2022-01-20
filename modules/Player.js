import GameObject from "./GameObject.js";

class Player extends GameObject {
  constructor(context, x, y, width, height, CONFIG) {
    super(context, x, y, width, height, CONFIG);
    this.state = {
      velocity: 0,
      dx: 0,
      dy: 0,
      currentKeys: [],
    };

    this.stats = {
      speed: 5,
      gravity: 10,
    };

    this.velocity = 0.1;
    this.gravity = 10;
    this.currentKeys = [];
    this.dx = 0;
    this.speed = 0.5;
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
    //Gravitation with Euler BW Algorithm
    if (this.x < 180 || this.state.velocity < 0) {
      this.state.velocity += (this.stats.gravity * deltaTime) / 50;
      this.y += (this.state.velocity * deltaTime) / 50;
      console.log(this.state.velocity);
    }

    if (this.state.currentKeys["ArrowRight"]) {
      //move on x-axis
      this.state.dx = 1;
    } else if (this.state.currentKeys["ArrowLeft"]) {
      this.state.dx = -1;
    } else {
      this.state.dx = 0;
    }

    if (this.state.currentKeys["Space"]) {
      this.state.velocity = -60;
    }

    this.x += this.stats.speed * deltaTime * this.state.dx;
  }

  render() {
    super.render();

    this.context.fillStyle = "red";

    this.context.fillRect(this.x, this.y, this.width, this.height);

    this.context.resetTransform();
  }
}

export default Player;
