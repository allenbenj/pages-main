// card-content.js: Apply approved card labels, titles, strength labels, tags, and
// audio/evidence button labels from documents/data/card-labels.json to the cards on
// documentspage.html. The JSON is written by tools/evidence-review.html and is the
// source of truth for these fields; this script only renders it.
(async () => {
  let approved = {};
  try {
    const response = await fetch('documents/data/card-labels.json', { cache: 'no-store' });
    if (response.ok) approved = (await response.json()).explanations || {};
  } catch {
    return;
  }

  for (const card of document.querySelectorAll('article.card[id]')) {
    const record = approved['card:' + card.id];
    if (!record) continue;
    try {
      const data = JSON.parse(record.text);
      const label = card.querySelector('.card-label');
      const title = card.querySelector('.card-title');
      const strength = card.querySelector('.evidence-strength');
      if (label && typeof data.label === 'string') label.textContent = data.label;
      if (title && typeof data.title === 'string') title.textContent = data.title;
      if (strength && typeof data.strength === 'string') strength.textContent = data.strength;
      for (const item of data.actionLabels || []) {
        for (const link of card.querySelectorAll('.card-actions a')) {
          if (link.getAttribute('href') === item.href) link.textContent = item.label;
        }
      }
      if (Array.isArray(data.tags)) {
        let row = card.querySelector('.pill-row');
        if (!row) {
          row = document.createElement('div');
          row.className = 'pill-row';
          card.append(row);
        }
        row.replaceChildren(...data.tags.map((tag) => {
          const span = document.createElement('span');
          span.className = 'pill';
          span.textContent = tag;
          return span;
        }));
      }
    } catch {
      // Ignore malformed records rather than breaking the rest of the page.
    }
  }
})();
