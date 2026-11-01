#!/usr/bin/env python3
"""Builds ONE self-contained HTML file (CSS, JS and sprites inlined) -> dist/slime-run-single.html
Handy for sharing a single file. Usage:  python3 tools/bundle.py"""
import base64, json, pathlib, re
ROOT = pathlib.Path(__file__).resolve().parent.parent
html = (ROOT / 'index.html').read_text(encoding='utf-8')
html = re.sub(r'<link rel="stylesheet" href="(css/[^"]+)">', lambda m: '<style>\n' + (ROOT / m.group(1)).read_text(encoding='utf-8') + '\n</style>', html)
sprites = {}
for f in sorted((ROOT / 'assets' / 'sprites').glob('*.png')):
    sprites['assets/sprites/' + f.name] = 'data:image/png;base64,' + base64.b64encode(f.read_bytes()).decode()
data_tag = '<script>window.SPRITE_DATA = ' + json.dumps(sprites) + ';</script>\n'
first = [True]
def inline(m):
    js = (ROOT / m.group(1)).read_text(encoding='utf-8').replace('</script', '<\\/script')
    pre = data_tag if first[0] else ''
    first[0] = False
    return pre + '<script>\n' + js + '\n</script>'
html = re.sub(r'<script src="(js/[^"]+)"></script>', inline, html)
out = ROOT / 'dist'; out.mkdir(exist_ok=True)
(out / 'slime-run-single.html').write_text(html, encoding='utf-8')
print('wrote', out / 'slime-run-single.html', len(html) // 1024, 'KB')
