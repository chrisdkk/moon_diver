/// COLLISION FUNCTIONS

//collision with top of a tile
function collisionTop(obj, y, xMin, xMax, boxHeight) {
  if (obj.x - obj.width / 2 < xMax && obj.x + obj.width / 2 > xMin) {
    if (
      obj.y + obj.dY > y - obj.height / 2 &&
      obj.y + obj.dY < y + boxHeight - obj.height / 2
    ) {
      if (obj.dY > 1) {
        obj.dY = 0;
        obj.state.velocity = 0;
        obj.jump = false;
      } else {
        obj.dY = 0;
        obj.state.velocity = 0;
        obj.jump = false;
      }
    }
  }
}

//collision with bottom of a tile
function collisionBottom(obj, y, xMin, xMax, boxHeight) {
  if (obj.x - obj.width / 2 < xMax && obj.x + obj.width / 2 > xMin) {
    if (
      obj.y + obj.dY < y + obj.height / 2 &&
      obj.y + obj.dY > y - boxHeight - obj.height / 2
    ) {
      obj.dY = 0;
      obj.state.velocity = 5;
    }
  }
}

//collision with left of a tile

function collisionLeft(obj, x, yMin, yMax, boxWidth) {
  if (obj.y - obj.height / 2 < yMax && obj.y + obj.height / 2 > yMin) {
    if (
      obj.x + obj.dX > x - obj.width / 2 &&
      obj.x + obj.dX < x - obj.width / 2 + boxWidth
    ) {
      obj.dX = 0;
    }
  }
}

//collision with right of a tile

function collisionRight(obj, x, yMin, yMax, boxWidth) {
  if (obj.y - obj.height / 2 < yMax && obj.y + obj.height / 2 > yMin) {
    if (
      obj.x + obj.dX < x + obj.width / 2 &&
      obj.x - obj.dX > x + obj.width / 2 - boxWidth
    ) {
      obj.dX = 0;
    }
  }
}

//Simple check for AABB Overlap
let checkCollisionBetween = (gameObjectA, gameObjectB) => {
  let bbA = gameObjectA.getBoundingBox();
  let bbB = gameObjectB.getBoundingBox();

  if (
    //go through criteria that exclude collision
    bbA.x > bbB.x + bbB.w ||
    bbA.x + bbA.w < bbB.x ||
    bbA.y > bbB.y + bbB.h ||
    bbA.y + bbA.h < bbB.y
  ) {
    return false;
  } else return true;
};
