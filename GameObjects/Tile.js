import GameObject from "./GameObject.js";

class Tile extends GameObject {
  constructor(context, x, y, width, height, CONFIG, camera, tileNum) {
    super(context, x, y, width, height, CONFIG, camera);
    this.tileNum = tileNum;
    this.tilesize = width;
    this.columns = 4; // Tilemap columns

    this.sx = (this.tileNum % this.columns) * this.tilesize;
    this.sy = Math.floor(this.tileNum / this.columns) * this.tilesize;
  }

  init() {
    this.tileMap = new Image();
    this.tileMap.src = "../assets/tilemap.png";
  }

  render() {
    // super.render();
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
}

export default Tile;
