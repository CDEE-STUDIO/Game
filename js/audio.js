/* Sound
 * Lo-fi loop and small effects, all generated with Web Audio (no audio files). Exposes Sound.* and wires the music button.
 */
"use strict";

// ----- sound: soft lo-fi loop and small effects, all generated with Web Audio (no files) -----
var Sound = (function () {
  var ac = null, master, bus, sfx, dly, started = false, muted = false, timer = 0;
  var BPM = 76, S16 = 60 / BPM / 4, nextT = 0, stepN = 0, lastAt = {}, melN = 2;
  var CH = [[53, 57, 60, 64], [52, 55, 59, 62], [50, 53, 57, 60], [48, 52, 55, 59]];   // Fmaj7 Em7 Dm7 Cmaj7
  var BASS = [41, 40, 38, 36];
  var PENT = [67, 69, 72, 74, 76, 79, 81, 84];                                          // C pentatonic
  try { muted = localStorage.getItem(KEY_MUTE) === "1"; } catch (e) {}
  function hz(m) { return 440 * Math.pow(2, (m - 69) / 12); }

  function init() {
    if (ac) return true;
    var AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return false;
    try { ac = new AC(); } catch (e) { ac = null; return false; }
    master = ac.createGain(); master.gain.value = muted ? 0 : 0.85;
    var comp = ac.createDynamicsCompressor(); comp.threshold.value = -20; comp.ratio.value = 4;
    master.connect(comp); comp.connect(ac.destination);
    bus = ac.createGain(); bus.gain.value = 0.55;
    var lp = ac.createBiquadFilter(); lp.type = "lowpass"; lp.frequency.value = 2300; lp.Q.value = 0.5;
    bus.connect(lp); lp.connect(master);
    var len = Math.floor(ac.sampleRate * 1.7), ir = ac.createBuffer(2, len, ac.sampleRate);
    for (var c = 0; c < 2; c++) { var d = ir.getChannelData(c); for (var i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, 2.8); }
    var cv = ac.createConvolver(); cv.buffer = ir;
    var wet = ac.createGain(); wet.gain.value = 0.35;
    lp.connect(wet); wet.connect(cv); cv.connect(master);
    dly = ac.createDelay(1); dly.delayTime.value = S16 * 3;
    var fb = ac.createGain(); fb.gain.value = 0.32;
    dly.connect(fb); fb.connect(dly); dly.connect(bus);
    sfx = ac.createGain(); sfx.gain.value = 0.75; sfx.connect(master);
    return true;
  }

  function tone(dest, type, f, t0, dur, vol, att, rel, f2) {
    var o = ac.createOscillator(), g = ac.createGain();
    o.type = type; o.frequency.setValueAtTime(f, t0);
    if (f2) o.frequency.exponentialRampToValueAtTime(f2, t0 + dur);
    g.gain.setValueAtTime(0.0001, t0);
    g.gain.linearRampToValueAtTime(vol, t0 + att);
    g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur + rel);
    o.connect(g); g.connect(dest); o.start(t0); o.stop(t0 + dur + rel + 0.05);
  }
  function noise(dest, t0, dur, vol, hp, lp) {
    var n = Math.max(1, Math.floor(ac.sampleRate * dur)), b = ac.createBuffer(1, n, ac.sampleRate), d = b.getChannelData(0);
    for (var i = 0; i < n; i++) d[i] = Math.random() * 2 - 1;
    var s = ac.createBufferSource(); s.buffer = b;
    var f = ac.createBiquadFilter(); f.type = hp ? "highpass" : "lowpass"; f.frequency.value = hp || lp;
    var g = ac.createGain(); g.gain.setValueAtTime(vol, t0); g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
    s.connect(f); f.connect(g); g.connect(dest); s.start(t0);
  }

  function schedule() {
    if (!ac || ac.state !== "running") return;
    while (nextT < ac.currentTime + 0.35) {
      var s16 = stepN % 16, bar = Math.floor(stepN / 16) % 4;
      var t0 = nextT + ((s16 % 2) ? S16 * 0.16 : 0), ch = CH[bar];
      if (s16 === 0) {
        ch.forEach(function (m) {
          tone(bus, "triangle", hz(m), t0, S16 * 14, 0.04, 0.5, 0.9);
          tone(bus, "sine", hz(m) * 1.004, t0, S16 * 14, 0.028, 0.7, 0.9);
        });
      }
      if (s16 === 0 || s16 === 6 || s16 === 10) tone(bus, "sine", hz(BASS[bar]), t0, S16 * (s16 === 0 ? 4.5 : 2.2), 0.17, 0.02, 0.15);
      var arp = { 2: 1, 5: 2, 8: 3, 11: 2, 13: 1 };
      if (arp[s16]) tone(bus, "triangle", hz(ch[arp[s16]] + 12), t0, 0.15, 0.05, 0.005, 0.32);
      if (s16 === 0 || s16 === 10) tone(bus, "sine", 125, t0, 0.14, 0.34, 0.002, 0.05, 45);
      if (s16 === 4 || s16 === 12) noise(bus, t0, 0.16, 0.07, 1400, 0);
      if (s16 % 2 === 0) noise(bus, t0, 0.04, 0.035, 7500, 0);
      if (s16 % 4 === 2 && Math.random() < 0.55) {
        melN = Math.max(0, Math.min(PENT.length - 1, melN + Math.floor(Math.random() * 5) - 2));
        var f = hz(PENT[melN]);
        tone(bus, "sine", f, t0, 0.28, 0.07, 0.01, 0.4);
        tone(dly, "sine", f, t0, 0.2, 0.04, 0.01, 0.2);
      }
      nextT += S16; stepN++;
    }
  }

  function ok(name, gap) {
    if (!ac || muted || ac.state !== "running") return false;
    var n = performance.now();
    if (lastAt[name] && n - lastAt[name] < (gap || 40)) return false;
    lastAt[name] = n; return true;
  }

  return {
    unlock: function () {
      if (!init()) return;
      if (ac.state === "suspended") { try { ac.resume(); } catch (e) {} }
      if (!started) { started = true; nextT = ac.currentTime + 0.15; stepN = 0; timer = setInterval(schedule, 110); }
    },
    isMuted: function () { return muted; },
    setMuted: function (v) {
      muted = !!v;
      try { localStorage.setItem(KEY_MUTE, muted ? "1" : "0"); } catch (e) {}
      if (master) master.gain.setTargetAtTime(muted ? 0 : 0.85, ac.currentTime, 0.05);
    },
    hidden: function (h) {
      if (!ac) return;
      try { if (h) ac.suspend(); else { ac.resume(); nextT = ac.currentTime + 0.15; } } catch (e) {}
    },
    jump: function () { if (!ok("jump", 60)) return; var t = ac.currentTime; tone(sfx, "sine", 330, t, 0.12, 0.14, 0.005, 0.05, 640); },
    coin: function () { if (!ok("coin", 30)) return; var t = ac.currentTime; tone(sfx, "triangle", 988, t, 0.07, 0.11, 0.003, 0.05); tone(sfx, "triangle", 1319, t + 0.07, 0.1, 0.11, 0.003, 0.16); },
    toss: function () { if (!ok("toss", 60)) return; var t = ac.currentTime; tone(sfx, "triangle", 900, t, 0.09, 0.1, 0.003, 0.03, 420); },
    hit: function () { if (!ok("hit", 50)) return; var t = ac.currentTime; tone(sfx, "square", 260, t, 0.08, 0.06, 0.002, 0.05, 120); noise(sfx, t, 0.06, 0.08, 1200, 0); },
    pop: function () { if (!ok("pop", 50)) return; var t = ac.currentTime; tone(sfx, "sine", 520, t, 0.09, 0.13, 0.003, 0.04, 180); },
    die: function () { if (!ok("die", 200)) return; var t = ac.currentTime; tone(sfx, "triangle", 420, t, 0.45, 0.18, 0.005, 0.2, 70); noise(sfx, t, 0.25, 0.12, 0, 800); },
    dash: function () { if (!ok("dash", 200)) return; var t = ac.currentTime; tone(sfx, "sawtooth", 180, t, 0.5, 0.06, 0.02, 0.25, 720); tone(sfx, "sine", 440, t, 0.4, 0.12, 0.01, 0.2, 1100); },
    ready: function () { if (!ok("ready", 300)) return; var t = ac.currentTime; [1047, 1319, 1568].forEach(function (f, i) { tone(sfx, "triangle", f, t + i * 0.07, 0.1, 0.1, 0.003, 0.15); }); },
    warn: function () { if (!ok("warn", 300)) return; var t = ac.currentTime; tone(sfx, "square", 130, t, 0.18, 0.08, 0.005, 0.1); tone(sfx, "square", 130, t + 0.3, 0.18, 0.08, 0.005, 0.1); },
    win: function () { if (!ok("win", 300)) return; var t = ac.currentTime; [523, 659, 784, 1047].forEach(function (f, i) { tone(sfx, "triangle", f, t + i * 0.09, 0.14, 0.12, 0.003, 0.25); }); },
    mile: function () { if (!ok("mile", 200)) return; var t = ac.currentTime; tone(sfx, "triangle", 880, t, 0.08, 0.09, 0.003, 0.1); tone(sfx, "triangle", 1320, t + 0.08, 0.12, 0.09, 0.003, 0.18); }
  };
})();
window.addEventListener("pointerdown", function () { Sound.unlock(); }, true);
window.addEventListener("keydown", function () { Sound.unlock(); }, true);
function syncMusicBtn() {
  var b = $("btnMusic"), on = !Sound.isMuted();
  b.textContent = on ? "เสียง: เปิด" : "เสียง: ปิด"; b.setAttribute("aria-pressed", on ? "true" : "false");
}
$("btnMusic").addEventListener("click", function () { Sound.unlock(); Sound.setMuted(!Sound.isMuted()); syncMusicBtn(); });
syncMusicBtn();
