function checkTileCollision(entity, tile) {
  let bbA = entity.getBoundingBox();
  let bbB = tile.getBoundingBox();

  let state = entity.state.movement;

  if (
    bbA.x < bbB.x + bbB.w &&
    bbA.x + bbA.w > bbB.x &&
    bbA.y < bbB.y + bbB.h &&
    bbA.y + bbA.h > bbB.y
  ) {
    //is colliding
    let collide;
    if (state.grounded) {
      if (state.right) {
        collide = "right";
        console.log("right");
      } else {
        collide = "left";
        console.log("left");
      }
    } else {
      let move = `${state.up} ${state.down} ${state.right} ${state.left}`;
      console.log(move);
      switch (move) {
        case "1 0 0 0":
          collide = "top";
          console.log("top");
          break;
        case "1 0 1 0":
          collide = "top-right";
          break;
        case "1 0 0 1":
          collide = "top-left";
          break;
        case "0 1 0 0":
          collide = "bottom";
          console.log("bottom");
          break;
        case "0 1 1 0":
          collide = "bottom-right";
          break;
        case "0 1 0 1":
          collide = "bottom-left";
          break;
        case "0 0 1 0":
          collide = "right";
          break;
        case "0 0 0 1":
          collide = "left";
          break;
        default:
          console.log("strange collision");
          break;
      }
    }
    tileCollision(entity, tile, collide);
  }
}

function tileCollision(entity, tile, cDir) {
  switch (cDir) {
    case "right":
      entity.x = tile.x - entity.width;
      break;
    case "left":
      entity.x = tile.x + tile.width;
      break;
    case "top":
      entity.state.velocity = 1;
      entity.y = entity.y;
      break;
    case "bottom":
      entity.state.movement.grounded = true;
      entity.y = tile.y - entity.height;
      break;
    case "top-right":

    case "top-left":

    case "bottom-right":

    case "bottom-left":
  }
}
