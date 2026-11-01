/* Drawing helpers
 * Small canvas helpers.
 */
"use strict";

function starPath(x, y, r) {
  ctx.beginPath();
  for (var i = 0; i < 10; i++) {
    var a = -Math.PI / 2 + i * Math.PI / 5, rr = i % 2 ? r * 0.45 : r;
    ctx.lineTo(x + Math.cos(a) * rr, y + Math.sin(a) * rr);
  }
  ctx.closePath();
}

function outlineText(txt, x, y, font, fill) {
  ctx.font = font; ctx.textAlign = "center"; ctx.lineJoin = "round"; ctx.lineWidth = 4;
  ctx.strokeStyle = C.ground; ctx.fillStyle = fill;
  ctx.strokeText(txt, x, y); ctx.fillText(txt, x, y);
}
