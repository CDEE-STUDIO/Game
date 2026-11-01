"""Smoke test: loads index.html in headless Chromium, plays a few seconds in every world,
and calls every registered drawing function. Needs: pip install playwright && playwright install chromium
Run:  python3 tests/smoke.py"""
import asyncio, os, pathlib, sys
from playwright.async_api import async_playwright
ROOT = pathlib.Path(__file__).resolve().parent.parent
JS = """() => {
  var errs = [], ok = 0;
  function tryit(name, fn) { try { ctx.save(); ctx.translate(300, 250); fn(); ctx.restore(); ok++; } catch (e) { ctx.restore(); errs.push(name + ': ' + e.message); } }
  ZONES.forEach(function (id, z) { tryit('zone ' + id, function () { ctx.setTransform(1,0,0,1,0,0); drawZone(z, 1); }); });
  Object.keys(CREATURE_ART).forEach(function (id) { [false, true].forEach(function (air) { tryit('creature ' + id + (air ? ' air' : ''), function () { CREATURE_ART[id]({ph:1,skin:id,type:air?'a':'g'}, 44, 34, air, 0.5); }); }); });
  Object.keys(PROJ_ART).forEach(function (n) { tryit('proj ' + n, function () { PROJ_ART[n]({ph:1,proj:n,w:60,h:50}, 40, 36); }); });
  Object.keys(BOSS_ART).forEach(function (k) { [0, 2].forEach(function (en) { [false, true].forEach(function (sp) { tryit('boss ' + k, function () {
     var b = { kind:k, cfg:{c1:'#888',c2:'#444'}, t:1, spitT: sp?0.2:0, atkT:0.3, mode:'fight', queue:[], dead:false };
     BOSS_ART[k](b, 100, 110, false, en); }); }); }); });
  return { ok: ok, errs: errs };
}"""
async def main():
    async with async_playwright() as p:
        b = await p.chromium.launch(executable_path=os.environ.get('CHROMIUM_PATH') or None)
        c = await b.new_context(viewport={'width': 844, 'height': 390}, is_mobile=True, has_touch=True)
        pg = await c.new_page(); errs = []
        pg.on('pageerror', lambda e: errs.append(str(e)))
        pg.on('console', lambda m: errs.append(m.text) if m.type == 'error' and 'fonts' not in m.text.lower() and 'net::' not in m.text else None)
        await pg.goto((ROOT / 'index.html').as_uri())
        await pg.wait_for_timeout(500)
        res = await pg.evaluate(JS)
        await pg.tap('#btnStart'); await pg.wait_for_timeout(4000)
        await pg.screenshot(path=str(ROOT / 'tests' / 'smoke.png'))
        print('draw functions ok:', res['ok'], 'errors:', res['errs'], errs[:5])
        await b.close()
        sys.exit(1 if (res['errs'] or errs) else 0)
asyncio.run(main())
