/* Layout
 * Canvas size, phone vs desktop mode, scale factor K.
 */
"use strict";

var W = 900, H = 340, GROUND = 286, K = 1, dpr = 1;
var phone = false, PX0 = 96, RPAD = 24;
var phoneMQ = window.matchMedia("(orientation: landscape) and (max-height: 560px) and ((pointer: coarse) or (hover: none))");
var portraitMQ = window.matchMedia("(orientation: portrait) and (max-width: 700px) and (pointer: coarse)");

function layout() {
  var cw = stage.clientWidth || 360, ch = stage.clientHeight || 300;
  phone = phoneMQ.matches;
  if (phone) {
    H = 300;
    W = Math.round(Math.max(480, Math.min(1000, H * cw / ch)));
    cv.style.aspectRatio = "";
  } else {
    var narrow = cw < 560;
    W = narrow ? 520 : 900;
    H = narrow ? 300 : 340;
    cv.style.aspectRatio = W + " / " + H;
  }
  K = Math.max(0.72, Math.min(1, W / 760));
  GROUND = H - 54;
  PX0 = phone ? Math.round(Math.max(150, Math.min(190, W * 0.26))) : 96;
  RPAD = phone ? 124 : 24;
  dpr = Math.min(window.devicePixelRatio || 1, 2);
  cv.width = Math.round(W * dpr);
  cv.height = Math.round(H * dpr);
}
