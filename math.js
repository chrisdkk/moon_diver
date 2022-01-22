function compareInterval(value, low, high) {
  // This shouldn't necessarily be required, but it allows us to just specify
  // the bounds of an interval, without checking which of the two is low and which is high.
  if (low > high) {
    var tmp = high;
    high = low;
    low = tmp;
  }

  // And then we simply check if the value lies outside of the interval
  if (value < low) {
    return -1;
  } else if (low <= value && value <= high) {
    return 0;
  } else if (value > high) {
    return 1;
  }
}

function distance(a, b) {
  return Math.sqrt(Math.pow(a.x - b.x, 2) + Math.pow(a.y - b.y, 2));
}

function pythagoras(a, b) {
  return Math.sqrt(a ** 2 + a ** 2);
}
