document.addEventListener('DOMContentLoaded', function() {
  // Category + modules data
  const categories = {
    kuudra: {
      title: "Kuudra",
      modules: [
        {
          id: 'auto-refill-pearls',
          title: 'Auto Refill Pearls',
          content: `<p>Automatically refills your ender pearls from your inventory into the hotbar when you run out. Useful during boss fights to avoid being stranded without pearls.</p>`
        },
        {
          id: 'dynamic-pearl-calculator',
          title: 'Dynamic Pearl Calculator',
          content: `<p>Shows an on-screen estimate of pearl usage and cooldowns to help plan engagements and retreats.</p>`
        }
      ]
    },
    dungeon: {
      title: "Dungeon",
      modules: [
        {
          id: 'auto-pot',
          title: 'Auto Pot',
          content: `<p>Automatically drinks potions when your health or other conditions are met.</p>`
        },
        {
          id: 'mob-highlighter',
          title: 'Mob Highlighter',
          content: `<p>Highlights important mobs and rare spawns to make them easier to find in dungeons.</p>`
        }
      ]
    },
    fishing: {
      title: "Fishing",
      modules: [
        {
          id: 'auto-fish',
          title: 'Auto Fish',
          content: `<p>Automatically reels and casts to speed up fishing sessions.</p>`
        }
      ]
    },
    render: {
      title: "Render",
      modules: [
        {
          id: 'custom-shaders',
          title: 'Custom Shaders',
          content: `<p>Toggle custom shader support and visual tweaks.</p>`
        }
      ]
    }
  };

  const tabsContainer = document.getElementById('category-tabs');
  const modulesList = document.getElementById('modules-list');
  const categoryTitle = document.getElementById('category-title');
  const moduleTitle = document.getElementById('module-title');
  const moduleContent = document.getElementById('module-content');

  let activeCategoryKey = Object.keys(categories)[0];
  let activeModuleId = null;

  function renderCategoryTabs() {
    tabsContainer.innerHTML = '';
    Object.keys(categories).forEach((key, index) => {
      const tab = document.createElement('div');
      tab.className = `category-tab ${key === activeCategoryKey ? 'active' : ''}`;
      tab.textContent = categories[key].title;
      tab.dataset.category = key;
      tab.addEventListener('click', () => {
        if (activeCategoryKey === key) return;
        activeCategoryKey = key;
        // select first module of new category
        activeModuleId = categories[key].modules.length ? categories[key].modules[0].id : null;
        renderCategoryTabs();
        renderModulesList();
        renderModuleDetail();
      });
      tabsContainer.appendChild(tab);
    });
  }

  function renderModulesList() {
    modulesList.innerHTML = '';
    const cat = categories[activeCategoryKey];
    categoryTitle.textContent = cat.title;
    if (!cat.modules || !cat.modules.length) {
      modulesList.innerHTML = '<p>No modules available for this category.</p>';
      moduleTitle.textContent = 'Select a module';
      moduleContent.innerHTML = 'Choose a module on the left to see details here.';
      return;
    }

    cat.modules.forEach(mod => {
      const btn = document.createElement('button');
      btn.className = `module-button ${activeModuleId === mod.id ? 'active' : ''}`;
      btn.textContent = mod.title;
      btn.dataset.moduleId = mod.id;
      btn.addEventListener('click', () => {
        activeModuleId = mod.id;
        // update active state on buttons
        document.querySelectorAll('.module-button').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        renderModuleDetail();
      });
      modulesList.appendChild(btn);
    });
  }

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
    // ensure the corresponding button is active
    document.querySelectorAll('.module-button').forEach(b => b.classList.toggle('active', b.dataset.moduleId === mod.id));
  }

  // initial selection
  activeModuleId = categories[activeCategoryKey].modules.length ? categories[activeCategoryKey].modules[0].id : null;
  renderCategoryTabs();
  renderModulesList();
  renderModuleDetail();

});

// Sidebar functions (if not already in sidebar.js)
function openNav() {
  document.getElementById("mySidenav").style.width = "250px";
}

function closeNav() {
  document.getElementById("mySidenav").style.width = "0";
}