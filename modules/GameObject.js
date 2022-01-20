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
    }
  }
}

export default GameObject;
