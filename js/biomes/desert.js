/* Desert
 * Egyptian town, scorpions + scarabs, mummy mini-boss, pharaoh who summons pyramids.
 */
"use strict";

// World 2: the desert (Egyptian town).
// To add a new world: copy this file, change the id, and add a <script> line in index.html (before js/main.js).

ZONES.push("desert"); ZONE_NAME.desert = "ทะเลทราย";
PAL.desert = {
  l: { sky1: "#ffcf8a", sky2: "#fff1d0", far: "#efc07c", near: "#e2a85a", cloud: "#fff8ea", ground: "#5a3b22", line: "#f2a93b", pebble: "#7d5733", sun: "#fff3b0", plant: "#4f9d5d", rock: "#d9a45f", wall: "#e6c88c", win: "#6d4a2a" },
  d: { sky1: "#1b1330", sky2: "#8a4a4a", far: "#4e2f45", near: "#3a2438", cloud: "#6a4a60", ground: "#1c1219", line: "#ffb84a", pebble: "#3b2735", sun: "#ffd9a0", plant: "#2f6f4a", rock: "#5a3a4a", wall: "#4a3340", win: "#ffcf6a" }
};
KIND_BY_ZONE.desert = ["mummy", "pharaoh"];            // [mini-boss, big boss]
KINDS.mummy = { name: "มัมมี่", w: 70, h: 78, c1: "#e4d6ac", c2: "#8a7a52", proj: ["bandage", "bandage", "bandage"], darkBar: true };
KINDS.pharaoh = { name: "ฟาโรห์ผู้เรียกปิรามิด", w: 120, h: 118, c1: "#e5b84b", c2: "#2b5fa8", proj: ["sand", "sand", "sand"], pyr: true };

// scenery behind the runner (a = fade, P = palette, dark = night mode)
ZONE_ART.desert = function (a, P, dark) {
  var i, x, idx;
    if (dark) tinyStars(a);
    sunDisc(W * 0.76, 74, dark ? 22 : 34, P.sun, a);
    cloudsLayer(P, a * 0.6, 0.08);
    ctx.fillStyle = P.rock;
    for (i = -1; i < W / 620 + 2; i++) {
      x = i * 620 - mod(off * 0.1, 620) + 320; var by = GROUND - 30;
      ctx.beginPath(); ctx.moveTo(x - 62, by); ctx.lineTo(x, by - 60); ctx.lineTo(x + 62, by); ctx.closePath(); ctx.fill();
      ctx.fillStyle = "rgba(0,0,0,0.16)"; ctx.beginPath(); ctx.moveTo(x, by - 60); ctx.lineTo(x + 62, by); ctx.lineTo(x + 8, by); ctx.closePath(); ctx.fill();
      ctx.fillStyle = P.rock;
    }
    hills(0.14, 16, 38, P.far, 150);
    for (i = -1; i < W / 170 + 2; i++) {
      idx = i + Math.floor(off * 0.24 / 170);
      var rr = rnd(idx + 11);
      if (rr < 0.12) continue;
      x = i * 170 - mod(off * 0.24, 170);
      ctx.fillStyle = P.wall;
      if (rr > 0.9) {
        ctx.fillRect(x + 20, GROUND - 98, 10, 90);
        ctx.beginPath(); ctx.moveTo(x + 20, GROUND - 98); ctx.lineTo(x + 25, GROUND - 112); ctx.lineTo(x + 30, GROUND - 98); ctx.closePath(); ctx.fill();
        continue;
      }
      var bw2 = 56 + rnd(idx + 3) * 60, bh2 = 36 + rnd(idx + 5) * 44;
      ctx.fillRect(x, GROUND - 8 - bh2, bw2, bh2);
      ctx.fillRect(x - 3, GROUND - 12 - bh2, bw2 + 6, 5);
      ctx.fillStyle = "rgba(0,0,0,0.14)"; ctx.fillRect(x + bw2 * 0.7, GROUND - 8 - bh2, bw2 * 0.3, bh2);
      ctx.fillStyle = P.win;
      for (var wi = 0; wi < 2; wi++) ctx.fillRect(x + 8 + wi * (bw2 * 0.4), GROUND - 8 - bh2 * 0.72, 8, 12);
      ctx.beginPath(); ctx.arc(x + bw2 * 0.45, GROUND - 20, 8, Math.PI, 0); ctx.fill(); ctx.fillRect(x + bw2 * 0.45 - 8, GROUND - 20, 16, 12);
      if (rr > 0.6) {
        ctx.fillStyle = P.wall;
        for (var ck = 0; ck < 4; ck++) ctx.fillRect(x + bw2 + 6 + ck * 10, GROUND - 8 - bh2 * 0.8, 5, bh2 * 0.8);
        ctx.fillRect(x + bw2 + 3, GROUND - 12 - bh2 * 0.8, 44, 5);
      }
    }
    hills(0.3, 12, 16, P.near, 110);
    ctx.strokeStyle = P.plant; ctx.lineCap = "round"; ctx.lineJoin = "round";
    for (i = -1; i < W / 330 + 2; i++) {
      idx = i + Math.floor(off * 0.6 / 330);
      if (rnd(idx) < 0.4) continue;
      x = i * 330 - mod(off * 0.6, 330) + 120 + rnd(idx + 9) * 120;
      var ch = 30 + rnd(idx + 3) * 16;
      ctx.lineWidth = 9; ctx.beginPath(); ctx.moveTo(x, GROUND - 1); ctx.lineTo(x, GROUND - ch); ctx.stroke();
      ctx.lineWidth = 6; ctx.beginPath(); ctx.moveTo(x, GROUND - ch * 0.45); ctx.lineTo(x - 13, GROUND - ch * 0.45); ctx.lineTo(x - 13, GROUND - ch * 0.75); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(x, GROUND - ch * 0.6); ctx.lineTo(x + 13, GROUND - ch * 0.6); ctx.lineTo(x + 13, GROUND - ch * 0.88); ctx.stroke();
    }
};

// regular monsters: ground + flying (o.skin == "desert")
CREATURE_ART.desert = function (o, w, h, air, fl) {
  var i, sk = o.skin;
  if (!air) {
      ctx.strokeStyle = "#6b3d12"; ctx.lineWidth = 2.5;
      for (i = 0; i < 4; i++) { var lx = -w * 0.24 + i * w * 0.15, sw = Math.sin(t * 16 + i * 1.6) * 3; ctx.beginPath(); ctx.moveTo(lx, -h * 0.3); ctx.lineTo(lx + sw - 3, 0); ctx.stroke(); }
      ctx.lineWidth = 5; ctx.beginPath(); ctx.moveTo(-w * 0.3, -h * 0.42); ctx.lineTo(-w * 0.52, -h * 0.58); ctx.stroke();
      ctx.fillStyle = "#c97a2b"; ctx.beginPath(); ctx.arc(-w * 0.55, -h * 0.62, 6, 0, 7); ctx.fill();
      ctx.lineWidth = 2.5; ctx.beginPath(); ctx.ellipse(0, -h * 0.4, w * 0.36, h * 0.27, 0, 0, 7); ctx.fill(); ctx.stroke();
      ctx.strokeStyle = "#c97a2b"; ctx.lineWidth = 6; ctx.beginPath(); ctx.moveTo(w * 0.28, -h * 0.45); ctx.quadraticCurveTo(w * 0.64, -h * 0.55, w * 0.42, -h * 0.98); ctx.stroke();
      ctx.fillStyle = "#6b3d12"; ctx.beginPath(); ctx.moveTo(w * 0.42, -h * 0.98); ctx.lineTo(w * 0.3, -h * 0.82); ctx.lineTo(w * 0.54, -h * 0.82); ctx.closePath(); ctx.fill();
      ctx.fillStyle = "#1a1a22"; ctx.beginPath(); ctx.arc(-w * 0.2, -h * 0.5, 2.3, 0, 7); ctx.arc(-w * 0.08, -h * 0.5, 2.3, 0, 7); ctx.fill();
  } else {
      ctx.fillStyle = "rgba(255,255,255,0.72)";
      [-1, 1].forEach(function (side) { ctx.save(); ctx.translate(side * w * 0.12, -h * 0.72); ctx.rotate(side * (0.5 + 0.5 * fl)); ctx.beginPath(); ctx.ellipse(side * 14, 0, 16, 6, 0, 0, 7); ctx.fill(); ctx.restore(); });
      ctx.strokeStyle = "#0e3d33"; ctx.lineWidth = 2;
      for (i = 0; i < 3; i++) { ctx.beginPath(); ctx.moveTo(-w * 0.12 + i * w * 0.12, -h * 0.2); ctx.lineTo(-w * 0.16 + i * w * 0.12, -h * 0.02 + Math.sin(t * 12 + i) * 2); ctx.stroke(); }
      ctx.beginPath(); ctx.ellipse(w * 0.04, -h * 0.45, w * 0.3, h * 0.3, 0, 0, 7); ctx.fillStyle = "#1f7a63"; ctx.fill(); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(w * 0.04, -h * 0.74); ctx.lineTo(w * 0.04, -h * 0.16); ctx.stroke();
      ctx.beginPath(); ctx.arc(-w * 0.3, -h * 0.45, h * 0.17, 0, 7); ctx.fillStyle = "#0e3d33"; ctx.fill();
      ctx.beginPath(); ctx.moveTo(-w * 0.4, -h * 0.55); ctx.lineTo(-w * 0.5, -h * 0.72); ctx.stroke();
      ctx.fillStyle = "#ffe14d"; ctx.beginPath(); ctx.arc(-w * 0.33, -h * 0.48, 2.2, 0, 7); ctx.fill();
  }
};

PROJ_ART.bandage = function (o, w, h) {
  var pr = o.proj, cy = -h * 0.5, i, sp = t * 9 + o.ph;
    ctx.save(); ctx.translate(0, cy); ctx.rotate(sp);
    ctx.fillStyle = "#e9dcb8"; ctx.beginPath(); ctx.arc(0, 0, 13, 0, 7); ctx.fill();
    ctx.strokeStyle = "#8a7a52"; ctx.lineWidth = 2; ctx.stroke();
    for (i = -1; i <= 1; i++) { ctx.beginPath(); ctx.moveTo(-10, i * 5); ctx.lineTo(10, i * 5 + 2); ctx.stroke(); }
    ctx.restore();
    ctx.strokeStyle = "#e9dcb8"; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(14, cy); ctx.quadraticCurveTo(26, cy + 6 * Math.sin(sp), 36, cy - 2); ctx.stroke();
};

PROJ_ART.sand = function (o, w, h) {
  var pr = o.proj, cy = -h * 0.5, i, sp = t * 9 + o.ph;
    var gl = ctx.createRadialGradient(0, cy, 2, 0, cy, 17);
    gl.addColorStop(0, "#fff3b0"); gl.addColorStop(1, "rgba(242,193,78,0)");
    ctx.fillStyle = gl; ctx.fillRect(-18, cy - 18, 36, 36);
    ctx.fillStyle = "#f2c14e"; ctx.beginPath(); ctx.arc(0, cy, 11, 0, 7); ctx.fill(); ctx.strokeStyle = "#a8780a"; ctx.lineWidth = 2; ctx.stroke();
    ctx.strokeStyle = "#a8780a"; ctx.lineWidth = 2.2; ctx.beginPath(); ctx.arc(0, cy - 3, 3, 0, 7); ctx.moveTo(0, cy); ctx.lineTo(0, cy + 7); ctx.moveTo(-4, cy + 3); ctx.lineTo(4, cy + 3); ctx.stroke();
};

PROJ_ART.pyramid = function (o, w, h) {
  var pr = o.proj, cy = -h * 0.5, i, sp = t * 9 + o.ph;
    var pw = o.w, pH = Math.max(1, o.h);
    ctx.fillStyle = "#e8c27a"; ctx.beginPath(); ctx.moveTo(-pw / 2, 0); ctx.lineTo(0, -pH); ctx.lineTo(pw / 2, 0); ctx.closePath(); ctx.fill();
    ctx.fillStyle = "#c99a4e"; ctx.beginPath(); ctx.moveTo(0, -pH); ctx.lineTo(pw / 2, 0); ctx.lineTo(pw * 0.08, 0); ctx.closePath(); ctx.fill();
    ctx.strokeStyle = "#8a5f23"; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(-pw / 2, 0); ctx.lineTo(0, -pH); ctx.lineTo(pw / 2, 0); ctx.closePath(); ctx.stroke();
    ctx.lineWidth = 1.2; ctx.globalAlpha = 0.5;
    for (i = 1; i < 4; i++) { ctx.beginPath(); ctx.moveTo(-pw / 2 * (1 - i / 4), -pH * i / 4); ctx.lineTo(pw / 2 * (1 - i / 4), -pH * i / 4); ctx.stroke(); }
    ctx.globalAlpha = 1;
    ctx.fillStyle = "#ffd23f"; ctx.beginPath(); ctx.moveTo(-pw * 0.07, -pH * 0.86); ctx.lineTo(0, -pH); ctx.lineTo(pw * 0.07, -pH * 0.86); ctx.closePath(); ctx.fill();
};

BOSS_ART.mummy = function (b, w, h, white, en) {
  var T = bossTools(b, white, en), cfg = T.cfg, S = T.S, sp = T.sp, br = T.br, f1 = T.f1, f2 = T.f2, eye = T.eye, eyes = T.eyes, i;
    var sw = Math.sin(b.t * 5) * 3;
    ctx.fillStyle = f1;
    ctx.beginPath(); ctx.moveTo(-w * 0.34, 0); ctx.lineTo(-w * 0.3, -h * 0.62); ctx.lineTo(w * 0.3, -h * 0.62); ctx.lineTo(w * 0.34, 0); ctx.closePath(); ctx.fill(); ctx.stroke();
    ctx.save(); ctx.translate(-w * 0.3, -h * 0.5); ctx.rotate(sp ? -1.2 : -0.5 + sw * 0.03);
    ctx.fillRect(-w * 0.34, -5, w * 0.34, 10); ctx.strokeRect(-w * 0.34, -5, w * 0.34, 10); ctx.restore();
    ctx.beginPath(); ctx.arc(0, -h * 0.78, h * 0.22, 0, 7); ctx.fill(); ctx.stroke();
    ctx.lineWidth = 2; ctx.globalAlpha = 0.7;
    for (i = 0; i < 4; i++) { ctx.beginPath(); ctx.moveTo(-w * 0.3, -h * (0.12 + i * 0.15)); ctx.lineTo(w * 0.3, -h * (0.18 + i * 0.15)); ctx.stroke(); }
    for (i = 0; i < 3; i++) { ctx.beginPath(); ctx.moveTo(-h * 0.2, -h * (0.7 + i * 0.07)); ctx.lineTo(h * 0.2, -h * (0.74 + i * 0.07)); ctx.stroke(); }
    ctx.globalAlpha = 1;
    ctx.fillStyle = "#2a2230"; ctx.fillRect(-h * 0.17, -h * 0.84, h * 0.34, h * 0.1);
    ctx.fillStyle = eye; ctx.beginPath(); ctx.arc(-h * 0.08, -h * 0.79, 3.2, 0, 7); ctx.arc(h * 0.08, -h * 0.79, 3.2, 0, 7); ctx.fill();
    ctx.strokeStyle = f1; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(w * 0.3, -h * 0.5); ctx.quadraticCurveTo(w * 0.5, -h * 0.4 + 6 * sw / 3, w * 0.42, -h * 0.2); ctx.stroke();
};

BOSS_ART.pharaoh = function (b, w, h, white, en) {
  var T = bossTools(b, white, en), cfg = T.cfg, S = T.S, sp = T.sp, br = T.br, f1 = T.f1, f2 = T.f2, eye = T.eye, eyes = T.eyes, i;
    var up = sp ? -1 : 0;
    ctx.fillStyle = f2; ctx.beginPath(); ctx.moveTo(-w * 0.4, 0); ctx.lineTo(-w * 0.26, -h * 0.58); ctx.lineTo(w * 0.26, -h * 0.58); ctx.lineTo(w * 0.4, 0); ctx.closePath(); ctx.fill(); ctx.strokeStyle = "#1c3d73"; ctx.stroke();
    ctx.fillStyle = white ? "#fff" : "#ffd23f"; ctx.fillRect(-w * 0.04, -h * 0.58, w * 0.08, h * 0.58);
    ctx.fillStyle = f1; ctx.beginPath(); ctx.moveTo(-w * 0.3, -h * 0.6); ctx.quadraticCurveTo(0, -h * 0.4, w * 0.3, -h * 0.6); ctx.lineTo(w * 0.22, -h * 0.68); ctx.lineTo(-w * 0.22, -h * 0.68); ctx.closePath(); ctx.fill(); ctx.strokeStyle = "#a8780a"; ctx.stroke();
    [-1, 1].forEach(function (s) {
      ctx.save(); ctx.translate(s * w * 0.27, -h * 0.5); ctx.rotate(s * (0.6 + up * 1.5 + Math.sin(b.t * 3) * 0.05));
      ctx.fillStyle = "#d9a36a"; ctx.fillRect(-4, -h * 0.3, 9, h * 0.3); ctx.restore();
    });
    ctx.fillStyle = f1; ctx.beginPath(); ctx.moveTo(-w * 0.24, -h * 0.66); ctx.lineTo(-w * 0.3, -h * 0.9); ctx.lineTo(0, -h * 1.02); ctx.lineTo(w * 0.3, -h * 0.9); ctx.lineTo(w * 0.24, -h * 0.66); ctx.closePath(); ctx.fill(); ctx.strokeStyle = "#a8780a"; ctx.stroke();
    ctx.fillStyle = white ? "#fff" : "#2b5fa8";
    for (i = -2; i <= 2; i++) { if (i === 0) continue; ctx.beginPath(); ctx.moveTo(i * w * 0.045 - 3, -h * 0.97); ctx.lineTo(i * w * 0.07 - 3, -h * 0.7); ctx.lineTo(i * w * 0.07 + 3, -h * 0.7); ctx.lineTo(i * w * 0.045 + 3, -h * 0.97); ctx.closePath(); ctx.fill(); }
    ctx.fillStyle = white ? "#fff" : "#d9a36a"; ctx.beginPath(); ctx.ellipse(0, -h * 0.78, w * 0.15, h * 0.13, 0, 0, 7); ctx.fill();
    ctx.fillStyle = "#2b5fa8"; ctx.fillRect(-4, -h * 0.66, 8, h * 0.1);
    eyes(0, -h * 0.8, 3.4);
    ctx.fillStyle = white ? "#fff" : "#ffd23f"; ctx.beginPath(); ctx.moveTo(0, -h * 1.02); ctx.lineTo(-5, -h * 1.1); ctx.lineTo(5, -h * 1.1); ctx.closePath(); ctx.fill();
    if (sp) { ctx.fillStyle = "rgba(255,210,63,0.5)"; ctx.beginPath(); ctx.arc(0, -h * 1.25, 14 + 4 * Math.sin(b.t * 30), 0, 7); ctx.fill(); }
};
