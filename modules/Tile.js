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

  getBoundingBox() {
    let bb = super.getBoundingBox();

    //TODO: change bounding box
    bb.w = bb.w + 2;
    bb.x = bb.x - 1;
    bb.h = bb.h + 2;
    bb.y = bb.y - 1;
    return bb;
  }
}

export default Tile;
