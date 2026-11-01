/* Sea
 * Pufferfish + flying fish, crab mini-boss, giant squid (tentacle on the ground, ink above).
 */
"use strict";

// World 3: the sea.
// To add a new world: copy this file, change the id, and add a <script> line in index.html (before js/main.js).

ZONES.push("sea"); ZONE_NAME.sea = "ชายทะเล";
PAL.sea = {
  l: { sky1: "#86d3ff", sky2: "#e6f7ff", far: "#6fc3e8", near: "#3aa6d6", cloud: "#ffffff", ground: "#375f6c", line: "#ffe9a0", pebble: "#5a8896", sun: "#fff3b0", seaTop: "#8fdcf5", seaBot: "#2f9bcf", foam: "#ffffff", plant: "#3d9a55", trunk: "#8a5a30", island: "#5aa89a" },
  d: { sky1: "#0a1233", sky2: "#27407a", far: "#1a3566", near: "#12294f", cloud: "#3a4f86", ground: "#0e1f2c", line: "#ffd98a", pebble: "#244555", sun: "#e8f0ff", seaTop: "#173a6b", seaBot: "#0b2247", foam: "#7fa6d8", plant: "#2a7a4a", trunk: "#4a3320", island: "#16405a" }
};
KIND_BY_ZONE.sea = ["crab", "squid"];            // [mini-boss, big boss]
KINDS.crab = { name: "ปูยักษ์", w: 92, h: 56, c1: "#ff6f59", c2: "#a62d1f", proj: ["bubble", "bubble", "bubble"] };
KINDS.squid = { name: "ราชาหมึกยักษ์", w: 128, h: 116, c1: "#9b5de5", c2: "#4b2a7a", proj: ["tentacle", "ink", "ink"], groundSummon: { proj: "tentacle", h: 54 } };

// scenery behind the runner (a = fade, P = palette, dark = night mode)
ZONE_ART.sea = function (a, P, dark) {
  var i, x, idx;
    var hz = GROUND - 66, sx0 = W * 0.7;
    if (dark) tinyStars(a);
    sunDisc(sx0, hz - 16, dark ? 20 : 30, P.sun, a);
    cloudsLayer(P, a, 0.1);
    ctx.fillStyle = P.island;
    x = mod(520 - off * 0.05, W + 400) - 150;
    ctx.beginPath(); ctx.ellipse(x, hz + 4, 80, 24, 0, 0, 7); ctx.fill();
    ctx.beginPath(); ctx.ellipse(x + 70, hz + 6, 46, 14, 0, 0, 7); ctx.fill();
    var sg = ctx.createLinearGradient(0, hz, 0, GROUND);
    sg.addColorStop(0, P.seaTop); sg.addColorStop(1, P.seaBot);
    ctx.fillStyle = sg; ctx.fillRect(0, hz, W, GROUND - hz);
    ctx.fillStyle = P.sun; ctx.globalAlpha = a * 0.5;
    for (i = 0; i < 6; i++) ctx.fillRect(sx0 - (28 - i * 4) / 2 + Math.sin(ambT * 2 + i) * 3, hz + 5 + i * 10, 28 - i * 4, 2);
    ctx.globalAlpha = a;
    ctx.strokeStyle = P.foam; ctx.lineWidth = 2; ctx.lineCap = "round"; ctx.globalAlpha = a * 0.45;
    for (i = 0; i < 16; i++) {
      var wy = hz + 7 + (i * 17) % 52, wx = mod(i * 97 - off * (0.08 + (wy - hz) / 420), W + 80) - 40;
      ctx.beginPath(); ctx.moveTo(wx, wy); ctx.lineTo(wx + 14 + (i % 3) * 5, wy); ctx.stroke();
    }
    ctx.globalAlpha = a;
    x = mod(300 - off * 0.14, W + 300) - 80; var sy = hz + 8 + Math.sin(ambT * 1.4) * 1.6;
    ctx.fillStyle = P.trunk; ctx.beginPath(); ctx.moveTo(x - 15, sy); ctx.lineTo(x + 15, sy); ctx.lineTo(x + 10, sy + 7); ctx.lineTo(x - 10, sy + 7); ctx.closePath(); ctx.fill();
    ctx.fillStyle = P.cloud; ctx.beginPath(); ctx.moveTo(x, sy - 26); ctx.lineTo(x, sy - 2); ctx.lineTo(x + 15, sy - 2); ctx.closePath(); ctx.fill();
    ctx.beginPath(); ctx.moveTo(x - 2, sy - 20); ctx.lineTo(x - 2, sy - 2); ctx.lineTo(x - 12, sy - 2); ctx.closePath(); ctx.fill();
    ctx.strokeStyle = P.foam; ctx.lineWidth = 3; ctx.globalAlpha = a * 0.9;
    ctx.beginPath();
    for (x = 0; x <= W; x += 8) { var fy = GROUND - 3 + Math.sin(x / 16 + ambT * 2.2 - off * 0.01) * 2; if (x === 0) ctx.moveTo(x, fy); else ctx.lineTo(x, fy); }
    ctx.stroke(); ctx.globalAlpha = a;
    ctx.strokeStyle = P.cloud; ctx.lineWidth = 2;
    for (i = 0; i < 3; i++) {
      var gx = mod(i * 280 - off * 0.2 - ambT * 18, W + 120) - 40, gy = 44 + i * 24 + Math.sin(ambT * 2 + i) * 4, fl = Math.sin(ambT * 9 + i * 2) * 3;
      ctx.beginPath(); ctx.moveTo(gx - 7, gy); ctx.quadraticCurveTo(gx - 3, gy - 4 + fl, gx, gy); ctx.quadraticCurveTo(gx + 3, gy - 4 + fl, gx + 7, gy); ctx.stroke();
    }
    for (i = -1; i < W / 640 + 2; i++) {
      idx = i + Math.floor(off * 0.7 / 640);
      if (rnd(idx + 5) < 0.3) continue;
      x = i * 640 - mod(off * 0.7, 640) + 200 + rnd(idx) * 160;
      var lean = (rnd(idx + 2) - 0.5) * 16, tx = x + 6 + lean, ty = GROUND - 70;
      ctx.strokeStyle = P.trunk; ctx.lineWidth = 6; ctx.beginPath(); ctx.moveTo(x, GROUND - 1); ctx.quadraticCurveTo(x + 14 + lean, GROUND - 34, tx, ty); ctx.stroke();
      ctx.fillStyle = P.plant;
      [-2.7, -2.05, -1.3, -0.6, 0.15].forEach(function (ang) {
        ctx.save(); ctx.translate(tx, ty); ctx.rotate(ang + Math.sin(ambT * 1.6 + x * 0.01) * 0.05);
        ctx.beginPath(); ctx.ellipse(17, 0, 20, 5, 0, 0, 7); ctx.fill(); ctx.restore();
      });
    }
};

// regular monsters: ground + flying (o.skin == "sea")
CREATURE_ART.sea = function (o, w, h, air, fl) {
  var i, sk = o.skin;
  if (!air) {
      var r = Math.min(w * 0.46, h * 0.64), cy = -h * 0.5;
      ctx.fillStyle = "#e08a1e"; ctx.beginPath(); ctx.moveTo(r * 0.8, cy); ctx.lineTo(r * 1.45, cy - 11 + fl * 3); ctx.lineTo(r * 1.45, cy + 11 + fl * 3); ctx.closePath(); ctx.fill();
      ctx.fillStyle = "#b8650f";
      for (i = 0; i < 12; i++) { var an = i / 12 * 6.283 + Math.sin(t * 3) * 0.05; ctx.beginPath(); ctx.moveTo(Math.cos(an - 0.14) * r * 0.9, cy + Math.sin(an - 0.14) * r * 0.9); ctx.lineTo(Math.cos(an) * r * 1.3, cy + Math.sin(an) * r * 1.3); ctx.lineTo(Math.cos(an + 0.14) * r * 0.9, cy + Math.sin(an + 0.14) * r * 0.9); ctx.closePath(); ctx.fill(); }
      ctx.beginPath(); ctx.arc(0, cy, r, 0, 7); ctx.fillStyle = "#f6b93b"; ctx.fill(); ctx.strokeStyle = "#b8650f"; ctx.lineWidth = 2.5; ctx.stroke();
      ctx.fillStyle = "#fde8a8"; ctx.beginPath(); ctx.ellipse(-r * 0.1, cy + r * 0.38, r * 0.6, r * 0.34, 0, 0, 7); ctx.fill();
      ctx.fillStyle = "#fff"; ctx.beginPath(); ctx.arc(-r * 0.42, cy - r * 0.18, 5.5, 0, 7); ctx.fill(); ctx.stroke();
      ctx.fillStyle = "#1a1a22"; ctx.beginPath(); ctx.arc(-r * 0.46, cy - r * 0.16, 2.6, 0, 7); ctx.fill();
      ctx.beginPath(); ctx.arc(-r * 0.86, cy + r * 0.12, 3, 0, 7); ctx.fillStyle = "#b8650f"; ctx.fill();
  } else {
      ctx.fillStyle = "rgba(200,240,255,0.85)";
      [-1, 1].forEach(function (side) { ctx.save(); ctx.translate(side * w * 0.06, -h * 0.66); ctx.rotate(side * (0.5 + 0.5 * fl)); ctx.beginPath(); ctx.ellipse(side * 15, 0, 17, 6, 0, 0, 7); ctx.fill(); ctx.restore(); });
      ctx.fillStyle = "#3a98d8"; ctx.beginPath(); ctx.moveTo(w * 0.36, -h * 0.5); ctx.lineTo(w * 0.62, -h * 0.5 - 12 + fl * 3); ctx.lineTo(w * 0.62, -h * 0.5 + 12 + fl * 3); ctx.closePath(); ctx.fill();
      ctx.beginPath(); ctx.ellipse(0, -h * 0.5, w * 0.42, h * 0.25, 0, 0, 7); ctx.fillStyle = "#4fb8ee"; ctx.fill(); ctx.strokeStyle = "#2a7ab0"; ctx.lineWidth = 2.5; ctx.stroke();
      ctx.fillStyle = "#d9f2ff"; ctx.beginPath(); ctx.ellipse(-w * 0.02, -h * 0.4, w * 0.3, h * 0.1, 0, 0, 7); ctx.fill();
      ctx.fillStyle = "#fff"; ctx.beginPath(); ctx.arc(-w * 0.26, -h * 0.56, 4.6, 0, 7); ctx.fill(); ctx.stroke();
      ctx.fillStyle = "#1a1a22"; ctx.beginPath(); ctx.arc(-w * 0.28, -h * 0.55, 2.2, 0, 7); ctx.fill();
  }
};

PROJ_ART.bubble = function (o, w, h) {
  var pr = o.proj, cy = -h * 0.5, i, sp = t * 9 + o.ph;
    ctx.fillStyle = "rgba(150,225,255,0.45)"; ctx.beginPath(); ctx.arc(0, cy, 14, 0, 7); ctx.fill();
    ctx.strokeStyle = "#5fc4ec"; ctx.lineWidth = 2; ctx.stroke();
    ctx.strokeStyle = "rgba(255,255,255,0.85)"; ctx.lineWidth = 2.4; ctx.beginPath(); ctx.arc(0, cy, 9.5, 3.5, 4.6); ctx.stroke();
};

PROJ_ART.ink = function (o, w, h) {
  var pr = o.proj, cy = -h * 0.5, i, sp = t * 9 + o.ph;
    var wb = Math.sin(t * 10 + o.ph) * 1.5;
    ctx.fillStyle = "#2a1b3d"; ctx.beginPath(); ctx.ellipse(0, cy, 14 + wb, 12 - wb, 0, 0, 7); ctx.fill();
    ctx.beginPath(); ctx.arc(13, cy + 2, 4, 0, 7); ctx.arc(19, cy - 3, 2.6, 0, 7); ctx.fill();
    ctx.fillStyle = "rgba(255,255,255,0.35)"; ctx.beginPath(); ctx.ellipse(-5, cy - 4, 3.5, 2.2, -0.5, 0, 7); ctx.fill();
};

PROJ_ART.tentacle = function (o, w, h) {
  var pr = o.proj, cy = -h * 0.5, i, sp = t * 9 + o.ph;
    var th = o.h, tw = o.w, sway = Math.sin(t * 9 + o.ph);
    ctx.strokeStyle = "#8f3b9c"; ctx.lineWidth = tw * 0.9 + 3; ctx.beginPath(); ctx.moveTo(0, 0); ctx.quadraticCurveTo(sway * 9, -th * 0.5, -sway * 7 - 5, -th * 0.9); ctx.stroke();
    ctx.strokeStyle = "#c070d6"; ctx.lineWidth = tw * 0.9; ctx.beginPath(); ctx.moveTo(0, 0); ctx.quadraticCurveTo(sway * 9, -th * 0.5, -sway * 7 - 5, -th * 0.9); ctx.stroke();
    ctx.fillStyle = "#f0c8f7";
    for (i = 0; i < 4; i++) { var ty = -th * (0.16 + i * 0.2); ctx.beginPath(); ctx.arc(sway * 3 * (i * 0.3), ty, 3, 0, 7); ctx.fill(); }
};

BOSS_ART.crab = function (b, w, h, white, en) {
  var T = bossTools(b, white, en), cfg = T.cfg, S = T.S, sp = T.sp, br = T.br, f1 = T.f1, f2 = T.f2, eye = T.eye, eyes = T.eyes, i;
    ctx.strokeStyle = cfg.c2; ctx.lineWidth = 4;
    for (i = -1; i <= 1; i += 2) for (var lg = 0; lg < 3; lg++) { ctx.beginPath(); ctx.moveTo(i * w * 0.2, -h * 0.25); ctx.lineTo(i * (w * 0.4 + lg * 6), -h * 0.12 + Math.sin(b.t * 6 + lg) * 3); ctx.lineTo(i * (w * 0.46 + lg * 6), 0); ctx.stroke(); }
    ctx.fillStyle = f1; ctx.beginPath(); ctx.ellipse(0, -h * 0.4, w * 0.36, h * 0.38, 0, 0, 7); ctx.fill(); ctx.lineWidth = 3.5; ctx.stroke();
    [-1, 1].forEach(function (s) {
      ctx.save(); ctx.translate(s * w * 0.4, -h * 0.55); ctx.rotate(s * (-0.3 - (sp ? 0.5 : 0.12 * Math.sin(b.t * 4))));
      ctx.beginPath(); ctx.ellipse(s * 8, -h * 0.28, w * 0.12, h * 0.3, 0, 0, 7); ctx.fillStyle = f1; ctx.fill(); ctx.stroke();
      ctx.fillStyle = f2; ctx.beginPath(); ctx.moveTo(s * 8, -h * 0.5); ctx.lineTo(s * 8, -h * 0.28); ctx.lineTo(s * 8 + s * 5, -h * 0.4); ctx.closePath(); ctx.fill(); ctx.restore();
    });
    [-1, 1].forEach(function (s) { ctx.beginPath(); ctx.moveTo(s * w * 0.12, -h * 0.7); ctx.lineTo(s * w * 0.12, -h * 0.9); ctx.stroke(); ctx.beginPath(); ctx.arc(s * w * 0.12, -h * 0.95, 6, 0, 7); ctx.fillStyle = "#fff"; ctx.fill(); ctx.stroke(); ctx.fillStyle = S; ctx.beginPath(); ctx.arc(s * w * 0.12 - 1, -h * 0.94, 2.8, 0, 7); ctx.fill(); });
    ctx.strokeStyle = S; ctx.lineWidth = 3; ctx.beginPath(); ctx.arc(0, -h * 0.36, w * 0.1, 0.2 * Math.PI, 0.8 * Math.PI); ctx.stroke();
};

BOSS_ART.squid = function (b, w, h, white, en) {
  var T = bossTools(b, white, en), cfg = T.cfg, S = T.S, sp = T.sp, br = T.br, f1 = T.f1, f2 = T.f2, eye = T.eye, eyes = T.eyes, i;
    var tw = sp ? 1 : 0;
    ctx.lineWidth = 12; ctx.strokeStyle = f1;
    for (i = 0; i < 5; i++) {
      var tx2 = -w * 0.38 + i * w * 0.19, sw2 = Math.sin(b.t * 4 + i * 1.3) * 7, up2 = (tw && i === 1) ? -h * 0.45 : 0;
      ctx.beginPath(); ctx.moveTo(tx2, -h * 0.3); ctx.quadraticCurveTo(tx2 + sw2, -h * 0.12 + up2, tx2 - 6 + sw2 * 0.5, up2 ? -h * 0.62 : -2); ctx.stroke();
    }
    ctx.fillStyle = f1; ctx.beginPath(); ctx.moveTo(-w * 0.34, -h * 0.34); ctx.bezierCurveTo(-w * 0.44, -h * 1.42, w * 0.44, -h * 1.42, w * 0.34, -h * 0.34); ctx.quadraticCurveTo(0, -h * 0.2, -w * 0.34, -h * 0.34); ctx.closePath(); ctx.fill(); ctx.lineWidth = 3.5; ctx.strokeStyle = cfg.c2; ctx.stroke();
    ctx.fillStyle = white ? "#fff" : "rgba(255,255,255,0.22)"; ctx.beginPath(); ctx.ellipse(-w * 0.14, -h * 0.9, w * 0.07, h * 0.12, -0.5, 0, 7); ctx.fill();
    ctx.fillStyle = white ? "#fff" : "#d9a0f5"; for (i = 0; i < 4; i++) { ctx.beginPath(); ctx.arc(-w * 0.12 + i * w * 0.09, -h * 1.1 + (i % 2) * 8, 3, 0, 7); ctx.fill(); }
    [-1, 1].forEach(function (s) { ctx.beginPath(); ctx.ellipse(s * w * 0.16, -h * 0.58, 9, 11, 0, 0, 7); ctx.fillStyle = "#fff"; ctx.fill(); ctx.lineWidth = 2; ctx.strokeStyle = S; ctx.stroke(); ctx.fillStyle = (en > 0) ? "#ff3355" : S; ctx.beginPath(); ctx.arc(s * w * 0.16 - 1, -h * 0.57, 5, 0, 7); ctx.fill(); });
    ctx.strokeStyle = S; ctx.lineWidth = 3; ctx.beginPath(); ctx.arc(0, -h * 0.38, 8, 0.15 * Math.PI, 0.85 * Math.PI); ctx.stroke();
};
