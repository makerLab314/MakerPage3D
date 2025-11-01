# Integration Guide: Gaussian Splat & Door Video

This guide explains how to integrate your Gaussian Splat 3D model and door opening video into the MakerLab website.

## 📹 Door Video Integration

### Step 1: Prepare your video file

1. **Filename**: Save your door opening video as `door-opening.mp4` (or `.webm` for better web compatibility)
2. **Location**: Place it in the root directory: `/door-opening.mp4`
3. **Recommended specs**:
   - Duration: 2-3 seconds
   - Resolution: 1920x1080 or 1280x720
   - Format: MP4 (H.264) or WebM
   - File size: Keep under 5MB for fast loading

### Step 2: Add video element to HTML

In `index.html`, replace the door scene (lines 31-43) with:

```html
<!-- Door Entry Scene -->
<div id="door-scene" class="scene">
    <div class="door-container">
        <div class="swipe-hint" id="swipe-hint">
            <div class="swipe-icon">↑</div>
            <p>Swipe Up to Enter</p>
        </div>
        
        <!-- Video element for door opening -->
        <video id="door-video" class="door-video" playsinline muted>
            <source src="door-opening.mp4" type="video/mp4">
            <source src="door-opening.webm" type="video/webm">
            Your browser does not support the video tag.
        </video>
        
        <!-- Fallback: Original CSS doors (hidden when video plays) -->
        <div class="door-frame" id="door-frame-fallback">
            <div class="door left-door" id="left-door"></div>
            <div class="door right-door" id="right-door"></div>
            <div class="door-knob"></div>
        </div>
    </div>
</div>
```

### Step 3: Update CSS for video

Add to `styles.css`:

```css
.door-video {
    position: absolute;
    top: 0;
    left: 50%;
    transform: translateX(-50%);
    width: 400px;
    height: 600px;
    object-fit: cover;
    border-radius: 10px;
    display: none;
    z-index: 10;
}

.door-video.playing {
    display: block;
}
```

### Step 4: Update JavaScript for video playback

In `app.js`, replace the `openDoor()` function (lines 233-245) with:

```javascript
function openDoor() {
    const video = document.getElementById('door-video');
    const swipeHint = document.getElementById('swipe-hint');
    const doorFrameFallback = document.getElementById('door-frame-fallback');
    
    swipeHint.style.display = 'none';
    
    // Check if video exists and can play
    if (video && video.canPlayType('video/mp4')) {
        video.classList.add('playing');
        doorFrameFallback.style.display = 'none';
        
        video.play();
        
        // Transition when video ends
        video.onended = () => {
            transition3DScene();
        };
    } else {
        // Fallback to CSS animation
        const leftDoor = document.getElementById('left-door');
        const rightDoor = document.getElementById('right-door');
        
        leftDoor.classList.add('open');
        rightDoor.classList.add('open');
        
        setTimeout(() => {
            transition3DScene();
        }, 1200);
    }
}
```

---

## 🎨 Gaussian Splat Integration

### Step 1: Choose a Gaussian Splat library

Recommended options:
- **Luma AI Viewer** (easiest): https://lumalabs.ai/
- **Three.js Gaussian Splat Loader**: https://github.com/antimatter15/splat
- **GaussianSplats3D**: https://github.com/mkkellogg/GaussianSplats3D

### Step 2: Prepare your Gaussian Splat file

1. **Filename**: Save as `makerlab-room.splat` or `makerlab-room.ply`
2. **Location**: Create a folder `/assets/` and place it there: `/assets/makerlab-room.splat`
3. **File format**: `.splat`, `.ply`, or `.ksplat` (depending on your capture tool)

### Step 3: Add library dependencies

Add before closing `</head>` in `index.html`:

```html
<!-- Three.js for Gaussian Splat rendering -->
<script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r158/three.min.js"></script>
<!-- Gaussian Splat Loader -->
<script src="https://cdn.jsdelivr.net/npm/@mkkellogg/gaussian-splats-3d@latest/build/gaussian-splats-3d.umd.min.js"></script>
```

**OR** for Luma AI (simpler):

```html
<script src="https://unpkg.com/@lumaai/luma-web@0.2.0/dist/library/luma-web.min.js"></script>
```

### Step 4: Replace Canvas 2D with Gaussian Splat

In `app.js`, replace the `init3DScene()` function (lines 279-309) with:

#### Option A: Using Three.js + Gaussian Splat Loader

```javascript
function init3DScene() {
    const container = document.getElementById('three-scene');
    
    // Create Three.js scene
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
        75,
        window.innerWidth / window.innerHeight,
        0.1,
        1000
    );
    
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    
    // Replace canvas
    const oldCanvas = document.getElementById('three-canvas');
    oldCanvas.parentNode.replaceChild(renderer.domElement, oldCanvas);
    renderer.domElement.id = 'three-canvas';
    
    // Load Gaussian Splat
    const viewer = new GaussianSplats3D.Viewer({
        scene: scene,
        renderer: renderer,
        camera: camera,
        useBuiltInControls: false
    });
    
    viewer.addSplatScene('assets/makerlab-room.splat')
        .then(() => {
            console.log('Gaussian Splat loaded successfully!');
        });
    
    // Set initial camera position
    camera.position.set(0, 1.6, 10);
    
    AppState.renderer = renderer;
    AppState.camera = camera;
    AppState.scene = scene;
    
    // Keep existing controls and markers
    setupControls();
    createInteractiveMarkers3D();
    
    // Animation loop
    function animate() {
        if (!AppState.isIn3DScene) return;
        requestAnimationFrame(animate);
        
        updateMovement();
        updateCamera();
        
        viewer.update();
        renderer.render(scene, camera);
    }
    
    animate();
}
```

#### Option B: Using Luma AI (Simplest)

```javascript
function init3DScene() {
    const container = document.getElementById('three-scene');
    const oldCanvas = document.getElementById('three-canvas');
    
    // Create Luma viewer
    const viewer = document.createElement('luma-web');
    viewer.style.width = '100%';
    viewer.style.height = '100%';
    viewer.setAttribute('source', 'https://lumalabs.ai/capture/YOUR_CAPTURE_ID');
    // OR use local file:
    // viewer.setAttribute('source', 'assets/makerlab-room.splat');
    
    oldCanvas.parentNode.replaceChild(viewer, oldCanvas);
    
    // Note: You'll need to adapt the marker system for Luma
    setupControls();
}
```

### Step 5: Update interactive markers for 3D

The current markers use 2D canvas projection. For Gaussian Splat, you'll need to:

1. Create 3D marker objects using Three.js sprites
2. Position them at equipment locations
3. Add raycasting for click detection

Example marker creation:

```javascript
function createInteractiveMarkers3D() {
    EquipmentData.forEach(equipment => {
        const sprite = new THREE.Sprite(
            new THREE.SpriteMaterial({ 
                color: 0x00d4ff,
                transparent: true,
                opacity: 0.8
            })
        );
        
        sprite.position.set(
            equipment.position.x,
            equipment.position.y,
            equipment.position.z
        );
        sprite.scale.set(0.5, 0.5, 1);
        sprite.userData = { type: 'equipment', data: equipment };
        
        AppState.scene.add(sprite);
    });
}
```

---

## 📁 Final File Structure

```
MakerPage3D/
├── index.html
├── app.js
├── styles.css
├── README.md
├── INTEGRATION_GUIDE.md
├── door-opening.mp4          ← Your door video
├── door-opening.webm         ← Optional WebM version
└── assets/
    └── makerlab-room.splat   ← Your Gaussian Splat file
```

---

## 🧪 Testing

1. **Test door video**: Clear browser cache and reload. Click "Go In" and verify video plays.
2. **Test Gaussian Splat**: Navigate into 3D scene and verify the model loads and renders.
3. **Test markers**: Ensure interactive markers still work with the new 3D system.

---

## 💡 Tips

- **Performance**: Gaussian Splats can be large. Optimize your `.splat` file size.
- **Fallbacks**: The code above includes fallbacks to CSS/Canvas if files are missing.
- **Camera position**: Adjust `camera.position.set(x, y, z)` to match your Splat's coordinate system.
- **Markers**: You may need to adjust marker positions to align with your actual Gaussian Splat room layout.

---

## 🆘 Troubleshooting

**Video won't play:**
- Check file path is correct: `/door-opening.mp4`
- Ensure video file is not corrupted
- Try converting to WebM format
- Check browser console for errors

**Gaussian Splat won't load:**
- Verify file path: `/assets/makerlab-room.splat`
- Check file format is compatible with chosen library
- Check browser console for CORS or loading errors
- Try a smaller test file first

**Markers not visible:**
- The marker system needs to be adapted from 2D to 3D
- Use Three.js raycasting for click detection
- Position markers based on your Splat's coordinate system

---

Need help? Check the library documentation or open an issue!
