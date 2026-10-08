/* Local-only click-to-edit overlay for tools/serve_site.py.
 *
 * The local server injects this script into every page it serves. Turn edit mode
 * on, click any text on the page, change it in the inline box, and Save writes the
 * new text straight back to the canonical source file in assets/pages/ (or the root
 * index.html). This is text-only editing: markup, attributes, structure, and case
 * narrative are untouched, and the server refuses any write it cannot match against
 * the source file, so a stale page can never corrupt the HTML.
 */
(() => {
  'use strict';

  const ATTR = 'data-site-editor';
  const pending = new Map();   // text-node index -> { index, expected, text }
  const pristine = new Map();  // text-node index -> value as loaded from disk
  let mode = false;
  let popover = null;
  let activeNode = null;
  let outlined = null;

  /* ---------------------------------------------------------------- text nodes */

  // Ordinal list of text nodes as the browser sees them. The server walks the raw
  // file in the same order, so an index identifies the same node in both.
  function textNodes() {
    const walker = document.createTreeWalker(document, NodeFilter.SHOW_TEXT, {
      acceptNode(node) {
        const parent = node.parentElement;
        if (parent && parent.closest('[' + ATTR + ']')) return NodeFilter.FILTER_REJECT;
        return NodeFilter.FILTER_ACCEPT;
      }
    });
    const list = [];
    while (walker.nextNode()) list.push(walker.currentNode);
    return list;
  }

  function textNodeAt(x, y) {
    let container = null;
    if (document.caretRangeFromPoint) {
      const range = document.caretRangeFromPoint(x, y);
      container = range && range.startContainer;
    } else if (document.caretPositionFromPoint) {
      const position = document.caretPositionFromPoint(x, y);
      container = position && position.offsetNode;
    }
    if (!container || container.nodeType !== Node.TEXT_NODE) return null;
    if (!container.nodeValue.trim()) return null;
    const parent = container.parentElement;
    if (!parent) return null;
    if (parent.closest('script,style,textarea,template,[contenteditable]')) return null;
    if (parent.closest('[' + ATTR + ']')) return null;
    return container;
  }

  function trimmedBounds(value) {
    const start = value.length - value.trimStart().length;
    const end = value.trimEnd().length;
    return { start, end };
  }

  /* ------------------------------------------------------------------- overlay */

  const style = document.createElement('style');
  style.setAttribute(ATTR, '');
  style.textContent = [
    '.site-editor-bar{position:fixed;left:16px;bottom:16px;z-index:2147483000;display:flex;align-items:center;gap:8px;',
    'flex-wrap:wrap;max-width:calc(100% - 32px);padding:10px 12px;border:1px solid #4b5b5e;border-radius:8px;',
    'background:rgba(12,18,19,.96);color:#dae4e5;font:13px/1.4 Manrope,system-ui,sans-serif;box-shadow:0 8px 24px rgba(0,0,0,.45)}',
    '.site-editor-bar button{cursor:pointer;border:1px solid #596866;border-radius:4px;background:#263234;color:#dae4e5;',
    'font:600 12px/1 Manrope,system-ui,sans-serif;padding:9px 11px}',
    '.site-editor-bar button:hover{border-color:#d4b85c;color:#d4b85c}',
    '.site-editor-bar button.is-primary{background:#d4b85c;border-color:#d4b85c;color:#101718}',
    '.site-editor-bar button[aria-pressed="true"]{background:#3d5a3f;border-color:#7bbd7f;color:#e6f5e7}',
    '.site-editor-bar button:disabled{opacity:.5;cursor:default}',
    '.site-editor-status{font-size:12px;color:#a9bcbe}',
    '.site-editor-popover{position:fixed;z-index:2147483001;width:min(560px,calc(100vw - 32px));padding:12px;',
    'border:1px solid #d4b85c;border-radius:8px;background:#151b1c;color:#dae4e5;',
    'font:13px/1.5 Manrope,system-ui,sans-serif;box-shadow:0 10px 30px rgba(0,0,0,.5)}',
    '.site-editor-popover textarea{box-sizing:border-box;width:100%;min-height:84px;padding:10px;border:1px solid #71898b;',
    'border-radius:4px;background:#101718;color:#dae4e5;font:14px/1.6 Manrope,system-ui,sans-serif;resize:vertical}',
    '.site-editor-popover textarea:focus-visible{outline:2px solid #d4b85c;outline-offset:2px}',
    '.site-editor-hint{margin:8px 0;color:#93a7a9;font-size:12px}',
    '.site-editor-actions{display:flex;gap:8px}',
    '.site-editor-actions button{cursor:pointer;border:1px solid #596866;border-radius:4px;background:#263234;color:#dae4e5;',
    'font:600 12px/1 Manrope,system-ui,sans-serif;padding:9px 11px}',
    '.site-editor-actions button.is-primary{background:#d4b85c;border-color:#d4b85c;color:#101718}',
    'html.site-editor-mode body{cursor:text}',
    'html.site-editor-mode a,html.site-editor-mode button{cursor:text}',
    '.site-editor-target{outline:2px dashed #d4b85c !important;outline-offset:3px !important}'
  ].join('');
  document.head.append(style);

  function makeButton(label, className) {
    const button = document.createElement('button');
    button.type = 'button';
    button.textContent = label;
    if (className) button.className = className;
    return button;
  }

  const bar = document.createElement('div');
  bar.setAttribute(ATTR, '');
  bar.className = 'site-editor-bar';
  const toggle = makeButton('Edit mode');
  toggle.setAttribute('aria-pressed', 'false');
  const save = makeButton('Save changes', 'is-primary');
  const discard = makeButton('Discard');
  const reload = makeButton('Reload');
  const status = document.createElement('span');
  status.className = 'site-editor-status';
  status.setAttribute('role', 'status');
  bar.append(toggle, save, discard, reload, status);
  document.body.append(bar);

  function setStatus(text) {
    status.textContent = text;
  }

  function renderStatus() {
    if (pending.size) {
      setStatus(pending.size + ' unsaved change' + (pending.size === 1 ? '' : 's') + '.');
    } else {
      setStatus(mode ? 'Click any text on the page to edit it.' : 'Edit mode is off.');
    }
  }

  /* ---------------------------------------------------------------- popover */

  function closePopover() {
    if (popover) popover.remove();
    popover = null;
    activeNode = null;
    if (outlined) {
      outlined.classList.remove('site-editor-target');
      outlined = null;
    }
  }

  function positionPopover(anchor) {
    const rect = anchor.getBoundingClientRect();
    const top = Math.min(rect.bottom + 8, window.innerHeight - popover.offsetHeight - 12);
    const left = Math.min(Math.max(rect.left, 12), window.innerWidth - popover.offsetWidth - 12);
    popover.style.top = Math.max(12, top) + 'px';
    popover.style.left = left + 'px';
  }

  function commit(index, node, value) {
    const original = pristine.get(index);
    if (typeof original !== 'string') return;
    const bounds = trimmedBounds(original);
    const next = original.slice(0, bounds.start) + value + original.slice(bounds.end);
    node.nodeValue = next;
    if (next === original) pending.delete(index);
    else pending.set(index, { index, expected: original, text: next });
    closePopover();
    renderStatus();
  }

  function openPopover(node) {
    closePopover();
    const index = textNodes().indexOf(node);
    if (index < 0) return;
    if (!pristine.has(index)) pristine.set(index, node.nodeValue);
    const original = pristine.get(index);
    const current = pending.has(index) ? pending.get(index).text : original;
    const bounds = trimmedBounds(current);

    activeNode = node;
    outlined = node.parentElement;
    if (outlined) outlined.classList.add('site-editor-target');

    popover = document.createElement('div');
    popover.setAttribute(ATTR, '');
    popover.className = 'site-editor-popover';
    popover.setAttribute('role', 'dialog');
    popover.setAttribute('aria-label', 'Edit page text');
    const area = document.createElement('textarea');
    area.value = current.slice(bounds.start, bounds.end);
    area.setAttribute('aria-label', 'Selected text');
    const hint = document.createElement('p');
    hint.className = 'site-editor-hint';
    hint.textContent = 'Text only. Ctrl+Enter applies, Escape cancels.';
    const actions = document.createElement('div');
    actions.className = 'site-editor-actions';
    const apply = makeButton('Apply', 'is-primary');
    const cancel = makeButton('Cancel');
    actions.append(apply, cancel);
    popover.append(area, hint, actions);
    document.body.append(popover);
    positionPopover(outlined || node.parentElement || document.body);
    area.focus();
    area.select();

    apply.onclick = () => commit(index, node, area.value);
    cancel.onclick = closePopover;
    area.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        closePopover();
      } else if (event.key === 'Enter' && (event.ctrlKey || event.metaKey)) {
        event.preventDefault();
        commit(index, node, area.value);
      }
    });
  }

  /* -------------------------------------------------------------- edit mode */

  function setMode(next) {
    mode = next;
    document.documentElement.classList.toggle('site-editor-mode', mode);
    toggle.textContent = mode ? 'Editing: on' : 'Edit mode';
    toggle.setAttribute('aria-pressed', String(mode));
    if (!mode) closePopover();
    renderStatus();
  }

  function onClick(event) {
    if (!mode) return;
    if (event.target instanceof Element && event.target.closest('[' + ATTR + ']')) return;
    event.preventDefault();
    event.stopPropagation();
    const node = textNodeAt(event.clientX, event.clientY);
    if (!node) {
      setStatus('Click directly on the text you want to change.');
      return;
    }
    openPopover(node);
  }

  async function saveAll() {
    if (!pending.size) {
      setStatus('No changes to save.');
      return;
    }
    const edits = [...pending.values()].map(({ index, expected, text }) => ({ index, expected, text }));
    save.disabled = true;
    setStatus('Saving...');
    try {
      const response = await fetch('/__site_edit__', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ page: location.pathname, edits })
      });
      let result = {};
      try {
        result = await response.json();
      } catch {
        result = {};
      }
      if (!response.ok) throw new Error(result.message || 'Save failed.');
      closePopover();
      pending.clear();
      pristine.clear();
      setStatus('Saved ' + result.updated + ' change' + (result.updated === 1 ? '' : 's') + ' to ' + result.file + '.');
    } catch (error) {
      setStatus(error.message || 'Save failed.');
    } finally {
      save.disabled = false;
    }
  }

  function discardAll() {
    const nodes = textNodes();
    for (const index of pending.keys()) {
      const node = nodes[index];
      if (node) node.nodeValue = pristine.get(index);
    }
    pending.clear();
    pristine.clear();
    closePopover();
    renderStatus();
  }

  toggle.onclick = () => setMode(!mode);
  save.onclick = saveAll;
  discard.onclick = discardAll;
  reload.onclick = () => location.reload();
  window.addEventListener('click', onClick, true);
  window.addEventListener('keydown', (event) => {
    if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'e') {
      event.preventDefault();
      setMode(!mode);
    } else if (event.key === 'Escape' && popover) {
      closePopover();
    }
  }, true);
  window.addEventListener('resize', () => {
    if (popover && activeNode && activeNode.parentElement) positionPopover(activeNode.parentElement);
  });

  renderStatus();
})();
