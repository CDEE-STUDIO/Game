/* Utilities
 * Tiny helpers shared by everything.
 */
"use strict";

function rand(a, b) { return a + Math.random() * (b - a); }
function mod(a, b) { return ((a % b) + b) % b; }
// deterministic pseudo random in [0,1) for a given number (scenery that must not flicker)
function rnd(n) { var s = Math.sin(n * 127.1 + 311.7) * 43758.5453; return s - Math.floor(s); }
