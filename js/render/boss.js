/* Boss drawing
 * Dispatches to BOSS_ART, draws the health bar and the stars you throw.
 */
"use strict";

// Shared look-up for BOSS_ART functions: colours, "is spitting now", eye helper.
function bossTools(b, white, en) {
  var cfg = b.cfg, S = "#1a1a22", eye = (en > 0) ? "#ff3355" : "#ffe14d";
  function eyes(ex, ey, r) { [-1, 1].forEach(function (s) { ctx.beginPath(); ctx.arc(ex + s * r * 2.1, ey, r, 0, 7); ctx.fillStyle = eye; ctx.fill(); ctx.lineWidth = 2; ctx.strokeStyle = S; ctx.stroke(); ctx.fillStyle = S; ctx.beginPath(); ctx.arc(ex + s * r * 2.1 - 1, ey + 1, r * 0.42, 0, 7); ctx.fill(); }); ctx.lineWidth = 3.5; ctx.strokeStyle = cfg.c2; }
  return { cfg: cfg, S: S, eye: eye, eyes: eyes, sp: b.spitT > 0, br: Math.sin(b.t * 3),
           f1: white ? "#ffffff" : cfg.c1, f2: white ? "#ffffff" : cfg.c2 };
}

// Each boss kind registers BOSS_ART[kind] (js/biomes/*.js). Origin = bottom centre, facing left.
function drawBossKind(b, w, h, white, en) {
  ctx.lineCap = "round"; ctx.lineJoin = "round"; ctx.lineWidth = 3.5; ctx.strokeStyle = b.cfg.c2;
  var art = BOSS_ART[b.kind];
  if (art) art(b, w, h, white, en);
  if (en > 0 && !b.dead) { ctx.fillStyle = "rgba(255,40,40," + (0.1 * en) + ")"; ctx.fillRect(-w / 2, -h * 1.1, w, h * 1.1); }
}

function drawBoss(b) {
  var cfg = b.cfg, w = b.w, h = b.h, bottom = bossBottom(b), cx = b.x + w / 2;
  var en = enrageLv(b), wob = Math.sin(b.t * (3.2 + 2.5 * en)), sy = 1 + (0.045 + 0.02 * en) * wob, sx = 1 - 0.03 * wob;
  if (b.hitT > 0) { sx += 0.06; sy -= 0.06; }
  var fade = b.dead ? Math.max(0, 1 - Math.max(0, b.deadT - 0.45) / 0.5) : 1;
  ctx.save();
  ctx.globalAlpha = fade;
  ctx.translate(cx + (b.dead ? (Math.random() - 0.5) * 8 : 0), bottom);
  ctx.scale(sx, sy);
  var white = b.flash > 0 || (b.dead && Math.floor(b.deadT * 18) % 2 === 0);
  if (b.kind && b.kind !== "slime") { drawBossKind(b, w, h, white, en); ctx.restore(); return; }

  if (b.tier === 1) {
    var flap = Math.sin(b.t * 9);
    ctx.fillStyle = C.wing; ctx.strokeStyle = cfg.c2; ctx.lineWidth = 2;
    [-1, 1].forEach(function (side) {
      ctx.save(); ctx.translate(side * w * 0.4, -h * 0.65); ctx.rotate(side * (0.45 + 0.4 * flap));
      ctx.beginPath(); ctx.ellipse(side * 30, 0, 38, 15, 0, 0, 7); ctx.fill(); ctx.stroke(); ctx.restore();
    });
  }
  if (b.tier === 2) {
    ctx.fillStyle = "#ff4d8d";
    [-1, 1].forEach(function (side) {
      ctx.beginPath(); ctx.moveTo(side * w * 0.26, -h * 0.9); ctx.lineTo(side * w * 0.4, -h * 1.32); ctx.lineTo(side * w * 0.1, -h * 0.98); ctx.closePath(); ctx.fill();
    });
  }

  ctx.beginPath();
  ctx.moveTo(-w / 2, 0);
  ctx.bezierCurveTo(-w / 2, -h * 1.35, w / 2, -h * 1.35, w / 2, 0);
  ctx.quadraticCurveTo(0, 8, -w / 2, 0);
  ctx.closePath();
  ctx.fillStyle = white ? "#ffffff" : cfg.c1; ctx.fill();
  ctx.strokeStyle = cfg.c2; ctx.lineWidth = 4; ctx.lineJoin = "round"; ctx.stroke();
  if (en > 0 && !b.dead) { ctx.fillStyle = "rgba(255,40,40," + (0.14 * en) + ")"; ctx.fill(); }
  ctx.fillStyle = "rgba(255,255,255,0.28)";
  ctx.beginPath(); ctx.ellipse(-w * 0.24, -h * 0.74, w * 0.09, h * 0.15, -0.6, 0, 7); ctx.fill();

  if (b.tier === 0) {
    var cw = w * 0.22;
    ctx.beginPath();
    ctx.moveTo(-cw, -h * 0.9); ctx.lineTo(-cw, -h * 1.1); ctx.lineTo(-cw / 2, -h * 0.99); ctx.lineTo(0, -h * 1.14);
    ctx.lineTo(cw / 2, -h * 0.99); ctx.lineTo(cw, -h * 1.1); ctx.lineTo(cw, -h * 0.9); ctx.closePath();
    ctx.fillStyle = "#ffd23f"; ctx.fill(); ctx.strokeStyle = "#a8780a"; ctx.lineWidth = 2.5; ctx.stroke();
  }

  if (b.mini) {
    ctx.strokeStyle = cfg.c2; ctx.lineWidth = 3; ctx.lineCap = "round";
    ctx.beginPath(); ctx.moveTo(0, -h * 1.0); ctx.quadraticCurveTo(w * 0.1, -h * 1.22, w * 0.02, -h * 1.34); ctx.stroke();
    ctx.beginPath(); ctx.arc(w * 0.02, -h * 1.38, 5, 0, 7); ctx.fillStyle = "#ffd23f"; ctx.fill(); ctx.lineWidth = 2; ctx.stroke();
  }
  var ey = -h * 0.52;
  [-1, 1].forEach(function (side) {
    var ex = side * w * 0.2;
    ctx.beginPath(); ctx.ellipse(ex, ey, w * 0.065, w * 0.085, 0, 0, 7);
    ctx.fillStyle = (b.tier === 2 || en > 0) ? "#ff3355" : "#ffffff"; ctx.fill();
    ctx.lineWidth = 2; ctx.strokeStyle = "#1a1a22"; ctx.stroke();
    ctx.fillStyle = "#1a1a22";
    ctx.beginPath(); ctx.ellipse(ex - side * 2, ey + 2, w * 0.03, w * 0.045, 0, 0, 7); ctx.fill();
    ctx.lineWidth = 3.5; ctx.lineCap = "round"; ctx.strokeStyle = "#1a1a22";
    ctx.beginPath(); ctx.moveTo(ex + side * 12, ey - 17); ctx.lineTo(ex - side * 11, ey - 8); ctx.stroke();
  });
  var my = -h * 0.24;
  if (b.spitT > 0) {
    ctx.fillStyle = "#3a0d1e"; ctx.beginPath(); ctx.ellipse(0, my, w * 0.14, h * 0.12, 0, 0, 7); ctx.fill();
    ctx.fillStyle = "#ff6b8b"; ctx.beginPath(); ctx.ellipse(0, my + h * 0.05, w * 0.08, h * 0.05, 0, 0, 7); ctx.fill();
  } else {
    ctx.strokeStyle = "#1a1a22"; ctx.lineWidth = 3; ctx.lineCap = "round";
    ctx.beginPath(); ctx.arc(0, my + 12, w * 0.1, 1.15 * Math.PI, 1.85 * Math.PI); ctx.stroke();
  }
  ctx.restore();
}

function drawBossUI() {
  if (boss) {
    var bw = Math.min(W * 0.36, 260), bx = (W - bw) / 2;
    outlineText(boss.cfg.name, W / 2, 24, "600 16px Mitr, Kanit, sans-serif", C.groundLine);
    ctx.fillStyle = "rgba(0,0,0,0.45)"; ctx.fillRect(bx - 2, 30, bw + 4, 14);
    var bk = KINDS[boss.kind];
    ctx.fillStyle = boss.tier === 2 ? "#ff4d8d" : (bk && bk.darkBar) ? boss.cfg.c2 : boss.cfg.c1;   // pale bosses use their dark colour for the bar
    ctx.fillRect(bx, 32, bw * Math.max(0, boss.hp) / boss.max, 10);
  } else if (bossPending && bannerT > 0) {
    if (Math.floor(bannerT * 5) % 2 === 0) outlineText(pendingMini ? "มินิบอสกำลังมา!" : "บอสกำลังมา!", W / 2, 70, "600 26px Mitr, Kanit, sans-serif", C.groundLine);
  }
}

function drawShots() {
  shots.forEach(function (s) {
    ctx.save(); ctx.translate(s.x, s.y); ctx.rotate(s.rot);
    starPath(0, 0, 10); ctx.fillStyle = C.star; ctx.fill();
    ctx.lineWidth = 2; ctx.lineJoin = "round"; ctx.strokeStyle = C.ground; ctx.stroke();
    ctx.restore();
  });
}
