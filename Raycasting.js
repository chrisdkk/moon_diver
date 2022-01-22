//--------------------------
//Horizontal Raycasts
//--------------------------

//Possible Directions
const direction = {
  UP: "up",
  DOWN: "down",
  LEFT: "left",
  RIGHT: "right",
};

//Defining a Ray
class Ray {
  constructor(x, y, dir) {
    this.origin = { x: x, y: y };
    this.direction = dir;
  }
}

class AABB {
  constructor(x, y, w, h) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
  }
}

function intersect(ray, aabb) {
  switch (ray.direction) {
    case direction.UP:
      if (ray.origin.y >= aabb.y + aabb.h) {
        if (compareInterval(ray.origin.x, aabb.x, aabb.x + aabb.w) == 0) {
          return { x: ray.origin.x, y: aabb.y + aabb.h };
        } else {
          return null;
        }
      } else {
        return null;
      }
    case direction.DOWN:
      if (ray.origin.y <= aabb.y) {
        if (compareInterval(ray.origin.x, aabb.x, aabb.x + aabb.w) == 0) {
          return { x: ray.origin.x, y: aabb.y };
        } else {
          return null;
        }
      } else {
        return null;
      }
    case direction.LEFT:
      if (ray.origin.x >= aabb.x + aabb.w) {
        if (compareInterval(ray.origin.y, aabb.y, aabb.y + aabb.h) == 0) {
          return { x: aabb.x + aabb.w, y: ray.origin.y };
        } else {
          return null;
        }
      } else {
        return null;
      }
    case direction.RIGHT:
      if (ray.origin.x <= aabb.x) {
        if (compareInterval(ray.origin.y, aabb.y, aabb.y + aabb.h) === 0) {
          return { x: aabb.x, y: ray.origin.y };
        } else {
          return null;
        }
      } else {
        return null;
      }
  }
}

function raycastDistance(ray, aabb) {
  var point = intersect(ray, aabb);

  if (point) {
    return distance(ray.origin, point);
  } else {
    return null;
  }
}

function raycast(ray) {
  let collisions = colliders
    .map((aabb) => {
      let intersection = intersect(ray, aabb);
      let result = {
        collider: aabb,
        intersection: intersect(ray, aabb),
        ray: ray,
      };

      if (result.intersection) {
        result.distance = distance(ray.origin, result.intersection);
      }

      return result;
    })
    .filter((collision) => {
      return collision.intersection;
    });

  collisions.sort((c1, c2) => {
    return c1.distance - c2.distance;
  });

  // JavaScript is happy with out of bound indexing, which means this line is still
  // valid even if there are no collisions.
  return collisions[0];
}
