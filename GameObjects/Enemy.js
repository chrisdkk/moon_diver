import GameObject from "./GameObject.js";
import EnemyProjectile from "./EnemyProjectile.js";
import { player, enemyProjectiles, gameObjects } from "../main.js";

class Enemy extends GameObject {
  constructor(context, x, y, width, height, CONFIG) {
    super(context, x, y, width, height, CONFIG);

    this.dir = -1;

    this.shoot = true;
  }

  init() {
    this.img = new Image();
    this.img.src = "./assets/Enemy.png";
  }

  update() {
    if (this.x < CONFIG.width && this.x > CONFIG.width / 2) {
      if (
        this.y < player.y &&
        this.y + this.height > player.y + player.height
      ) {
        if (this.shoot) {
          let projectile = new EnemyProjectile(
            context,
            this.x + 30 * this.dir,
            this.y,
            this.width,
            this.height,
            CONFIG,
            this.dir
          );
          enemyProjectiles.push(projectile);
          gameObjects.push(projectile);
          this.shoot = false;

          new Audio("../assets/audio/shoot.wav").play();

          setTimeout(() => {
            this.shoot = true;
          }, 500);
        }
      }
    }
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
