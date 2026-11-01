/* Scenery
 * Sky, ground, crossfade between worlds. The scenery of each world is in js/biomes/<world>.js (ZONE_ART).
 */
"use strict";

// Worlds that have no PAL entry (the city) use the CSS tokens, so they follow light/dark automatically.
function pal(z) {
  var k = ZONES[z];
  if (!PAL[k]) return { sky1: C.sky1, sky2: C.sky2, far: C.hill2, near: C.hill, cloud: C.cloud, ground: C.ground, line: C.groundLine, pebble: C.pebble };
  return PAL[k][C.zdark === "1" ? "d" : "l"];
}

function hills(par, amp, base, color, len) {
  ctx.fillStyle = color; ctx.beginPath(); ctx.moveTo(0, GROUND);
  for (var x = 0; x <= W; x += 10) {
    var u = (x + off * par);
    ctx.lineTo(x, GROUND - base - amp * Math.sin(u / len) - amp * 0.5 * Math.sin(u / (len * 0.43)));
  }
  ctx.lineTo(W, GROUND); ctx.closePath(); ctx.fill();
}
function cloudsLayer(P, a, par) {
  ctx.fillStyle = P.cloud; ctx.globalAlpha = a * 0.85;
  clouds.forEach(function (c) {
    var x = mod(c.x - off * par, W + 200) - 100;
    ctx.save(); ctx.translate(x, c.y); ctx.scale(c.s, c.s);
    ctx.beginPath();
    ctx.arc(0, 0, 16, 0, 7); ctx.arc(22, -8, 20, 0, 7); ctx.arc(46, 0, 15, 0, 7);
    ctx.rect(0, -2, 46, 16);
    ctx.fill(); ctx.restore();
  });
  ctx.globalAlpha = a;
}
function sunDisc(x, y, r, col, a) {
  var gl = ctx.createRadialGradient(x, y, r * 0.4, x, y, r * 3);
  gl.addColorStop(0, col); gl.addColorStop(1, "rgba(255,240,180,0)");
  ctx.globalAlpha = a * 0.45; ctx.fillStyle = gl; ctx.fillRect(x - r * 3, y - r * 3, r * 6, r * 6);
  ctx.globalAlpha = a; ctx.fillStyle = col; ctx.beginPath(); ctx.arc(x, y, r, 0, 7); ctx.fill();
}
function tinyStars(a) {
  ctx.fillStyle = "#ffffff"; ctx.globalAlpha = a * 0.7;
  stars.forEach(function (s, i) { var x = mod(s.x - off * 0.03, W + 40) - 20; ctx.beginPath(); ctx.arc(x, s.y, 0.8 + (i % 3) * 0.5, 0, 7); ctx.fill(); });
  ctx.globalAlpha = a;
}

// The sky gradient is common; everything else is the world's own ZONE_ART.
function drawZone(z, a) {
  var k = ZONES[z], P = pal(z), dark = C.zdark === "1";
  ctx.save();
  ctx.globalAlpha = a;
  var g = ctx.createLinearGradient(0, 0, 0, GROUND);
  g.addColorStop(0, P.sky1); g.addColorStop(1, P.sky2);
  ctx.fillStyle = g; ctx.fillRect(0, 0, W, GROUND);
  if (ZONE_ART[k]) ZONE_ART[k](a, P, dark);
  ctx.restore();
}

function drawBackground() {
  if (zoneBlend < 1) { drawZone(zoneFrom, 1); drawZone(zoneTo, zoneBlend); }
  else drawZone(zoneTo, 1);
}

function groundZ(z, a) {
  var P = pal(z);
  ctx.save(); ctx.globalAlpha = a;
  ctx.fillStyle = P.ground; ctx.fillRect(0, GROUND, W, H - GROUND);
  ctx.fillStyle = P.line; ctx.fillRect(0, GROUND, W, 3);
  ctx.fillStyle = P.pebble;
  for (var i = -1; i < W / 70 + 2; i++) {
    var x = i * 70 - mod(off, 70);
    ctx.fillRect(x, GROUND + 16, 22, 3);
    ctx.fillRect(x + 36, GROUND + 32, 12, 3);
  }
  ctx.restore();
}
function drawGround() {
  if (zoneBlend < 1) { groundZ(zoneFrom, 1); groundZ(zoneTo, zoneBlend); }
  else groundZ(zoneTo, 1);
}

function drawZoneBanner() {
  if (zoneBannerT <= 0 || state !== "play") return;
  ctx.save(); ctx.globalAlpha = Math.min(1, zoneBannerT / 0.6);
  outlineText("เขตใหม่: " + ZONE_NAME[ZONES[zoneTo]], W / 2, Math.round(H * 0.4), "600 22px Mitr, Kanit, sans-serif", C.groundLine);
  ctx.restore();
}
