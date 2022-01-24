import GameObject from "./GameObject.js";

class Collectible extends GameObject {
  constructor(context, x, y, width, height, CONFIG, camera) {
    super(context, x, y, width, height, CONFIG, camera);
  }

  init() {
    this.img = new Image();
    this.img.src = "./assets/gem.png";
  }

  update() {}

  render() {
    super.render();

    //move canvas origin to x
    this.context.translate(this.x, this.y);

    //draw collectible
    this.context.drawImage(this.img, 0, 0, this.width, this.height);

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

export default Collectible;
