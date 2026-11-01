/* Player drawing
 * Picks the right sprite frame (run cycle / jump phases / crouch) and draws it.
 */
"use strict";

function drawPlayer() {
  var airborne = p.z > 0;
  var fi = F_FALL, bob = 0, runFi = Math.floor(p.cyc * 8) % 8; if (runFi < 0) runFi += 8;
  if (state === "over") fi = F_FALL;
  else if (dashT > 0) fi = runFi;
  else if (airborne) {
    // jump sheet: 2 push off, 3 rising, 4 apex, 5 starts falling, 6 toes touch
    if (p.vz > 0) fi = p.z < 26 ? F_PUSH : (p.vz > JV * 0.3 ? F_RISE : F_APEX);
    else fi = (-p.vz < JV * 0.3 && p.z > 60) ? F_APEX : (p.z > 40 ? F_FALL : F_TOES);
  } else if (p.duck && state === "play") fi = F_CROUCH;
  else if (state === "play" && p.sqT > 0 && p.sqK !== 1) fi = F_LAND;
  else {
    fi = runFi;
    bob = Math.abs(Math.cos(p.cyc * Math.PI * 2)) * (state === "play" ? 3 : 2);
  }
  var feetY = GROUND - p.z - bob;

  ctx.save();
  ctx.globalAlpha = Math.max(0.08, 0.3 - p.z / 600);
  ctx.fillStyle = "#000";
  ctx.beginPath(); ctx.ellipse(p.x + 6, GROUND + 4, 28 - Math.min(p.z / 10, 10), 5, 0, 0, 7); ctx.fill();
  ctx.restore();

  var a = p.sqT / 0.14, sx = 1, sy = 1;
  if (p.sqT > 0) {
    if (p.sqK === 1) { sx = 1 - 0.1 * a; sy = 1 + 0.14 * a; }
    else { sx = 1 + 0.15 * a; sy = 1 - 0.14 * a; }
  }
  if (fi >= F_CROUCH) { sx = 1; sy = 1; }
  if (fi === F_CROUCH) { sx = 1.1; sy = 0.7; }
  if (dashT > 0) { sx *= 1.12; sy *= 0.94; }

  var im = frameImgs[fi];
  if (dashT > 0) {
    var gl = ctx.createRadialGradient(p.x + 8, feetY - 44, 6, p.x + 8, feetY - 44, 74);
    gl.addColorStop(0, C.star); gl.addColorStop(1, "rgba(255,210,63,0)");
    ctx.save(); ctx.globalAlpha = 0.5; ctx.fillStyle = gl; ctx.fillRect(p.x - 70, feetY - 124, 170, 170); ctx.restore();
  }
  for (var gi = (dashT > 0 ? 3 : 0); gi >= 0; gi--) {
    ctx.save();
    ctx.globalAlpha = gi === 0 ? 1 : 0.38 / gi;
    ctx.translate(p.x - gi * 26, feetY);
    ctx.rotate(p.tilt);
    ctx.scale(-sx, sy);
    if (im.complete && im.naturalWidth) ctx.drawImage(im, -FCX * SC, -FBASE * SC, FW * SC, FH * SC);
    else { ctx.fillStyle = "#f5b800"; ctx.fillRect(-20, -PH, 40, PH); }
    ctx.restore();
  }

  if (state === "over" && p.tOver > 0.35) {
    var hx = p.x + Math.sin(p.tilt) * PH * 0.7, hy = feetY - Math.cos(p.tilt) * PH * 0.7 - 6;
    ctx.fillStyle = C.star;
    for (var i = 0; i < 3; i++) {
      var ang = p.tOver * 5 + i * 2.094;
      starPath(hx + Math.cos(ang) * 20, hy + Math.sin(ang) * 7, 5.5); ctx.fill();
    }
  }
}

function drawSpeedLines() {
  var ratio = speed / (BASE_SPEED * K);
  if (state !== "play" || (ratio < 1.5 && dashT <= 0)) return;
  ctx.strokeStyle = C.dust; ctx.lineWidth = 2; ctx.lineCap = "round";
  ctx.globalAlpha = dashT > 0 ? 0.55 : Math.min(0.5, (ratio - 1.5) * 0.4);
  for (var i = 0; i < 7; i++) {
    var y = 28 + (i * 53) % (GROUND - 80), len = 60 + (i * 37) % 70;
    var x = mod(i * 173 - off * 1.8, W + 200) - 100;
    ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x + len, y); ctx.stroke();
  }
  ctx.globalAlpha = 1;
}
