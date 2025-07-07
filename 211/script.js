class TileGridApp {
    constructor() {
        this.currentGrid = 'main-grid';
        this.gridHistory = [];
        this.searchQuery = '';
        this.allTiles = [];
        this.originalMainGridTiles = []; // Store original tiles
        this.init();
    }

    init() {
        this.collectAllTiles();
        this.storeOriginalMainGridTiles(); // Store original tiles
        this.bindEvents();
        this.showGrid('main-grid');
    }

    storeOriginalMainGridTiles() {
        // Store the original main grid tiles for restoration
        const mainGridContainer = document.querySelector('#main-grid .tiles-container');
        if (mainGridContainer) {
            this.originalMainGridTiles = Array.from(mainGridContainer.children).map(tile => tile.cloneNode(true));
        }
    }

    collectAllTiles() {
        // Collect all tiles from all grids for search
        this.allTiles = [];
        
        // Get main grid tiles
        const mainGridTiles = document.querySelectorAll('#main-grid .tile[data-search]');
        mainGridTiles.forEach(tile => {
            this.allTiles.push({
                element: tile,
                title: tile.querySelector('h2').textContent,
                description: tile.querySelector('p').textContent,
                searchData: tile.dataset.search,
                gridId: tile.dataset.grid,
                isMainTile: true,
                parentGrid: 'main-grid'
            });
        });

        // Get subgrid tiles
        const subgrids = document.querySelectorAll('.tile-grid:not(#main-grid)');
        subgrids.forEach(grid => {
            const gridId = grid.id;
            const gridTitle = grid.querySelector('.grid-title').textContent;
            const tiles = grid.querySelectorAll('.tile[data-search]');
            
            tiles.forEach(tile => {
                this.allTiles.push({
                    element: tile,
                    title: tile.querySelector('h2').textContent,
                    description: tile.querySelector('p').textContent,
                    searchData: tile.dataset.search,
                    gridId: tile.dataset.grid,
                    isMainTile: false,
                    parentGrid: gridId,
                    parentGridTitle: gridTitle
                });
            });
        });
    }

    bindEvents() {
        // Handle tile clicks
        document.addEventListener('click', (e) => {
            const tile = e.target.closest('.tile');
            if (tile && tile.dataset.grid && !tile.classList.contains('empty-tile')) {
                // Read aloud if setting is enabled
                const audioToggle = document.getElementById('audio-toggle');
                if (audioToggle && audioToggle.checked) {
                    const titleElem = tile.querySelector('h2');
                    if (titleElem) this.speakText(titleElem.textContent);
                }
                this.expandTileToGrid(tile, tile.dataset.grid);
            }

            // Handle back button and close button clicks
            const closeButton = e.target.closest('.close-button');
            if ((closeButton) && (closeButton?.dataset.back)) {
                this.navigateToGrid(closeButton.dataset.back);
            }
        });

        // Handle search input
        const searchInput = document.getElementById('search-input');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                this.searchQuery = e.target.value.toLowerCase().trim();
                this.performSearch();
            });

            // Clear search when clicking outside
            document.addEventListener('click', (e) => {
                if (!e.target.closest('.search-container')) {
                    searchInput.blur();
                }
            });
        }

        // Handle keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.currentGrid !== 'main-grid') {
                this.goBack();
            }
            
            // Clear search with Escape when on main grid
            if (e.key === 'Escape' && this.currentGrid === 'main-grid' && this.searchQuery) {
                this.clearSearch();
            }
        });

        // Handle touch events for mobile
        let touchStartY = 0;
        document.addEventListener('touchstart', (e) => {
            touchStartY = e.touches[0].clientY;
        });

        document.addEventListener('touchend', (e) => {
            const touchEndY = e.changedTouches[0].clientY;
            const diff = touchStartY - touchEndY;
            
            // Swipe up to go back (if not on main grid)
            if (diff > 50 && this.currentGrid !== 'main-grid') {
                this.goBack();
            }
        });

        // Settings menu toggle
        const settingsBtn = document.getElementById('settings-btn');
        const settingsMenuContainer = document.querySelector('.settings-menu-container');
        if (settingsBtn && settingsMenuContainer) {
            settingsBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                settingsMenuContainer.classList.toggle('open');
                // Focus dropdown for accessibility
                const dropdown = settingsMenuContainer.querySelector('.settings-dropdown');
                if (dropdown) dropdown.focus();
            });
            // Close settings when clicking outside
            document.addEventListener('click', (e) => {
                if (!e.target.closest('.settings-menu-container')) {
                    settingsMenuContainer.classList.remove('open');
                }
            });
            // Optional: close on Escape
            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape') {
                    settingsMenuContainer.classList.remove('open');
                }
            });
        }

        // Home button in grid headers
        document.addEventListener('click', (e) => {
            const homeBtn = e.target.closest('.home-button');
            if (homeBtn && homeBtn.dataset.home) {
                this.showGrid(homeBtn.dataset.home);
                // Optionally clear grid history to reset navigation
                this.gridHistory = [];
            }
        });
    }

    performSearch() {
        // Only search when on main grid
        if (this.currentGrid !== 'main-grid') return;

        const searchQuery = this.searchQuery;
        const mainGridContainer = document.querySelector('#main-grid .tiles-container');
        
        if (searchQuery === '') {
            // Show original main grid tiles
            this.showOriginalMainGrid();
        } else {
            // Show search results
            this.showSearchResults(searchQuery, mainGridContainer);
        }
    }

    showOriginalMainGrid() {
        const mainGridContainer = document.querySelector('#main-grid .tiles-container');
        
        if (!mainGridContainer) return;
        
        // Clear container
        mainGridContainer.innerHTML = '';
        
        // Restore original tiles from stored copies
        this.originalMainGridTiles.forEach(tileClone => {
            const restoredTile = tileClone.cloneNode(true);
            mainGridContainer.appendChild(restoredTile);
        });
        
        // Ensure main grid is visible
        this.showGrid('main-grid');
    }

    showSearchResults(searchQuery, container) {
        // Clear container
        container.innerHTML = '';
        
        // Find matching tiles (only tiles where search query appears in text content)
        const matchingTiles = this.allTiles.filter(tile => {
            const titleMatches = tile.title.toLowerCase().includes(searchQuery);
            const descriptionMatches = tile.description.toLowerCase().includes(searchQuery);
            return titleMatches || descriptionMatches;
        });

        // Create and display search result tiles
        matchingTiles.forEach(tileData => {
            const searchTile = this.createSearchResultTile(tileData);
            container.appendChild(searchTile);
        });

        // Update search results count
        this.updateSearchResults(matchingTiles.length);
    }

    createSearchResultTile(tileData) {
        const tile = document.createElement('div');
        tile.className = 'tile search-result-tile';
        tile.dataset.grid = tileData.gridId;
        tile.dataset.parentGrid = tileData.parentGrid;
        
        // Add special styling for subgrid tiles
        if (!tileData.isMainTile) {
            tile.classList.add('subgrid-tile');
        }

        const content = `
            <div class="tile-content">
                <h2>${tileData.title}</h2>
                <p>${tileData.description}</p>
                ${!tileData.isMainTile ? `<div class="tile-category">${tileData.parentGridTitle}</div>` : ''}
            </div>
        `;
        
        tile.innerHTML = content;
        
        // Add click handler for search result tiles
        tile.addEventListener('click', () => {
            // Read aloud if setting is enabled
            const audioToggle = document.getElementById('audio-toggle');
            if (audioToggle && audioToggle.checked) {
                this.speakText(tileData.title);
            }
            if (tileData.isMainTile) {
                // Navigate directly to the main grid tile
                this.expandTileToGrid(tile, tileData.gridId);
            } else {
                // Navigate to parent grid first, then to the specific tile
                this.navigateToSubgridTile(tileData.parentGrid, tileData.gridId);
            }
        });

        return tile;
    }

    navigateToSubgridTile(parentGridId, targetGridId) {
        // First navigate to the parent grid
        this.navigateToGrid(parentGridId);
        
        // Then navigate to the target grid if it exists
        if (targetGridId) {
            this.navigateToGrid(targetGridId);
        }
    }

    updateSearchResults(count) {
        // You can add a results counter here if needed
        // console.log(`Found ${count} matching tiles`);
    }

    clearSearch() {
        const searchInput = document.getElementById('search-input');
        if (searchInput) {
            searchInput.value = '';
            this.searchQuery = '';
            this.performSearch();
        }
    }

    expandTileToGrid(clickedTile, gridId) {
        if (gridId === this.currentGrid) return;
        
        // Add current grid to history
        if (this.currentGrid !== 'main-grid') {
            this.gridHistory.push(this.currentGrid);
        }
        
        // Navigate directly to the new grid
        this.showGrid(gridId);
    }

    showGridWithExpansion(gridId, expansionOverlay) {
        // Hide all grids
        const allGrids = document.querySelectorAll('.tile-grid');
        allGrids.forEach(grid => {
            grid.classList.remove('active');
        });

        // Show target grid
        const targetGrid = document.getElementById(gridId);
        if (targetGrid) {
            targetGrid.classList.add('active');
            this.currentGrid = gridId;
        } else {
            // If grid doesn't exist, create an empty grid with just the header
            this.createEmptyGrid(gridId);
        }
    }

    navigateToGrid(gridId) {
        if (gridId === this.currentGrid) return;
        
        // Add current grid to history
        if (this.currentGrid !== 'main-grid') {
            this.gridHistory.push(this.currentGrid);
        }
        
        this.showGrid(gridId);
    }

    goBack() {
        if (this.gridHistory.length > 0) {
            const previousGrid = this.gridHistory.pop();
            this.showGrid(previousGrid);
        } else {
            this.showGrid('main-grid');
        }
    }

    showGrid(gridId) {
        // Hide all grids
        const allGrids = document.querySelectorAll('.tile-grid');
        allGrids.forEach(grid => {
            grid.classList.remove('active');
        });

        // Show target grid
        const targetGrid = document.getElementById(gridId);
        if (targetGrid) {
            targetGrid.classList.add('active');
            this.currentGrid = gridId;
        } else {
            // If grid doesn't exist, create an empty grid with just the header
            this.createEmptyGrid(gridId);
        }
    }

    createEmptyGrid(gridId) {
        // Extract title from gridId (convert kebab-case to Title Case)
        const title = gridId
            .replace(/-/g, ' ')
            .replace(/\b\w/g, l => l.toUpperCase())
            .replace(/\b(grid|subgrid)\b/gi, '');
        
        const homeButton = document.createElement('button');
        homeButton.className = 'home-button';
        homeButton.dataset.home = 'main-grid';
        homeButton.tabindex = '0';
        homeButton.innerHTML = '<h1 class="grid-title"><span style="color:#FD004B">2</span><span style="color:#FFAF5F">1</span><span style="color:#FD004B">1</span></h1>';

        const gridContainer = document.createElement('div');
        gridContainer.id = gridId;
        gridContainer.className = 'tile-grid active';
        
        // Add header with back button and title
        const header = document.createElement('div');
        header.className = 'grid-header';
        
        const closeButton = document.createElement('div');
        closeButton.className = 'close-button';
        closeButton.dataset.back = this.currentGrid;
        closeButton.innerHTML = '<span>×</span>';
        
        const gridTitle = document.createElement('h1');
        gridTitle.className = 'grid-title';
        gridTitle.textContent = title;
        
        header.appendChild(homeButton);
        header.appendChild(gridTitle);
        header.appendChild(closeButton);
        gridContainer.appendChild(header);
        
        // Add tiles container with empty state
        const tilesContainer = document.createElement('div');
        tilesContainer.className = 'tiles-container';
        
        // Add empty tile
        const emptyTile = document.createElement('div');
        emptyTile.className = 'tile empty-tile';
        emptyTile.innerHTML = `
            <div class="tile-content">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3"/><path d="M12 9v4"/><path d="M12 17h.01"/></svg>
                <h2>No Content</h2>
                <p>This section is currently empty</p>
            </div>
        `;
        
        tilesContainer.appendChild(emptyTile);
        gridContainer.appendChild(tilesContainer);
        document.getElementById('app').appendChild(gridContainer);
        
        this.currentGrid = gridId;
    }

    // Utility method to create dynamic grids
    createDynamicGrid(gridId, title, tiles) {
        const gridContainer = document.createElement('div');
        gridContainer.id = gridId;
        gridContainer.className = 'tile-grid';
        
        // Add header with back button and title
        const header = document.createElement('div');
        header.className = 'grid-header';
        
        const closeButton = document.createElement('div');
        closeButton.className = 'close-button';
        closeButton.dataset.back = this.currentGrid;
        closeButton.innerHTML = '<span>×</span>';
        
        const gridTitle = document.createElement('h1');
        gridTitle.className = 'grid-title';
        gridTitle.textContent = title;
        
        header.appendChild(closeButton);
        header.appendChild(gridTitle);
        gridContainer.appendChild(header);
        
        // Add tiles container
        const tilesContainer = document.createElement('div');
        tilesContainer.className = 'tiles-container';
        
        // Add tiles
        tiles.forEach(tile => {
            const tileElement = document.createElement('div');
            tileElement.className = 'tile';
            tileElement.dataset.grid = tile.gridId || '';
            tileElement.dataset.search = tile.searchTerms || '';
            
            // Add empty-tile class if no gridId is provided
            if (!tile.gridId) {
                tileElement.classList.add('empty-tile');
            }
            
            tileElement.innerHTML = `
                <div class="tile-content">
                    <h2>${tile.title}</h2>
                    <p>${tile.description}</p>
                </div>
            `;
            
            tilesContainer.appendChild(tileElement);
        });
        
        gridContainer.appendChild(tilesContainer);
        document.getElementById('app').appendChild(gridContainer);
        
        // Update the allTiles collection
        this.collectAllTiles();
        
        return gridContainer;
    }

    // Add this method to the class
    speakText(text) {
        if (!window.speechSynthesis) return;
        window.speechSynthesis.cancel(); // Stop any current speech
        const utter = new window.SpeechSynthesisUtterance(text);
        utter.rate = 1;
        utter.pitch = 1;
        utter.lang = 'en-US';
        window.speechSynthesis.speak(utter);
    }
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new TileGridApp();
});

// Add some dynamic grid creation examples
// You can uncomment and modify these to add more grids dynamically

/*
// Example of creating a dynamic grid
const app = new TileGridApp();

// Create a dynamic subgrid
const aiTiles = [
    { title: 'Machine Learning', description: 'Neural networks & algorithms', gridId: 'ml-subgrid', searchTerms: 'machine learning neural networks algorithms' },
    { title: 'Computer Vision', description: 'Image recognition & processing', gridId: 'cv-subgrid', searchTerms: 'computer vision image recognition processing' },
    { title: 'Natural Language', description: 'Text processing & understanding', gridId: 'nlp-subgrid', searchTerms: 'natural language text processing nlp' },
    { title: 'Robotics', description: 'Automation & control systems', gridId: 'robotics-subgrid', searchTerms: 'robotics automation control systems' }
];

app.createDynamicGrid('ai-subgrid', 'Artificial Intelligence', aiTiles);
*/ 