/**
 * shell.js — An Edifice of Lies
 * Reusable nav + footer injector for pages/
 *
 * Usage: include <script src="shell.js"></script> as the LAST element inside
 * <body> before any Webflow/jQuery scripts. The nav is inserted at afterbegin
 * of <body> and the footer is inserted immediately before this <script> tag,
 * so page-specific content sits cleanly between them.
 *
 * Optional page config (set before this script):
 *   window.EDIFICE = { active: 'evidence.html', title: 'Evidence' }
 */
(function () {
  'use strict';

  // Capture script reference immediately (document.currentScript is only live during execution)
  var _script = document.currentScript;

  // Determine which page is active for nav highlighting
  var _page = (window.EDIFICE && window.EDIFICE.active) ||
    window.location.pathname.split('/').pop() ||
    'index.html';

  /* ─── NAV HTML ────────────────────────────────────────────────────────── */

  var NAV = `<div class="nav" role="banner">
  <div class="container w-container">
    <div class="nav_container w-nav"
         data-collapse="medium"
         data-animation="default"
         data-duration="400"
         data-easing="ease"
         data-easing2="ease"
         role="banner">

      <!-- Logo -->
      <a href="index.html" class="logo-link w-inline-block nav_left" aria-label="An Edifice of Lies — home">
        <div class="nav_logo-icon">
          <svg width="100%" height="100%" viewBox="0 0 33 33" preserveAspectRatio="xMidYMid meet">
            <path d="M28,0H5C2.24,0,0,2.24,0,5v23c0,2.76,2.24,5,5,5h23c2.76,0,5-2.24,5-5V5c0-2.76-2.24-5-5-5ZM29,17c-6.63,0-12,5.37-12,12h-1c0-6.63-5.37-12-12-12v-1c6.63,0,12-5.37,12-12h1c0,6.63,5.37,12,12,12v1Z" fill="currentColor"/>
          </svg>
        </div>
        <div data-brand-name="true" class="paragraph_xlarge margin-bottom_none text_all-caps">An Edifice of Lies</div>
      </a>

      <!-- Desktop nav -->
      <div class="nav_right">
        <nav role="navigation" class="nav_menu w-nav-menu">
          <ul role="list" class="nav_menu-list w-list-unstyled">

            <!-- Framework mega-dropdown -->
            <li class="nav_menu-list-item">
              <div data-delay="0" data-hover="false" class="nav_dropdown-menu w-dropdown">
                <div class="nav_link w-dropdown-toggle" aria-haspopup="true" aria-expanded="false">
                  <div>Framework</div>
                  <div class="nav_caret w-icon-dropdown-toggle"></div>
                </div>
                <nav class="w-dropdown-list nav_mega-menu" aria-label="Framework pages">
                  <ul role="list" class="nav_mega-menu_list w-list-unstyled">

                    <li class="grid-item-manual">
                      <div class="eyebrow">Navigate the Case</div>
                      <ul role="list" class="mega-nav_list w-list-unstyled">
                        <li><a href="index.html" class="mega-nav_link-item w-inline-block">
                          <div class="content-block">
                            <div><strong>Overview</strong></div>
                            <div class="paragraph_small text-color_secondary">Introduction and framing of the case.</div>
                          </div>
                        </a></li>
                        <li><a href="timeline.html" class="mega-nav_link-item w-inline-block">
                          <div class="content-block">
                            <div><strong>Timeline</strong></div>
                            <div class="paragraph_small text-color_secondary">Chronological sequence of events.</div>
                          </div>
                        </a></li>
                        <li><a href="scene.html" class="mega-nav_link-item w-inline-block">
                          <div class="content-block">
                            <div><strong>Scene Reconstruction</strong></div>
                            <div class="paragraph_small text-color_secondary">Layout, cameras, and spatial context.</div>
                          </div>
                        </a></li>
                        <li><a href="players.html" class="mega-nav_link-item w-inline-block">
                          <div class="content-block">
                            <div><strong>Key Players</strong></div>
                            <div class="paragraph_small text-color_secondary">Roles and relationships of all parties.</div>
                          </div>
                        </a></li>
                      </ul>
                    </li>

                    <li class="grid-item-manual">
                      <div class="eyebrow">Evidence &amp; Analysis</div>
                      <ul role="list" class="mega-nav_list w-list-unstyled">
                        <li><a href="evidence.html" class="mega-nav_link-item w-inline-block">
                          <div class="content-block">
                            <div><strong>Evidence Database</strong></div>
                            <div class="paragraph_small text-color_secondary">Full filterable evidence record.</div>
                          </div>
                        </a></li>
                        <li><a href="contradictions.html" class="mega-nav_link-item w-inline-block">
                          <div class="content-block">
                            <div><strong>Contradictions</strong></div>
                            <div class="paragraph_small text-color_secondary">Mapped inconsistencies in the record.</div>
                          </div>
                        </a></li>
                        <li><a href="contradictions_grouped.html" class="mega-nav_link-item w-inline-block">
                          <div class="content-block">
                            <div><strong>Lies Grouped</strong></div>
                            <div class="paragraph_small text-color_secondary">Contradictions by theme and category.</div>
                          </div>
                        </a></li>
                        <li><a href="misconduct.html" class="mega-nav_link-item w-inline-block">
                          <div class="content-block">
                            <div><strong>Misconduct</strong></div>
                            <div class="paragraph_small text-color_secondary">Investigative and prosecutorial failures.</div>
                          </div>
                        </a></li>
                      </ul>
                    </li>

                    <li class="grid-item-manual">
                      <div class="eyebrow">Documents &amp; Tools</div>
                      <ul role="list" class="mega-nav_list w-list-unstyled">
                        <li><a href="documentspage.html" class="mega-nav_link-item w-inline-block">
                          <div class="content-block">
                            <div><strong>Source Documents</strong></div>
                            <div class="paragraph_small text-color_secondary">Filings, exhibits, and transcripts.</div>
                          </div>
                        </a></li>
                        <li><a href="connections.html" class="mega-nav_link-item w-inline-block">
                          <div class="content-block">
                            <div><strong>Connections Map</strong></div>
                            <div class="paragraph_small text-color_secondary">Relationships and network analysis.</div>
                          </div>
                        </a></li>
                        <li><a href="misconductandfailure.html" class="mega-nav_link-item w-inline-block">
                          <div class="content-block">
                            <div><strong>Misconduct &amp; Failure</strong></div>
                            <div class="paragraph_small text-color_secondary">Combined systemic failure analysis.</div>
                          </div>
                        </a></li>
                        <li><a href="prosecutor_allowed.html" class="mega-nav_link-item w-inline-block">
                          <div class="content-block">
                            <div><strong>Prosecutor Conduct</strong></div>
                            <div class="paragraph_small text-color_secondary">What the prosecution chose to allow.</div>
                          </div>
                        </a></li>
                      </ul>
                    </li>

                    <!-- CTA card -->
                    <li class="grid-item-manual">
                      <a href="documentspage.html" class="card-link is-inverse w-inline-block">
                        <div class="card_body">
                          <div class="heading_tertiary">Open the source documents archive</div>
                          <p class="paragraph_small text-color_inverse-secondary">Filings, exhibits, transcripts, and supporting materials from the full project record.</p>
                          <div class="margin_top-auto">
                            <div class="button-group">
                              <div class="text-button is-secondary">
                                <div>Open documents</div>
                                <div class="button_icon">
                                  <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 16 16" fill="none">
                                    <path d="M2 8H14.5M14.5 8L8.5 2M14.5 8L8.5 14" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/>
                                  </svg>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </a>
                    </li>

                  </ul>
                </nav>
              </div>
            </li>

            <li class="nav_menu-list-item">
              <a href="index.html" class="nav_link w-inline-block"><div>Overview</div></a>
            </li>
            <li class="nav_menu-list-item">
              <a href="evidence.html" class="nav_link w-inline-block"><div>Evidence</div></a>
            </li>
            <li class="nav_menu-list-item">
              <a href="timeline.html" class="nav_link w-inline-block"><div>Timeline</div></a>
            </li>

          </ul>
        </nav>

        <div class="button-group margin-top_none">
          <a href="contradictions.html" class="button w-inline-block">
            <div class="button_label">View contradictions</div>
          </a>
        </div>
      </div>

      <!-- Mobile hamburger -->
      <div class="nav_mobile-menu-button w-nav-button" aria-label="Open navigation menu">
        <div class="icon">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
            <g stroke-linecap="square" stroke-linejoin="miter" stroke-width="1.5" fill="none" stroke="currentColor" stroke-miterlimit="10">
              <line x1="1" y1="5"  x2="23" y2="5"  stroke="currentColor"/>
              <line x1="1" y1="12" x2="23" y2="12" stroke="currentColor"/>
              <line x1="1" y1="19" x2="23" y2="19" stroke="currentColor"/>
            </g>
          </svg>
        </div>
      </div>

    </div>
  </div>
</div>`;

  /* ─── FOOTER HTML ─────────────────────────────────────────────────────── */

  var FOOTER = `<footer class="footer is-inverse">
  <div class="container">
    <nav class="grid_5-col gap-small" aria-label="Footer navigation">

      <!-- Brand column -->
      <div class="grid-item-manual">
        <div class="flex_vertical gap-small">
          <a href="index.html" class="logo-link w-inline-block">
            <div class="nav_logo-icon">
              <svg width="100%" height="100%" viewBox="0 0 33 33" preserveAspectRatio="xMidYMid meet">
                <path d="M28,0H5C2.24,0,0,2.24,0,5v23c0,2.76,2.24,5,5,5h23c2.76,0,5-2.24,5-5V5c0-2.76-2.24-5-5-5ZM29,17c-6.63,0-12,5.37-12,12h-1c0-6.63-5.37-12-12-12v-1c6.63,0,12-5.37,12-12h1c0,6.63,5.37,12,12,12v1Z" fill="currentColor"/>
              </svg>
            </div>
            <div data-brand-name="true" class="paragraph_xlarge margin-bottom_none text_all-caps">An Edifice of Lies</div>
          </a>
        </div>
      </div>

      <!-- Navigate column -->
      <ul role="list" class="w-list-unstyled">
        <li><h3 class="heading_xxsmall text-color_secondary">Navigate</h3></li>
        <li><a href="index.html"   class="footer_link on-inverse w-inline-block"><div>Overview</div></a></li>
        <li><a href="timeline.html" class="footer_link on-inverse w-inline-block"><div>Timeline</div></a></li>
        <li><a href="evidence.html" class="footer_link on-inverse w-inline-block"><div>Evidence</div></a></li>
        <li><a href="players.html"  class="footer_link on-inverse w-inline-block"><div>Key Players</div></a></li>
        <li><a href="scene.html"    class="footer_link on-inverse w-inline-block"><div>Scene</div></a></li>
      </ul>

      <!-- Analysis column -->
      <ul role="list" class="w-list-unstyled">
        <li><h3 class="heading_xxsmall text-color_secondary">Analysis</h3></li>
        <li><a href="contradictions.html"         class="footer_link on-inverse w-inline-block"><div>Contradictions</div></a></li>
        <li><a href="contradictions_grouped.html"  class="footer_link on-inverse w-inline-block"><div>Lies Grouped</div></a></li>
        <li><a href="misconduct.html"              class="footer_link on-inverse w-inline-block"><div>Misconduct</div></a></li>
        <li><a href="misconductandfailure.html"    class="footer_link on-inverse w-inline-block"><div>Misconduct &amp; Failure</div></a></li>
        <li><a href="prosecutor_allowed.html"      class="footer_link on-inverse w-inline-block"><div>Prosecutor Conduct</div></a></li>
      </ul>

      <!-- Documents column -->
      <ul role="list" class="w-list-unstyled">
        <li><h3 class="heading_xxsmall text-color_secondary">Documents</h3></li>
        <li><a href="documentspage.html" class="footer_link on-inverse w-inline-block"><div>Source Documents</div></a></li>
        <li><a href="connections.html"   class="footer_link on-inverse w-inline-block"><div>Connections Map</div></a></li>
        <li><a href="editor.html"        class="footer_link on-inverse w-inline-block"><div>DB Editor</div></a></li>
      </ul>

      <!-- Contact column -->
      <ul role="list" class="w-list-unstyled">
        <li><h3 class="heading_xxsmall text-color_secondary">Contact</h3></li>
        <li>
          <a href="mailto:Leecountycorruptiontips@proton.me" class="footer_link on-inverse w-inline-block">
            <div>Submit tips</div>
          </a>
        </li>
        <li>
          <a href="false-allegation-framework.html" class="footer_link on-inverse w-inline-block">
            <div>Framework landing</div>
          </a>
        </li>
      </ul>

    </nav>
    <div class="divider margin-top_xsmall margin-bottom_xsmall"></div>
    <nav class="footer_bottom" aria-label="Footer legal">
      <div class="text-color_secondary">State v. Benjamin Allen — project materials. All content sourced from the public case record.</div>
    </nav>
  </div>
</footer>`;

  /* ─── INJECTION ───────────────────────────────────────────────────────── */

  // 1. Prepend nav as first child of <body>
  document.body.insertAdjacentHTML('afterbegin', NAV);

  // 2. Insert footer immediately before this <script> tag
  _script.insertAdjacentHTML('beforebegin', FOOTER);

  /* ─── ACTIVE LINK HIGHLIGHTING ────────────────────────────────────────── */

  var allLinks = document.querySelectorAll(
    '.nav_link, .mega-nav_link-item, .footer_link'
  );
  allLinks.forEach(function (link) {
    var href = link.getAttribute('href');
    if (href === _page || (href === 'index.html' && (_page === '' || _page === '/'))) {
      link.classList.add('w--current');
    }
  });

  /* ─── FALLBACK MOBILE MENU TOGGLE ─────────────────────────────────────── */
  // Webflow JS handles .w-nav-button natively; this is a safety fallback only.

  var mobileBtn = document.querySelector('.w-nav-button');
  var navMenu   = document.querySelector('.w-nav-menu');

  if (mobileBtn && navMenu) {
    // Only attach if Webflow hasn't already initialised the nav
    mobileBtn.addEventListener('click', function () {
      var open = this.classList.toggle('w--open');
      navMenu.classList.toggle('w--open', open);
      this.setAttribute('aria-expanded', open);
    });
  }

  /* ─── FALLBACK DROPDOWN TOGGLE ────────────────────────────────────────── */
  // Webflow handles .w-dropdown; this covers any cold-load edge cases.

  document.querySelectorAll('.w-dropdown').forEach(function (dd) {
    var toggle = dd.querySelector('.w-dropdown-toggle');
    var list   = dd.querySelector('.w-dropdown-list');
    if (!toggle || !list) return;

    toggle.addEventListener('click', function (e) {
      e.stopPropagation();
      var open = dd.classList.toggle('w--open');
      list.classList.toggle('w--open', open);
      toggle.setAttribute('aria-expanded', open);
    });
  });

  document.addEventListener('click', function () {
    document.querySelectorAll('.w-dropdown.w--open').forEach(function (dd) {
      dd.classList.remove('w--open');
      var list = dd.querySelector('.w-dropdown-list');
      var tog  = dd.querySelector('.w-dropdown-toggle');
      if (list) list.classList.remove('w--open');
      if (tog)  tog.setAttribute('aria-expanded', 'false');
    });
  });

})();
