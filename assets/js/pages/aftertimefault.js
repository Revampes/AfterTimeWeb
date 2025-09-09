document.addEventListener('DOMContentLoaded', function() {
  const dots = document.getElementById('dots');
  const moreText = document.getElementById('more-text');
  const toggleButton = document.getElementById('toggle-button');

  if (toggleButton) {
    toggleButton.addEventListener('click', function() {
      if (moreText.style.display === 'none') {
        dots.style.display = 'none';
        moreText.style.display = 'inline'; // Or 'block' depending on content
        toggleButton.textContent = 'Read less';
      } else {
        dots.style.display = 'inline';
        moreText.style.display = 'none';
        toggleButton.textContent = 'Read more';
      }
    });
  }

  // Expandable box functionality
  document.querySelectorAll('.box-header').forEach(header => {
    header.addEventListener('click', function() {
      const box = this.closest('.expandable-box');
      box.classList.toggle('expanded');
    });
  });

  // Category data - this would be your content for each category
  const categories = {
    kuudra: {
      title: "Kuudra",
      content: `
        <h3>Kuudra Modules</h3>
        <p>Kuudra is a powerful boss entity found in the Crimson Isle. Defeating Kuudra requires teamwork and strategy, offering valuable rewards for successful completion.</p>
        
        <h3>Kuudra Tiers</h3>
        <ul>
          <li><strong>Basic:</strong> Entry-level difficulty, requires minimal gear</li>
          <li><strong>Hot:</strong> Increased difficulty with additional mechanics</li>
          <li><strong>Burning:</strong> Challenging difficulty with unique rewards</li>
          <li><strong>Fiery:</strong> Expert-level difficulty requiring coordination</li>
          <li><strong>Infernal:</strong> The ultimate challenge for seasoned players</li>
        </ul>
        
        <h3>Rewards</h3>
        <p>Successful completion of Kuudra battles grants various rewards including Crimson Armor pieces, attributes, and other valuable items that enhance your gameplay experience.</p>
        
        <p>Each higher tier offers better rewards but requires more skill, coordination, and better equipment to complete.</p>
      `
    },
    dungeon: {
      title: "Dungeon",
      content: `
        <h3>Dungeon Modules</h3>
        <p>Dungeons are challenging instanced areas with multiple floors, each with increasing difficulty. Team up with other players to defeat monsters, solve puzzles, and defeat the boss at the end.</p>
        
        <h3>Dungeon Floors</h3>
        <ul>
          <li><strong>Entrance:</strong> Introduction to dungeon mechanics</li>
          <li><strong>Floor 1:</strong> The Catacombs - Beginner level</li>
          <li><strong>Floor 2:</strong> The Catacombs - Intermediate level</li>
          <li><strong>Floor 3:</strong> The Catacombs - Advanced level</li>
          <li><strong>Floor 4:</strong> The Catacombs - Expert level</li>
          <li><strong>Floor 5:</strong> The Catacombs - Master level</li>
          <li><strong>Floor 6:</strong> The Catacombs - Nightmare level</li>
          <li><strong>Floor 7:</strong> The Catacombs - Ultimate challenge</li>
        </ul>
        
        <h3>Dungeon Classes</h3>
        <p>Choose from different classes, each with unique abilities and playstyles:</p>
        <ul>
          <li><strong>Tank:</strong> High health and defense, protects teammates</li>
          <li><strong>Healer:</strong> Restores health and provides support</li>
          <li><strong>Mage:</strong> Powerful ranged magic attacks</li>
          <li><strong>Berserker:</strong> High melee damage output</li>
          <li><strong>Archer:</strong> Long-range physical attacks</li>
        </ul>
      `
    },
    fishing: {
      title: "Fishing",
      content: `
        <h3>Fishing Modules</h3>
        <p>Fishing is a relaxing activity that can yield various rewards, from common fish to rare sea creatures. Different locations and fishing rods affect what you can catch.</p>
        
        <h3>Fishing Locations</h3>
        <ul>
          <li><strong>Pond:</strong> Basic fishing spot with common fish</li>
          <li><strong>Lake:</strong> Larger variety of fish</li>
          <li><strong>Ocean:</strong> Chance to catch rare sea creatures</li>
          <li><strong>Lava:</strong> Specialized fishing for unique rewards</li>
          <li><strong>Winter:</strong> Ice fishing for cold-weather species</li>
        </ul>
        
        <h3>Fishing Rods</h3>
        <p>Different rods have different capabilities:</p>
        <ul>
          <li><strong>Starter Rod:</strong> Basic fishing capabilities</li>
          <li><strong>Advanced Rod:</strong> Increased chance for rare catches</li>
          <li><strong>Expert Rod:</strong> Special abilities and bonuses</li>
          <li><strong>Legendary Rod:</strong> Highest chance for legendary catches</li>
        </ul>
        
        <h3>Sea Creatures</h3>
        <p>Rare catches that spawn enemies when fished up:</p>
        <ul>
          <li><strong>Common:</strong> Easy to defeat, common rewards</li>
          <li><strong>Uncommon:</strong> Moderate difficulty, better rewards</li>
          <li><strong>Rare:</strong> Challenging, valuable rewards</li>
          <li><strong>Legendary:</strong> Very difficult, exclusive rewards</li>
        </ul>
      `
    },
    render: {
      title: "Render",
      content: `
        <h3>Render Modules</h3>
        <p>Render modules enhance the visual experience of the game, providing better graphics, visual effects, and customization options.</p>
        
        <h3>Visual Enhancements</h3>
        <ul>
          <li><strong>Shader Support:</strong> Enhanced lighting and shadows</li>
          <li><strong>Texture Improvements:</strong> Higher resolution textures</li>
          <li><strong>Particle Effects:</strong> Enhanced visual effects</li>
          <li><strong>UI Customization:</strong> Customizable user interface</li>
          <li><strong>Color Adjustments:</strong> Brightness, contrast, and saturation controls</li>
        </ul>
        
        <h3>Performance Options</h3>
        <p>Balance between visual quality and performance:</p>
        <ul>
          <li><strong>Low:</strong> Maximum performance, minimal visuals</li>
          <li><strong>Medium:</strong> Balanced performance and visuals</li>
          <li><strong>High:</strong> Enhanced visuals with moderate performance impact</li>
          <li><strong>Ultra:</strong> Best visuals, significant performance impact</li>
        </ul>
        
        <h3>Customization Features</h3>
        <p>Personalize your gaming experience:</p>
        <ul>
          <li><strong>Custom Skies:</strong> Replace the default skybox</li>
          <li><strong>Custom Water:</strong> Enhanced water visuals</li>
          <li><strong>Custom Models:</strong> Replace item and entity models</li>
          <li><strong>Custom Animations:</strong> Enhanced animation effects</li>
        </ul>
      `
    }
  };

  // Generate category tabs
  const tabsContainer = document.getElementById('category-tabs');
  const contentContainer = document.getElementById('category-container');
  
  // Create tabs for each category
  Object.keys(categories).forEach((categoryKey, index) => {
    const category = categories[categoryKey];
    
    // Create tab
    const tab = document.createElement('div');
    tab.className = `category-tab ${index === 0 ? 'active' : ''}`;
    tab.textContent = category.title;
    tab.dataset.category = categoryKey;
    tabsContainer.appendChild(tab);
    
    // Create content box
    const box = document.createElement('div');
    box.className = `expandable-box ${index === 0 ? 'expanded' : ''}`;
    box.innerHTML = `
      <div class="box-header">
        <div class="box-title">Category [${category.title}]</div>
        <div class="arrow-button">
          <svg viewBox="0 0 24 24">
            <path d="M7 10l5 5 5-5z"></path>
          </svg>
        </div>
      </div>
      <div class="box-content">
        <div class="content-inner scrollable-content">
          ${category.content}
        </div>
      </div>
    `;
    contentContainer.appendChild(box);
    
    // Add click event to tab
    tab.addEventListener('click', function() {
      // Remove active class from all tabs
      document.querySelectorAll('.category-tab').forEach(t => t.classList.remove('active'));
      
      // Add active class to clicked tab
      this.classList.add('active');
      
      // Hide all content boxes
      document.querySelectorAll('.expandable-box').forEach(box => {
        box.classList.remove('expanded');
      });
      
      // Show the selected content box
      const categoryBoxes = document.querySelectorAll('.expandable-box');
      categoryBoxes[index].classList.add('expanded');
    });
  });

  // Add click events to all box headers
  document.querySelectorAll('.box-header').forEach(header => {
    header.addEventListener('click', function() {
      const box = this.closest('.expandable-box');
      box.classList.toggle('expanded');
    });
  });
});

// Sidebar functions (if not already in sidebar.js)
function openNav() {
  document.getElementById("mySidenav").style.width = "250px";
}

function closeNav() {
  document.getElementById("mySidenav").style.width = "0";
}