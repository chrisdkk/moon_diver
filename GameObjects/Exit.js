import GameObject from "./GameObject.js";

class Exit extends GameObject {
  constructor(context, x, y, width, height, CONFIG) {
    super(context, x, y, width, height, CONFIG);
  }

  init() {
    this.img = new Image();
    this.img.src = "./assets/exit.png";
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
    return bb;
  }
}

export default Exit;
