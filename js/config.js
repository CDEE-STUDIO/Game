/* Tuning
 * All the numbers you are likely to want to change while balancing the game.
 */
"use strict";

// --- physics (px, seconds) ---
var G = 2300, JV = 820, FASTFALL = 3200, JUMP_CUT = 260;
var JUMP_T = 2 * JV / G;                      // air time of a full jump
// --- speed: eases toward MAX_SPEED instead of climbing in a straight line ---
var BASE_SPEED = 360, MAX_SPEED = 820, RAMP = 110;
// --- dash (costs money, makes you invulnerable and faster) ---
var DASH_COST = 600, DASH_TIME = 2.0;
// --- coins ---
var COIN_VALUE = 5;
// --- worlds: score per world, then the cycle repeats ---
var ZONE_LEN = 1500;
// --- bosses: first mini-boss at MINI_FIRST, then every MINI_EVERY; big bosses use bossScore() in js/game/boss.js ---
var MINI_FIRST = 500, MINI_EVERY = 1000;
// --- storage keys ---
var KEY_BEST = "slimerun-best", KEY_MUTE = "slimerun-mute";
