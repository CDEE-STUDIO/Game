/* Coins drawing
 * Draws the coins.
 */
"use strict";

function drawCoins() {
  coins.forEach(function (c) {
    var sx = 0.35 + 0.65 * Math.abs(Math.cos(t * 5 + c.x * 0.02));
    ctx.save(); ctx.translate(c.x, GROUND - c.y); ctx.scale(sx, 1);
    ctx.beginPath(); ctx.arc(0, 0, 9, 0, 7);
    ctx.fillStyle = "#ffd23f"; ctx.fill();
    ctx.lineWidth = 2; ctx.strokeStyle = "#b07d00"; ctx.stroke();
    ctx.fillStyle = "#b07d00"; ctx.fillRect(-1.5, -4.5, 3, 9);
    ctx.restore();
  });
}
