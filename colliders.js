const colliders = {
  1: function (tile) {
    return {
      x: tile.x,
      y: tile.y,
      width: tile.width,
      height: 0,
    };
  },
  2: function (tile) {
    return {
      x: tile.x + tile.width,
      y: tile.y,
      width: 0,
      height: tile.height,
    };
  },
  3: function (tile) {
    return {
      x: tile.x,
      y: tile.y + tile.height,
      width: tile.x + tile.width,
      height: 0,
    };
  },
  4: function (tile) {
    return {
      x: tile.x,
      y: tile.y,
      width: 0,
      height: tile.y + tile.height,
    };
  },
  5: function (tile) {
    return {
      x: tile.x,
      y: tile.y,
      width: tile.width,
      height: 0,
    };
  },
};
