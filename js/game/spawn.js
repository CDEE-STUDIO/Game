/* Spawning
 * Regular monsters and where they sit.
 */
"use strict";

// ----- spawning -----
function spawn() {
  var tt = t;
  var air = !firstSpawn && Math.random() < 0.4;
  firstSpawn = false;
  var x = W + 40, grp = [];
  if (air) {
    grp.push({ type: "a", skin: ZONES[zoneTo], x: x, w: 44, h: 34, lift: 50, ph: rand(0, 6) });
  } else {
    var sc = rand(0.85, 1.25);
    var w = 44 * sc, h = 32 * sc;
    grp.push({ type: "g", skin: ZONES[zoneTo], x: x, w: w, h: h, lift: 0, ph: rand(0, 6) });
    if (tt > 14 && Math.random() < 0.22) {
      var sc2 = rand(0.8, 1.1);
      grp.push({ type: "g", skin: ZONES[zoneTo], x: x + w + 6, w: 44 * sc2, h: 32 * sc2, lift: 0, ph: rand(0, 6) });
    }
  }
  grp.forEach(function (o) { obstacles.push(o); });
  spawnTimer = rand(0.95, 1.7);
  placeCoins(air, grp, spawnTimer);
}

function slimeBottom(o) {
  if (o.spit) return GROUND - o.lift;
  return o.type === "a" ? GROUND - o.lift + Math.sin(t * 3 + o.ph) * 4 : GROUND;
}
