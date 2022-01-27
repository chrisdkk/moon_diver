import GameObject from "./GameObject.js";

class PlayerProjectile extends GameObject {
  constructor(context, x, y, width, height, CONFIG, dir) {
    super(context, x, y, width, height, CONFIG);
    this.dir = dir;
    this.speed = 10;
  }

  init() {
    this.sprite = {
      frames: 4,
      fps: 16,
      frameSize: {
        width: 80,
        height: 80,
      },
      image: null,
    };
    this.sprite.image = new Image();
    this.sprite.image.src = "./assets/player_proj.png";
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

    let coords = this.getImageSpriteCoordinates(this.sprite);

    //draw player image
    context.imageSmoothingEnabled = false;
    this.context.drawImage(
      this.sprite.image, // the image
      coords.sourceX, //source x
      coords.sourceY, //source y
      coords.sourceWidth, //source width
      coords.sourceHeight, //source height
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
