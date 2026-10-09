(() => {
  const $ = id => document.getElementById(id);
  let files = [], visible = [], selected = null, comparing = false, contexts = {}, contextReady = false;
  let importance = {};
  const allowed = ['audio/', 'video/', 'documents/', 'content/images/evidence/'];
  function url(file) {
    const p = file.filePath;
    if (!allowed.some(x => p.startsWith(x)) || p.split('/').includes('..')) throw Error('Invalid file path');
    return p.split('/').map(encodeURIComponent).join('/');
  }
  function display(file, box) {
    box.replaceChildren(); let el;
    if (file.fileType === 'pdf') { el = document.createElement('iframe'); el.title = file.title; }
    else if (file.fileType === 'image') { el = document.createElement('img'); el.alt = file.title; }
    else if (['audio', 'video'].includes(file.fileType)) {
      el = document.createElement(file.fileType); el.controls = true; el.preload = 'metadata';
      el.addEventListener('error', () => { const p = document.createElement('p'); p.textContent = 'This browser could not play this format. Open the original file above.'; box.append(p); });
    } else { el = document.createElement('p'); el.textContent = 'Use the original-file link to open this format in a compatible application.'; }
    if (el.tagName !== 'P') el.src = url(file);
    box.append(el);
  }
  function caseContext(file) {
    const box = $('context-items'); box.replaceChildren();
    const saved = importance[file.filePath];
    if (saved) {
      $('context-status').textContent = 'Saved explanation for this evidence file.';
      const p = document.createElement('p'); p.className = 'importance-explanation'; p.textContent = saved.text; box.append(p); return;
    }
    const items = contexts[file.filePath] || [];
    $('context-status').textContent = items.length ? 'Quoted from the existing website discussion. Open the linked page for the full argument and source context.' : contextReady ? 'This file has no linked explanation yet. Its significance cannot be established from its filename alone.' : 'Loading the linked case discussion…';
    for (const item of items) {
      const article = document.createElement('article'); article.className = 'case-context-item';
      const heading = document.createElement('h3'); heading.textContent = item.heading;
      article.append(heading);
      for (const text of item.excerpts) { const p = document.createElement('p'); p.textContent = text; article.append(p); }
      const link = document.createElement('a'); link.href = item.page + (item.anchor ? '#' + encodeURIComponent(item.anchor) : ''); link.textContent = 'Read the full discussion →'; article.append(link); box.append(article);
    }
  }
  function controls() {
    const i = visible.findIndex(f => selected && f.filePath === selected.filePath);
    $('previous').disabled = i <= 0; $('next').disabled = i < 0 || i >= visible.length - 1;
    $('copy').disabled = $('compare').disabled = !selected;
  }
  function select(file) {
    if (comparing) {
      $('comparison-title').textContent = file.title; $('comparison-original').href = url(file);
      display(file, $('comparison-display')); $('comparison').hidden = false; $('panels').classList.add('comparing');
      comparing = false; $('compare').textContent = 'Compare with next selection';
      $('feedback').textContent = 'Comparison opened. The original selection remains on the left.'; return;
    }
    selected = file; caseContext(file); $('title').textContent = file.title; $('path').textContent = file.filePath;
    $('original').href = url(file); $('original').hidden = false; display(file, $('display'));
    $('integrity').hidden = false;
    $('details').textContent = `Size: ${Number(file.sizeBytes || 0).toLocaleString()} bytes. SHA-256: ${file.sha256 || 'Not recorded'}`;
    history.replaceState(null, '', '#file=' + encodeURIComponent(file.filePath));
    document.dispatchEvent(new Event('evidence-file-selected'));
    for (const button of $('files').querySelectorAll('button')) button.setAttribute('aria-pressed', String(button.dataset.path === file.filePath));
    controls(); $('feedback').textContent = '';
    if (matchMedia('(max-width:760px)').matches) $('preview').scrollIntoView({behavior:'smooth', block:'start'});
  }
  function render() {
    const terms = $('search').value.toLowerCase().trim().split(/\s+/).filter(Boolean);
    visible = files.filter(f => (!$('type').value || f.fileType === $('type').value) && (!$('collection').value || f.collection === $('collection').value) && terms.every(t => (f.title + ' ' + f.filePath).toLowerCase().includes(t)));
    visible.sort((a,b) => $('sort').value === 'size' ? b.sizeBytes-a.sizeBytes : $('sort').value === 'type' ? a.fileType.localeCompare(b.fileType) || a.title.localeCompare(b.title) : a.title.localeCompare(b.title,undefined,{numeric:true}));
    $('count').textContent = `${visible.length} of ${files.length} files`; $('files').replaceChildren();
    if (!visible.length) { const p=document.createElement('p');p.textContent='No files match. Clear the filters or try fewer search words.';$('files').append(p); }
    for (const file of visible) {
      const button = document.createElement('button'); button.type='button'; button.dataset.path=file.filePath;
      button.setAttribute('aria-pressed',String(selected?.filePath===file.filePath));button.textContent=file.title;
      const small=document.createElement('small');small.textContent=`${file.fileType.toUpperCase()} · ${file.collection} · ${(file.sizeBytes/1024/1024).toFixed(1)} MB`;button.append(small);
      button.addEventListener('click',()=>select(file));$('files').append(button);
    }
    controls();
  }
  $('search').addEventListener('input',render);
  for(const id of ['type','collection','sort']) $(id).addEventListener('change',render);
  $('reset').addEventListener('click',()=>{$('search').value=$('type').value=$('collection').value='';render();});
  for(const [id,offset] of [['previous',-1],['next',1]]) $(id).addEventListener('click',()=>{const i=visible.findIndex(f=>f.filePath===selected?.filePath);if(visible[i+offset])select(visible[i+offset]);});
  $('compare').addEventListener('click',()=>{comparing=!comparing;$('compare').textContent=comparing?'Cancel comparison':'Compare with next selection';$('feedback').textContent=comparing?'Choose another file from the list to compare.':'';});
  $('close-comparison').addEventListener('click',()=>{$('comparison').hidden=true;$('comparison-display').replaceChildren();$('panels').classList.remove('comparing');});
  $('copy').addEventListener('click',async()=>{try{await navigator.clipboard.writeText(location.href);$('feedback').textContent='File link copied.';}catch{$('feedback').textContent='Copy the address from the browser to share this file selection.';}});
  fetch('documents/data/evidence-importance.json', {cache:'no-store'}).then(r=>r.json()).then(data=>{importance=data.explanations||{};if(selected)caseContext(selected);}).catch(()=>{});
  fetch('documents/data/evidence-context.json').then(r=>{if(!r.ok)throw Error();return r.json();}).then(data=>{contexts=data.files;contextReady=true;if(selected)caseContext(selected);}).catch(()=>{$('context-status').textContent='The case discussion could not be loaded. Reload to try again.';});
  fetch('documents/data/evidence-export.json').then(r=>{if(!r.ok)throw Error();return r.json();}).then(data=>{
    files=data.evidence.filter(f=>{try{url(f);return true;}catch{return false;}});
    for(const c of [...new Set(files.map(f=>f.collection))].sort()){const o=document.createElement('option');o.value=c;o.textContent=c.replaceAll('/',' / ').replaceAll('_',' ');$('collection').append(o);}
    render();const requested=new URLSearchParams(location.hash.slice(1)).get('file');const f=files.find(f=>f.filePath===requested);if(f)select(f);
  }).catch(()=>{$('count').textContent='Inventory unavailable. Reload to try again.';});
})();
