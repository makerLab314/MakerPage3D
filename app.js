// Import Three.js and GaussianSplats3D as ES modules
import * as THREE from 'three';
import * as GaussianSplats3D from '@mkkellogg/gaussian-splats-3d';

// Application State
const AppState = {
    currentScene: 'landing',
    isInDoorScene: false,
    isIn3DScene: false,
    camera: null,
    scene: null,
    renderer: null,
    clock: new THREE.Clock(),
    controls: {
        forward: false,
        backward: false,
        left: false,
        right: false
    },
    mouseX: 0,
    mouseY: 0,
    isDragging: false,
    cameraRotation: { x: 0, y: 0 },
    velocity: { x: 0, y: 0, z: 0 },
    easterEggsFound: [],
    isAnimatingToObject: false,
    isLockedAtObject: false,
    currentLockedObject: null,
    loadingProgress: 0,
    dragStartX: 0
};

// Configuration Constants
const Config = {
    GAUSSIAN_SPLAT_FILE: './makerLab.ksplat',
    INTERACTION_DISTANCE: 0.5,
    FLY_TO_OBJECT_DURATION: 1500, // 1.5 seconds
    OBJECT_VIEW_DISTANCE: 2.0 // Distance from object when viewing
};

// Data for the application
const EquipmentData = [
    {
        id: 'printer1',
        name: 'Prusa i3 MK3S+',
        position: { x: -5, y: 1.5, z: 2 },
        icon: '🖨️',
        description: 'High-quality FDM 3D printer perfect for precise prototyping and production.',
        specs: 'Build Volume: 250×210×210mm | Layer Height: 0.05-0.35mm | Filament: 1.75mm'
    },
    {
        id: 'printer2',
        name: 'Ultimaker S5',
        position: { x: -5, y: 1.5, z: -2 },
        icon: '🖨️',
        description: 'Professional-grade 3D printer with dual extrusion capabilities.',
        specs: 'Build Volume: 330×240×300mm | Dual Extrusion | Heated Build Plate'
    },
    {
        id: 'laser',
        name: 'Laser Cutter',
        position: { x: 5, y: 1.5, z: 0 },
        icon: '⚡',
        description: 'Precision laser cutting and engraving machine for various materials.',
        specs: 'Work Area: 600×400mm | Power: 80W | Materials: Wood, Acrylic, Leather'
    }
];

const ProjectsData = [
    {
        id: 'project1',
        title: 'Smart Home Automation',
        description: 'IoT-based home automation system with 3D-printed enclosures and custom PCB designs.',
        image: null,
        tags: ['IoT', '3D Printing', 'Electronics']
    },
    {
        id: 'project2',
        title: 'Robotic Arm',
        description: 'Six-axis robotic arm built with 3D-printed parts and Arduino control.',
        image: null,
        tags: ['Robotics', '3D Printing', 'Arduino']
    },
    {
        id: 'project3',
        title: 'Eco Lamp Design',
        description: 'Sustainable lamp designs using recycled materials and laser-cut components.',
        image: null,
        tags: ['Design', 'Sustainability', 'Laser Cutting']
    },
    {
        id: 'project4',
        title: 'Custom Keyboard',
        description: 'Mechanical keyboard with 3D-printed case and custom keycaps.',
        image: null,
        tags: ['3D Printing', 'Electronics', 'Design']
    }
];

const MembersData = [
    {
        id: 'member1',
        name: 'Alex Chen',
        role: 'Lead Engineer',
        description: 'Specializes in robotics and automation systems.',
        avatar: '👨‍🔬'
    },
    {
        id: 'member2',
        name: 'Sarah Mueller',
        role: '3D Design Specialist',
        description: 'Expert in CAD modeling and additive manufacturing.',
        avatar: '👩‍🎨'
    },
    {
        id: 'member3',
        name: 'Marcus Weber',
        role: 'Software Developer',
        description: 'Focuses on embedded systems and IoT applications.',
        avatar: '👨‍💻'
    },
    {
        id: 'member4',
        name: 'Lisa Schmidt',
        role: 'Electronics Engineer',
        description: 'PCB design and circuit prototyping expert.',
        avatar: '👩‍🔧'
    }
];

const NewsData = [
    {
        id: 'news1',
        date: '2025-10-28',
        title: 'New Prusa MK4 Arrives!',
        content: 'We just received our latest addition - the Prusa MK4 with input shaping for even faster prints.'
    },
    {
        id: 'news2',
        date: '2025-10-25',
        title: 'Workshop: Introduction to 3D Printing',
        content: 'Join us next week for a beginner-friendly workshop on 3D printing basics and design principles.'
    },
    {
        id: 'news3',
        date: '2025-10-20',
        title: 'Maker Faire Success',
        content: 'Our team showcased 10+ projects at the local Maker Faire with amazing community response!'
    },
    {
        id: 'news4',
        date: '2025-10-15',
        title: 'Open Lab Hours Extended',
        content: 'Good news! We are extending our open lab hours. Now open Monday-Friday 2pm-10pm.'
    }
];

const EasterEggs = [
    {
        id: 'egg1',
        position: { x: -8, y: 0.5, z: -8 },
        title: '🎉 Hidden Benchy!',
        message: 'You found the legendary 3D printer test - the 3DBenchy boat! Every maker knows this little guy.'
    },
    {
        id: 'egg2',
        position: { x: 8, y: 0.5, z: 8 },
        title: '🎮 Konami Code',
        message: 'Up, Up, Down, Down, Left, Right, Left, Right, B, A - You are a true maker and gamer!'
    }
];

// Debug Logger
function logToScreen(message) {
    const logDiv = document.getElementById('debug-log');
    if (logDiv) {
        const line = document.createElement('div');
        line.textContent = `> ${message}`;
        logDiv.appendChild(line);
        logDiv.scrollTop = logDiv.scrollHeight;
    }
    console.log(message);
}

// Initialize Application
document.addEventListener('DOMContentLoaded', () => {
    logToScreen('App initialized. Waiting for user interaction...');
    initEventListeners();
    checkMobileAndShowWarning();
});

function checkMobileAndShowWarning() {
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    
    if (isMobile) {
        document.getElementById('mobile-warning').classList.add('show');
        
        document.getElementById('continue-btn').addEventListener('click', () => {
            document.getElementById('mobile-warning').classList.remove('show');
            startLoading();
        });
        
        document.getElementById('cancel-btn').addEventListener('click', () => {
            window.location.href = 'about:blank';
        });
    } else {
        startLoading();
    }
}

function startLoading() {
    // Simulate loading progress
    let progress = 0;
    const progressBar = document.getElementById('progress-bar');
    const progressText = document.getElementById('progress-text');
    const loadingVideo = document.getElementById('loading-video');
    
    // Ensure video metadata is loaded before syncing
    if (loadingVideo && loadingVideo.canPlayType('video/mp4')) {
        loadingVideo.load();
        
        // Wait for metadata to be loaded
        loadingVideo.addEventListener('loadedmetadata', () => {
            console.log('Video duration:', loadingVideo.duration);
        });
    }
    
    const loadingInterval = setInterval(() => {
        progress += Math.random() * 10;
        if (progress >= 100) {
            progress = 100;
            clearInterval(loadingInterval);
            setTimeout(() => {
                hideLoadingScreen();
            }, 500);
        }
        
        AppState.loadingProgress = progress;
        progressBar.style.width = `${progress}%`;
        progressText.textContent = `${Math.floor(progress)}%`;
        
        // Sync video playback with progress (0-100%)
        if (loadingVideo && loadingVideo.duration && !isNaN(loadingVideo.duration)) {
            const videoTime = (progress / 100) * loadingVideo.duration;
            loadingVideo.currentTime = videoTime;
        }
    }, 200);
}

function hideLoadingScreen() {
    setTimeout(() => {
        document.getElementById('loading-screen').classList.add('hidden');
    }, 500);
}

function initEventListeners() {
    // Landing page
    document.getElementById('go-in-btn').addEventListener('click', transitionToDoorScene);
    
    // Back button
    document.getElementById('back-btn').addEventListener('click', backToLanding);
    
    // Close buttons
    const closeHud = document.getElementById('close-hud');
    if (closeHud) {
        closeHud.addEventListener('click', closeFloatingHUD);
    }
    
    document.getElementById('close-projects').addEventListener('click', () => {
        document.getElementById('projects-view').classList.add('hidden');
    });
    
    document.getElementById('close-members').addEventListener('click', () => {
        document.getElementById('members-view').classList.add('hidden');
    });
    
    document.getElementById('close-news').addEventListener('click', () => {
        document.getElementById('news-view').classList.add('hidden');
    });
    
    document.getElementById('close-easter').addEventListener('click', () => {
        document.getElementById('easter-egg-modal').classList.add('hidden');
    });
}

function transitionToDoorScene() {
    const landing = document.getElementById('landing-page');
    const threeScene = document.getElementById('three-scene');
    
    landing.classList.remove('active');
    
    // Start loading 3D scene early
    init3DScene();
    
    // Skip door scene, go directly to 3D scene
    setTimeout(() => {
        threeScene.classList.add('active');
        AppState.isIn3DScene = true;
        AppState.currentScene = '3d';
        
        onWindowResize();
    }, 500);
}

function backToLanding() {
    const threeScene = document.getElementById('three-scene');
    const landing = document.getElementById('landing-page');
    
    threeScene.classList.remove('active');
    landing.classList.add('active');
    
    AppState.isIn3DScene = false;
    AppState.currentScene = 'landing';
    
    // Cleanup 3D scene
    if (AppState.renderer) {
        AppState.renderer.dispose();
        AppState.renderer = null;
    }
}

function init3DScene() {
    if (AppState.renderer) return; // Already initialized

    const container = document.getElementById('three-scene');
    
    // Create Three.js scene
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
        75,
        window.innerWidth / window.innerHeight,
        0.1,
        1000
    );
    
    const renderer = new THREE.WebGLRenderer({ 
        antialias: false, // Disable antialiasing for performance
        powerPreference: "high-performance",
        stencil: false,
        depth: true
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5)); // Lower max pixel ratio
    
    // Replace canvas
    const oldCanvas = document.getElementById('three-canvas');
    if (oldCanvas && oldCanvas.parentNode) {
        oldCanvas.parentNode.replaceChild(renderer.domElement, oldCanvas);
        renderer.domElement.id = 'three-canvas';
    }
    
    // Initialize scene objects array
    if (!AppState.scene) {
        AppState.scene = {};
    }
    AppState.scene.objects = [];
    AppState.scene.interactiveObjects = [];
    
    // Set initial camera position - Start at center
    camera.position.set(0, 1.6, 0);
    camera.rotation.y = 0;
    
    // Debugging: Add visual helpers
    scene.background = new THREE.Color(0xffffff); // White background to fill holes
    // const gridHelper = new THREE.GridHelper(20, 20);
    // scene.add(gridHelper);
    // const axesHelper = new THREE.AxesHelper(5);
    // scene.add(axesHelper);

    AppState.renderer = renderer;
    AppState.camera = camera;
    AppState.scene.threeScene = scene;
    
    // Check for Cross-Origin Isolation
    if (!window.crossOriginIsolated) {
        console.log('[INFO] Running without SharedArrayBuffer (normal for GitHub Pages). Using fallback mode.');
    }

    // Safari browser detection
    const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
    if (isSafari) {
        logToScreen('[INFO] Safari detected - using compatibility mode for PLY parsing.');
    }

    // Verify file access first
    logToScreen(`Checking file: ${Config.GAUSSIAN_SPLAT_FILE}`);
    fetch(Config.GAUSSIAN_SPLAT_FILE)
        .then(response => {
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            logToScreen(`File found! Size: ${response.headers.get('content-length')} bytes`);
            return response.blob();
        })
        .then(blob => {
            logToScreen(`Blob created. Size: ${blob.size}`);
        })
        .catch(e => {
            logToScreen(`ERROR: Failed to fetch file: ${e.message}`);
            alert('Failed to load splat file. Check debug log.');
        });

    // Load Gaussian Splat
     const viewer = new GaussianSplats3D.Viewer({
        scene: scene,
        renderer: renderer,
        camera: camera,
        useBuiltInControls: false,
        sharedMemoryForWorkers: false,
        progressiveLoad: false,
        // format: GaussianSplats3D.SceneFormat.Ply,  <--- DIESE ZEILE LÖSCHEN!
        streamView: false
    });
    
    logToScreen('Starting splat viewer...');
    viewer.addSplatScene(Config.GAUSSIAN_SPLAT_FILE, {
        'showLoadingUI': true,
        'position': [0, 0, 0],
        'rotation': [0, 0, 1, 0], // Rotate 180 degrees around Z axis to flip upside down
        'scale': [5, 5, 5],
        'splatAlphaRemovalThreshold': 20, // Aggressively remove transparent splats
        'sphericalHarmonicsDegree': 0, // Disable view-dependent color shifts (huge performance boost)
        // Safari fix: Disable progressive loading
        'progressiveLoad': false,
        // Load all data before rendering
        'streamView': false
    })
        .then(() => {
            logToScreen('Splat loaded successfully!');
            
            // Debug: Inspect viewer for mesh
            if (viewer.splatMesh) {
                logToScreen('Found viewer.splatMesh!');
                if (!scene.children.includes(viewer.splatMesh)) {
                    scene.add(viewer.splatMesh);
                    logToScreen('Manually added viewer.splatMesh to scene');
                }
            } else if (viewer.splatScene) {
                logToScreen('Found viewer.splatScene!');
                 if (!scene.children.includes(viewer.splatScene)) {
                    scene.add(viewer.splatScene);
                    logToScreen('Manually added viewer.splatScene to scene');
                }
            } else {
                logToScreen('Could not find splat mesh in viewer properties.');
                // List viewer properties to find where the mesh is
                const keys = Object.keys(viewer).filter(k => !k.startsWith('_'));
                logToScreen(`Viewer keys: ${keys.join(', ')}`);
            }

            logToScreen(`Scene children count: ${scene.children.length}`);
        })
        .catch((error) => {
            logToScreen(`ERROR loading splat: ${error}`);
        });
    
    // Store viewer reference
    AppState.viewer = viewer;
    
    // Setup controls and markers
    setupControls();
    createInteractiveMarkers3D();
    
    startAnimationLoop();
}

function startAnimationLoop() {
    let frameCount = 0;
    let lastTime = performance.now();

    // Animation loop
    function animate() {
        if (!AppState.isIn3DScene) {
            requestAnimationFrame(animate);
            return;
        }
        requestAnimationFrame(animate);
        
        const currentTime = performance.now();
        const delta = AppState.clock.getDelta();

        // Dynamic Resolution Scaling
        frameCount++;
        if (currentTime - lastTime >= 1000) {
            const fps = frameCount;
            frameCount = 0;
            lastTime = currentTime;
            
            if (AppState.renderer) {
                const currentPixelRatio = AppState.renderer.getPixelRatio();
                // If FPS is low (< 30), reduce resolution
                if (fps < 30 && currentPixelRatio > 0.5) {
                    const newRatio = Math.max(0.5, currentPixelRatio * 0.8);
                    AppState.renderer.setPixelRatio(newRatio);
                    // console.log(`Low FPS (${fps}), reducing resolution to ${newRatio.toFixed(2)}`);
                } 
                // If FPS is good (> 55), try to increase resolution up to limit
                else if (fps > 55 && currentPixelRatio < 1.5 && currentPixelRatio < window.devicePixelRatio) {
                    const newRatio = Math.min(Math.min(window.devicePixelRatio, 1.5), currentPixelRatio * 1.1);
                    AppState.renderer.setPixelRatio(newRatio);
                }
            }
        }
        
        updateMovement(delta);
        updateCamera();
        
        // Animate marker rings
        animateMarkers(currentTime);
        
        if (AppState.viewer) AppState.viewer.update();
        if (AppState.renderer && AppState.scene.threeScene && AppState.camera) {
            AppState.renderer.render(AppState.scene.threeScene, AppState.camera);
        }
    }
    
    animate();
}

function animateMarkers(time) {
    if (!AppState.scene.objects) return;
    
    // Animate marker rings
    AppState.scene.objects.forEach(obj => {
        if (obj.ring) {
            // Rotate the ring slowly
            obj.ring.rotation.z = (time * 0.001) % (Math.PI * 2);
            
            // Pulse scale
            const scale = 1 + Math.sin(time * 0.003) * 0.1;
            obj.ring.scale.set(scale, scale, 1);
        }
    });
}

function createInteractiveMarkers3D() {
    if (!AppState.scene.threeScene) return;
    
    // Create sample equipment markers with visible 3D objects
    EquipmentData.forEach(equipment => {
        const marker = {
            type: 'equipment',
            data: equipment,
            position: equipment.position,
            screenPos: { x: 0, y: 0 },
            size: 40,
            color: '#00d4ff'
        };
        
        // Create a neon-style marker with outer ring
        const markerGroup = new THREE.Group();
        
        // Inner glowing sphere
        const innerGeo = new THREE.SphereGeometry(0.15, 16, 16);
        const innerMat = new THREE.MeshBasicMaterial({ 
            color: 0x00d4ff,
            transparent: true,
            opacity: 0.9
        });
        const innerSphere = new THREE.Mesh(innerGeo, innerMat);
        markerGroup.add(innerSphere);
        
        // Outer ring
        const ringGeo = new THREE.RingGeometry(0.2, 0.25, 32);
        const ringMat = new THREE.MeshBasicMaterial({ 
            color: 0x00d4ff,
            transparent: true,
            opacity: 0.6,
            side: THREE.DoubleSide
        });
        const ring = new THREE.Mesh(ringGeo, ringMat);
        ring.rotation.x = Math.PI / 2;
        markerGroup.add(ring);
        
        markerGroup.position.set(equipment.position.x, equipment.position.y, equipment.position.z);
        
        AppState.scene.threeScene.add(markerGroup);
        marker.mesh = markerGroup;
        marker.ring = ring; // Store ring for animation
        
        AppState.scene.objects.push(marker);
        AppState.scene.interactiveObjects.push(marker);
    });
    
    // Create other interactive objects
    createInteractiveObjects();
    
    // Create easter eggs
    createEasterEggs();
}

function createInteractiveObjects() {
    if (!AppState.scene.threeScene) return;
    
    // Whiteboard (Projects trigger)
    const projectMarker = {
        type: 'projects-trigger',
        position: { x: -9.5, y: 2, z: -5 },
        screenPos: { x: 0, y: 0 },
        size: 50,
        color: '#7b2cbf',
        label: '📋 Projects'
    };
    
    // Create visible 3D marker
    const projectGeo = new THREE.SphereGeometry(0.25, 16, 16);
    const projectMat = new THREE.MeshBasicMaterial({ 
        color: 0x7b2cbf,
        transparent: true,
        opacity: 0.8
    });
    const projectMesh = new THREE.Mesh(projectGeo, projectMat);
    projectMesh.position.set(projectMarker.position.x, projectMarker.position.y, projectMarker.position.z);
    
    // Optimization
    projectMesh.matrixAutoUpdate = false;
    projectMesh.updateMatrix();

    AppState.scene.threeScene.add(projectMesh);
    projectMarker.mesh = projectMesh;
    
    AppState.scene.objects.push(projectMarker);
    AppState.scene.interactiveObjects.push(projectMarker);
    
    // Computer screen (News trigger)
    const newsMarker = {
        type: 'news-trigger',
        position: { x: 9.5, y: 2, z: 5 },
        screenPos: { x: 0, y: 0 },
        size: 50,
        color: '#00d4ff',
        label: '💻 News'
    };
    
    const newsGeo = new THREE.SphereGeometry(0.25, 16, 16);
    const newsMat = new THREE.MeshBasicMaterial({ 
        color: 0x00d4ff,
        transparent: true,
        opacity: 0.8
    });
    const newsMesh = new THREE.Mesh(newsGeo, newsMat);
    newsMesh.position.set(newsMarker.position.x, newsMarker.position.y, newsMarker.position.z);
    
    // Optimization
    newsMesh.matrixAutoUpdate = false;
    newsMesh.updateMatrix();

    AppState.scene.threeScene.add(newsMesh);
    newsMarker.mesh = newsMesh;
    
    AppState.scene.objects.push(newsMarker);
    AppState.scene.interactiveObjects.push(newsMarker);
    
    // Member display object
    const memberDisplay = {
        type: 'members-trigger',
        position: { x: 0, y: 0.75, z: -9.5 },
        screenPos: { x: 0, y: 0 },
        size: 50,
        color: '#ffd700',
        label: '👥 Team'
    };
    
    const memberGeo = new THREE.SphereGeometry(0.25, 16, 16);
    const memberMat = new THREE.MeshBasicMaterial({ 
        color: 0xffd700,
        transparent: true,
        opacity: 0.8
    });
    const memberMesh = new THREE.Mesh(memberGeo, memberMat);
    memberMesh.position.set(memberDisplay.position.x, memberDisplay.position.y, memberDisplay.position.z);
    
    // Optimization
    memberMesh.matrixAutoUpdate = false;
    memberMesh.updateMatrix();

    AppState.scene.threeScene.add(memberMesh);
    memberDisplay.mesh = memberMesh;
    
    AppState.scene.objects.push(memberDisplay);
    AppState.scene.interactiveObjects.push(memberDisplay);
}

function createEasterEggs() {
    if (!AppState.scene.threeScene) return;
    
    EasterEggs.forEach(egg => {
        const eggMarker = {
            type: 'easter-egg',
            data: egg,
            position: egg.position,
            screenPos: { x: 0, y: 0 },
            size: 30,
            color: '#ff00ff',
            pulse: 0
        };
        
        // Create visible 3D marker
        const geometry = new THREE.SphereGeometry(0.15, 16, 16);
        const material = new THREE.MeshBasicMaterial({ 
            color: 0xff00ff,
            transparent: true,
            opacity: 0.6
        });
        const mesh = new THREE.Mesh(geometry, material);
        mesh.position.set(egg.position.x, egg.position.y, egg.position.z);
        
        // Optimization
        mesh.matrixAutoUpdate = false;
        mesh.updateMatrix();

        AppState.scene.threeScene.add(mesh);
        eggMarker.mesh = mesh;
        
        AppState.scene.objects.push(eggMarker);
        AppState.scene.interactiveObjects.push(eggMarker);
    });
}

function setupControls() {
    // Keyboard controls
    document.addEventListener('keydown', (e) => {
        if (!AppState.isIn3DScene) return;
        
        // Check if locked at object - trying to move exits
        if (AppState.isLockedAtObject) {
            if (['w', 'a', 's', 'd', 'arrowup', 'arrowdown', 'arrowleft', 'arrowright'].includes(e.key.toLowerCase())) {
                exitObjectView();
            }
            return;
        }
        
        switch(e.key.toLowerCase()) {
            case 'w':
            case 'arrowup':
                AppState.controls.forward = true;
                updateWASDIndicator('w', true);
                break;
            case 's':
            case 'arrowdown':
                AppState.controls.backward = true;
                updateWASDIndicator('s', true);
                break;
            case 'a':
            case 'arrowleft':
                AppState.controls.left = true;
                updateWASDIndicator('a', true);
                break;
            case 'd':
            case 'arrowright':
                AppState.controls.right = true;
                updateWASDIndicator('d', true);
                break;
        }
    });
    
    document.addEventListener('keyup', (e) => {
        if (!AppState.isIn3DScene) return;
        
        switch(e.key.toLowerCase()) {
            case 'w':
            case 'arrowup':
                AppState.controls.forward = false;
                updateWASDIndicator('w', false);
                break;
            case 's':
            case 'arrowdown':
                AppState.controls.backward = false;
                updateWASDIndicator('s', false);
                break;
            case 'a':
            case 'arrowleft':
                AppState.controls.left = false;
                updateWASDIndicator('a', false);
                break;
            case 'd':
            case 'arrowright':
                AppState.controls.right = false;
                updateWASDIndicator('d', false);
                break;
        }
    });
    
    // Mouse controls for looking around - HORIZONTAL ONLY
    document.addEventListener('mousedown', () => { 
        AppState.isDragging = true;
        AppState.dragStartX = 0;
    });
    document.addEventListener('mouseup', () => { AppState.isDragging = false; });
    document.addEventListener('mouseleave', () => { AppState.isDragging = false; });

    document.addEventListener('mousemove', (e) => {
        if (!AppState.isIn3DScene || !AppState.isDragging) return;
        
        // If locked at object, dragging also exits
        if (AppState.isLockedAtObject) {
            exitObjectView();
            return;
        }
        
        // Track drag distance
        AppState.dragStartX += Math.abs(e.movementX);
        
        // Sensitivity factor - ONLY HORIZONTAL ROTATION
        const sensitivity = 0.002;
        
        // Only update Y rotation (horizontal)
        AppState.cameraRotation.y += e.movementX * sensitivity;
        // Don't update X rotation (vertical) - removed the line
    });
    
    // Click interaction
    const canvas = document.getElementById('three-canvas');
    canvas.addEventListener('click', handleClick);
    
    // Window resize
    window.addEventListener('resize', onWindowResize);
}

function updateWASDIndicator(key, active) {
    const keyElement = document.querySelector(`.wasd-key[data-key="${key}"]`);
    if (keyElement) {
        if (active) {
            keyElement.classList.add('active');
        } else {
            keyElement.classList.remove('active');
        }
    }
}

function handleClick(event) {
    if (!AppState.camera || !AppState.scene.interactiveObjects) return;
    
    // Don't register click if we were dragging
    if (AppState.dragStartX > 10) {
        AppState.dragStartX = 0;
        return;
    }
    
    const rect = AppState.renderer.domElement.getBoundingClientRect();
    const mouse = new THREE.Vector2();
    mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
    
    const raycaster = new THREE.Raycaster();
    raycaster.setFromCamera(mouse, AppState.camera);
    
    // Check interactions with markers based on distance
    for (const obj of AppState.scene.interactiveObjects) {
        const markerPos = new THREE.Vector3(obj.position.x, obj.position.y, obj.position.z);
        const distance = raycaster.ray.distanceToPoint(markerPos);
        
        if (distance < Config.INTERACTION_DISTANCE) {
            handleObjectInteraction(obj);
            break;
        }
    }
}

function handleObjectInteraction(object) {
    if (object.type === 'equipment') {
        // Fly to object and show HUD
        flyToObject(object);
    } else if (object.type === 'projects-trigger') {
        showProjectsView();
    } else if (object.type === 'members-trigger') {
        showMembersView();
    } else if (object.type === 'news-trigger') {
        showNewsView();
    } else if (object.type === 'easter-egg') {
        showEasterEgg(object.data);
    }
}

function flyToObject(object) {
    if (AppState.isAnimatingToObject) return;
    
    AppState.isAnimatingToObject = true;
    const startPos = {
        x: AppState.camera.position.x,
        y: AppState.camera.position.y,
        z: AppState.camera.position.z
    };
    
    // Calculate position in front of the object
    const targetPos = {
        x: object.position.x,
        y: object.position.y,
        z: object.position.z + Config.OBJECT_VIEW_DISTANCE
    };
    
    const startTime = Date.now();
    
    function animateFly() {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / Config.FLY_TO_OBJECT_DURATION, 1);
        
        // Smooth easing function
        const eased = 1 - Math.pow(1 - progress, 3);
        
        AppState.camera.position.x = startPos.x + (targetPos.x - startPos.x) * eased;
        AppState.camera.position.y = startPos.y + (targetPos.y - startPos.y) * eased;
        AppState.camera.position.z = startPos.z + (targetPos.z - startPos.z) * eased;
        
        // Look at the object
        const lookAtPos = new THREE.Vector3(object.position.x, object.position.y, object.position.z);
        AppState.camera.lookAt(lookAtPos);
        
        // Update rotation state to match
        const direction = new THREE.Vector3();
        AppState.camera.getWorldDirection(direction);
        AppState.cameraRotation.y = Math.atan2(direction.x, direction.z);
        
        if (progress < 1) {
            requestAnimationFrame(animateFly);
        } else {
            AppState.isAnimatingToObject = false;
            AppState.isLockedAtObject = true;
            AppState.currentLockedObject = object;
            showFloatingHUD(object.data);
        }
    }
    
    animateFly();
}

function exitObjectView() {
    AppState.isLockedAtObject = false;
    AppState.currentLockedObject = null;
    closeFloatingHUD();
}

function showFloatingHUD(equipment) {
    const hud = document.getElementById('floating-hud');
    document.getElementById('hud-icon').textContent = equipment.icon;
    document.getElementById('hud-title').textContent = equipment.name;
    document.getElementById('hud-description').textContent = equipment.description;
    document.getElementById('hud-specs').innerHTML = equipment.specs;
    hud.classList.remove('hidden');
}

function closeFloatingHUD() {
    const hud = document.getElementById('floating-hud');
    hud.classList.add('hidden');
}

function showProjectsView() {
    const view = document.getElementById('projects-view');
    const container = document.getElementById('projects-container');
    
    container.innerHTML = '';
    ProjectsData.forEach(project => {
        const card = document.createElement('div');
        card.className = 'card-3d';
        card.innerHTML = `
            <h3>${project.title}</h3>
            <p>${project.description}</p>
            <div style="margin-top: 15px; display: flex; gap: 8px; flex-wrap: wrap;">
                ${project.tags.map(tag => `<span style="background: rgba(0,212,255,0.2); padding: 5px 10px; border-radius: 5px; font-size: 0.85em;">${tag}</span>`).join('')}
            </div>
        `;
        container.appendChild(card);
    });
    
    view.classList.remove('hidden');
}

function showMembersView() {
    const view = document.getElementById('members-view');
    const container = document.getElementById('members-container');
    
    container.innerHTML = '';
    MembersData.forEach(member => {
        const card = document.createElement('div');
        card.className = 'card-3d';
        card.innerHTML = `
            <div style="font-size: 3em; text-align: center; margin-bottom: 15px;">${member.avatar}</div>
            <h3>${member.name}</h3>
            <p style="color: var(--primary-color); margin-bottom: 10px;">${member.role}</p>
            <p>${member.description}</p>
        `;
        container.appendChild(card);
    });
    
    view.classList.remove('hidden');
}

function showNewsView() {
    const view = document.getElementById('news-view');
    const container = document.getElementById('news-container');
    
    container.innerHTML = '';
    NewsData.forEach(news => {
        const item = document.createElement('div');
        item.className = 'news-item';
        item.innerHTML = `
            <div class="date">${formatDate(news.date)}</div>
            <h3>${news.title}</h3>
            <p>${news.content}</p>
        `;
        container.appendChild(item);
    });
    
    view.classList.remove('hidden');
}

function showEasterEgg(egg) {
    if (!AppState.easterEggsFound.includes(egg.id)) {
        AppState.easterEggsFound.push(egg.id);
    }
    
    const modal = document.getElementById('easter-egg-modal');
    document.getElementById('easter-title').textContent = egg.title;
    document.getElementById('easter-message').textContent = egg.message;
    modal.classList.remove('hidden');
}

function formatDate(dateStr) {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
}

function updateMovement(delta) {
    // Don't move if locked at object or animating
    if (AppState.isLockedAtObject || AppState.isAnimatingToObject) {
        return;
    }
    
    const speed = 5.0 * delta; // Adjusted speed for delta time
    const sinRotation = Math.sin(AppState.camera.rotation.y);
    const cosRotation = Math.cos(AppState.camera.rotation.y);
    
    if (AppState.controls.forward) {
        AppState.camera.position.x += sinRotation * speed;
        AppState.camera.position.z -= cosRotation * speed;
    }
    if (AppState.controls.backward) {
        AppState.camera.position.x -= sinRotation * speed;
        AppState.camera.position.z += cosRotation * speed;
    }
    if (AppState.controls.left) {
        AppState.camera.position.x -= cosRotation * speed;
        AppState.camera.position.z -= sinRotation * speed;
    }
    if (AppState.controls.right) {
        AppState.camera.position.x += cosRotation * speed;
        AppState.camera.position.z += sinRotation * speed;
    }
    
    // Boundary limits
    AppState.camera.position.x = Math.max(-9, Math.min(9, AppState.camera.position.x));
    AppState.camera.position.z = Math.max(-9, Math.min(9, AppState.camera.position.z));
}

function updateCamera() {
    // Don't update rotation if locked at object
    if (!AppState.isLockedAtObject) {
        // Apply rotation directly from state - HORIZONTAL ONLY
        AppState.camera.rotation.y = AppState.cameraRotation.y;
        // Keep X rotation at 0 for horizontal-only rotation
        AppState.camera.rotation.x = 0;
    }
}

function onWindowResize() {
    if (!AppState.renderer || !AppState.camera) return;
    
    AppState.camera.aspect = window.innerWidth / window.innerHeight;
    AppState.camera.updateProjectionMatrix();
    AppState.renderer.setSize(window.innerWidth, window.innerHeight);
}

