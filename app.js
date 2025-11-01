// Application State
const AppState = {
    currentScene: 'landing',
    isInDoorScene: false,
    isIn3DScene: false,
    camera: null,
    scene: null,
    renderer: null,
    controls: {
        forward: false,
        backward: false,
        left: false,
        right: false
    },
    mouseX: 0,
    mouseY: 0,
    cameraRotation: { x: 0, y: 0 },
    velocity: { x: 0, y: 0, z: 0 },
    easterEggsFound: []
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

// Initialize Application
document.addEventListener('DOMContentLoaded', () => {
    initEventListeners();
    hideLoadingScreen();
});

function initEventListeners() {
    // Landing page
    document.getElementById('go-in-btn').addEventListener('click', transitionToDoorScene);
    
    // Door scene - touch/swipe
    const doorScene = document.getElementById('door-scene');
    let touchStartY = 0;
    
    doorScene.addEventListener('touchstart', (e) => {
        touchStartY = e.touches[0].clientY;
    });
    
    doorScene.addEventListener('touchend', (e) => {
        const touchEndY = e.changedTouches[0].clientY;
        const swipeDistance = touchStartY - touchEndY;
        
        if (swipeDistance > 50) { // Swipe up
            openDoor();
        }
    });
    
    // Also allow click/keyboard for desktop
    doorScene.addEventListener('click', openDoor);
    document.addEventListener('keydown', (e) => {
        if (AppState.isInDoorScene && (e.key === 'ArrowUp' || e.key === 'w' || e.key === 'W')) {
            openDoor();
        }
    });
    
    // Back button
    document.getElementById('back-btn').addEventListener('click', backToLanding);
    
    // Close buttons
    document.getElementById('close-info').addEventListener('click', () => {
        document.getElementById('info-panel').classList.add('hidden');
    });
    
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

function hideLoadingScreen() {
    setTimeout(() => {
        document.getElementById('loading-screen').classList.add('hidden');
    }, 1000);
}

function transitionToDoorScene() {
    const landing = document.getElementById('landing-page');
    const doorScene = document.getElementById('door-scene');
    
    landing.classList.remove('active');
    
    setTimeout(() => {
        doorScene.classList.add('active');
        AppState.isInDoorScene = true;
        AppState.currentScene = 'door';
    }, 500);
}

function openDoor() {
    const leftDoor = document.getElementById('left-door');
    const rightDoor = document.getElementById('right-door');
    const swipeHint = document.getElementById('swipe-hint');
    
    swipeHint.style.display = 'none';
    leftDoor.classList.add('open');
    rightDoor.classList.add('open');
    
    setTimeout(() => {
        transition3DScene();
    }, 1200);
}

function transition3DScene() {
    const doorScene = document.getElementById('door-scene');
    const threeScene = document.getElementById('three-scene');
    
    doorScene.classList.remove('active');
    threeScene.classList.add('active');
    
    AppState.isInDoorScene = false;
    AppState.isIn3DScene = true;
    AppState.currentScene = '3d';
    
    init3DScene();
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

// 3D Scene Setup - Canvas 2D Implementation
function init3DScene() {
    const canvas = document.getElementById('three-canvas');
    const ctx = canvas.getContext('2d');
    
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    AppState.renderer = { ctx, canvas };
    AppState.camera = {
        position: { x: 0, y: 0, z: 10 },
        rotation: { x: 0, y: 0 }
    };
    
    // Initialize scene objects
    AppState.scene = {
        objects: [],
        interactiveObjects: []
    };
    
    // Create room environment
    createRoom();
    createEquipmentMarkers();
    createInteractiveObjects();
    createEasterEggs();
    
    // Controls
    setupControls();
    
    // Start animation loop
    animate();
}

function createRoom() {
    // Create a pseudo-3D room using 2D canvas
    AppState.scene.room = {
        floor: { color: '#808080' },
        walls: { color: '#e0e0e0' },
        ceiling: { color: '#ffffff' }
    };
}

function createEquipmentMarkers() {
    EquipmentData.forEach(equipment => {
        const marker = {
            type: 'equipment',
            data: equipment,
            position: equipment.position,
            screenPos: { x: 0, y: 0 },
            size: 40,
            color: '#00d4ff'
        };
        AppState.scene.objects.push(marker);
        AppState.scene.interactiveObjects.push(marker);
    });
}

function createInteractiveObjects() {
    // Whiteboard (Projects trigger)
    const projectMarker = {
        type: 'projects-trigger',
        position: { x: -9.5, y: 2, z: -5 },
        screenPos: { x: 0, y: 0 },
        size: 50,
        color: '#7b2cbf',
        label: '📋 Projects'
    };
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
    AppState.scene.objects.push(memberDisplay);
    AppState.scene.interactiveObjects.push(memberDisplay);
}

function createEasterEggs() {
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
        AppState.scene.objects.push(eggMarker);
        AppState.scene.interactiveObjects.push(eggMarker);
    });
}

function setupControls() {
    // Keyboard controls
    document.addEventListener('keydown', (e) => {
        if (!AppState.isIn3DScene) return;
        
        switch(e.key.toLowerCase()) {
            case 'w':
            case 'arrowup':
                AppState.controls.forward = true;
                break;
            case 's':
            case 'arrowdown':
                AppState.controls.backward = true;
                break;
            case 'a':
            case 'arrowleft':
                AppState.controls.left = true;
                break;
            case 'd':
            case 'arrowright':
                AppState.controls.right = true;
                break;
        }
    });
    
    document.addEventListener('keyup', (e) => {
        if (!AppState.isIn3DScene) return;
        
        switch(e.key.toLowerCase()) {
            case 'w':
            case 'arrowup':
                AppState.controls.forward = false;
                break;
            case 's':
            case 'arrowdown':
                AppState.controls.backward = false;
                break;
            case 'a':
            case 'arrowleft':
                AppState.controls.left = false;
                break;
            case 'd':
            case 'arrowright':
                AppState.controls.right = false;
                break;
        }
    });
    
    // Mouse controls for looking around
    document.addEventListener('mousemove', (e) => {
        if (!AppState.isIn3DScene) return;
        
        AppState.mouseX = (e.clientX / window.innerWidth) * 2 - 1;
        AppState.mouseY = -(e.clientY / window.innerHeight) * 2 + 1;
    });
    
    // Click interaction
    const canvas = document.getElementById('three-canvas');
    canvas.addEventListener('click', handleClick);
    
    // Window resize
    window.addEventListener('resize', onWindowResize);
}

function handleClick(event) {
    const rect = AppState.renderer.canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    
    // Check if click is on any interactive object
    for (const obj of AppState.scene.interactiveObjects) {
        const dx = x - obj.screenPos.x;
        const dy = y - obj.screenPos.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < obj.size / 2) {
            handleObjectInteraction(obj);
            break;
        }
    }
}

function handleObjectInteraction(object) {
    if (object.type === 'equipment') {
        showInfoPanel(object.data);
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

function showInfoPanel(equipment) {
    const panel = document.getElementById('info-panel');
    document.getElementById('panel-title').textContent = equipment.name;
    document.getElementById('panel-description').innerHTML = `<p>${equipment.description}</p>`;
    document.getElementById('panel-specs').innerHTML = `<strong>Specifications:</strong><br>${equipment.specs}`;
    panel.classList.remove('hidden');
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

function updateMovement() {
    const speed = 0.1;
    const direction = {
        x: Math.sin(AppState.camera.rotation.y),
        z: Math.cos(AppState.camera.rotation.y)
    };
    
    if (AppState.controls.forward) {
        AppState.camera.position.x += direction.x * speed;
        AppState.camera.position.z -= direction.z * speed;
    }
    if (AppState.controls.backward) {
        AppState.camera.position.x -= direction.x * speed;
        AppState.camera.position.z += direction.z * speed;
    }
    if (AppState.controls.left) {
        AppState.camera.position.x -= direction.z * speed;
        AppState.camera.position.z -= direction.x * speed;
    }
    if (AppState.controls.right) {
        AppState.camera.position.x += direction.z * speed;
        AppState.camera.position.z += direction.x * speed;
    }
    
    // Boundary limits
    AppState.camera.position.x = Math.max(-9, Math.min(9, AppState.camera.position.x));
    AppState.camera.position.z = Math.max(-9, Math.min(9, AppState.camera.position.z));
}

function updateCamera() {
    // Smooth camera rotation based on mouse
    const targetRotationY = AppState.mouseX * Math.PI * 0.5;
    const targetRotationX = AppState.mouseY * Math.PI * 0.3;
    
    AppState.cameraRotation.y += (targetRotationY - AppState.cameraRotation.y) * 0.05;
    AppState.cameraRotation.x += (targetRotationX - AppState.cameraRotation.x) * 0.05;
    
    AppState.camera.rotation.y = AppState.cameraRotation.y;
    AppState.camera.rotation.x = AppState.cameraRotation.x;
}

function project3DToScreen(pos3D) {
    // Simple pseudo-3D projection
    const cam = AppState.camera;
    
    // Relative position to camera
    const relX = pos3D.x - cam.position.x;
    const relZ = pos3D.z - cam.position.z;
    
    // Rotate relative to camera rotation
    const cosY = Math.cos(-cam.rotation.y);
    const sinY = Math.sin(-cam.rotation.y);
    const rotX = relX * cosY - relZ * sinY;
    const rotZ = relX * sinY + relZ * cosY;
    
    // Project to screen
    if (rotZ < 0.1) return null; // Behind camera
    
    const scale = 300 / rotZ;
    const screenX = AppState.renderer.canvas.width / 2 + rotX * scale;
    const screenY = AppState.renderer.canvas.height / 2 + (pos3D.y - 1.6) * scale;
    
    return { x: screenX, y: screenY, scale: scale };
}

function drawScene() {
    const ctx = AppState.renderer.ctx;
    const canvas = AppState.renderer.canvas;
    
    // Clear canvas
    ctx.fillStyle = '#87ceeb';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Draw floor gradient
    const gradient = ctx.createLinearGradient(0, canvas.height / 2, 0, canvas.height);
    gradient.addColorStop(0, '#a0a0a0');
    gradient.addColorStop(1, '#606060');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, canvas.height / 2, canvas.width, canvas.height / 2);
    
    // Draw ceiling
    const ceilGradient = ctx.createLinearGradient(0, 0, 0, canvas.height / 2);
    ceilGradient.addColorStop(0, '#ffffff');
    ceilGradient.addColorStop(1, '#e0e0e0');
    ctx.fillStyle = ceilGradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height / 2);
    
    // Sort objects by distance (painter's algorithm)
    const sortedObjects = [...AppState.scene.objects].sort((a, b) => {
        const distA = Math.sqrt(
            Math.pow(a.position.x - AppState.camera.position.x, 2) +
            Math.pow(a.position.z - AppState.camera.position.z, 2)
        );
        const distB = Math.sqrt(
            Math.pow(b.position.x - AppState.camera.position.x, 2) +
            Math.pow(b.position.z - AppState.camera.position.z, 2)
        );
        return distB - distA;
    });
    
    // Draw objects
    for (const obj of sortedObjects) {
        const screenPos = project3DToScreen(obj.position);
        
        if (screenPos) {
            obj.screenPos = screenPos;
            const size = obj.size * screenPos.scale / 10;
            
            // Pulse effect for easter eggs
            let alpha = 1;
            if (obj.type === 'easter-egg') {
                obj.pulse = (obj.pulse || 0) + 0.05;
                alpha = 0.3 + Math.sin(obj.pulse) * 0.2;
            }
            
            // Draw circle
            ctx.beginPath();
            ctx.arc(screenPos.x, screenPos.y, size / 2, 0, Math.PI * 2);
            ctx.fillStyle = obj.color;
            ctx.globalAlpha = alpha;
            ctx.fill();
            
            // Draw glow
            ctx.shadowBlur = 20;
            ctx.shadowColor = obj.color;
            ctx.fill();
            ctx.shadowBlur = 0;
            ctx.globalAlpha = 1;
            
            // Draw label if exists and close enough
            if (obj.label && screenPos.scale > 15) {
                ctx.fillStyle = '#ffffff';
                ctx.font = `${Math.min(16, size / 3)}px Arial`;
                ctx.textAlign = 'center';
                ctx.textBaseline = 'top';
                ctx.fillText(obj.label, screenPos.x, screenPos.y + size / 2 + 5);
            }
        }
    }
    
    // Draw UI hint
    ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
    ctx.font = '14px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('Move around and click on glowing markers to interact', canvas.width / 2, canvas.height - 30);
}

function animate() {
    if (!AppState.isIn3DScene || !AppState.renderer) return;
    
    requestAnimationFrame(animate);
    
    updateMovement();
    updateCamera();
    drawScene();
}

function onWindowResize() {
    if (!AppState.renderer) return;
    
    const canvas = AppState.renderer.canvas;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
