import GameObject from "./GameObject.js";

class PlayerProjectile extends GameObject {
  constructor(context, x, y, width, height, CONFIG, dir) {
    super(context, x, y, width, height, CONFIG);
  }

  init() {}

  update() {}

  render() {
    if (this.CONFIG.debug) {
      let bb = this.getBoundingBox();
      this.context.translate(bb.x, bb.y);
      this.context.strokeRect(0, 0, bb.w, bb.h);
      this.context.resetTransform();
    }
  }

  getBoundingBox() {
    return {
      x: this.x,
      y: this.y,
      w: this.width,
      h: this.height,
    };
  }
}
