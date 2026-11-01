/* Input
 * Keyboard, touch and mouse. Everything calls jump / setDuck / startDash / throwStar.
 */
"use strict";

// ----- input -----
function jump() {
  if (state !== "play") { tryStart(); return; }
  if (dashT > 0) return;
  if (p.z === 0 && p.vz === 0) launch();
  else jumpBuf = 0.12;
}
function launch() {
  p.vz = JV; jumpBuf = 0; p.sqT = 0.14; p.sqK = 1;
  Sound.jump();
  dustBurst(5);
}
function tryStart() {
  if (state === "ready") startGame();
  else if (state === "over" && performance.now() - diedAt > 800) startGame();
}
function setDuck(v) { duckHeld = v; }

window.addEventListener("keydown", function (e) {
  var k = e.code;
  if (k === "Space" || k === "ArrowUp" || k === "KeyW") {
    e.preventDefault();
    if (!e.repeat) { jumpHeld = true; jump(); }
  } else if (k === "ArrowDown" || k === "KeyS") {
    e.preventDefault(); setDuck(true);
  } else if (k === "KeyF" || k === "KeyJ" || k === "KeyX" || k === "Enter") {
    e.preventDefault();
    if (!e.repeat) {
      if (state === "play") { throwHeld = true; throwStar(); }
      else if (k === "Enter") tryStart();
    }
  } else if (k === "KeyE" || k === "ShiftLeft" || k === "ShiftRight" || k === "KeyK") {
    e.preventDefault();
    if (!e.repeat) startDash();
  }
});
window.addEventListener("keyup", function (e) {
  var k = e.code;
  if (k === "Space" || k === "ArrowUp" || k === "KeyW") { jumpHeld = false; cutJump(); }
  else if (k === "ArrowDown" || k === "KeyS") setDuck(false);
  else if (k === "KeyF" || k === "KeyJ" || k === "KeyX" || k === "Enter") throwHeld = false;
});
function cutJump() { if (p.vz > JUMP_CUT) p.vz = JUMP_CUT; }

function bindHold(el, down, up) {
  el.addEventListener("pointerdown", function (e) { e.preventDefault(); down(); });
  ["pointerup", "pointercancel", "pointerleave"].forEach(function (ev) { el.addEventListener(ev, function () { up(); }); });
}
bindHold($("btnJump"), function () { jumpHeld = true; jump(); }, function () { if (jumpHeld) { jumpHeld = false; cutJump(); } });
bindHold($("btnDuck"), function () { setDuck(true); }, function () { setDuck(false); });
bindHold($("btnThrow"), function () { throwHeld = true; throwStar(); }, function () { throwHeld = false; });
bindHold($("tDuck"), function () { setDuck(true); }, function () { setDuck(false); });
bindHold($("tDash"), function () { startDash(); }, function () {});
bindHold($("btnDash"), function () { startDash(); }, function () {});
bindHold($("tThrow"), function () { throwHeld = true; throwStar(); }, function () { throwHeld = false; });
stage.addEventListener("contextmenu", function (e) { e.preventDefault(); });
$("btnStart").addEventListener("click", function () { tryStart(); });
overlay.addEventListener("pointerdown", function () { tryStart(); });
cv.addEventListener("pointerdown", function (e) {
  e.preventDefault();
  jumpHeld = true; jump();
});
cv.addEventListener("pointerup", function () { if (jumpHeld) { jumpHeld = false; cutJump(); } });
document.addEventListener("visibilitychange", function () { Sound.hidden(document.hidden); if (document.hidden) { duckHeld = false; jumpHeld = false; throwHeld = false; } });
