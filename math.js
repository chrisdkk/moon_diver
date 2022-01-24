const degree = (degrees) => (degrees * Math.PI) / 180;

function distance(a, b) {
  return Math.sqrt(Math.pow(a.x - b.x, 2) + Math.pow(a.y - b.y, 2));
}

function pythagoras(a, b) {
  return Math.sqrt(a ** 2 + a ** 2);
}
