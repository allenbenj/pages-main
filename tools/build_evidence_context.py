"""Link shipped evidence to existing website discussion; no new case analysis."""
from pathlib import Path
from urllib.parse import unquote, urlsplit
from bs4 import BeautifulSoup
import json,re
ROOT=Path(__file__).resolve().parents[1]
inventory=json.loads((ROOT/'documents/data/evidence-export.json').read_text(encoding='utf-8'))['evidence']
known={f['filePath'] for f in inventory}; contexts={p:[] for p in known}
def add(path,page,container):
    title=container.select_one('.card-title,h1,h2,h3,h4')
    paragraphs=[p.get_text(' ',strip=True) for p in container.select('p') if len(p.get_text(' ',strip=True))>65 and not p.find_parent(['nav','footer'])]
    if not paragraphs:return
    anchor=container.get('id')
    record={'page':page,'anchor':anchor,'heading':title.get_text(' ',strip=True) if title else page,'excerpts':paragraphs[:3],'relationship':'Existing website discussion linked to this file'}
    if record not in contexts[path]:contexts[path].append(record)
for file in sorted((ROOT/'assets/pages').glob('*.html')):
    if file.name=='evidence-viewer.html':continue
    source=file.read_text(encoding='utf-8');soup=BeautifulSoup(source,'html.parser')
    for node in soup.find_all(True):
        for attr in ['href','src','data-modal-image','data-href']:
            value=node.get(attr,'')
            if not isinstance(value,str):continue
            path=unquote(urlsplit(value).path).lstrip('/')
            if path not in known:continue
            parent=node.find_parent(['article','section'])
            if parent:add(path,file.name,parent)
    # Existing explicit card-to-file associations in the Documents page.
    if file.name=='documentspage.html':
        cards=soup.select('article.card')
        for block in re.finditer(r'titles:\s*\[([^\]]+)\],\s*links:\s*\[([\s\S]*?)\]\s*\}',source):
            titles=re.findall(r"['\"]([^'\"]+)['\"]",block.group(1))
            links=re.findall(r"href:\s*['\"]([^'\"]+)['\"]",block.group(2))
            for card in cards:
                title=card.select_one('.card-title')
                if title and title.get_text(' ',strip=True).casefold() in [t.casefold() for t in titles]:
                    for link in links:
                        path=unquote(urlsplit(link).path)
                        if path in known:add(path,file.name,card)
result={'generator':'tools/build_evidence_context.py','kind':'existing_website_discussion','files':contexts,'coverage':{'total':len(known),'withDiscussion':sum(bool(v) for v in contexts.values())}}
(ROOT/'documents/data/evidence-context.json').write_text(json.dumps(result,indent=2,ensure_ascii=False),encoding='utf-8')
print(json.dumps(result['coverage']))
