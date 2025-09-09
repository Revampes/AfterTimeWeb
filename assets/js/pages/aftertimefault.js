document.addEventListener('DOMContentLoaded', () => {
  const categories = {
    kuudra: {
      title: 'Kuudra',
      modules: [
        { id: 'auto-refill-pearls', title: 'Auto Refill Pearls', content: `<p>Automatically refills your ender pearls from your sack. Combo with pearl cancel.</p>` },
        { id: 'dynamic-pearl-calculator', title: 'Dynamic Pearl Calculator', content: `<p>Highlight the spot/angle that you should aim at.</p>` }
      ]
    },
    dungeon: {
      title: 'Dungeon',
      modules: [
        { id: 'leap-announce', title: 'Leap Announce', content: `<p>Announce in party chat that you have leaped to someone with in-game name.</p>` },
        { id: 'mob-highlighter', title: 'Mob Highlighter', content: `<p>Highlights important mobs and rare spawns to make them easier to find in dungeons.</p>` }
      ]
    },
    fishing: {
      title: 'Fishing',
      modules: [
        { id: 'auto-fish', title: 'Auto Fish', content: `<p>Automatically reels and casts your rod.</p><ul><li>AutoShift</li><li>SlugMode</li></ul>` }
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

// Sidebar helpers (keep these global for other pages)
function openNav() { document.getElementById('mySidenav').style.width = '250px'; }
function closeNav() { document.getElementById('mySidenav').style.width = '0'; }
