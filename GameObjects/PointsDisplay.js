import GameObject from "./GameObject.js";

class PointsDisplay extends GameObject {
  constructor(context, x, y, camera) {
    super(context, x, y, camera);

    this.points = 0;
  }

  render() {
    this.context.beginPath();
    this.context.fillStyle = "white";
    this.context.fillRect(this.x, this.y, 100, 60);
    this.context.fillStyle = "darkslateblue";
    this.context.font = "bold 30px comic-sans";
    this.context.textAlign = "center";
    this.context.fillText(this.points, this.x + 50, this.y + 30);
  }

  increase() {
    this.points++;
  }
}

export default PointsDisplay;
