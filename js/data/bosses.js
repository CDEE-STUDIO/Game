/* Boss data
 * Generic slime bosses (fallback when a world has no boss kind), mini-boss colours and attack labels.
 */
"use strict";

var BOSSES = [
  { name: "ราชาสไลม์", hp: 10, w: 116, h: 92, c1: "#4fd17a", c2: "#1b8c48", gap: 1.9, sp: 330, fly: false },
  { name: "สไลม์ยักษ์ปีกม่วง", hp: 24, w: 124, h: 96, c1: "#a58bff", c2: "#5a3fc4", gap: 1.5, sp: 420, fly: true },
  { name: "จักรพรรดิสไลม์มืด", hp: 40, w: 136, h: 108, c1: "#2c2552", c2: "#ff4d8d", gap: 1.25, sp: 520, fly: false }
];
var MINI_PAL = [["#ff9f43", "#b85c00"], ["#4fd1d9", "#197a82"], ["#ff7eb6", "#b02a67"], ["#c3e04a", "#6d8a10"]];
var ATK_LABEL = { double: "ยิงคู่!", cross: "สลับสูงต่ำ!", burst: "ยิงรัว!", rain: "ฝนสไลม์!", pyr: "ซัมมอนปิรามิด!" };
