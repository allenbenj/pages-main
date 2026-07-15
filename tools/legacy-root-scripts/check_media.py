import re
from pathlib import Path
root = Path('e:/GITHUB/Web/pages')
regex = re.compile(r'(?:src|href|data-modal-image|poster)\s*=\s*["\']([^"\']+\.(?:png|jpe?g|gif|webp|svg|mp4|webm|mov|ogg|mp3|wav|m4a|aac|flac))(?:\?[^"\']*)?["\']', re.IGNORECASE)
missing = []
count = 0
for p in root.rglob('*.html'):
    text = p.read_text(encoding='utf-8', errors='ignore')
    for m in regex.finditer(text):
        ref = m.group(1)
        if ref.startswith(('http://', 'https://', 'data:', '//')):
            continue
        count += 1
        target = root / ref.lstrip('/') if ref.startswith('/') else (p.parent / ref).resolve()
        if not target.exists():
            missing.append((str(p.relative_to(root)), ref, str(target)))
print('Total local media refs:', count)
print('Missing references:', len(missing))
for item in missing[:200]:
    print(item)
