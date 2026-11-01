/* Snow
 * Snow town, ghosts, snowman mini-boss, yeti that throws snowballs.
 */
"use strict";

// World 4: the snow world (snow town).
// To add a new world: copy this file, change the id, and add a <script> line in index.html (before js/main.js).

ZONES.push("snow"); ZONE_NAME.snow = "ทุ่งหิมะ";
PAL.snow = {
  l: { sky1: "#bcd5ee", sky2: "#f3f8ff", far: "#aebfd8", near: "#d4e2f2", cloud: "#ffffff", ground: "#566a8c", line: "#ffffff", pebble: "#7b90b0", plant: "#2f6a50", cap: "#ffffff", wall: "#9b7b63", roof: "#ffffff", win: "#ffd27a" },
  d: { sky1: "#0b1330", sky2: "#2d3d6c", far: "#27385e", near: "#3a4c78", cloud: "#44547f", ground: "#121a2c", line: "#cfe4ff", pebble: "#27324e", plant: "#1c4a40", cap: "#cfdcf5", wall: "#3a3556", roof: "#cfdcf5", win: "#ffd27a" }
};
KIND_BY_ZONE.snow = ["snowman", "yeti"];            // [mini-boss, big boss]
KINDS.snowman = { name: "มนุษย์หิมะ", w: 66, h: 84, c1: "#f4f9ff", c2: "#8fb0d6", proj: ["snowball", "snowball", "snowball"], darkBar: true };
KINDS.yeti = { name: "เยติยักษ์", w: 126, h: 122, c1: "#e8f1fb", c2: "#6f93c4", proj: ["snowball", "snowball", "snowball"], darkBar: true };
var snowflakes = [];
for (var sfi = 0; sfi < 44; sfi++) snowflakes.push({ x: Math.random() * 1000, y: Math.random() * 400, r: 1.2 + Math.random() * 2.2, v: 24 + Math.random() * 40, d: Math.random() * 6 });

// scenery behind the runner (a = fade, P = palette, dark = night mode)
ZONE_ART.snow = function (a, P, dark) {
  var i, x, idx;
    if (dark) tinyStars(a);
    cloudsLayer(P, a, 0.1);
    [[0.1, 124, 380, P.far], [0.22, 82, 250, P.near]].forEach(function (L) {
      for (var mi = -1; mi < W / L[2] + 2; mi++) {
        var midx = mi + Math.floor(off * L[0] / L[2]), mx = mi * L[2] - mod(off * L[0], L[2]) + L[2] * 0.5, mh = L[1] * (0.7 + 0.3 * rnd(midx + L[1])), mw = L[2] * 0.62, mb = GROUND - 8;
        ctx.fillStyle = L[3]; ctx.beginPath(); ctx.moveTo(mx - mw, mb); ctx.lineTo(mx, mb - mh); ctx.lineTo(mx + mw, mb); ctx.closePath(); ctx.fill();
        ctx.fillStyle = P.cap; ctx.beginPath(); ctx.moveTo(mx - mw * 0.26, mb - mh * 0.74); ctx.lineTo(mx, mb - mh); ctx.lineTo(mx + mw * 0.26, mb - mh * 0.74); ctx.lineTo(mx + mw * 0.1, mb - mh * 0.68); ctx.lineTo(mx - mw * 0.06, mb - mh * 0.76); ctx.closePath(); ctx.fill();
      }
    });
    hills(0.3, 8, 12, P.near, 90);
    for (i = -1; i < W / 190 + 2; i++) {
      idx = i + Math.floor(off * 0.34 / 190);
      if (rnd(idx + 21) < 0.25) continue;
      x = i * 190 - mod(off * 0.34, 190) + rnd(idx + 2) * 40;
      var hw = 54 + rnd(idx + 4) * 30, hh = 30 + rnd(idx + 6) * 18, hb = GROUND - 6;
      if (rnd(idx + 8) > 0.5) {
        ctx.fillStyle = P.wall; ctx.fillRect(x + hw * 0.7, hb - hh - 30, 8, 18);
        ctx.fillStyle = "#ffffff";
        for (var sk2 = 0; sk2 < 3; sk2++) { ctx.globalAlpha = a * (0.5 - sk2 * 0.13); ctx.beginPath(); ctx.arc(x + hw * 0.7 + 4 + Math.sin(ambT + sk2) * 3, hb - hh - 36 - sk2 * 9 - (ambT * 7) % 9, 3 + sk2, 0, 7); ctx.fill(); }
        ctx.globalAlpha = a;
      }
      ctx.fillStyle = P.wall; ctx.fillRect(x, hb - hh, hw, hh);
      ctx.fillStyle = P.roof; ctx.beginPath(); ctx.moveTo(x - 7, hb - hh + 2); ctx.lineTo(x + hw / 2, hb - hh - 26); ctx.lineTo(x + hw + 7, hb - hh + 2); ctx.closePath(); ctx.fill();
      ctx.fillStyle = P.win; ctx.fillRect(x + 9, hb - hh * 0.72, 10, 10); ctx.fillRect(x + hw - 19, hb - hh * 0.72, 10, 10);
      ctx.fillStyle = "rgba(0,0,0,0.25)"; ctx.fillRect(x + hw / 2 - 5, hb - 16, 10, 16);
    }
    for (i = -1; i < W / 230 + 2; i++) {
      idx = i + Math.floor(off * 0.65 / 230);
      if (rnd(idx + 1) < 0.3) continue;
      x = i * 230 - mod(off * 0.65, 230) + 60 + rnd(idx + 4) * 90;
      var th = 44 + rnd(idx + 7) * 28;
      ctx.fillStyle = P.plant;
      for (var tier = 0; tier < 3; tier++) {
        var ty2 = GROUND - th * (0.22 + tier * 0.28), tw = th * (0.34 - tier * 0.07);
        ctx.beginPath(); ctx.moveTo(x - tw, ty2); ctx.lineTo(x, ty2 - th * 0.42); ctx.lineTo(x + tw, ty2); ctx.closePath(); ctx.fill();
      }
      ctx.fillStyle = P.cap; ctx.beginPath(); ctx.moveTo(x - th * 0.1, GROUND - th * 0.88); ctx.lineTo(x, GROUND - th * 1.0); ctx.lineTo(x + th * 0.1, GROUND - th * 0.88); ctx.closePath(); ctx.fill();
    }
    ctx.fillStyle = "#ffffff"; ctx.globalAlpha = a * 0.85;
    snowflakes.forEach(function (f) {
      var fx = mod(f.x + Math.sin(ambT * 0.8 + f.d) * 14 - off * 0.3, W + 20) - 10, fy = mod(f.y + ambT * f.v, GROUND + 10);
      ctx.beginPath(); ctx.arc(fx, fy, f.r, 0, 7); ctx.fill();
    });
    ctx.globalAlpha = a;
};

// regular monsters: ground + flying (o.skin == "snow")
CREATURE_ART.snow = function (o, w, h, air, fl) {
  var i, sk = o.skin;
    var gw = w * 0.4, top = -h * 0.6, wav = Math.sin(t * 6 + o.ph) * 3;
    ctx.fillStyle = "rgba(200,225,255,0.28)"; ctx.beginPath(); ctx.arc(0, top, gw * 1.35, 0, 7); ctx.fill();
    ctx.beginPath(); ctx.moveTo(-gw, top); ctx.arc(0, top, gw, Math.PI, 0); ctx.lineTo(gw, -h * 0.1);
    for (i = 0; i < 3; i++) { var xa = gw - i * gw * 2 / 3, xb = xa - gw * 2 / 3; ctx.quadraticCurveTo((xa + xb) / 2, -h * 0.1 + 9 + wav * (i % 2 ? -1 : 1), xb, -h * 0.1); }
    ctx.closePath(); ctx.fillStyle = air ? "rgba(214,232,255,0.92)" : "rgba(240,247,255,0.96)"; ctx.fill(); ctx.strokeStyle = "#9db9dc"; ctx.lineWidth = 2; ctx.stroke();
    ctx.fillStyle = "#26334d";
    ctx.beginPath(); ctx.ellipse(-gw * 0.42, top + 2, 3, 4.6, 0, 0, 7); ctx.ellipse(gw * 0.1, top + 2, 3, 4.6, 0, 0, 7); ctx.fill();
    ctx.beginPath(); ctx.ellipse(-gw * 0.16, top + gw * 0.62, 4, 5.5, 0, 0, 7); ctx.fill();
    ctx.fillStyle = "rgba(255,150,170,0.5)"; ctx.beginPath(); ctx.arc(-gw * 0.62, top + gw * 0.38, 3.2, 0, 7); ctx.arc(gw * 0.3, top + gw * 0.38, 3.2, 0, 7); ctx.fill();
    ctx.fillStyle = "rgba(240,247,255,0.96)";
    [-1, 1].forEach(function (side) { ctx.save(); ctx.translate(side * gw, top + gw * 0.5); ctx.rotate(side * (0.5 + 0.3 * Math.sin(t * 7 + o.ph))); ctx.beginPath(); ctx.ellipse(side * 6, 0, 8, 4, 0, 0, 7); ctx.fill(); ctx.stroke(); ctx.restore(); });
};

PROJ_ART.snowball = function (o, w, h) {
  var pr = o.proj, cy = -h * 0.5, i, sp = t * 9 + o.ph;
    ctx.fillStyle = "#ffffff"; ctx.beginPath(); ctx.arc(0, cy, 13, 0, 7); ctx.fill();
    ctx.strokeStyle = "#9db9dc"; ctx.lineWidth = 2; ctx.stroke();
    ctx.fillStyle = "#cfe4ff"; ctx.beginPath(); ctx.arc(Math.cos(sp) * 6, cy + Math.sin(sp) * 6, 3, 0, 7); ctx.arc(Math.cos(sp + 2.4) * 7, cy + Math.sin(sp + 2.4) * 7, 2.2, 0, 7); ctx.fill();
};

BOSS_ART.snowman = function (b, w, h, white, en) {
  var T = bossTools(b, white, en), cfg = T.cfg, S = T.S, sp = T.sp, br = T.br, f1 = T.f1, f2 = T.f2, eye = T.eye, eyes = T.eyes, i;
    var bob = Math.abs(br) * 2;
    ctx.fillStyle = f1; ctx.lineWidth = 3;
    ctx.beginPath(); ctx.arc(0, -h * 0.22, h * 0.24, 0, 7); ctx.fill(); ctx.stroke();
    ctx.beginPath(); ctx.arc(0, -h * 0.55 - bob, h * 0.19, 0, 7); ctx.fill(); ctx.stroke();
    ctx.beginPath(); ctx.arc(0, -h * 0.82 - bob, h * 0.14, 0, 7); ctx.fill(); ctx.stroke();
    ctx.strokeStyle = "#6b4a2a"; ctx.lineWidth = 3;
    [-1, 1].forEach(function (s) { ctx.beginPath(); ctx.moveTo(s * h * 0.17, -h * 0.58 - bob); ctx.lineTo(s * (h * 0.4 + (sp && s < 0 ? 4 : 0)), -h * (sp && s < 0 ? 0.88 : 0.66) - bob); ctx.stroke(); });
    ctx.fillStyle = S; ctx.fillRect(-h * 0.17, -h * 0.94 - bob, h * 0.34, 4); ctx.fillRect(-h * 0.1, -h * 1.1 - bob, h * 0.2, h * 0.17);
    ctx.fillStyle = (en > 0) ? "#ff3355" : S; ctx.beginPath(); ctx.arc(-5, -h * 0.84 - bob, 2.4, 0, 7); ctx.arc(5, -h * 0.84 - bob, 2.4, 0, 7); ctx.fill();
    ctx.fillStyle = "#ff8a2b"; ctx.beginPath(); ctx.moveTo(-1, -h * 0.8 - bob); ctx.lineTo(-h * 0.2, -h * 0.76 - bob); ctx.lineTo(-1, -h * 0.76 - bob); ctx.closePath(); ctx.fill();
    ctx.fillStyle = S; for (i = 0; i < 3; i++) { ctx.beginPath(); ctx.arc(0, -h * (0.45 - i * 0.12) - bob * 0.5, 2.4, 0, 7); ctx.fill(); }
    ctx.fillStyle = "#e0463c"; ctx.fillRect(-h * 0.14, -h * 0.7 - bob, h * 0.28, 6);
};

BOSS_ART.yeti = function (b, w, h, white, en) {
  var T = bossTools(b, white, en), cfg = T.cfg, S = T.S, sp = T.sp, br = T.br, f1 = T.f1, f2 = T.f2, eye = T.eye, eyes = T.eyes, i;
    var arm = sp ? -1.9 : 0.15 + Math.sin(b.t * 3) * 0.08;
    ctx.fillStyle = f1; ctx.lineWidth = 3.5;
    ctx.beginPath(); ctx.moveTo(-w * 0.38, 0); ctx.quadraticCurveTo(-w * 0.52, -h * 0.55, -w * 0.26, -h * 0.82); ctx.lineTo(w * 0.26, -h * 0.82); ctx.quadraticCurveTo(w * 0.52, -h * 0.55, w * 0.38, 0); ctx.closePath(); ctx.fill(); ctx.stroke();
    ctx.strokeStyle = "rgba(111,147,196,0.7)"; ctx.lineWidth = 2;
    for (i = 0; i < 6; i++) { ctx.beginPath(); ctx.moveTo(-w * 0.3 + i * w * 0.12, -h * 0.4); ctx.lineTo(-w * 0.34 + i * w * 0.12, -h * 0.26); ctx.stroke(); }
    ctx.strokeStyle = cfg.c2; ctx.lineWidth = 3.5;
    ctx.save(); ctx.translate(-w * 0.34, -h * 0.66); ctx.rotate(arm);
    ctx.fillStyle = f1; ctx.beginPath(); ctx.ellipse(0, h * 0.2, w * 0.1, h * 0.26, 0, 0, 7); ctx.fill(); ctx.stroke(); ctx.restore();
    ctx.beginPath(); ctx.ellipse(w * 0.36, -h * 0.4, w * 0.1, h * 0.26, 0.15, 0, 7); ctx.fillStyle = f1; ctx.fill(); ctx.stroke();
    ctx.beginPath(); ctx.ellipse(0, -h * 0.86, w * 0.27, h * 0.19, 0, 0, 7); ctx.fillStyle = f1; ctx.fill(); ctx.stroke();
    ctx.fillStyle = white ? "#fff" : "#9fc1ea"; ctx.beginPath(); ctx.ellipse(0, -h * 0.83, w * 0.17, h * 0.12, 0, 0, 7); ctx.fill();
    ctx.fillStyle = "#fff"; ctx.strokeStyle = S; ctx.lineWidth = 1.5;
    [-1, 1].forEach(function (s) { ctx.beginPath(); ctx.moveTo(s * w * 0.06, -h * 0.76); ctx.lineTo(s * w * 0.1, -h * 0.66); ctx.lineTo(s * w * 0.02, -h * 0.75); ctx.closePath(); ctx.fill(); ctx.stroke(); });
    eyes(0, -h * 0.9, 3.6);
    ctx.strokeStyle = S; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(-w * 0.1, -h * 0.97); ctx.lineTo(-w * 0.03, -h * 0.94); ctx.moveTo(w * 0.1, -h * 0.97); ctx.lineTo(w * 0.03, -h * 0.94); ctx.stroke();
    if (sp) { ctx.fillStyle = "#fff"; ctx.strokeStyle = "#9db9dc"; ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(-w * 0.52, -h * 0.95, 14, 0, 7); ctx.fill(); ctx.stroke(); }
};
