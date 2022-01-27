import GameObject from "./GameObject.js";

class Interface extends GameObject {
  constructor(context, x, y) {
    super(context, x, y);

    this.points = 0;
    this.health = 3;
  }

  init() {
    this.image = new Image();
    this.image.src = "../assets/gem.png";
  }

  render() {
    this.context.beginPath();
    this.context.fillStyle = "white";
    this.context.fillRect(this.x, this.y, 140, 30);
    this.context.fillRect(this.x, this.y + 30, 110, 50);

    //draw empty health rectangles beneath
    this.context.fillStyle = "#8b93af";

    for (let i = 0; i < 3; i++) {
      this.context.fillRect(this.x + 5 + i * 45, this.y + 5, 40, 20);
    }

    this.context.fillStyle = "#b4202a";
    for (let i = 0; i < this.health; i++) {
      this.context.fillRect(this.x + 5 + i * 45, this.y + 5, 40, 20);
    }

    this.context.drawImage(this.image, this.x - 10, this.y + 15);
    this.context.fillStyle = "black";
    this.context.font = "bold 45px pixeloid";
    this.context.textAlign = "center";
    this.context.fillText(this.points, this.x + 85, this.y + 73);
  }

  increase() {
    this.points++;
  }
}

export default Interface;
