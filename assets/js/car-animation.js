// 3D Tesla Visualization
document.addEventListener('DOMContentLoaded', function() {
    // Initialize 3D scene
    const container = document.getElementById('tesla-3d');
    if (!container) {
        console.error('Tesla container not found');
        return;
    }
    
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    container.appendChild(renderer.domElement);
    
    // Add lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);
    
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(1, 1, 1);
    scene.add(directionalLight);
    
    // Create Tesla Model
    function createTesla(model = 'model-3') {
        // Clear existing objects
        while(scene.children.length > 0){ 
            scene.remove(scene.children[0]); 
        }
        
        // Add lighting back
        scene.add(ambientLight);
        scene.add(directionalLight);
        
        // Create Tesla body
        const teslaGeometry = new THREE.BoxGeometry(4.5, 1.5, 2);
        const teslaMaterial = new THREE.MeshPhongMaterial({ 
            color: 0x1a3a6c,
            specular: 0x111111,
            shininess: 30
        });
        const teslaBody = new THREE.Mesh(teslaGeometry, teslaMaterial);
        teslaBody.position.y = 0.75;
        scene.add(teslaBody);
        
        // Create wheels
        const wheelGeometry = new THREE.CylinderGeometry(0.3, 0.3, 0.2, 32);
        const wheelMaterial = new THREE.MeshPhongMaterial({ color: 0x333333 });
        
        const frontLeftWheel = new THREE.Mesh(wheelGeometry, wheelMaterial);
        frontLeftWheel.position.set(1.7, 0.3, 0.7);
        frontLeftWheel.rotation.z = Math.PI / 2;
        scene.add(frontLeftWheel);
        
        const frontRightWheel = new THREE.Mesh(wheelGeometry, wheelMaterial);
        frontRightWheel.position.set(-1.7, 0.3, 0.7);
        frontRightWheel.rotation.z = Math.PI / 2;
        scene.add(frontRightWheel);
        
        const rearLeftWheel = new THREE.Mesh(wheelGeometry, wheelMaterial);
        rearLeftWheel.position.set(1.7, 0.3, -0.7);
        rearLeftWheel.rotation.z = Math.PI / 2;
        scene.add(rearLeftWheel);
        
        const rearRightWheel = new THREE.Mesh(wheelGeometry, wheelMaterial);
        rearRightWheel.position.set(-1.7, 0.3, -0.7);
        rearRightWheel.rotation.z = Math.PI / 2;
        scene.add(rearRightWheel);
        
        // Add headlights
        const headlightGeometry = new THREE.BoxGeometry(0.3, 0.2, 0.1);
        const headlightMaterial = new THREE.MeshPhongMaterial({ color: 0xffffff });
        
        const leftHeadlight = new THREE.Mesh(headlightGeometry, headlightMaterial);
        leftHeadlight.position.set(2.2, 0.8, 0.5);
        scene.add(leftHeadlight);
        
        const rightHeadlight = new THREE.Mesh(headlightGeometry, headlightMaterial);
        rightHeadlight.position.set(2.2, 0.8, -0.5);
        scene.add(rightHeadlight);
        
        // Add windows
        const windowGeometry = new THREE.BoxGeometry(4, 0.8, 0.1);
        const windowMaterial = new THREE.MeshPhongMaterial({ 
            color: 0x000033, 
            transparent: true, 
            opacity: 0.6 
        });
        
        const windows = new THREE.Mesh(windowGeometry, windowMaterial);
        windows.position.set(0, 1.1, 0);
        scene.add(windows);
        
        // Add Tesla logo
        const logoGeometry = new THREE.BoxGeometry(0.3, 0.1, 0.6);
        const logoMaterial = new THREE.MeshPhongMaterial({ color: 0xffffff });
        const logo = new THREE.Mesh(logoGeometry, logoMaterial);
        logo.position.set(-0.1, 1.2, 0);
        scene.add(logo);
        
        // Position camera
        camera.position.z = 5;
        camera.position.y = 2;
        camera.lookAt(0, 1, 0);
        
        // Add orbit controls
        const controls = new THREE.OrbitControls(camera, renderer.domElement);
        controls.enableDamping = true;
        controls.dampingFactor = 0.05;
        controls.rotateSpeed = 0.5;
        
        // Add background
        scene.background = new THREE.Color(0xf0f0f0);
        
        return { 
            teslaBody, 
            frontLeftWheel, 
            frontRightWheel, 
            rearLeftWheel, 
            rearRightWheel, 
            controls 
        };
    }
    
    // Create initial Tesla
    let currentTesla = createTesla();
    let currentModel = 'model-3';
    
    // Animation loop
    function animate() {
        requestAnimationFrame(animate);
        
        // Rotate Tesla body slightly for animation
        if (currentTesla.teslaBody) {
            currentTesla.teslaBody.rotation.y += 0.005;
            
            // Rotate wheels
            currentTesla.frontLeftWheel.rotation.x += 0.01;
            currentTesla.frontRightWheel.rotation.x += 0.01;
            currentTesla.rearLeftWheel.rotation.x += 0.01;
            currentTesla.rearRightWheel.rotation.x += 0.01;
        }
        
        currentTesla.controls.update();
        renderer.render(scene, camera);
    }
    
    animate();
    
    // Handle window resize
    window.addEventListener('resize', function() {
        camera.aspect = container.clientWidth / container.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(container.clientWidth, container.clientHeight);
    });
    
    // Change Tesla button
    const changeBtn = document.getElementById('change-tesla');
    if (changeBtn) {
        changeBtn.addEventListener('click', function() {
            // Create new Tesla model
            const models = ['model-3', 'model-y', 'model-s', 'model-x'];
            const randomIndex = Math.floor(Math.random() * models.length);
            const newModel = models[randomIndex];
            
            // Change model
            currentTesla = createTesla(newModel);
            
            // Add color variation
            const colors = [
                0x1a3a6c, // Blue
                0xe63946, // Red
                0x006d77, // Teal
                0x8338ec, // Purple
                0xff9e00, // Orange
                0x2a9d8f  // Green
            ];
            
            const randomColor = colors[Math.floor(Math.random() * colors.length)];
            currentTesla.teslaBody.material.color.set(randomColor);
        });
    }
    
    // Reset view button
    const resetBtn = document.getElementById('reset-tesla');
    if (resetBtn) {
        resetBtn.addEventListener('click', function() {
            camera.position.set(5, 2, 5);
            camera.lookAt(0, 1, 0);
            currentTesla.controls.reset();
        });
    }
});