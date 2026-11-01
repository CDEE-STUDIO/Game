/* Registries
 * Empty containers that content packs (js/biomes/*.js) fill in. Load this FIRST.
 */
"use strict";

// Order of ZONES = order the worlds appear in the run (it follows the load order of js/biomes/*.js).
var ZONES = [];            // ["meadow", "desert", ...]
var ZONE_NAME = {};        // id -> Thai label shown in the "new zone" banner
var PAL = {};              // id -> { l: {...light colours}, d: {...dark colours} } (the city/meadow world uses the CSS tokens instead)
var KIND_BY_ZONE = {};     // id -> [mini-boss kind, big-boss kind]
var KINDS = {};            // kind -> boss description (see docs/ARCHITECTURE.md)

// Drawing functions per world / monster / boss / projectile (each biome file registers its own).
var ZONE_ART = {};         // id   -> function (a, P, dark)            draws the scenery behind the runner
var CREATURE_ART = {};     // id   -> function (o, w, h, air, fl)      draws the regular ground + flying monster of that world
var BOSS_ART = {};         // kind -> function (b, w, h, white, en)    draws a boss, origin = bottom centre, facing left
var PROJ_ART = {};         // name -> function (o, w, h)               draws something a boss throws
