/* Obstacles drawing
 * Slimes, creatures, thrown things and the red warning markers.
 */
"use strict";

// Regular monsters: each world draws its own in CREATURE_ART (js/biomes/*.js), facing left, origin at bottom centre.
function drawCreature(o, w, h) {
  var art = CREATURE_ART[o.skin];
  if (!art) return;
  var air = o.type === "a", fl = Math.sin(t * 16 + o.ph);
  ctx.lineCap = "round"; ctx.lineJoin = "round";
  art(o, w, h, air, fl);
}

// Things bosses throw / summon: PROJ_ART[name]
function drawProj(o, w, h) {
  var art = PROJ_ART[o.proj];
  if (!art) return;
  ctx.lineCap = "round"; ctx.lineJoin = "round";
  art(o, w, h);
}

function drawWarnings() {
  obstacles.forEach(function (o) {
    if (!o.fall && !o.pre) return;
    var f = o.fall ? o.fall.t / o.fall.dur : o.pre.t / o.pre.dur, cx = o.x + o.w / 2;
    ctx.save();
    ctx.globalAlpha = 0.35 + 0.45 * f; ctx.strokeStyle = "#ff4d4d"; ctx.fillStyle = "rgba(255,77,77,0.35)"; ctx.lineWidth = 2.5;
    ctx.beginPath(); ctx.ellipse(cx, GROUND + 3, (o.pyr ? o.w * 0.5 : 8) + (o.pyr ? 10 : 20) * f, 3 + 3 * f, 0, 0, 7); ctx.fill(); ctx.stroke();
    ctx.restore();
  });
}

function drawSlime(o) {
  var wob = Math.sin(t * 7 + o.ph);
  var sy = 1 + 0.07 * wob, sx = 1 - 0.05 * wob;
  if (o.pyr) { sx = 1; sy = 1; }
  var bottom = slimeBottom(o);
  var w = o.w, h = o.h, air = o.type === "a";
  ctx.save();
  ctx.translate(o.x + w / 2, bottom);
  ctx.scale(sx, sy);
  if (o.pre) { ctx.restore(); return; }
  if (!o.spit && o.skin) { drawCreature(o, w, h); ctx.restore(); return; }
  if (o.spit && o.proj && o.proj !== "blob") { drawProj(o, w, h); ctx.restore(); return; }
  if (o.spit && !o.fall) {
    ctx.fillStyle = o.c1;
    [0.4, 0.22, 0.1].forEach(function (al, i) {
      ctx.globalAlpha = al; ctx.beginPath(); ctx.ellipse(w * 0.5 + 8 + i * 12, -h * 0.35, 7 - i * 1.5, 5 - i, 0, 0, 7); ctx.fill();
    });
    ctx.globalAlpha = 1;
  }
  if (air && !o.spit) {
    var flap = Math.sin(t * 18 + o.ph);
    ctx.fillStyle = C.wing; ctx.strokeStyle = C.flyDark; ctx.lineWidth = 1.5;
    [-1, 1].forEach(function (side) {
      ctx.save();
      ctx.translate(side * w * 0.38, -h * 0.65);
      ctx.rotate(side * (0.45 + 0.45 * flap));
      ctx.beginPath(); ctx.ellipse(side * 12, 0, 15, 6.5, 0, 0, 7); ctx.fill(); ctx.stroke();
      ctx.restore();
    });
  }
  ctx.beginPath();
  ctx.moveTo(-w / 2, 0);
  ctx.bezierCurveTo(-w / 2, -h * 1.35, w / 2, -h * 1.35, w / 2, 0);
  ctx.quadraticCurveTo(0, 5, -w / 2, 0);
  ctx.closePath();
  ctx.fillStyle = o.c1 || (air ? C.fly : C.slime); ctx.fill();
  ctx.strokeStyle = o.c2 || (air ? C.flyDark : C.slimeDark); ctx.lineWidth = 2.5; ctx.stroke();
  ctx.fillStyle = "rgba(255,255,255,0.5)";
  ctx.beginPath(); ctx.ellipse(-w * 0.22, -h * 0.72, w * 0.1, h * 0.14, -0.6, 0, 7); ctx.fill();
  var blink = ((t * 0.7 + o.ph * 2.3) % 3) < 0.13;
  ctx.fillStyle = "#1a1a22"; ctx.strokeStyle = "#1a1a22"; ctx.lineWidth = 1.8; ctx.lineCap = "round";
  [-1, 1].forEach(function (side) {
    var ex = side * w * 0.17, ey = -h * 0.42;
    if (blink) { ctx.beginPath(); ctx.moveTo(ex - 3, ey); ctx.lineTo(ex + 3, ey); ctx.stroke(); }
    else { ctx.beginPath(); ctx.ellipse(ex, ey, 3, 4.6, 0, 0, 7); ctx.fill(); }
  });
  if (!blink) {
    ctx.fillStyle = "#fff";
    [-1, 1].forEach(function (side) {
      ctx.beginPath(); ctx.arc(side * w * 0.17 - 0.8, -h * 0.42 - 1.8, 1.1, 0, 7); ctx.fill();
    });
  }
  ctx.strokeStyle = "#1a1a22"; ctx.lineWidth = 1.6; ctx.lineCap = "round";
  ctx.beginPath(); ctx.arc(0, -h * 0.3, 3.5, 0.15 * Math.PI, 0.85 * Math.PI); ctx.stroke();
  ctx.restore();
}
