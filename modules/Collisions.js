let Line = {
  line1: {
    start: undefined,
    end: undefined,
  },
  line2: {
    start: undefined,
    end: undefined,
  },
  line3: {
    start: undefined,
    end: undefined,
  },
};

let o1, o2, o3, o4;

function setPlayerVertices(p1, p2) {
  let currentVertice = {
    upRight: {
      x: p1.x + p1.width,
      y: p1.y,
    },
    upLeft: {
      x: p1.x,
      y: p1.y,
    },
    downRight: {
      x: p1.x + p1.width,
      y: p1.y + p1.height,
    },
    downLeft: {
      x: p1.x,
      y: p1.y + p1.height,
    },
  };
  let nextVertice = {
    upRight: {
      x: p2.x + p2.width,
      y: p2.y,
    },
    upLeft: {
      x: p2.x,
      y: p2.y,
    },
    downRight: {
      x: p2.x + p2.width,
      y: p2.y + p2.height,
    },
    downLeft: {
      x: p2.x,
      y: p2.y + p2.height,
    },
  };

  if (p1.x <= p2.x && p1.y <= p2.y) {
    Line.line1.start = currentVertice.upRight;
    Line.line2.start = currentVertice.downRight;
    Line.line3.start = currentVertice.downLeft;
    Line.line1.end = nextVertice.upRight;
    Line.line2.end = nextVertice.downRight;
    Line.line3.end = nextVertice.downLeft;
    o1 = 0;
    o2 = 1;
    o3 = 3;
    o4 = 0;
  } else if (p1.x <= p2.x && p1.y >= p2.y) {
    Line.line1.start = currentVertice.upLeft;
    Line.line2.start = currentVertice.upRight;
    Line.line3.start = currentVertice.downRight;
    Line.line1.end = nextVertice.upLeft;
    Line.line2.end = nextVertice.upRight;
    Line.line3.end = nextVertice.downRight;
    o1 = 2;
    o2 = 3;
    o3 = 3;
    o4 = 0;
  } else if (p1.x >= p2.x && p1.y <= p2.y) {
    Line.line1.start = currentVertice.upLeft;
    Line.line2.start = currentVertice.downRight;
    Line.line3.start = currentVertice.downLeft;
    Line.line1.end = nextVertice.upLeft;
    Line.line2.end = nextVertice.downRight;
    Line.line3.end = nextVertice.downLeft;
    o1 = 0;
    o2 = 1;
    o3 = 1;
    o4 = 2;
  } else if (p1.x >= p2.x && p1.y >= p2.y) {
    Line.line1.start = currentVertice.upLeft;
    Line.line2.start = currentVertice.upRight;
    Line.line3.start = currentVertice.downLeft;
    Line.line1.end = nextVertice.upLeft;
    Line.line2.end = nextVertice.upRight;
    Line.line3.end = nextVertice.downLeft;
    s1 = tl1;
    s2 = tr1;
    s3 = bl1;
    e1 = tl2;
    e2 = tr2;
    e3 = bl2;
    o1 = 1;
    o2 = 2;
    o3 = 2;
    o4 = 3;
  }
}

function hasCollided(o) {
  //
  let i1 = line2lineIntersection(
    Line.line1.start,
    Line.line1.end,
    o[o1],
    o[o2]
  );
  let i2 = line2lineIntersection(
    Line.line2.start,
    Line.line2.end,
    o[o1],
    o[o2]
  );
  let i3 = line2lineIntersection(
    Line.line3.start,
    Line.line3.end,
    o[o1],
    o[o2]
  );
  let i4 = line2lineIntersection(s1, e1, o[o3], o[o4]);
  let i5 = line2lineIntersection(s2, e2, o[o3], o[o4]);
  let i6 = line2lineIntersection(s3, e3, o[o3], o[o4]);
  //
  let tracks = [];
  if (i1) {
    tracks.push(track(s1, e1, i1));
  }
  if (i2) {
    tracks.push(track(s2, e2, i2));
  }
  if (i3) {
    tracks.push(track(s3, e3, i3));
  }
  if (i4) {
    tracks.push(track(s1, e1, i4));
  }
  if (i5) {
    tracks.push(track(s2, e2, i5));
  }
  if (i6) {
    tracks.push(track(s3, e3, i6));
  }
  //
  let nohitDist = 10000000;
  let minDistSq = nohitDist;
  let halt = { dx: null, dy: null };
  for (let i = 0; i < tracks.length; i++) {
    let t = tracks[i];
    let testdist = t.dx * t.dx + t.dy * t.dy;
    if (testdist < minDistSq) {
      minDistSq = testdist;
      halt.dx = t.dx;
      halt.dy = t.dy;
      halt.s = t.s;
      halt.i = t.i;
    }
  }
  return halt;
}

function line2lineIntersection(p0, p1, p2, p3) {
  let unknownA = (p3.x - p2.x) * (p0.y - p2.y) - (p3.y - p2.y) * (p0.x - p2.x);
  let unknownB = (p1.x - p0.x) * (p0.y - p2.y) - (p1.y - p0.y) * (p0.x - p2.x);
  let denominator =
    (p3.y - p2.y) * (p1.x - p0.x) - (p3.x - p2.x) * (p1.y - p0.y);
  // Test if Coincident
  // If the denominator and numerator for the ua and ub are 0
  //    then the two lines are coincident.
  if (unknownA == 0 && unknownB == 0 && denominator == 0) {
    return null;
  }
  // Test if Parallel
  // If the denominator for the equations for ua and ub is 0
  //     then the two lines are parallel.
  if (denominator == 0) return null;
  // If the intersection of line segments is required
  // then it is only necessary to test if ua and ub lie between 0 and 1.
  // Whichever one lies within that range then the corresponding
  // line segment contains the intersection point.
  // If both lie within the range of 0 to 1 then
  // the intersection point is within both line segments.
  unknownA /= denominator;
  unknownB /= denominator;
  let isIntersecting =
    unknownA >= 0 && unknownA <= 1 && unknownB >= 0 && unknownB <= 1;
  if (!isIntersecting) {
    return null;
  }
  return {
    x: p0.x + unknownA * (p1.x - p0.x),
    y: p0.y + unknownA * (p1.y - p0.y),
  };
}
