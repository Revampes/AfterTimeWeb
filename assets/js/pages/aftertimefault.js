document.addEventListener('DOMContentLoaded', () => {
  /* =========================================================
   * Reveal-on-scroll
   * =======================================================*/
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('reveal-in');
        entry.target.classList.remove('reveal-init');
        observer.unobserve(entry.target);
      }
    });
  }, { root: null, threshold: 0.12, rootMargin: '0px 0px -10% 0px' });

  const markForReveal = (nodes) => {
    if (!nodes) return;
    (nodes instanceof Element ? [nodes] : nodes).forEach(el => {
      if (el) { el.classList.add('reveal-init'); observer.observe(el); }
    });
  };

  /* =========================================================
   * Data model (flattened modules with derived metadata)
   * =======================================================*/
  const rawCategories = {
    kuudra: { modules: [
      { id: 'auto-refill-pearls', title: 'Auto Refill Pearls', content: `<p>Automatically refills your ender pearls from your sack. Combo with pearl cancel.</p><div class="notice-label"><p>Warning: Use at your own risk!</p><p>Disable when using spirit leap in dungeon (counts as pearl).</p></div>` },
      { id: 'dynamic-pearl-calculator', title: 'Dynamic Pearl Calculator', content: `<p>Highlights the best throw spot / angle.</p>` },
      { id: 'crate-beam', title: 'Crate Beam Highlight', content: `<p>Highlights supplies / crates using a beacon beam.</p>` },
      { id: 'crate-hitbox', title: 'Crate Hitbox', content: `<p>ESP hitbox highlight for supplies / crates.</p>` },
      { id: 'pearl-cancel', title: 'Pearl Cancel', content: `<p>Blocks right click timing to enable downward pearl throws.</p><div class="notice-label"><p>Warning: Use at your own risk!</p></div>` },
      { id: 'track-arrow', title: 'Twilight/Toxic Arrow Tracker', content: `<p>Tracks twilight & toxic arrow poison counts.</p><div class="image-wrapper"><img src="assets/images/photos/Skyblock/arrowposion.png" alt="Arrow Poison"></div>` },
      { id: 'hide-useless-perk', title: 'Hide Useless Perk', content: `<p>Hide / block useless perk clicks (WIP).</p><div class="notice-label"><p>Notice: Currently not working.</p></div>` },
      { id: 'crate-aura', title: 'Crate Aura', content: `<p>Auto right click crate within 4 blocks (1s cooldown).</p><div class="notice-label"><p>Automation related – use at your own risk.</p></div>` },
      { id: 'crate-priority', title: 'Crate Priority', content: `<p>Generates action titles from (No Pre) party messages.</p><div class="notice-label"><p>Requires party members enabling Check No Pre.</p></div>` },
      { id: 'fresh-message', title: 'Fresh Message', content: `<p>Announces fresh tools during build phase.</p>` },
      { id: 'chest-open-notice', title: 'Chest Open Notice', content: `<p>Notifies party when you open a Kuudra chest.</p><ul><li>Auto Open Chest</li><li>Auto Requeue</li></ul><div class="notice-label"><p>Auto Open Chest is use at your own risk.</p></div>` }
    ]},
    dungeon: { modules: [
      { id: 'leap-announce', title: 'Leap Announce', content: `<p>Announces leap target in party chat.</p>` },
      { id: 'mob-highlighter', title: 'Mob Highlight', content: `<p>ESP highlight for starred mobs.</p><div class="image-wrapper"><img src="assets/images/photos/Dungeon/starmobhighlight.png" alt="Star Mob Highlight"></div>` },
      { id: 'invincible-timer', title: 'Invincible Timer', content: `<p>Bonzo / spirit / phoenix invincibility timers.</p>` },
      { id: 'ghost-block', title: 'Floor7 Pre Ghost Block', content: `<p>Generates ghost blocks for F7 routing.</p><div class="notice-label"><p>Warning: Use at your own risk!</p><p>Will evolve with DungeonBreaker release.</p>
        </div><div class="image-wrapper">
            <img src="assets/images/photos/Dungeon/f7p1.png" alt="F7">
            <img src="assets/images/photos/Dungeon/f7p2.png" alt="F7">
            <img src="assets/images/photos/Dungeon/f7p3.1.png" alt="F7">
            <img src="assets/images/photos/Dungeon/f7p3.2.1.png" alt="F7">
            <img src="assets/images/photos/Dungeon/f7p3.2.2.png" alt="F7">
            <img src="assets/images/photos/Dungeon/f7core.png" alt="F7">
            <img src="assets/images/photos/Dungeon/f7gold.png" alt="F7">
            <img src="assets/images/photos/Dungeon/f7eep5.png" alt="F7">
        </div>` },
      { id: 'key-highlight', title: 'Wither/Blood Key Highlight', content: `<p>ESP highlight for keys.</p><div class="image-wrapper"><img src="assets/images/photos/Dungeon/witherkeyhighlight.png" alt="Wither Key"><img src="assets/images/photos/Dungeon/bloodkeyhighlight.png" alt="Blood Key"></div>` },
      { id: 'secret-click-highlight', title: 'Secret Click Highlight', content: `<p>Color hitbox for clicked secret (chest/lever/button).</p>` },
      { id: 'custom-terminals-ui', title: 'Custom Terminals UI', content: `<p>Large, minimal terminals UI.
      </p><div class="image-wrapper">
        <h3>Colors</h3>
        <img src="assets/images/photos/Dungeon/colors.png" alt="Colors Terminal">
        <h3>Melody</h3>
        <img src="assets/images/photos/Dungeon/melody.png" alt="Melody Terminal">
        <h3>Numbers</h3>
        <img src="assets/images/photos/Dungeon/numbers.png" alt="Numbers Terminal">
        <h3>Red green</h3>
        <img src="assets/images/photos/Dungeon/redgreen.png" alt="Red green Terminal">
        <h3>Rubix</h3>
        <img src="assets/images/photos/Dungeon/rubix.png" alt="Rubix Terminal">
        <h3>Starts with</h3>
        <img src="assets/images/photos/Dungeon/startswith.png" alt="Starts with Terminal">
      </div>` },
      { id: 'watcher-timer', title: 'Watcher Timer', content: `<p>Helps mage timing for blood clear.</p>` },
      { id: 'p3-tick-timer', title: 'Phase Three Tick Timer', content: `<p>Instant death early entry timer.</p>` }
    ]},
    fishing: { modules: [
      { id: 'auto-fish', title: 'Auto Fish', content: `<p>Automatically reels & recasts your rod.</p><div class="notice-label"><p>Use at your own risk.</p></div><div class="video-wrapper"><a class="video-thumb" href="https://youtu.be/NS9oywaLgtA" target="_blank" rel="noopener"><img src="https://img.youtube.com/vi/NS9oywaLgtA/hqdefault.jpg" alt="Auto Fish"></a></div>` }
    ]},
    render: { modules: [
      { id: 'no-debuff', title: 'No Debuff', content: `<p>Removes blindness & liquid fog.</p><div class="notice-label"><p>Use at your own risk!</p></div><div class="image-wrapper"><img src="assets/images/photos/render/nodeff.png" alt="No Debuff"></div>` },
      { id: 'full-bright', title: 'Full Bright', content: `<p>Max gamma daylight effect.</p>` },
      { id: 'etherwarp-overlay', title: 'Etherwarp Overlay', content: `<p>Highlights valid etherwarp targets.</p>` },
      { id: 'player-esp', title: 'PlayerESP', content: `<p>ESP entity boxes for players.</p><div class="notice-label"><p>Use at your own risk.</p></div><div class="image-wrapper"><img src="assets/images/photos/render/playeresp.png" alt="Player ESP"></div>` },
      { id: 'name-tag', title: 'NameTag', content: `<p>Large nametag through blocks.</p><div class="notice-label"><p>Use at your own risk.</p></div><div class="image-wrapper"><img src="assets/images/photos/render/nametag.png" alt="NameTag"></div>` }
    ]},
    skyblock: { modules: [
      { id: 'fast-hotkey', title: 'Fast Hotkey', content: `<p>UI command executor.</p><div class="video-wrapper"><a class="video-thumb" href="https://youtu.be/ImsxT4CHpUo" target="_blank" rel="noopener"><img src="https://img.youtube.com/vi/ImsxT4CHpUo/hqdefault.jpg" alt="Fast Hotkey"></a></div>` },
      { id: 'storage-preview', title: 'Storage Preview', content: `<p>View & grab items from storage containers.</p><div class="image-wrapper"><img src="assets/images/photos/Skyblock/storagepreview.png" alt="Storage Preview"></div>` },
      { id: 'toggle-sprint', title: 'Toggle Sprint', content: `<p>Persistent sprint without holding key.</p>` },
      { id: 'auto-experiment', title: 'Auto Experiment', content: `<p>Automates experimentation table interactions.</p><div class="notice-label"><p>Use at your own risk.</p></div>` },
      { id: 'hotbar-swap', title: 'Hotbar Swap', content: `<p>Passive or command-driven hotbar swapping.</p><div class="notice-label"><p>Use at your own risk.</p></div><div class="video-wrapper"><a class="video-thumb" href="https://youtu.be/ImsxT4CHpUo" target="_blank" rel="noopener"><img src="https://img.youtube.com/vi/ImsxT4CHpUo/hqdefault.jpg" alt="Hotbar Swap"></a></div>` },
      { id: 'search-bar', title: 'Search Bar', content: `<p>Highlights inventory items matching search.</p><div class="notice-label"><p>Requires pressing E twice when unfocused (bug).</p></div>` },
      { id: 'chat-command', title: 'Party Command', content: `<p>Regex shortcuts expand into party commands.</p>` },
      { id: 'waypoint-grab', title: 'Waypoint', content: `<p>Generate temporary beams from waypoint messages.</p>` },
      { id: 'flux-flare-timer', title: 'FluxFlare Timer', content: `<p>Tracks remaining flux / flare duration.</p><div class="notice-label"><p>Flare timer also triggered by Bonzo staff fireworks.</p></div>` }
    ]},
    performance: { modules: [
      { id: 'hide-useless-message', title: 'Hide Useless Message', content: `<p>Suppress clutter chat messages.</p>` },
      { id: 'hide-lightning', title: 'Hide Lightning', content: `<p>Hide lightning particles / effects for FPS.</p>` }
    ]}
  };

  const modules = [];
  Object.keys(rawCategories).forEach(cat => {
    rawCategories[cat].modules.forEach(mod => {
      const div = document.createElement('div');
      div.innerHTML = mod.content;
      const text = div.textContent || '';
      const firstSentence = (text.trim().split(/\.|\n/)[0] || '').trim();
      const short = firstSentence.length > 120 ? firstSentence.slice(0,117) + '…' : firstSentence;
      const risky = /use at your own risk|warning:/i.test(text);
      const hasMedia = /<img|<video|video-wrapper|video-thumb|iframe|<ul|setting/i.test(mod.content);
      modules.push({ id: mod.id, name: mod.title, category: cat, content: mod.content, short, risky, hasMedia });
    });
  });

  /* =========================================================
   * DOM references
   * =======================================================*/
  const tabs = document.querySelectorAll('.atf-tab');
  const panels = document.querySelectorAll('.tab-panel');
  const grid = document.getElementById('modules-grid');
  const tagSelect = document.getElementById('module-tag-select');
  // Force reset tag select to 'all' on load to avoid persisted selection after refresh
  if (tagSelect) tagSelect.value = 'all';
  const searchInput = document.getElementById('module-search');
  const resetBtn = document.getElementById('reset-filters');
  const noMsg = document.getElementById('no-modules-msg');
  const modal = document.getElementById('module-modal');
  const modalBody = document.getElementById('module-modal-body');
  const modalTitle = document.getElementById('module-modal-title');

  /* =========================================================
   * Tabs handling
   * =======================================================*/
  function activateTab(name) {
    tabs.forEach(t => {
      const active = t.dataset.tab === name;
      t.classList.toggle('active', active);
      t.setAttribute('aria-selected', String(active));
    });
    panels.forEach(p => {
      const active = p.id === `tab-${name}`;
      p.classList.toggle('active', active);
      if (active) p.removeAttribute('hidden'); else p.setAttribute('hidden', 'true');
    });
  }
  tabs.forEach(btn => {
    btn.addEventListener('click', () => activateTab(btn.dataset.tab));
    btn.addEventListener('keydown', e => {
      if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
        e.preventDefault();
        const arr = Array.from(tabs);
        const i = arr.indexOf(btn);
        const next = e.key === 'ArrowRight' ? (i + 1) % arr.length : (i - 1 + arr.length) % arr.length;
        arr[next].focus();
      }
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); activateTab(btn.dataset.tab); }
    });
  });

  /* =========================================================
   * Filtering
   * =======================================================*/
  // Filtering logic variables
  let currentTag = 'all';
  let currentSearch = '';
  function applyFilters() {
    const term = currentSearch.trim().toLowerCase();
    const list = modules.filter(m => {
      if (currentTag !== 'all') {
        if (currentTag === 'risk') {
          if (!m.risky) return false;
        } else if (currentTag === 'media') {
          if (!m.hasMedia) return false;
        } else if (m.category !== currentTag) {
          return false;
        }
      }
      if (!term) return true;
      return m.name.toLowerCase().includes(term) || m.short.toLowerCase().includes(term) || m.category.includes(term);
    });
    renderGrid(list);
  }
  tagSelect?.addEventListener('change', () => { currentTag = tagSelect.value; applyFilters(); });
  searchInput?.addEventListener('input', () => { currentSearch = searchInput.value; applyFilters(); });
  resetBtn?.addEventListener('click', () => {
    currentTag = 'all'; currentSearch='';
    if (tagSelect) tagSelect.value='all';
    if (searchInput) searchInput.value='';
    applyFilters();
    searchInput?.focus();
  });

  /* =========================================================
   * Grid rendering
   * =======================================================*/
  function escapeHTML(str){return str.replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;','\'':'&#39;'}[c]));}
  function renderGrid(list) {
    if (!grid) return;
    grid.innerHTML='';
    if (!list.length) { noMsg?.classList.remove('hidden'); return; }
    noMsg?.classList.add('hidden');
    const frag = document.createDocumentFragment();
    list.forEach(m => {
      const card = document.createElement('div');
      card.className='module-card';
      card.innerHTML = `
        <div class="module-card-head">
          <h3 class="module-card-title">${m.name}</h3>
        </div>
        <p class="module-card-desc">${escapeHTML(m.short)}</p>
        <div class="module-card-tags">
          <span class="module-tag module-tag-cat">${m.category}</span>
          ${m.hasMedia ? '<span class="module-tag module-tag-media" title="Contains media or settings">Media</span>' : ''}
          ${m.risky ? '<span class="tag tag-risk" title="May be disallowed or risky">Use at your own risk</span>' : ''}
        </div>
        <div class="module-card-actions"><button class="details-btn" data-module-id="${m.id}" type="button">Details</button></div>`;
      frag.appendChild(card);
    });
    grid.appendChild(frag);
    markForReveal(grid.querySelectorAll('.module-card'));
  }

  /* =========================================================
   * Modal
   * =======================================================*/
  function openModal(mod){
    if (!modal) return;
    modalTitle.textContent = mod.name;
    modalBody.innerHTML = `<div class="module-detail-body">${mod.content}</div>`;
    modal.classList.add('open');
    modal.setAttribute('aria-hidden','false');
    document.body.style.overflow='hidden';
    setTimeout(()=>{ modal.querySelector('.modal-close')?.focus(); },30);
  }
  function closeModal(){
    if (!modal) return;
    modal.classList.remove('open');
    modal.setAttribute('aria-hidden','true');
    document.body.style.overflow='';
  }
  modal?.addEventListener('click', e => { if (e.target.matches('[data-close-modal]')) closeModal(); });
  document.addEventListener('keydown', e => { if (e.key==='Escape' && modal?.classList.contains('open')) closeModal(); });
  grid?.addEventListener('click', e => {
    const btn = e.target.closest('.details-btn');
    if (!btn) return;
    const id = btn.getAttribute('data-module-id');
    const mod = modules.find(m=>m.id===id);
    if (mod) openModal(mod);
  });
  modal?.querySelector('.modal-close')?.addEventListener('click', closeModal);

  /* =========================================================
   * Init
   * =======================================================*/
  markForReveal([document.querySelector('.hero-blur'), document.querySelector('.atf-tabs')]);
  activateTab('overview');
  applyFilters();
});

// Smooth scrolling (future anchors)
document.querySelectorAll('a.scroll-link').forEach(a=>{
  a.addEventListener('click', e=>{ e.preventDefault(); const id=a.getAttribute('href'); const el=document.querySelector(id); el?.scrollIntoView({behavior:'smooth',block:'start'}); });
});

// Sidebar helpers
function openNav(){ document.getElementById('mySidenav').style.width='250px'; }
function closeNav(){ document.getElementById('mySidenav').style.width='0'; }
