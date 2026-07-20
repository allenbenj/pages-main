(() => {
  if (document.querySelector('.edifice-topnav')) return;

  const pages = [
    ['index.html', 'Landing'],
    ['overview.html', 'Overview'],
    ['timeline.html', 'Timeline'],
    ['evidence.html', 'Evidence'],
    ['misconduct.html', 'Misconduct'],
    ['contradictions.html', 'Contradictions'],
    ['documentspage.html', 'Documents'],
    ['players.html', 'Players'],
    ['case-study.html', 'Case Study'],
    ['overview.html#page-index', 'Page Index']
  ];

  const path = window.location.pathname.split('/').pop() || 'index.html';
  const nav = document.createElement('nav');
  nav.className = 'edifice-topnav';
  nav.setAttribute('aria-label', 'Project navigation');

  const links = pages.map(([href, label]) => {
    const active = href === path ? ' is-active' : '';
    return `<a class="${active.trim()}" href="${href}">${label}</a>`;
  }).join('');

  nav.innerHTML = `
    <div class="edifice-topnav-inner">
      <a class="edifice-topnav-brand" href="index.html">
        <span class="edifice-topnav-mark" aria-hidden="true">AE</span>
        <span>Case Navigation</span>
      </a>
      <div class="edifice-topnav-links">${links}</div>
    </div>
  `;

  const target = document.body.firstElementChild;
  if (target) {
    document.body.insertBefore(nav, target);
  } else {
    document.body.appendChild(nav);
  }
})();
