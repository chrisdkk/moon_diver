import GameObject from "./GameObject.js";

class Tile extends GameObject {
  constructor(context, x, y, width, height, CONFIG, tileNum) {
    super(context, x, y, width, height, CONFIG);
    this.tileNum = tileNum;
    this.tilesize = 48;
    this.columns = 4;

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
  getBoundingBox() {
    let bb = super.getBoundingBox();
    return bb;
  }
}

export default Tile;
