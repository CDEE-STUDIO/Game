/* Boss logic
 * When bosses appear, how they attack, how they take damage. Boss looks/stats live in js/biomes/*.js.
 */
"use strict";

function miniScore(k) { return MINI_FIRST + MINI_EVERY * k; }
function nextBossInfo() {
  var bs = bossScore(bossIdx), ms = miniScore(miniIdx);
  return ms < bs ? { mini: true, at: ms } : { mini: false, at: bs };
}
function showNextBoss() { $("nextBoss").textContent = nextBossInfo().at; }
function bossScore(n) { return n === 0 ? 1000 : n === 1 ? 5000 : 10000 * (n - 1); }
function bossBottom(b) { return GROUND - (b.cfg.fly ? 22 + Math.sin(b.t * 2.2) * 10 : 0); }

function spawnBoss() {
  var mini = pendingMini, n = mini ? miniIdx : bossIdx, tier, cfg, hp;
  if (mini) {
    // mini-boss: smaller, quicker to appear, and a bit tougher every time
    var pal = MINI_PAL[n % MINI_PAL.length];
    tier = 3;
    cfg = { name: "มินิบอส Lv." + (n + 1), hp: Math.min(45, 6 + 3 * n), w: 74, h: 60, c1: pal[0], c2: pal[1],
            gap: Math.max(1.0, 1.55 - 0.05 * n), sp: Math.min(480, 360 + 12 * n), fly: false };
    hp = cfg.hp;
  } else {
    tier = Math.min(n, 2); cfg = BOSSES[tier];
    hp = cfg.hp + (n > 2 ? (n - 2) * 15 : 0);
  }
  var kz = KIND_BY_ZONE[ZONES[zoneTo]], kind = kz ? kz[mini ? 0 : 1] : "slime";
  if (kz) {
    var kd = KINDS[kind];
    cfg = { name: mini ? kd.name + " Lv." + (n + 1) : (kd.big || kd.name), hp: cfg.hp, w: mini ? kd.w * (kd.ms || 0.95) : kd.w, h: mini ? kd.h * (kd.ms || 0.95) : kd.h, c1: kd.c1, c2: kd.c2,
            gap: cfg.gap, sp: cfg.sp, fly: false };
  }
  var sc = K < 1 ? 0.78 : 1;
  boss = { kind: kind, n: n, tier: tier, mini: mini, cfg: cfg, hp: hp, max: hp, w: cfg.w * sc, h: cfg.h * sc, x: W + 160, mode: "enter",
           atkT: 1.4, queue: [], qT: 0, fightT: 0, last: "", enr: 0, flash: 0, hitT: 0, spitT: 0, t: 0, dead: false, deadT: 0 };
}

// How strong a boss is decides which attacks it knows. Anger grows as its health drops.
function bossPower(b) { return b.mini ? 1 + 0.5 * b.n : [2.5, 4, 5][b.tier] + Math.max(0, b.n - 2) * 0.5; }
function enrageLv(b) { var r = b.hp / b.max; return r <= 0.25 ? 2 : r <= 0.5 ? 1 : 0; }

function summon(b, lx, proj, ph) {
  b.spitT = 0.35;
  var pw = proj === "pyramid" ? 44 + (ph - 36) * 0.4 : 26;
  obstacles.push({ type: "g", spit: true, pyr: true, proj: proj, x: lx, w: pw, h: 0, hFull: ph, lift: 0, tgt: 0, age: 1, riseT: 0,
                   pre: { t: 0, dur: proj === "pyramid" ? 0.75 : 0.6 }, vx: 0, ph: rand(0, 6), c1: b.cfg.c1, c2: b.cfg.c2 });
}
function spit(b, lane) {
  var kp = KINDS[b.kind];
  if (kp && kp.groundSummon && lane === "L") { summon(b, rand(p.x + 150, Math.max(p.x + 180, b.x - 20)), kp.groundSummon.proj, kp.groundSummon.h); return; }
  b.spitT = 0.25;
  var sz = (kp && kp.size) || [32, 28];
  obstacles.push({ type: "a", spit: true, proj: kp ? kp.proj[lane === "H" ? 1 : 0] : "blob", x: b.x + 6, w: sz[0], h: sz[1], lift: 20, tgt: lane === "H" ? 50 : 0, age: 0,
                   vx: b.cfg.sp * K * (1 + 0.1 * enrageLv(b)), ph: rand(0, 6), c1: b.cfg.c1 === "#2c2552" ? "#7b3fd1" : b.cfg.c1, c2: b.cfg.c2 });
}

// a slime that drops from the sky onto a marked spot, then rolls toward the player
function dropSlime(b, lx) {
  b.spitT = 0.25;
  var kq = KINDS[b.kind], sz = (kq && kq.size) || [32, 28];
  obstacles.push({ type: "a", spit: true, proj: kq ? kq.proj[2] : "blob", x: lx, w: sz[0], h: sz[1], lift: GROUND + 40, tgt: 0, age: 0, fall: { t: 0, dur: 0.55, h0: GROUND + 40 },
                   vx: b.cfg.sp * K * (1 + 0.1 * enrageLv(b)), ph: rand(0, 6), c1: b.cfg.c1 === "#2c2552" ? "#7b3fd1" : b.cfg.c1, c2: b.cfg.c2 });
}

function planAttack(b) {
  var P = bossPower(b), e = enrageLv(b), kd = KINDS[b.kind] || {}, lane = Math.random() < 0.5 ? "L" : "H", opp;
  if (kd.alternate) lane = b.lastLane === "L" ? "H" : "L";   // this boss always swaps high / low
  opp = lane === "L" ? "H" : "L";
  var opts = [["single", kd.pyr ? 2 : 5]];
  if (kd.pyr) opts.push(["pyr", 6 + 2 * e]);                // summons pyramids
  if (P >= 1.5) opts.push(["double", 2 + e]);
  if (P >= 2) opts.push(["cross", 2 + e]);
  if (P >= 2.5) opts.push(["rain", 2 + e]);
  if (P >= 3.5) opts.push(["burst", 2 + e]);
  var sum = 0, i;
  opts.forEach(function (o) { if (o[0] === b.last && o[0] !== "single") o[1] *= 0.3; sum += o[1]; });
  var pick = Math.random() * sum, kind = "single";
  for (i = 0; i < opts.length; i++) { pick -= opts[i][1]; if (pick <= 0) { kind = opts[i][0]; break; } }
  var seq;
  if (kind === "double") seq = [{ at: 0, h: lane }, { at: 0.22, h: lane }];
  else if (kind === "cross") seq = [{ at: 0, h: lane }, { at: 0.95, h: opp }];
  else if (kind === "burst") seq = [{ at: 0, h: "L" }, { at: 0.15, h: "L" }, { at: 0.3, h: "L" }];
  else if (kind === "rain") {
    var lo = p.x + 110, hi = Math.max(lo + 30, b.x - 40), lx = lo + Math.random() * (hi - lo), n = P >= 4.5 ? 3 : 2;
    seq = []; for (i = 0; i < n; i++) seq.push({ at: i * 1.0, drop: true, lx: lx });
  } else if (kind === "pyr") {
    var pn = 1 + (e >= 1 ? 1 : 0) + (e >= 2 ? 1 : 0), plo = p.x + 150, phi = Math.max(plo + 30, b.x - 30);
    seq = [];
    for (i = 0; i < pn; i++) { var rr = Math.random(); seq.push({ at: i * 1.1, pyr: true, lx: plo + Math.random() * (phi - plo), ph: rr < 0.38 ? 36 : rr < 0.76 ? 56 : 80 }); }
  } else seq = [{ at: 0, h: lane }];
  b.queue = seq; b.qT = 0; b.last = kind;
  for (i = seq.length - 1; i >= 0; i--) if (seq[i].h) { b.lastLane = seq[i].h; break; }
  if (ATK_LABEL[kind]) parts.push({ k: "txt", text: (kind === "rain" && kd.rainLabel) || ATK_LABEL[kind], x: b.x + b.w / 2, y: bossBottom(b) - b.h * 1.5 - 8, vx: 0, vy: -16, g: 0, life: 0, max: 0.9, s: 0 });
  // attacks come faster the longer the fight lasts and the angrier the boss gets
  var calm = (b.cfg.gap + 0.5) * (1 - Math.min(0.25, 0.006 * b.fightT)) * (e === 2 ? 0.65 : e === 1 ? 0.82 : 1);
  b.atkT = seq[seq.length - 1].at + Math.max(0.9, calm) + (kind === "rain" ? 0.6 : 0) + (kind === "pyr" ? 0.8 : 0);
}

function throwStar() {
  if (state !== "play" || throwCD > 0 || !(boss || bossPending)) return;
  throwCD = 0.28; p.throwT = 0.16; Sound.toss();
  shots.push({ x: p.x + 28, y: GROUND - p.z - (p.duck ? 22 : 50), vx: 820, rot: 0 });
  for (var i = 0; i < 3; i++) parts.push({ k: "star", x: p.x + 30, y: GROUND - p.z - (p.duck ? 22 : 50), vx: rand(60, 200), vy: rand(-90, 90), g: 0, life: 0, max: 0.25, s: rand(2, 4), rot: rand(0, 6) });
}

function popBlob(o) {
  Sound.pop();
  for (var i = 0; i < 8; i++) parts.push({ k: "blob", col: o.c1 || (o.type === "a" ? C.fly : C.slime), x: o.x + o.w / 2, y: slimeBottom(o) - o.h / 2, vx: rand(-160, 160), vy: rand(-200, 60), g: 700, life: 0, max: rand(0.3, 0.5), s: rand(2.5, 5) });
}

function hitBoss(b, sx, sy) {
  b.hp -= 1; b.flash = 0.1; b.hitT = 0.12; Sound.hit();
  var en = enrageLv(b);
  if (en > b.enr && b.hp > 0) {
    b.enr = en; shake = Math.max(shake, 0.2); Sound.warn();
    parts.push({ k: "txt", text: en === 2 ? "บอสโกรธสุดขีด!" : "บอสโกรธ!", x: b.x + b.w / 2, y: bossBottom(b) - b.h * 1.5 - 8, vx: 0, vy: -20, g: 0, life: 0, max: 1.2, s: 0 });
  }
  for (var i = 0; i < 4; i++) parts.push({ k: "star", x: sx, y: sy, vx: rand(-200, 60), vy: rand(-200, 200), g: 0, life: 0, max: rand(0.25, 0.45), s: rand(3, 6), rot: rand(0, 6) });
  if (b.hp <= 0) {
    b.dead = true; b.deadT = 0; shake = 0.35; Sound.win();
    for (var j = obstacles.length - 1; j >= 0; j--) if (obstacles[j].spit) { popBlob(obstacles[j]); obstacles.splice(j, 1); }
  }
}

function finishBoss() {
  var b = boss, bonus = b.mini ? 50 + 10 * b.n : (b.tier + 1) * 100;
  dist += bonus;
  parts.push({ k: "txt", text: (b.mini ? "มินิบอสแพ้! +" : "บอสแพ้! +") + bonus, x: b.x + b.w / 2, y: GROUND - b.h - 10, vx: 0, vy: -40, g: 0, life: 0, max: 1.6, s: 0 });
  if (b.mini) miniIdx++; else bossIdx++;
  boss = null; bossPending = false; pendingMini = false; spawnTimer = 1.8;
  showNextBoss();
}

function updateBoss(dt) {
  var b = boss; b.t += dt;
  if (b.flash > 0) b.flash -= dt;
  if (b.hitT > 0) b.hitT -= dt;
  if (b.spitT > 0) b.spitT -= dt;
  if (b.dead) {
    b.deadT += dt;
    if (Math.random() < 0.6) {
      parts.push({ k: "blob", col: b.cfg.c1, x: b.x + rand(0, b.w), y: bossBottom(b) - rand(0, b.h), vx: rand(-120, 120), vy: rand(-220, -40), g: 700, life: 0, max: rand(0.4, 0.7), s: rand(3, 7) });
      parts.push({ k: "star", x: b.x + rand(0, b.w), y: bossBottom(b) - rand(0, b.h), vx: rand(-150, 150), vy: rand(-250, -50), g: 400, life: 0, max: rand(0.5, 0.9), s: rand(4, 8), rot: rand(0, 6) });
    }
    if (b.deadT > 0.95) finishBoss();
    return;
  }
  var tx = W - b.w - RPAD;
  if (b.mode === "enter") { b.x -= 260 * dt; if (b.x <= tx) { b.x = tx; b.mode = "fight"; } return; }
  b.fightT += dt; b.atkT -= dt;
  if (!b.queue.length && b.atkT <= 0) planAttack(b);
  if (b.queue.length) {
    b.qT += dt;
    while (b.queue.length && b.queue[0].at <= b.qT) { var it = b.queue.shift(); if (it.drop) dropSlime(b, it.lx); else if (it.pyr) summon(b, it.lx, "pyramid", it.ph); else spit(b, it.h); }
  }
}

function updateShots(dt) {
  for (var i = shots.length - 1; i >= 0; i--) {
    var s = shots[i], gone = false;
    s.x += s.vx * dt; s.rot += 14 * dt;
    if (Math.random() < 0.5) parts.push({ k: "star", x: s.x - 8, y: s.y, vx: -60, vy: rand(-30, 30), g: 0, life: 0, max: 0.22, s: rand(2, 3.5), rot: rand(0, 6) });
    if (s.x > W + 20) gone = true;
    if (!gone && boss && !boss.dead) {
      var bb = bossBottom(boss);
      if (s.x + 8 > boss.x + 6 && s.x - 8 < boss.x + boss.w - 6 && s.y + 10 > bb - boss.h && s.y - 10 < bb) { hitBoss(boss, s.x, s.y); gone = true; }
    }
    if (!gone) {
      for (var j = obstacles.length - 1; j >= 0; j--) {
        var o = obstacles[j];
        if (!o.spit || o.pre) continue;
        var ob = slimeBottom(o);
        if (o.pyr) { if (s.x + 8 > o.x && s.x - 8 < o.x + o.w && s.y + 8 > ob - o.h) { gone = true; break; } continue; }
        if (s.x + 8 > o.x && s.x - 8 < o.x + o.w && s.y + 8 > ob - o.h && s.y - 8 < ob) { popBlob(o); obstacles.splice(j, 1); gone = true; break; }
      }
    }
    if (gone) shots.splice(i, 1);
  }
}
