/* Particles
 * Dust, sparkles, floating text.
 */
"use strict";

// ----- particles -----
function dustBurst(n) {
  for (var i = 0; i < n; i++) {
    parts.push({ k: "dust", x: p.x + rand(-16, 8), y: GROUND - 2, vx: -speed * rand(0.6, 0.95) + (state === "over" ? rand(-80, 80) : 0), vy: rand(-70, -15), g: 0, life: 0, max: rand(0.3, 0.55), s: rand(3, 6.5) });
  }
}
function trail() {
  parts.push({ k: "star", x: p.x - 16, y: GROUND - p.z - rand(18, 74), vx: -speed * 0.5 - rand(0, 60), vy: rand(-20, 20), g: 0, life: 0, max: rand(0.45, 0.8), s: rand(3, 6.5), rot: rand(0, 6) });
}
function celebrate(score) {
  Sound.mile();
  var el = $("score"); el.classList.remove("pop"); void el.offsetWidth; el.classList.add("pop");
  for (var i = 0; i < 14; i++) {
    var a = rand(0, Math.PI * 2), v = rand(120, 260);
    parts.push({ k: "star", x: p.x + 10, y: GROUND - p.z - 45, vx: Math.cos(a) * v, vy: Math.sin(a) * v - 80, g: 500, life: 0, max: rand(0.5, 0.9), s: rand(4, 8), rot: rand(0, 6) });
  }
  parts.push({ k: "txt", text: score + "!", x: p.x - 10, y: GROUND - p.z - PH - 12, vx: 0, vy: -50, g: 0, life: 0, max: 1.0, s: 0 });
}
function updateParts(dt) {
  if (shake > 0) shake = Math.max(0, shake - dt);
  for (var i = parts.length - 1; i >= 0; i--) {
    var q = parts[i];
    q.life += dt; q.vy += (q.g || 0) * dt; q.x += q.vx * dt; q.y += q.vy * dt;
    if (q.k === "txt") q.x -= speed * dt * 0.3;
    if (q.life >= q.max) parts.splice(i, 1);
  }
}
function drawParts() {
  parts.forEach(function (q) {
    var f = q.life / q.max;
    if (q.k === "dust") {
      ctx.globalAlpha = (1 - f) * 0.8; ctx.fillStyle = C.dust;
      ctx.beginPath(); ctx.arc(q.x, q.y, q.s * (1 + f * 1.3), 0, 7); ctx.fill();
    } else if (q.k === "star") {
      ctx.globalAlpha = 1 - f; ctx.fillStyle = C.star;
      ctx.save(); ctx.translate(q.x, q.y); ctx.rotate((q.rot || 0) + q.life * 5);
      starPath(0, 0, q.s * (1 - f * 0.4)); ctx.fill(); ctx.restore();
    } else if (q.k === "blob") {
      ctx.globalAlpha = 1 - f; ctx.fillStyle = q.col;
      ctx.beginPath(); ctx.arc(q.x, q.y, q.s * (1 - f * 0.5), 0, 7); ctx.fill();
    } else if (q.k === "txt") {
      ctx.globalAlpha = f < 0.7 ? 1 : (1 - f) / 0.3;
      ctx.font = "600 22px Mitr, Kanit, sans-serif"; ctx.textAlign = "center";
      ctx.lineWidth = 4; ctx.lineJoin = "round"; ctx.strokeStyle = C.ground; ctx.fillStyle = C.groundLine;
      ctx.strokeText(q.text, q.x, q.y); ctx.fillText(q.text, q.x, q.y);
    }
  });
  ctx.globalAlpha = 1;
}
