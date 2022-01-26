import GameObject from "./GameObject.js";

class Enemy extends GameObject {
  constructor(context, x, y, width, height, CONFIG) {
    super(context, x, y, width, height, CONFIG);

    this.shoot = false;
    this.dir = -1;

    this.rateOfFire = 40;
    this.shootCoolDown = 0;
    this.shoot = false;
  }

  init() {
    this.img = new Image();
    this.img.src = "./assets/Enemy.png";
  }

  update() {
    setInterval(this.timeCycle(), 50);
  }

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
    bb.x = bb.x + bb.w / 4;
    bb.y = bb.y + bb.h / 4;
    bb.w = bb.w / 2;
    bb.h = bb.h / 2;
    return bb;
  }

  timeCycle() {
    if (this.shootCoolDown === 0) {
      this.shootCoolDown = this.rateOfFire;
      this.shoot = true;
    } else {
      this.shoot = false;
    }
    if (this.shootCoolDown > 0) {
      this.shootCoolDown--;
    }
  }
}

export default Enemy;
