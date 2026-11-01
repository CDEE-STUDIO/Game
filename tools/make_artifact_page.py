#!/usr/bin/env python3
"""Turns index.html into a page FRAGMENT (no doctype/html/head/body) for hosts that wrap the page themselves,
and prints the list of files that must be published next to it.  -> dist/artifact-page.html"""
import pathlib, re
ROOT = pathlib.Path(__file__).resolve().parent.parent
html = (ROOT / 'index.html').read_text(encoding='utf-8')
html = re.sub(r'<!doctype html>\s*<html[^>]*>\s*<head>', '', html, flags=re.I)
html = re.sub(r'<meta charset[^>]*>\s*', '', html)
html = re.sub(r'<meta name="viewport"[^>]*>\s*', '', html)
html = re.sub(r'<style>:root\{color-scheme.*?</style>\s*', '', html, flags=re.S)
html = html.replace('</head>', '').replace('<body>', '').replace('</body>', '').replace('</html>', '')
out = ROOT / 'dist'; out.mkdir(exist_ok=True)
(out / 'artifact-page.html').write_text(html.strip() + '\n', encoding='utf-8')
files = [str(p.relative_to(ROOT)) for pat in ('css/*.css', 'js/**/*.js', 'js/*.js', 'assets/**/*') for p in sorted(ROOT.glob(pat)) if p.is_file()]
print('\n'.join(sorted(set(files))))
