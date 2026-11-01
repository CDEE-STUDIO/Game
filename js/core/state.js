/* Game state
 * All mutable state of a run lives here (plus the saved best score).
 */
"use strict";

// ----- state -----
var state = "ready"; // ready | play | over
var t = 0, dist = 0, off = 0, speed = 0, spawnTimer = 0, firstSpawn = true;
var diedAt = 0, jumpBuf = 0, jumpHeld = false, duckHeld = false;
var obstacles = [];
var p = { x: 96, z: 0, vz: 0, duck: false, cyc: 0, tilt: 0, sqT: 0, sqK: 1, vx: 0, tOver: 0, throwT: 0 };
var baseSp = 0, money = 0, coins = [], dashT = 0, graceT = 0, coinT = 1.5;
var shots = [], boss = null, bossIdx = 0, miniIdx = 0, pendingMini = false, bossPending = false, bannerT = 0, throwCD = 0, throwHeld = false;
var parts = [], shake = 0, overShown = false, dustT = 0, starT = 0, milestone = 0;
var best = 0;
try { best = parseInt(localStorage.getItem(KEY_BEST) || "0", 10) || 0; } catch (e) {}
$("best").textContent = best;

var stars = [], clouds = [];
for (var i = 0; i < 16; i++) stars.push({ x: Math.random() * 900, y: 14 + Math.random() * 130, r: 3 + Math.random() * 4 });
for (var j = 0; j < 5; j++) clouds.push({ x: j * 230 + Math.random() * 80, y: 28 + Math.random() * 70, s: 0.7 + Math.random() * 0.6 });

// --- world (zone) state: which world is shown and the crossfade between two ---
var zoneTo = 0, zoneFrom = 0, zoneBlend = 1, zoneBannerT = 0, ambT = 0;
