const canvas = document.getElementById("canvas");
const context = canvas.getContext("2d");

const CONFIG = {
  width: 80 * 12,
  height: 80 * 8,
  debug: false,
};

const levelState = {
  lastTick: undefined,
  deltaTime: 0,
};
