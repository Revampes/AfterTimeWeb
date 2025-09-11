document.addEventListener('DOMContentLoaded', () => {
  // Setup: reveal-on-scroll observer
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        el.classList.add('reveal-in');
        el.classList.remove('reveal-init');
        observer.unobserve(el);
      }
    });
  }, { root: null, threshold: 0.12, rootMargin: '0px 0px -10% 0px' });

  const markForReveal = (nodes) => {
    if (!nodes) return;
    const list = (nodes instanceof Element) ? [nodes] : nodes;
    list.forEach(el => {
      if (!el) return;
      el.classList.add('reveal-init');
      observer.observe(el);
    });
  };

  // Mark initial static blocks in main content for reveal animation
  markForReveal(document.querySelectorAll(
    '#main > h1, .hero-blur, .features, .feature-card, .mod-description-container, .mod-card, .categories-layout, .modules-column, .details-column, .category-tabs, .module-detail, .tutorial-container, .tutorial-card, footer'
  ));

  const categories = {
    kuudra: {
      title: 'Kuudra',
      modules: [
        { id: 'auto-refill-pearls', title: 'Auto Refill Pearls', content: `<p>Automatically refills your ender pearls from your sack. Combo with pearl cancel.</p>
             <div class="notice-label">
               <p>Warning: Use at your own risk!</p>
               <p>Disable this module when you're using spirit leap in dungeon as it also counts as ender pearl</p>
             </div>
        `},
        { id: 'dynamic-pearl-calculator', title: 'Dynamic Pearl Calculator', content: `<p>Highlight the spot/angle that you should aim at.</p>` },
        { id: 'crate-beam', title: 'Crate Beam Highlight', content: `<p>Highlight supplies/crates with beacon beam.</p>`},
        { id: 'crate-hitbox', title: 'Crate Hitbox', content: `<p>Highlight supplies/crates with ESP hitbox.</p>`},
        { id: 'pearl-cancel', title: 'Pearl Cancel', content: `<p>Blocked right click action so that you can throw ender pearl towards ground.</p>
             <div class="notice-label">
                <p>Warning: Use at your own risk!</p>
             </div>
        `},
        { id: 'track-arrow', title: 'Twilight/Toxic Arrow Tracker', content: `<p>Track the number of twilight and toxic arrow posion in player's inventory
            <div class="image-wrapper">
                <img src="assets/images/photos/Skyblock/arrowposion.png" alt="Arrow Posion image">
            </div>
        `},
        { id: 'hide-useless-perk', title: 'Hide Useless Perk', content: `<p>Hide and block user from clicking useless perk</p>
             <div class="notice-label">
                <p>Notice: Currently not working in progress!</p>
             </div>
        `},
        { id: 'crate-aura', title: 'Crate Aura', content: `<p>Automatically interact (right click armorstand's helmet) with supply/crate when its within four blocks range (1s cooldown)</p>
            <div class="notice-label">
                <p>This feature is related to automation, use at your own risk.</p>
            </div>
        `},
        { id: 'crate-priority', title: 'Crate Priority', content: `<p>Recieve (No Pre) message from party members and create title indicates what you should do next.</p>
            <div class="notice-label">
                <p>This feature requires all other party members to enable Check No Pre module</p>
            </div>
        `},
        { id: 'fresh-message', title: 'Fresh Message', content: `<p>Announce when you get fresh tools during build phase in party chat</p>`},
        { id: 'chest-open-notice', title: 'Chest Open Notice', content: `<p>To notice other party members when you've opened the kuudra reward chest.</p>
            <ul>
                <li>Auto Open Chest</li>
                <li>Auto Requeue</li>
            </ul>
            <div class="notice-label">
                <p>Auto Open Chest subsetting is used at your own risk</p>
            </div>
        `}

      ]
    },
    dungeon: {
      title: 'Dungeon',
      modules: [
        { id: 'leap-announce', title: 'Leap Announce', content: `<p>Announce in party chat that you have leaped to someone with in-game name.</p>` },
        { id: 'mob-highlighter', title: 'Mob Highlight', content: `<p>Highlights starred mobs with ESP Hitbox through wall.</p>` },
        { id: 'invincible-timer', title: 'Invincible timer', content: `<p>Create a visible ui for player to know the exact time of bonzo/spirit/phoenix cooldown</p>`},
        { id: 'ghost-block', title: 'Floor7 Pre Ghost Block', content: `<p>Automatically create ghost block in f7 boss room for better gaming experience</p>
            <div class="notice-label">
                <p>Warning: Use at your own risk!</p>
                <p>This feature will not be removed once DungeonBreaker is released.</p>
                <ul>
                    <li>Instead, there will be ghost block stop you from walking (for more precise mining with dungeonbreaker)</li>
                </ul>
            </div>
        `},
        { id: 'key-highlight', title: 'Wither/Blood Key Highlight', content: `<p>Highlights wither and blood key with ESP hitbox through wall.</p>`},
        { id: 'secret-click-highlight', title: 'Secret Click Highlight', content: `<p>Highlights the clicked secret with colored hitbox in dungeon.</p><p>e.g. secret chest, lever and button</p>`},
        { id: 'custom-terminals-ui', title: 'Custom Terminals UI', content: `<p>Provide a large and clean terminals GUI</p>`},
        { id: 'watcher-timer', title: 'Watcher Timer', content: `<p>Notice when mage should clear blood mobs.</p>`},
        { id: 'p3-tick-timer', title: 'Phase three tick timer', content: `<p>Instant death timer for early entering phase3</p>`}
      ]
    },
    fishing: {
      title: 'Fishing',
      modules: [
        { id: 'auto-fish', title: 'Auto Fish', content: `<p>Automatically reels and casts your rod.</p>
        <br>
        <p>You can toggle these helper functions</p>
        <div class="image-wrapper">
            <img src="assets/images/photos/Fishing/autofishsettingone.png" alt="AutoFish setting">
        </div>
        <br>
        <p>You are able to adjust:</p>
        <div class="image-wrapper">
            <img src="assets/images/photos/Fishing/autofishsettingtwo.png" alt="AutoFish setting">
        </div>
        `}
      ]
    },
    render: {
      title: 'Render',
      modules: [
        { id: 'no-debuff', title: 'No Debuff', content: `<p>Remove blindness, fog effect under liquid.</p>
            <div class="notice-label">
                <p>Use at your own risk!</p>
            </div>
        `},
        { id: 'full-bright', title: 'Full Bright', content: `<p>Increase gamma value to see SUN everywhere.</p>`},
        { id: 'etherwarp-overlay', title: 'Etherwarp Overlay', content: `<p>Highlight the available block that you're allowed to etherwarp with.</p>`},
        { id: 'player-esp', title: 'PlayerESP', content: `<p>Generate entitybox to highlight player through wall/block</p>`},
        { id: 'name-tag', title: 'NameTag', content: `<p>Generate a bigger nametag of player through wall/block</p>`}
      ]
    },
    skyblock: {
      title: 'Skyblock',
      modules: [
        { id: 'fast-hotkey', title: 'Fast Hotkey', content: `<p>Create a UI for executing command without typing.</p>
            <div class="video-wrapper">
              <a class="video-thumb" href="https://youtu.be/ImsxT4CHpUo" target="_blank" rel="noopener noreferrer" title="Fast Hotkey Demo">
                <img src="https://img.youtube.com/vi/ImsxT4CHpUo/hqdefault.jpg" alt="Fast Hotkey Demo">
                <span class="play-overlay">▶</span>
              </a>
            </div>
            <div class="video-caption">Click the thumbnail to open the video on YouTube</div>` },
        { id: 'storage-preview', title: 'Storage Preview', content: `<p>Allow player to view and grab items from enderchest or storage</p>
            <div class="image-wrapper">
                <img src="assets/images/photos/Skyblock/storagepreview.png" alt="Storage preview image">
            </div>
        `},
        { id: 'toggle-sprint', title: 'Toggle sprint', content: `<p>You can no longer have to hold your sprint keybind.</p>`},
        { id: 'auto-experiment', title: 'Auto Experiment', content: `<p>Automatically do experimental table.</p>`},
        { id: 'hotbar-swap', title: 'Hotbar Swap', content: `<p>Automatically/passively swap hotbar items triggered by command or in game message</p>
            <div class="video-wrapper">
                <a class="video-thumb" href="https://youtu.be/ImsxT4CHpUo" target="_blank" rel="noopener noreferrer" title="Hotbar Swap Demo">
                    <img src="https://img.youtube.com/vi/ImsxT4CHpUo/hqdefault.jpg" alt="Hotbar Swap Demo">
                    <span> class="play-overlay">▶</span>
                </a>
            </div>
            <div class="video-caption">Click the thumbnail to open the video on YouTube</div>` },
        { id: 'search-bar', title: 'Search Bar', content: `<p>Highlight the item you would like to find in your inventory/enderchest/storage/chest</p>
            <div class="notice-label">
                <p>This feature is currently bugged when you're not focusing on the search bar (you pressed E and it will first open your player inventory)</p>
                <p>Simply, you have to click E twice</p>
            </div>
        `},
        { id: 'chat-command', title: 'Party Command', content: `<p>Allow player to do short regex for executing long command in party</p>`},
        { id: 'waypoint-grab', title: 'Waypoint', content: `<p>Get waypoint message sent by you or your party membranes and generate beacon beam staying for 20 seconds</p>`},
        { id: 'flux-flare-timer', title: 'FluxFlare Timer', content: `<p>A timer to show the remaining time for flux or flare</p>
            <div class="notice-label">
                <p>Notice that the flare timer will also be triggered by bonzo's staff (or else that creates firework sound)</p>
            </div>
        `}
      ]
    },
    performance: {
      title: 'Performance',
      modules: [
        { id: 'hide-useless-message', title: 'Hide Useless Message', content: `<p>Hide useless message in game for cleaner chatbox.</p>`},
        { id: 'hide-lightning', title: 'Hide lightning', content: `<p>Hide lightning in order to improve game performance.</p>`}
      ]
    }
  };

  const tabsContainer = document.getElementById('category-tabs');
  const tabsContainerMobile = document.getElementById('category-tabs-mobile');
  const modulesList = document.getElementById('modules-list');
  const categoryTitle = document.getElementById('category-title');
  const moduleTitle = document.getElementById('module-title');
  const moduleContent = document.getElementById('module-content');

  if (!tabsContainer || !modulesList || !categoryTitle || !moduleTitle || !moduleContent) {
    console.warn('aftertimefault.js: required DOM elements not found.');
    return;
  }

  let activeCategoryKey = Object.keys(categories)[0];
  let activeModuleId = null;

  function buildCategoryTabsHTML() {
    return Object.keys(categories).map(key => {
      const active = key === activeCategoryKey ? ' active' : '';
      return `<button type="button" class="category-tab${active}" data-category="${key}">${categories[key].title}</button>`;
    }).join('');
  }

  function renderCategoryTabs() {
    const html = buildCategoryTabsHTML();
    if (tabsContainer) tabsContainer.innerHTML = html;
    if (tabsContainerMobile) tabsContainerMobile.innerHTML = html; // mirror for mobile
    markForReveal([tabsContainer]);
    if (tabsContainerMobile) markForReveal([tabsContainerMobile]);
  }

  function onCategoryClick(e) {
    const btn = e.target.closest && e.target.closest('.category-tab');
    if (!btn) return;
    const key = btn.dataset.category;
    if (!key || !categories[key] || key === activeCategoryKey) return;
    activeCategoryKey = key;
    activeModuleId = categories[key].modules.length ? categories[key].modules[0].id : null;
    renderCategoryTabs();
    renderModulesList();
    renderModuleDetail();
  }

  // Event delegation for both desktop + mobile tab containers
  if (tabsContainer) tabsContainer.addEventListener('click', onCategoryClick);
  if (tabsContainerMobile) tabsContainerMobile.addEventListener('click', onCategoryClick);

  function renderModulesList() {
    const cat = categories[activeCategoryKey];
    // update category title
    categoryTitle.textContent = cat.title;
    if (!cat.modules || !cat.modules.length) {
      modulesList.innerHTML = '<p>No modules available for this category.</p>';
      moduleTitle.textContent = 'Select a module';
      moduleContent.innerHTML = 'Choose a module on the left to see details here.';
      // Apply reveal animation to empty states
      markForReveal([modulesList, moduleContent]);
      return;
    }
    // build buttons as HTML in one go to avoid duplicates
    const html = cat.modules.map(mod => {
      const active = activeModuleId === mod.id ? ' active' : '';
      return `<button type="button" class="module-button${active}" data-module-id="${mod.id}">${mod.title}</button>`;
    }).join('');
    modulesList.innerHTML = html;
    // Apply reveal animation to newly rendered modules list
    markForReveal([modulesList]);
  }

  // Delegated click handler for module buttons
  modulesList.addEventListener('click', (e) => {
    const btn = e.target.closest && e.target.closest('.module-button');
    if (!btn) return;
    const id = btn.dataset.moduleId || btn.getAttribute('data-module-id');
    if (!id) return;
    activeModuleId = id;
    // update active class for buttons
    modulesList.querySelectorAll('.module-button').forEach(b => b.classList.toggle('active', b.dataset.moduleId === id));
    renderModuleDetail();
  });

  function renderModuleDetail() {
    const cat = categories[activeCategoryKey];
    const mod = cat.modules.find(m => m.id === activeModuleId) || cat.modules[0];
    if (!mod) {
      moduleTitle.textContent = 'Select a module';
      moduleContent.innerHTML = 'Choose a module on the left to see details here.';
      markForReveal([moduleContent]);
      return;
    }
    moduleTitle.textContent = mod.title;
    moduleContent.innerHTML = mod.content;
    // Apply reveal animation to newly injected module content
    markForReveal([moduleTitle, moduleContent]);
    markForReveal(moduleContent.querySelectorAll(':scope > *'));
  }

  // initial selection
  activeModuleId = categories[activeCategoryKey].modules.length ? categories[activeCategoryKey].modules[0].id : null;
  renderCategoryTabs();
  renderModulesList();
  renderModuleDetail();

});

// Smooth scrolling for anchor links
document.querySelectorAll('a.scroll-link').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        const targetElement = document.querySelector(targetId);

        if (targetElement) {
            targetElement.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Sidebar helpers (keep these global for other pages)
function openNav() { document.getElementById('mySidenav').style.width = '250px'; }
function closeNav() { document.getElementById('mySidenav').style.width = '0'; }
