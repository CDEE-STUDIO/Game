/* DOM handles
 * Elements the game talks to.
 */
"use strict";

var $ = function (id) { return document.getElementById(id); };
var cv = $("game"), ctx = cv.getContext("2d"), stage = $("stage");
var overlay = $("overlay");
