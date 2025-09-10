document.addEventListener('DOMContentLoaded', () => {
  const categories = {
    kuudra: {
      title: 'Kuudra',
      modules: [
        { id: 'auto-refill-pearls', title: 'Auto Refill Pearls', content: `<p>Automatically refills your ender pearls from your sack. Combo with pearl cancel.</p>
             <div class="notice-label">
               <p>Warning: Use at your own risk!</p>
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
        { id: 'track-arrow', title: 'Twilight/Toxic Arrow Tracker', content: `<p>Track the number of twilight and toxic arrow posion in player's inventory`},
        { id: 'hide-useless-perk', title: 'Hide Useless Perk', content: `<p>Hide and block user from clicking useless perk</p>
             <div class="notice-label">
                <p>Notice: Currently not working in progress!</p>
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
                    <li>Instead, there will be ghost block stop you from walking (for more precise ghost block with dungeonbreaker)</li>
                </ul>
            </div>
        `},
        { id: 'key-highlight', title: 'Wither/Blood Key Highlight', content: `<p>Highlights wither and blood key with ESP hitbox through wall.</p>`},
        { id: 'secret-click-highlight', title: 'Secret Click Highlight', content: `<p>Highlights the clicked secret with colored hitbox in dungeon.</p><p>e.g. secret chest, lever and button</p>`},
        { id: 'custom-terminals-ui', title: 'Custom Terminals UI', content: `<p>Provide a large and clean terminals GUI</p>`},
        { id: 'watcher-timer', title: 'Watcher Timer', content: `<p>Notice when mage should clear blood mobs.</p>`}
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
        { id: 'custom-shaders', title: 'Custom Shaders', content: `<p>Toggle custom shader support and visual tweaks.</p>` }
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
            <div class="video-caption">Click the thumbnail to open the video on YouTube</div>` }
      ]
    },
    performance: {
      title: 'Performance',
      modules: [
        { id: 'hide-useless-message', title: 'Hide Useless Message', content: `<p>Hide useless message in game for cleaner chatbox.</p>`}
      ]
    }
  };

  const tabsContainer = document.getElementById('category-tabs');
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

  function renderCategoryTabs() {
    tabsContainer.innerHTML = '';
    Object.keys(categories).forEach(key => {
      const el = document.createElement('button');
      el.type = 'button';
      el.className = `category-tab ${key === activeCategoryKey ? 'active' : ''}`;
      el.dataset.category = key;
      el.textContent = categories[key].title;
      tabsContainer.appendChild(el);
    });
  }

  // Use event delegation for category clicks
  tabsContainer.addEventListener('click', (e) => {
    const btn = e.target.closest && e.target.closest('.category-tab');
    if (!btn) return;
    const key = btn.dataset.category;
    if (!key || !categories[key]) return;
    if (key === activeCategoryKey) return;
    activeCategoryKey = key;
    activeModuleId = categories[key].modules.length ? categories[key].modules[0].id : null;
    renderCategoryTabs();
    renderModulesList();
    renderModuleDetail();
  });

  function renderModulesList() {
    const cat = categories[activeCategoryKey];
    // update category title
    categoryTitle.textContent = cat.title;
    if (!cat.modules || !cat.modules.length) {
      modulesList.innerHTML = '<p>No modules available for this category.</p>';
      moduleTitle.textContent = 'Select a module';
      moduleContent.innerHTML = 'Choose a module on the left to see details here.';
      return;
    }
    // build buttons as HTML in one go to avoid duplicates
    const html = cat.modules.map(mod => {
      const active = activeModuleId === mod.id ? ' active' : '';
      return `<button type="button" class="module-button${active}" data-module-id="${mod.id}">${mod.title}</button>`;
    }).join('');
    modulesList.innerHTML = html;
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
      return;
    }
    moduleTitle.textContent = mod.title;
    moduleContent.innerHTML = mod.content;
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
