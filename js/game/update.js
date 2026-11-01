/* Update
 * One simulation step: speed, physics, spawning, collisions, zones, bosses.
 */
"use strict";

// ----- update -----
function update(dt) {
  if (state === "play") {
    t += dt;
    var fullSp = BASE_SPEED + (MAX_SPEED - BASE_SPEED) * (1 - Math.exp(-t / RAMP));
    var target = ((boss || (bossPending && clearField())) ? Math.min(fullSp, 480) : fullSp) * K;
    baseSp += Math.max(-500 * dt, Math.min(500 * dt, target - baseSp));
    var mul = 1;
    if (dashT > 0) {
      var el = 1 - dashT / DASH_TIME;
      if (el < 0.6) mul = 1.5;
      else { var u = (el - 0.6) / 0.4; mul = 1.5 - 0.5 * u * u * (3 - 2 * u); }
    }
    speed = baseSp * mul;
    if (dashT > 0) { dashT -= dt; if (dashT <= 0) { dashT = 0; graceT = 0.35; } }
    else if (graceT > 0) graceT -= dt;
    dist += speed * dt / 40;
    var zn = Math.floor(dist / ZONE_LEN) % ZONES.length;
    if (zn !== zoneTo && !boss && !bossPending) { zoneFrom = zoneTo; zoneTo = zn; zoneBlend = 0; zoneBannerT = 2.4; }
    if (zoneBlend < 1) zoneBlend = Math.min(1, zoneBlend + dt / 1.6);
    if (zoneBannerT > 0) zoneBannerT -= dt;
    off += speed * dt;
    p.cyc += dt * (1.9 + speed / K * 0.003);
    if (p.sqT > 0) p.sqT = Math.max(0, p.sqT - dt);
    var advX = ((boss || bossPending) ? PX0 + 50 : PX0) + (dashT > 0 ? 40 : 0);
    p.x += (advX - p.x) * Math.min(1, dt * 3);
    if (throwCD > 0) throwCD -= dt;
    if (p.throwT > 0) p.throwT -= dt;
    if (bannerT > 0) bannerT -= dt;
    if (throwHeld) throwStar();
    p.duck = duckHeld && dashT <= 0;

    if (dashT > 0) { p.vz = 0; p.z += (22 - p.z) * Math.min(1, dt * 12); }
    else if (p.z > 0 || p.vz > 0) {
      p.vz -= (G + (p.duck ? FASTFALL : 0)) * dt;
      p.z += p.vz * dt;
      if (p.z <= 0) {
        p.z = 0; p.vz = 0;
        p.sqT = 0.14; p.sqK = 2;
        dustBurst(6);
        if (jumpBuf > 0) launch();
      }
    }
    if (jumpBuf > 0) jumpBuf -= dt;
    p.tilt = 0.07 + (p.z > 0 ? -Math.max(-0.18, Math.min(0.18, p.vz * 0.00018)) : 0) + 0.12 * (p.throwT > 0 ? p.throwT / 0.16 : 0) + (dashT > 0 ? 0.2 : 0);

    if (p.z === 0) { dustT -= dt; if (dustT <= 0) { dustT = 0.09; dustBurst(1); } }
    starT -= dt;
    if (starT <= 0) { starT = dashT > 0 ? 0.02 : Math.max(0.05, 0.24 - (speed / K - 360) / 5000); trail(); }

    if (!bossPending && !boss) {
      spawnTimer -= dt;
      if (spawnTimer <= 0) spawn();
    }
    for (var i = obstacles.length - 1; i >= 0; i--) {
      var oo = obstacles[i];
      if (oo.pyr) {
        oo.x -= speed * dt;
        if (oo.pre) {
          oo.pre.t += dt;
          if (oo.pre.t >= oo.pre.dur) { oo.pre = null; shake = Math.max(shake, 0.12); for (var qi = 0; qi < 8; qi++) parts.push({ k: "dust", x: oo.x + oo.w / 2, y: GROUND - 2, vx: rand(-160, 160), vy: rand(-110, -20), g: 0, life: 0, max: rand(0.3, 0.5), s: rand(3, 7) }); }
        } else { oo.riseT += dt; oo.h = oo.hFull * Math.min(1, oo.riseT / 0.18); }
      } else if (oo.spit) {
        if (oo.fall) {
          oo.fall.t += dt;
          var ff = Math.min(1, oo.fall.t / oo.fall.dur);
          oo.lift = oo.fall.h0 * (1 - ff * ff);
          if (ff >= 1) {
            oo.fall = null; oo.lift = 0; oo.tgt = 0; oo.age = 1; shake = Math.max(shake, 0.1);
            for (var di = 0; di < 7; di++) parts.push({ k: "dust", x: oo.x + 16, y: GROUND - 2, vx: rand(-140, 140), vy: rand(-90, -20), g: 0, life: 0, max: rand(0.3, 0.5), s: rand(3, 6) });
          }
        } else {
          oo.age += dt;
          var u = Math.min(1, oo.age / 0.25);
          oo.lift = 20 + (oo.tgt - 20) * (1 - Math.pow(1 - u, 2));
          oo.x -= oo.vx * dt;
        }
      } else oo.x -= speed * dt;
      if (oo.x + oo.w < -20) obstacles.splice(i, 1);
    }
    if (!boss && !bossPending) { var nb = nextBossInfo(); if (dist >= nb.at) { bossPending = true; pendingMini = nb.mini; bannerT = 2.4; Sound.warn(); } }
    if (bossPending && !boss && clearField()) spawnBoss();
    if (boss) updateBoss(dt);
    updateShots(dt);

    // collision
    var ph = p.duck ? 34 : 66;
    var bx = p.x + PH * AR * 0.1 - 16, bw = 32;
    var by = GROUND - p.z - ph, bh = ph;
    for (var n = 0; n < obstacles.length; n++) {
      var o = obstacles[n];
      if (o.pre || (o.pyr && o.h < 10)) continue;
      var ob = slimeBottom(o);
      var ox = o.x + (o.pyr ? o.w * 0.2 : 5), ow = o.pyr ? o.w * 0.6 : o.w - 10, oy = ob - o.h + 4, oh = o.h - 6;
      if (bx < ox + ow && bx + bw > ox && by < oy + oh && by + bh > oy) {
        if (dashT > 0) { popBlob(o); obstacles.splice(n, 1); n--; shake = Math.max(shake, 0.08); }
        else if (graceT <= 0) { endGame(); break; }
      }
    }

    for (var ci = coins.length - 1; ci >= 0; ci--) {
      var c = coins[ci];
      c.x -= speed * dt;
      var cy = GROUND - c.y;
      if (c.x > bx - 14 && c.x < bx + bw + 14 && cy > by - 12 && cy < by + bh + 12) {
        Sound.coin();
        if (money < DASH_COST) { money = Math.min(DASH_COST, money + COIN_VALUE); syncMoney(); }
        for (var q = 0; q < 3; q++) parts.push({ k: "star", x: c.x, y: cy, vx: rand(-90, 90), vy: rand(-140, -20), g: 300, life: 0, max: 0.35, s: rand(2.5, 4.5), rot: rand(0, 6) });
        coins.splice(ci, 1);
      } else if (c.x < -20) coins.splice(ci, 1);
    }

    var s = Math.floor(dist);
    if (s !== lastScore) { lastScore = s; $("score").textContent = s; }
    var m = Math.floor(s / 100);
    if (m > milestone) { milestone = m; celebrate(m * 100); }
    var sp = (speed / (BASE_SPEED * K)).toFixed(1);
    if (sp !== lastSp) { lastSp = sp; $("spd").textContent = "×" + sp; }
  } else if (state === "ready") {
    off += 90 * dt;
    p.cyc += dt * 1.4;
  } else if (state === "over") {
    p.tOver += dt;
    p.tilt = -1.35 * Math.min(1, p.tOver / 0.4);
    if (p.z > 0 || p.vz > 0) {
      p.vz -= G * dt; p.z += p.vz * dt;
      if (p.z <= 0) { p.z = 0; p.vz = 0; dustBurst(8); shake = 0.12; }
    }
    p.x += p.vx * dt; p.vx *= Math.pow(0.03, dt);
    if (!overShown && performance.now() - diedAt > 700) { overShown = true; overlay.hidden = false; }
  }
}
var lastScore = -1, lastSp = "";
