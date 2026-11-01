/* Colours from CSS tokens
 * The canvas reads colours from css/tokens.css so light/dark mode works.
 */
"use strict";

// ----- colours from CSS tokens -----
var C = {};
var COLOR_KEYS = ["sky1", "sky2", "hill", "hill2", "cloud", "star", "ground", "groundLine", "pebble", "slime", "slimeDark", "dust", "zdark", "fly", "flyDark", "wing"];
function readColors() {
  var s = getComputedStyle(document.documentElement);
  COLOR_KEYS.forEach(function (k) { C[k] = s.getPropertyValue("--" + k).trim() || "#888"; });
}
