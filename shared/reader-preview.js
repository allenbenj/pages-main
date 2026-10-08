(() => {
  const rail = document.querySelector('.reader-evidence .page-rail');
  if (rail && 'IntersectionObserver' in window) {
    const links = [...rail.querySelectorAll('a[href^="#"]')];
    const visible = new Map();
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => visible.set(entry.target.id, entry.isIntersecting));
      const active = links.find((link) => visible.get(link.hash.slice(1)));
      if (!active) return;
      links.forEach((link) => {
        if (link === active) link.setAttribute('aria-current', 'location');
        else link.removeAttribute('aria-current');
      });
    }, { rootMargin: '-10% 0px -55% 0px' });
    links.forEach((link) => {
      const section = document.getElementById(link.hash.slice(1));
      if (section) observer.observe(section);
    });
  }

  const switcher = document.querySelector('.reader-map .view-switcher');
  if (switcher) {
    switcher.setAttribute('role', 'tablist');
    const tabs = [...switcher.querySelectorAll('.view-tab')];
    const syncTabs = () => tabs.forEach((tab) => {
      const selected = tab.classList.contains('active');
      const panel = document.getElementById(`panel-${tab.dataset.panel}`);
      tab.id = `reader-tab-${tab.dataset.panel}`;
      tab.setAttribute('role', 'tab');
      tab.setAttribute('aria-controls', panel.id);
      tab.setAttribute('aria-selected', String(selected));
      tab.tabIndex = selected ? 0 : -1;
      panel.setAttribute('role', 'tabpanel');
      panel.setAttribute('aria-labelledby', tab.id);
      panel.hidden = !selected;
    });
    syncTabs();
    document.addEventListener('DOMContentLoaded', syncTabs, { once: true });
    new MutationObserver(syncTabs).observe(switcher, {
      subtree: true, attributes: true, attributeFilter: ['class']
    });
    switcher.addEventListener('keydown', (event) => {
      if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
      event.preventDefault();
      const index = tabs.indexOf(document.activeElement);
      const next = event.key === 'Home' ? 0 : event.key === 'End' ? tabs.length - 1
        : (index + (event.key === 'ArrowRight' ? 1 : -1) + tabs.length) % tabs.length;
      tabs[next].click();
      tabs[next].focus();
    });
  }

  document.querySelectorAll('.home-songs audio').forEach((player) => {
    player.addEventListener('play', () => {
      document.querySelectorAll('.home-songs audio').forEach((other) => {
        if (other !== player) other.pause();
      });
    });
  });
})();
