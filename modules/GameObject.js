class GameObject {
  constructor(context, x, y, width, height, CONFIG) {
    this.context = context;
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.CONFIG = CONFIG;

    //Every game object
    this.init();
  }

  init() {}

  update() {}

  render() {
    if (this.CONFIG.debug) {
      let rbb = this.getRight();
      let lbb = this.getLeft();
      let tbb = this.getTop();
      let bbb = this.getBottom();
      this.context.strokeStyle = "blue";
      this.context.translate(rbb.x, rbb.y);
      this.context.strokeRect(0, 0, rbb.w, rbb.h);
      this.context.resetTransform();
      this.context.translate(lbb.x, lbb.y);
      this.context.strokeRect(0, 0, lbb.w, lbb.h);
      this.context.resetTransform();
      this.context.translate(tbb.x, tbb.y);
      this.context.strokeRect(0, 0, tbb.w, tbb.h);
      this.context.resetTransform();
      this.context.translate(bbb.x, bbb.y);
      this.context.strokeRect(0, 0, bbb.w, bbb.h);
      this.context.resetTransform();
    }
  }

  getRight() {
    return {
      x: this.x + this.width - 10,
      y: this.y,
      w: 10,
      h: this.height,
    };
  }

  getLeft() {
    return {
      x: this.x,
      y: this.y,
      w: 10,
      h: this.height,
    };
  }

  getTop() {
    return {
      x: this.x,
      y: this.y,
      w: this.width,
      h: 10,
    };
  }

  getBottom() {
    return {
      x: this.x,
      y: this.y + this.height - 10,
      w: this.width,
      h: 10,
    };
  }
}

export default GameObject;
