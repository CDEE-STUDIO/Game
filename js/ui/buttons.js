/* Touch/pad buttons
 * Show/hide the dash and throw buttons as the situation changes.
 */
"use strict";

var dashShown = false;
function syncDashButtons() {
  var want = state === "play" && money >= DASH_COST && dashT <= 0;
  if (want === dashShown) return;
  dashShown = want;
  if (want) Sound.ready();
  ["tDash", "btnDash"].forEach(function (id) {
    var el = $(id);
    el.hidden = !want;
    el.classList.remove("show");
    if (want) { void el.offsetWidth; el.classList.add("show"); }
  });
}

var throwShown = false;
function syncThrowButtons() {
  var want = state === "play" && !!(boss || bossPending);
  if (want === throwShown) return;
  throwShown = want;
  ["tThrow", "btnThrow"].forEach(function (id) {
    var el = $(id);
    el.hidden = !want;
    el.classList.remove("show");
    if (want) { void el.offsetWidth; el.classList.add("show"); }
  });
  if (!want) throwHeld = false;
}
