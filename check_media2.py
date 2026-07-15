from pathlib import Path
from urllib.parse import unquote
import re
root = Path('e:/GITHUB/Web/pages')
regex = re.compile(r'(?:src|href|data-modal-image|poster)\s*=\s*["\']([^"\']+\.(?:png|jpe?g|gif|webp|svg|mp4|webm|mov|ogg|mp3|wav|m4a|aac|flac))(?:\?[^"\']*)?["\']', re.IGNORECASE)
refs = []
for p in root.rglob('*.html'):
    text = p.read_text(encoding='utf-8', errors='ignore')
    for m in regex.finditer(text):
        ref = m.group(1)
        if ref.startswith(('http://','https://','data:','//')):
            continue
        if ref.startswith('/'):
            target = root / ref.lstrip('/')
        else:
            target = (p.parent / ref).resolve()
        if not target.exists():
            refs.append((p, ref, target))
dedup = {}
for p, ref, target in refs:
    dedup.setdefault(ref, set()).add(str(p.relative_to(root)))
for ref, pages in sorted(dedup.items()):
    decoded = unquote(ref)
    exists = False
    target_decoded = None
    if ref != decoded:
        if decoded.startswith('/'):
            target_decoded = root / decoded.lstrip('/')
        else:
            sample_page = next(iter(pages))
            target_decoded = (root / sample_page).parent / decoded
        exists = target_decoded.exists()
    print('REF:', ref)
    print('  pages:', sorted(pages))
    print('  decoded:', decoded)
    print('  decoded exists:', exists)
    if target_decoded is not None:
        print('  decoded path:', target_decoded)
