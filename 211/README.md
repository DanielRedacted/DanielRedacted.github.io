# Tile Grid Web App

A modern, full-screen tile grid web application with smooth animations and nested navigation. Each tile expands to reveal a new grid of related content, creating an intuitive browsing experience.

## Features

- **Full-Screen Design**: Beautiful gradient background with glassmorphism tiles
- **Smooth Animations**: Elegant transitions between grids with staggered tile animations
- **Responsive Layout**: Adapts to different screen sizes and devices
- **Touch Support**: Swipe gestures for mobile navigation
- **Keyboard Navigation**: ESC key to go back
- **Nested Navigation**: Multiple levels of tile grids
- **Modern UI**: Clean, minimalist design with hover effects

## How to Use

1. **Open the App**: Simply open `index.html` in your web browser
2. **Navigate**: Click on any tile to expand it and reveal a new grid
3. **Go Back**: Use the back button (←) or press ESC key
4. **Mobile**: Swipe up on mobile devices to go back

## File Structure

```
web-app/
├── index.html      # Main HTML structure
├── styles.css      # Modern CSS styling and animations
├── script.js       # JavaScript functionality
└── README.md       # This file
```

## Customization

### Adding New Grids

You can easily add new grids by modifying the HTML structure in `index.html`. Each grid should follow this pattern:

```html
<div id="your-grid-id" class="tile-grid">
    <div class="back-button" data-back="parent-grid-id">
        <span>← Back</span>
    </div>
    <div class="tile" data-grid="next-grid-id">
        <div class="tile-content">
            <h2>Your Title</h2>
            <p>Your description</p>
        </div>
    </div>
    <!-- Add more tiles as needed -->
</div>
```

### Dynamic Grid Creation

You can also create grids dynamically using JavaScript:

```javascript
const tiles = [
    { title: 'Title 1', description: 'Description 1', gridId: 'grid-1' },
    { title: 'Title 2', description: 'Description 2', gridId: 'grid-2' }
];

app.createDynamicGrid('dynamic-grid', tiles);
```

### Styling Customization

The app uses CSS custom properties and modern design principles. You can customize:

- Colors: Modify the gradient in `body` background
- Tile appearance: Adjust the glassmorphism effects
- Animations: Change timing and easing functions
- Layout: Modify grid template columns/rows

## Browser Support

- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

## Technologies Used

- **HTML5**: Semantic structure
- **CSS3**: Modern styling with Grid, Flexbox, and animations
- **JavaScript ES6+**: Class-based architecture with event handling
- **Google Fonts**: Inter font family for typography

## Performance Features

- Hardware-accelerated animations
- Efficient event delegation
- Minimal DOM manipulation
- Responsive design with CSS Grid
- Touch-optimized interactions

## License


# Colors
- Theme colors: #00538D, #31A0CC
- Accent colors: #FD004B, #FFAF5F



This project is open source and available under the MIT License.