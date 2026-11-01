/* Coins and dash
 * Money, coin layout (never overlaps a monster, always collectable) and the dash.
 */
"use strict";

function syncMoney() {
  $("money").textContent = money + "/" + DASH_COST;
  $("moneyWrap").classList.toggle("full", money >= DASH_COST);
}

// Coins are laid out per slime group so every one can be collected without touching a monster.
//  - over a ground slime: an arc that follows the real jump path (held jump, apex over the slime)
//  - under a flying slime: a low row you collect while ducking
//  - between groups: a ground row, only when the gap is wide enough to land, run and take off again
function placeCoins(air, grp, d) {
  var s = baseSp || speed, i;
  var x0 = grp[0].x, x1 = grp[grp.length - 1].x + grp[grp.length - 1].w, xc = (x0 + x1) / 2;
  if (Math.random() < 0.8) {
    if (air) {
      for (i = 0; i < 5; i++) coins.push({ x: xc + (i - 2) * 34, y: 18 });
    } else {
      for (i = 0; i < 5; i++) {
        var tt = JUMP_T / 2 + (i - 2) * 0.095;
        coins.push({ x: xc + (tt - JUMP_T / 2) * s, y: JV * tt - 0.5 * G * tt * tt + 33 });
      }
    }
  }
  if (Math.random() < 0.6) {
    var from = Math.max(xc + 0.36 * s + 40, x1 + 40);
    var to = x0 + s * d - 0.36 * s - 40;
    var L = to - from, n = Math.min(6, Math.floor(L / 34) + 1);
    if (n >= 3) {
      var st = from + (L - (n - 1) * 34) / 2;
      for (i = 0; i < n; i++) coins.push({ x: st + i * 34, y: 22 });
    }
  }
}

function clearField() {
  return coins.length === 0 && !obstacles.some(function (o) { return !o.spit; });
}

function startDash() {
  if (state !== "play" || dashT > 0 || money < DASH_COST) return;
  money -= DASH_COST; syncMoney();
  dashT = DASH_TIME; p.vz = 0; p.duck = false; jumpBuf = 0; shake = Math.max(shake, 0.12); Sound.dash();
  for (var i = 0; i < 12; i++) parts.push({ k: "star", x: p.x + 10, y: GROUND - p.z - 40, vx: rand(-320, 40), vy: rand(-180, 180), g: 0, life: 0, max: rand(0.3, 0.6), s: rand(4, 8), rot: rand(0, 6) });
  parts.push({ k: "txt", text: "พุ่ง!", x: p.x, y: GROUND - p.z - PH - 10, vx: 0, vy: -40, g: 0, life: 0, max: 0.9, s: 0 });
}
