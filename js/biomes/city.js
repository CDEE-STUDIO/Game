/* City (first world)
 * Zombies. Uses the CSS tokens for colour.
 */
"use strict";

// World 1: the city. Crawling zombies + flying zombie heads; the big zombie throws rocks high and low in turns.
// To add a new world: copy this file, change the id, and add a <script> line in index.html (before js/main.js).

ZONES.push("city"); ZONE_NAME.city = "กลางเมือง";
KIND_BY_ZONE.city = ["zombie", "zombie"];            // [mini-boss, big boss]
KINDS.zombie = { name: "ซอมบี้", big: "ซอมบี้ยักษ์", ms: 0.62, w: 104, h: 128, c1: "#8fbf6a", c2: "#3d5a2a", proj: ["rock", "rock", "rock"], size: [40, 36], alternate: true, rainLabel: "ฝนหิน!" };

// scenery behind the runner (a = fade, P = palette, dark = night mode)
ZONE_ART.city = function (a, P, dark) {
  var i, x, idx;
    ctx.fillStyle = C.star; ctx.globalAlpha = a * 0.55;
    stars.forEach(function (s) { var sx = mod(s.x - off * 0.04, W + 40) - 20; starPath(sx, s.y, s.r); ctx.fill(); });
    ctx.globalAlpha = a;
    cloudsLayer(P, a, 0.12);
    var layers = [[0.16, 150, 64, 110, P.far, 0.5], [0.3, 110, 46, 80, P.near, 1]];
    layers.forEach(function (ly, li) {
      var sp = ly[0], cell = ly[1];
      for (i = -1; i < W / cell + 2; i++) {
        idx = i + Math.floor(off * sp / cell);
        var r1 = rnd(idx * 3 + li * 50 + 7);
        if (r1 < 0.1) continue;
        var bw = cell * (0.55 + rnd(idx + 31 + li) * 0.35), bh = ly[2] + rnd(idx + 13 + li * 9) * ly[3];
        x = i * cell - mod(off * sp, cell) + 8;
        ctx.fillStyle = ly[4]; ctx.fillRect(x, GROUND - 8 - bh, bw, bh + 8);
        if (r1 > 0.75) { ctx.fillRect(x + bw * 0.46, GROUND - 8 - bh - 18, 3, 18); }
        else if (r1 > 0.5) { ctx.fillRect(x + 4, GROUND - 8 - bh - 6, bw - 8, 6); }
        ctx.fillStyle = dark ? "rgba(255,214,120," + (0.75 * ly[5]) + ")" : "rgba(255,255,255," + (0.6 * ly[5]) + ")";
        var cols = Math.max(2, Math.floor(bw / 16));
        for (var cy = 0; cy < Math.floor(bh / 18); cy++) for (var cx = 0; cx < cols; cx++) {
          if (rnd(idx * 7 + cy * 3 + cx + li * 91) < (dark ? 0.45 : 0.25)) continue;
          ctx.fillRect(x + 5 + cx * ((bw - 8) / cols), GROUND - 8 - bh + 8 + cy * 18, 6, 8);
        }
      }
    });
};

// regular monsters: ground + flying (o.skin == "city")
CREATURE_ART.city = function (o, w, h, air, fl) {
  var i, sk = o.skin;
    var sk1 = "#8fbf6a", sk2 = "#3d5a2a", cl = "#6b5b7b";
    if (!air) {                                          // crawling zombie
      var cr = Math.sin(t * 9 + o.ph);
      ctx.strokeStyle = sk1; ctx.lineWidth = 5;
      ctx.beginPath(); ctx.moveTo(w * 0.22, -h * 0.3); ctx.lineTo(w * 0.5, -h * 0.1 - cr * 2); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(w * 0.18, -h * 0.4); ctx.lineTo(w * 0.46, -h * 0.28 + cr * 2); ctx.stroke();
      ctx.fillStyle = cl; ctx.strokeStyle = "#3a2f47"; ctx.lineWidth = 2;
      ctx.beginPath(); ctx.ellipse(w * 0.1, -h * 0.42, w * 0.3, h * 0.27, -0.12, 0, 7); ctx.fill(); ctx.stroke();
      ctx.fillStyle = sk1; ctx.beginPath(); ctx.moveTo(w * 0.0, -h * 0.58); ctx.lineTo(w * 0.1, -h * 0.5); ctx.lineTo(w * 0.04, -h * 0.4); ctx.closePath(); ctx.fill();
      ctx.strokeStyle = sk1; ctx.lineWidth = 5;
      ctx.beginPath(); ctx.moveTo(-w * 0.12, -h * 0.42); ctx.lineTo(-w * 0.36, -h * 0.32 + cr * 3); ctx.lineTo(-w * 0.5, -h * 0.5 + cr * 3); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(-w * 0.14, -h * 0.5); ctx.lineTo(-w * 0.3, -h * 0.62 - cr * 3); ctx.lineTo(-w * 0.46, -h * 0.68 - cr * 3); ctx.stroke();
      ctx.fillStyle = sk1; ctx.strokeStyle = sk2; ctx.lineWidth = 2;
      ctx.beginPath(); ctx.arc(-w * 0.2, -h * 0.68, h * 0.24, 0, 7); ctx.fill(); ctx.stroke();
      ctx.fillStyle = "#e7e2b8"; ctx.beginPath(); ctx.arc(-w * 0.27, -h * 0.72, 3.6, 0, 7); ctx.fill();
      ctx.fillStyle = "#1a1a22"; ctx.beginPath(); ctx.arc(-w * 0.28, -h * 0.72, 1.6, 0, 7); ctx.arc(-w * 0.13, -h * 0.72, 2.6, 0, 7); ctx.fill();
      ctx.fillStyle = "#3a0d1e"; ctx.beginPath(); ctx.ellipse(-w * 0.24, -h * 0.58, 5, 2.6, 0, 0, 7); ctx.fill();
      ctx.strokeStyle = "#3d5a2a"; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(-w * 0.28, -h * 0.9); ctx.lineTo(-w * 0.22, -h * 0.96); ctx.moveTo(-w * 0.2, -h * 0.92); ctx.lineTo(-w * 0.14, -h * 0.97); ctx.stroke();
    } else {                                             // flying zombie head
      var fl2 = Math.sin(t * 16 + o.ph);
      ctx.fillStyle = "rgba(90,70,110,0.85)";
      [-1, 1].forEach(function (side) { ctx.save(); ctx.translate(side * w * 0.12, -h * 0.72); ctx.rotate(side * (0.5 + 0.5 * fl2)); ctx.beginPath(); ctx.ellipse(side * 15, 0, 17, 6, 0, 0, 7); ctx.fill(); ctx.restore(); });
      ctx.fillStyle = sk1; ctx.strokeStyle = sk2; ctx.lineWidth = 2.5;
      ctx.beginPath(); ctx.ellipse(0, -h * 0.45, w * 0.36, h * 0.38, 0, 0, 7); ctx.fill(); ctx.stroke();
      ctx.fillStyle = "#6a8a46"; ctx.beginPath(); ctx.ellipse(w * 0.14, -h * 0.64, 6, 4, 0.4, 0, 7); ctx.fill();
      ctx.fillStyle = "#e7e2b8"; ctx.beginPath(); ctx.arc(-w * 0.14, -h * 0.52, 5.2, 0, 7); ctx.fill();
      ctx.fillStyle = "#1a1a22"; ctx.beginPath(); ctx.arc(-w * 0.16, -h * 0.51, 2.2, 0, 7); ctx.arc(w * 0.1, -h * 0.52, 3.4, 0, 7); ctx.fill();
      ctx.fillStyle = "#3a0d1e"; ctx.beginPath(); ctx.ellipse(-w * 0.02, -h * 0.26, 8, 4, 0, 0, 7); ctx.fill();
      ctx.fillStyle = "#e7e2b8"; ctx.fillRect(-w * 0.08, -h * 0.3, 3, 3); ctx.fillRect(w * 0.04, -h * 0.3, 3, 3);
      ctx.strokeStyle = sk2; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(-w * 0.1, -h * 0.8); ctx.lineTo(-w * 0.04, -h * 0.9); ctx.moveTo(w * 0.04, -h * 0.82); ctx.lineTo(w * 0.1, -h * 0.9); ctx.stroke();
    }
};

PROJ_ART.rock = function (o, w, h) {
  var pr = o.proj, cy = -h * 0.5, i, sp = t * 9 + o.ph;
    ctx.save(); ctx.translate(0, cy); ctx.rotate(t * 6 + o.ph);
    ctx.fillStyle = "#8a8794"; ctx.beginPath();
    var rr = 20;
    for (i = 0; i < 9; i++) { var an = i / 9 * 6.283, rv = rr * (0.82 + 0.18 * ((i * 37 + 11) % 5) / 4); ctx.lineTo(Math.cos(an) * rv, Math.sin(an) * rv); }
    ctx.closePath(); ctx.fill(); ctx.strokeStyle = "#4b4858"; ctx.lineWidth = 2.5; ctx.stroke();
    ctx.fillStyle = "rgba(255,255,255,0.25)"; ctx.beginPath(); ctx.ellipse(-5, -6, 6, 4, -0.5, 0, 7); ctx.fill();
    ctx.strokeStyle = "#4b4858"; ctx.lineWidth = 1.6; ctx.beginPath(); ctx.moveTo(-2, -2); ctx.lineTo(4, 5); ctx.lineTo(1, 10); ctx.moveTo(4, 5); ctx.lineTo(10, 3); ctx.stroke();
    ctx.restore();
    return;
};

BOSS_ART.zombie = function (b, w, h, white, en) {
  var T = bossTools(b, white, en), cfg = T.cfg, S = T.S, sp = T.sp, br = T.br, f1 = T.f1, f2 = T.f2, eye = T.eye, eyes = T.eyes, i;
    var lur = Math.sin(b.t * 3.4), arm = sp ? -2.3 : 0.3 + lur * 0.12, sk1b = white ? "#fff" : cfg.c1;
    var legs = Math.sin(b.t * 4) * 3;
    ctx.fillStyle = white ? "#fff" : "#4a4466"; ctx.strokeStyle = "#2c2842"; ctx.lineWidth = 3;
    ctx.fillRect(-w * 0.26, -h * 0.34, w * 0.2, h * 0.34 + legs * 0.3); ctx.strokeRect(-w * 0.26, -h * 0.34, w * 0.2, h * 0.34 + legs * 0.3);
    ctx.fillRect(w * 0.04, -h * 0.34, w * 0.2, h * 0.34 - legs * 0.3); ctx.strokeRect(w * 0.04, -h * 0.34, w * 0.2, h * 0.34 - legs * 0.3);
    ctx.fillStyle = white ? "#fff" : "#2a2736"; ctx.fillRect(-w * 0.3, -h * 0.04, w * 0.26, h * 0.04); ctx.fillRect(w * 0.02, -h * 0.04, w * 0.26, h * 0.04);
    ctx.fillStyle = white ? "#fff" : "#7d6aa0"; ctx.beginPath(); ctx.moveTo(-w * 0.32, -h * 0.34); ctx.lineTo(-w * 0.28, -h * 0.78); ctx.lineTo(w * 0.24, -h * 0.76); ctx.lineTo(w * 0.32, -h * 0.34); ctx.closePath(); ctx.fill(); ctx.stroke();
    ctx.fillStyle = sk1b; ctx.beginPath(); ctx.moveTo(-w * 0.1, -h * 0.76); ctx.lineTo(0, -h * 0.55); ctx.lineTo(w * 0.1, -h * 0.76); ctx.closePath(); ctx.fill();
    ctx.strokeStyle = "#5b4a7a"; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(-w * 0.2, -h * 0.5); ctx.lineTo(-w * 0.14, -h * 0.42); ctx.lineTo(-w * 0.2, -h * 0.36); ctx.moveTo(w * 0.16, -h * 0.5); ctx.lineTo(w * 0.1, -h * 0.44); ctx.stroke();
    ctx.strokeStyle = cfg.c2; ctx.lineWidth = 3;
    ctx.save(); ctx.translate(w * 0.28, -h * 0.7); ctx.rotate(-0.15 - lur * 0.05);
    ctx.fillStyle = sk1b; ctx.beginPath(); ctx.ellipse(w * 0.04, h * 0.2, w * 0.09, h * 0.22, 0, 0, 7); ctx.fill(); ctx.stroke(); ctx.restore();
    ctx.save(); ctx.translate(-w * 0.3, -h * 0.7); ctx.rotate(arm);
    ctx.fillStyle = sk1b; ctx.beginPath(); ctx.ellipse(-w * 0.04, h * 0.2, w * 0.09, h * 0.22, 0, 0, 7); ctx.fill(); ctx.stroke();
    if (sp || (b.atkT < 0.5 && b.mode === "fight" && !b.queue.length)) { ctx.fillStyle = "#8a8794"; ctx.strokeStyle = "#4b4858"; ctx.beginPath(); ctx.arc(-w * 0.04, h * 0.44, w * 0.14, 0, 7); ctx.fill(); ctx.stroke(); }
    ctx.restore();
    ctx.strokeStyle = cfg.c2; ctx.lineWidth = 3; ctx.fillStyle = sk1b;
    ctx.beginPath(); ctx.arc(-w * 0.04, -h * 0.9, w * 0.2, 0, 7); ctx.fill(); ctx.stroke();
    ctx.fillStyle = white ? "#fff" : "#2f3a22"; ctx.beginPath(); ctx.moveTo(-w * 0.24, -h * 0.95); ctx.lineTo(-w * 0.2, -h * 1.1); ctx.lineTo(-w * 0.12, -h * 1.0); ctx.lineTo(-w * 0.04, -h * 1.13); ctx.lineTo(w * 0.04, -h * 1.0); ctx.lineTo(w * 0.12, -h * 1.08); ctx.lineTo(w * 0.15, -h * 0.94); ctx.closePath(); ctx.fill();
    ctx.fillStyle = "#e7e2b8"; ctx.beginPath(); ctx.arc(-w * 0.13, -h * 0.9, w * 0.055, 0, 7); ctx.fill(); ctx.lineWidth = 2; ctx.strokeStyle = S; ctx.stroke();
    ctx.fillStyle = eye; ctx.beginPath(); ctx.arc(-w * 0.14, -h * 0.9, w * 0.028, 0, 7); ctx.fill();
    ctx.fillStyle = (en > 0) ? "#ff3355" : "#1a1a22"; ctx.beginPath(); ctx.arc(w * 0.07, -h * 0.9, w * 0.04, 0, 7); ctx.fill();
    ctx.strokeStyle = "#e7e2b8"; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(w * 0.1, -h * 0.86); ctx.lineTo(w * 0.1, -h * 0.76); ctx.stroke();
    ctx.fillStyle = "#3a0d1e"; ctx.beginPath(); ctx.ellipse(-w * 0.06, -h * 0.8, w * 0.08, sp ? h * 0.05 : h * 0.025, 0, 0, 7); ctx.fill();
    ctx.fillStyle = "#e7e2b8"; ctx.fillRect(-w * 0.1, -h * 0.82, 3, 4); ctx.fillRect(-w * 0.03, -h * 0.82, 3, 4);
};
