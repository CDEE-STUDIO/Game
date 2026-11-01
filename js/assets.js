/* Sprites
 * Player sprite frames are PNG files in assets/sprites. Frame geometry is shared by all of them.
 */
"use strict";

// Every frame is drawn on a FW x FH canvas, feet on row FBASE, body centre on column FCX.
// FSRC = source pixel height of the character, PH = height on screen (px).
var FW = 340, FH = 300, FBASE = 282, FCX = 170, FSRC = 210;
var AR = 275 / 300;
var PH = 88;
var SC = PH / FSRC;

// Order matters: 0-7 run cycle, then the 8 frames of the jump sheet.
var SPRITE_FILES = [];
for (var si = 0; si < 8; si++) SPRITE_FILES.push("assets/sprites/run_0" + si + ".png");
for (var sj = 0; sj < 8; sj++) SPRITE_FILES.push("assets/sprites/jump_0" + sj + ".png");

// Named frame indexes
var F_CROUCH = 8,   // jump sheet 1: get ready (also used for ducking)
    F_PUSH = 9,     // 2: push off
    F_RISE = 10,    // 3: rising
    F_APEX = 11,    // 4: top of the jump
    F_FALL = 12,    // 5: starts falling (also game over)
    F_TOES = 13,    // 6: toes touch down
    F_LAND = 14;    // 7: landed on both feet

// tools/bundle.py can inline the PNGs as data URIs by defining window.SPRITE_DATA first; normally they load from the files.
var frameImgs = SPRITE_FILES.map(function (src) { var im = new Image(); im.src = (window.SPRITE_DATA && window.SPRITE_DATA[src]) || src; return im; });
