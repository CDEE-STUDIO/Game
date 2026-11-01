/* Scene
 * Draws one frame: background, ground, boss, coins, monsters, player, effects, HUD text.
 */
"use strict";

function draw() {
  ctx.setTransform(cv.width / W, 0, 0, cv.height / H, 0, 0);
  ctx.clearRect(0, 0, W, H);
  ctx.save();
  if (shake > 0) ctx.translate((Math.random() - 0.5) * 8 * shake / 0.25, (Math.random() - 0.5) * 6 * shake / 0.25);
  drawBackground();
  drawSpeedLines();
  drawGround();
  if (boss) drawBoss(boss);
  drawCoins();
  drawWarnings();
  obstacles.forEach(drawSlime);
  drawPlayer();
  drawShots();
  drawParts();
  drawBossUI();
  drawZoneBanner();
  ctx.restore();
}
