
function line_intersection(line1, line2) {
  function area (a, b, c) {
    return (b.x - a.x) * (c.y - a.y) - (b.y - a.y) * (c.x - a.x);
  }
 
  function intersect_1 (a, b, c, d) {
    if (a > b)  [a, b] = [b, a];
    if (c > d)  [c, d] = [d, c];
    return Math.max(a,c) <= Math.min(b,d);
  }
 
  function intersect (pt a, pt b, pt c, pt d) {
    return intersect_1 (a.x, b.x, c.x, d.x)
      && intersect_1 (a.y, b.y, c.y, d.y)
      && area(a,b,c) * area(a,b,d) <= 0
      && area(c,d,a) * area(c,d,b) <= 0;
  }
  return intersect(line1.point1, line1.point2, line2.point1, line2.point2);
};
