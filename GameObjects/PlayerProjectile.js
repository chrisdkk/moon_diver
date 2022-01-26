import GameObject from "./GameObject.js";

class PlayerProjectile extends GameObject {
  constructor(context, x, y, width, height, CONFIG, dir) {
    super(context, x, y, width, height, CONFIG);
    this.dir = dir;
    this.speed = 10;
  }

  init() {
    this.image = new Image();
    this.image.src = "./assets/player_proj.png";
  }

  update() {
    //move projectile
    this.x += this.dir * this.speed;
  }

  render() {
    super.render();

    if (this.dir === 1) {
      this.context.translate(this.x, this.y);
    } else {
      this.context.translate(this.x + this.width, this.y);
    }

    this.context.scale(this.dir, 1);

    this.context.drawImage(
      this.image, // the image
      0, //destination x
      0, //destination y
      this.width, //destination width
      this.height //destination height
    );

    this.context.resetTransform();
  }

  getBoundingBox() {
    let bb = super.getBoundingBox();
    bb.x = bb.x + bb.w / 4;
    bb.y = bb.y + bb.h / 4;
    bb.w = bb.w / 2;
    bb.h = bb.h / 2;
    return bb;
  }
}

export default PlayerProjectile;
