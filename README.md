# MakerLab 3D Experience

An immersive 3D virtual tour of MakerLab - a creative space for innovation, 3D printing, and collaborative making.

## Features

### 🎨 Landing Page
- Beautiful glass morphism design
- Animated gradient background
- "Go In" button with smooth transitions

### 🚪 Interactive Entry
- Door opening animation
- Swipe-to-enter gesture (mobile) or click/keyboard (desktop)
- Smooth transition to 3D environment

### 🌐 3D Virtual Environment
- Canvas 2D-powered pseudo-3D room with perspective rendering
- First-person navigation (WASD/Arrow keys + mouse look)
- Gradient-based lighting effects
- Interactive markers throughout the space

### 🔧 Equipment Showcase
- Interactive 3D printer and equipment models
- Click on markers to view detailed specifications
- Glass panel info windows with descriptions

### 📋 Projects Display
- Whiteboard interaction
- 3D card layout for projects
- Tags and descriptions
- Smooth animations

### 👥 Team Members
- Interactive member display
- 3D cards with avatars
- Role and description information

### 📰 News Section
- Computer screen trigger
- Latest updates and announcements
- Chronological news feed

### 🎁 Easter Eggs
- Hidden surprises throughout the environment
- Interactive discovery system
- Achievement tracking

## Technology Stack

- **HTML5** - Structure and semantic markup
- **CSS3** - Advanced styling with glass morphism, animations, and responsive design
- **JavaScript (ES6+ Modules)** - Application logic and interactivity
- **Three.js (r160)** - 3D rendering engine
- **@mkkellogg/gaussian-splats-3d** - Photorealistic 3D environment rendering using Gaussian Splatting

## Getting Started

### Prerequisites
- Modern web browser (Chrome, Firefox, Safari, Edge) with WebGL support
- Node.js (v14 or higher) for running the development server (optional for local development)

### Quick Start (GitHub Pages)

The application is deployed on GitHub Pages and loads all dependencies from CDN:
```
https://makerlab314.github.io/MakerPage3D/
```

No installation is required - just visit the URL in your browser!

### Local Development

1. Clone the repository:
```bash
git clone https://github.com/makerLab314/MakerPage3D.git
cd MakerPage3D
```

2. (Optional) Install dependencies locally:
```bash
npm install
```

3. Start the development server (with CORS headers for SharedArrayBuffer):
```bash
npm start
```

4. Open your browser and navigate to:
```
http://localhost:8000
```

**Note:** The application loads Three.js and Gaussian Splats 3D from CDN (jsdelivr.net) by default, so it works directly from GitHub Pages without requiring `npm install`. The custom server (`server.js`) is recommended for proper Gaussian Splat rendering as it sets the necessary CORS headers (`Cross-Origin-Opener-Policy` and `Cross-Origin-Embedder-Policy`) for SharedArrayBuffer support.

**Alternative servers** (if you don't need Gaussian Splat features):

**Python 3:**
```bash
python -m http.server 8000
```

**PHP:**
```bash
php -S localhost:8000
```

## Usage

### Navigation
- **Landing Page**: Click "Go In" to start the experience
- **Door Scene**: Swipe up (mobile) or click/press up arrow (desktop) to enter
- **3D Environment**: 
  - Move: W/A/S/D or Arrow keys
  - Look: Move mouse
  - Interact: Click on glowing markers
- **Back**: Click the "← Back" button to return to landing page

### Interactions
- **Equipment**: Click blue glowing spheres to view specifications
- **Projects**: Click purple marker near whiteboard
- **Members**: Click golden trophy/display
- **News**: Click blue marker near computer screen
- **Easter Eggs**: Explore corners to discover hidden surprises

## File Structure

```
MakerPage3D/
├── index.html          # Main HTML structure
├── styles.css          # All styling and animations
├── app.js             # Application logic and 3D scene
└── README.md          # Documentation
```

## Customization

### Adding Equipment
Edit the `EquipmentData` array in `app.js`:
```javascript
{
    id: 'unique-id',
    name: 'Equipment Name',
    position: { x: 0, y: 1.5, z: 0 },
    icon: '🖨️',
    description: 'Description text',
    specs: 'Technical specifications'
}
```

### Adding Projects
Edit the `ProjectsData` array in `app.js`:
```javascript
{
    id: 'project-id',
    title: 'Project Title',
    description: 'Project description',
    tags: ['Tag1', 'Tag2']
}
```

### Adding Team Members
Edit the `MembersData` array in `app.js`:
```javascript
{
    id: 'member-id',
    name: 'Name',
    role: 'Role',
    description: 'Description',
    avatar: '👨‍🔬'
}
```

### Adding News
Edit the `NewsData` array in `app.js`:
```javascript
{
    id: 'news-id',
    date: '2025-10-28',
    title: 'News Title',
    content: 'News content'
}
```

## Browser Compatibility

- ✅ Chrome 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Edge 90+

## Performance Tips

- The 3D scene is optimized for modern devices
- For better performance on older devices, reduce the number of objects in the scene
- Mobile devices may have reduced quality settings automatically applied

## Future Enhancements

- [ ] Actual Gaussian Splat integration for photorealistic room capture (requires WebGL library)
- [ ] Upgrade to Three.js or WebGL for true 3D rendering with realistic lighting
- [ ] VR/AR support for immersive experiences
- [ ] Multiplayer collaboration features
- [ ] Additional interactive mini-games
- [ ] Video integration for door opening sequence
- [ ] Sound effects and ambient audio
- [ ] Backend integration for dynamic content

## Contributing

Contributions are welcome! Please feel free to submit pull requests or open issues.

## License

This project is open source and available for educational and non-commercial use.

## Credits

Created for MakerLab - Where Innovation Meets Creativity

---

**Enjoy exploring MakerLab in 3D!** 🚀
