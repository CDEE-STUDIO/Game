/* Main
 * Game loop, resize, fullscreen button, and start-up. Load this LAST.
 */
"use strict";

// ----- loop -----
var last = 0, frame = 0;
function loop(ts) {
  var dt = Math.min(0.033, (ts - last) / 1000 || 0.016);
  last = ts;
  if (portraitMQ.matches) { requestAnimationFrame(loop); return; }
  ambT += dt;
  if ((frame++ % 45) === 0) readColors();
  update(dt);
  syncThrowButtons();
  syncDashButtons();
  updateParts(dt);
  draw();
  requestAnimationFrame(loop);
}

var lastKey = "";
function onResize() {
  var key = stage.clientWidth + "x" + stage.clientHeight + (phoneMQ.matches ? "p" : "d");
  if (key === lastKey) return;
  lastKey = key;
  var oldW = W;
  layout();
  if (W !== oldW) {
    if (state === "play") obstacles = obstacles.filter(function (o) { return o.x < W; });
    if (boss) boss.x = Math.min(boss.x, W - boss.w - RPAD);
  }
}
window.addEventListener("resize", onResize);
if (window.ResizeObserver) { try { new ResizeObserver(onResize).observe(stage); } catch (e) {} }
var toastTimer = 0;
function toast(msg) {
  var el = $("toast"); el.textContent = msg; el.hidden = false;
  clearTimeout(toastTimer); toastTimer = setTimeout(function () { el.hidden = true; }, 3600);
}
function fsFail() {
  $("btnFull").hidden = true;
  toast("หน้านี้ไม่ได้รับอนุญาตให้ขยายเต็มจอ เกมเต็มพื้นที่หน้าจอที่มีอยู่แล้ว");
}
var fsOK = !!(document.fullscreenEnabled || document.webkitFullscreenEnabled) && !!(stage.requestFullscreen || stage.webkitRequestFullscreen);
if (fsOK) {
  $("btnFull").hidden = false;
  $("btnFull").addEventListener("click", function () {
    try {
      if (document.fullscreenElement || document.webkitFullscreenElement) { (document.exitFullscreen || document.webkitExitFullscreen).call(document); return; }
      var req = stage.requestFullscreen || stage.webkitRequestFullscreen;
      var r = req.call(stage);
      if (r && r.catch) r.catch(fsFail);
    } catch (e) { fsFail(); }
  });
}
if (phoneMQ.addEventListener) { phoneMQ.addEventListener("change", onResize); portraitMQ.addEventListener("change", function () { duckHeld = false; jumpHeld = false; throwHeld = false; }); }

layout(); lastKey = stage.clientWidth + "x" + stage.clientHeight + (phoneMQ.matches ? "p" : "d");
readColors();
reset(); state = "ready";
if (best > 0) { var os0 = $("ovScore"); os0.hidden = false; os0.textContent = "สถิติสูงสุดของคุณ " + best; }
requestAnimationFrame(loop);
