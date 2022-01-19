import GameObject from "./GameObject.js";

class Tile extends GameObject {
  constructor(context, x, y, width, height, CONFIG, tileNum) {
    super(context, x, y, width, height, CONFIG);
    this.tileNum = tileNum;
    this.tilesize = 80;
    this.columns = 4;
    this.rows = 6;

    this.sx = (this.tileNum % this.columns) * this.tilesize;
    this.sy = Math.floor(this.tileNum / this.columns) * this.tilesize;
  }

  init() {
    this.tileMap = new Image();
    this.tileMap.src = "../assets/tilemap.png";
  }

  render() {
    super.render();
    this.context.drawImage(
      this.tileMap,
      this.sx,
      this.sy,
      this.tilesize,
      this.tilesize,
      this.x,
      this.y,
      this.width,
      this.height
    );
  }

  getRight() {
    let rbb = super.getRight();
    return rbb;
  }

  getLeft() {
    let lbb = super.getLeft();
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
}

export default Tile;
