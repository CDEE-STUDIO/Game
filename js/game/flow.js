/* Run flow
 * reset / start / game over.
 */
"use strict";

function reset() {
  obstacles = []; dist = 0; speed = BASE_SPEED * K; t = 0; spawnTimer = 1.2; firstSpawn = true;
  p.z = 0; p.vz = 0; p.duck = false; p.tilt = 0; jumpBuf = 0;
  zoneTo = 0; zoneFrom = 0; zoneBlend = 1; zoneBannerT = 0;
  baseSp = speed; money = 0; coins = []; dashT = 0; graceT = 0; coinT = 1.5; syncMoney();
  p.x = PX0; p.vx = 0; p.sqT = 0; p.tOver = 0; parts = []; shake = 0; milestone = 0; overShown = false;
  shots = []; boss = null; bossIdx = 0; miniIdx = 0; pendingMini = false; bossPending = false; bannerT = 0; throwCD = 0; throwHeld = false; p.throwT = 0;
  showNextBoss();
}

function startGame() {
  reset();
  state = "play";
  overlay.hidden = true;
}

function endGame() {
  state = "over";
  throwHeld = false;
  Sound.die();
  diedAt = performance.now();
  p.vz = Math.max(p.vz, 0) + 480; p.vx = -240; p.tOver = 0; shake = 0.25;
  for (var i = 0; i < 10; i++) parts.push({ k: "star", x: p.x, y: GROUND - p.z - 40, vx: rand(-260, 260), vy: rand(-320, -60), g: 900, life: 0, max: rand(0.5, 0.9), s: rand(4, 8), rot: rand(0, 6) });
  var sc = Math.floor(dist);
  var isBest = sc > best;
  if (isBest) {
    best = sc; $("best").textContent = best;
    try { localStorage.setItem(KEY_BEST, String(best)); } catch (e) {}
  }
  $("ovTitle").textContent = "โดนสไลม์เข้าแล้ว!";
  $("ovText").textContent = isBest ? "สถิติใหม่เลย เก่งมาก" : "ลองอีกรอบ รอบนี้ไปได้ไกลกว่าเดิม";
  var os = $("ovScore"); os.hidden = false; os.textContent = "คะแนน " + sc + " · สถิติสูงสุด " + best + " · ความเร็วสุด ×" + (speed / (BASE_SPEED * K)).toFixed(1);
  $("btnStart").textContent = "เล่นอีกครั้ง";
}
