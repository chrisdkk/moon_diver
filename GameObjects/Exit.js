import GameObject from "./GameObject.js";

class Exit extends GameObject {
  constructor(context, x, y, width, height, CONFIG) {
    super(context, x, y, width, height, CONFIG);
  }

  init() {
    this.sprite = {
      frames: 12,
      fps: 18,
      frameSize: {
        width: 80,
        height: 80,
      },
      image: null,
    };
    this.sprite.image = new Image();
    this.sprite.image.src = "./assets/exit_portal.png";
  }

  update() {}

  render() {
    super.render();

    //move canvas origin to x
    this.context.translate(this.x, this.y);

    let coords = this.getImageSpriteCoordinates(this.sprite);

    //draw player image
    context.imageSmoothingEnabled = false;
    this.context.drawImage(
      this.sprite.image, // the image
      coords.sourceX, //source x
      coords.sourceY, //source y
      coords.sourceWidth, //source width
      coords.sourceHeight, //source height
      0, //destination x
      0, //destination y
      this.width, //destination width
      this.height //destination height
    );

    this.context.resetTransform();
  }

  getBoundingBox() {
    let bb = super.getBoundingBox();
    return bb;
  }
}

export default Exit;
