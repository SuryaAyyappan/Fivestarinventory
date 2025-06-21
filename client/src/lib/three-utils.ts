declare global {
  interface Window {
    THREE: any;
  }
}

export function createThreeScene(container: HTMLElement) {
  // Check if Three.js is available
  if (typeof window === 'undefined' || !window.THREE) {
    console.warn('Three.js not loaded');
    return () => {};
  }

  const THREE = window.THREE;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  const renderer = new THREE.WebGLRenderer({ alpha: true });
  
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setClearColor(0x000000, 0);
  container.appendChild(renderer.domElement);

  // Create chocolate-colored particles
  const particleGeometry = new THREE.BufferGeometry();
  const particleCount = 150;
  const positions = new Float32Array(particleCount * 3);
  const colors = new Float32Array(particleCount * 3);
  const sizes = new Float32Array(particleCount);

  const chocolateColors = [
    { r: 0.545, g: 0.271, b: 0.075 }, // #8B4513 - saddle brown
    { r: 0.804, g: 0.522, b: 0.247 }, // #CD853F - peru
    { r: 1.0, g: 0.843, b: 0.0 },     // #FFD700 - gold
    { r: 0.96, g: 0.64, b: 0.38 },    // #F5A461 - sandy brown
  ];

  for (let i = 0; i < particleCount; i++) {
    // Random positions in 3D space
    positions[i * 3] = (Math.random() - 0.5) * 40;
    positions[i * 3 + 1] = (Math.random() - 0.5) * 40;
    positions[i * 3 + 2] = (Math.random() - 0.5) * 40;

    // Random chocolate colors
    const color = chocolateColors[Math.floor(Math.random() * chocolateColors.length)];
    colors[i * 3] = color.r;
    colors[i * 3 + 1] = color.g;
    colors[i * 3 + 2] = color.b;

    // Random sizes
    sizes[i] = Math.random() * 3 + 1;
  }

  particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  particleGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
  particleGeometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

  const particleMaterial = new THREE.PointsMaterial({
    size: 0.1,
    vertexColors: true,
    transparent: true,
    opacity: 0.6,
    sizeAttenuation: true
  });

  const particles = new THREE.Points(particleGeometry, particleMaterial);
  scene.add(particles);

  // Add some geometric shapes
  const geometries = [
    new THREE.BoxGeometry(0.5, 0.5, 0.5),
    new THREE.SphereGeometry(0.3, 8, 6),
    new THREE.ConeGeometry(0.3, 0.8, 6)
  ];

  const shapes: any[] = [];
  for (let i = 0; i < 15; i++) {
    const geometry = geometries[Math.floor(Math.random() * geometries.length)];
    const material = new THREE.MeshBasicMaterial({
      color: new THREE.Color().setHSL(
        Math.random() * 0.1 + 0.05, // Hue range for chocolate colors
        0.7 + Math.random() * 0.3,   // Saturation
        0.3 + Math.random() * 0.4    // Lightness
      ),
      transparent: true,
      opacity: 0.3
    });

    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(
      (Math.random() - 0.5) * 30,
      (Math.random() - 0.5) * 30,
      (Math.random() - 0.5) * 30
    );
    mesh.rotation.set(
      Math.random() * Math.PI,
      Math.random() * Math.PI,
      Math.random() * Math.PI
    );

    shapes.push(mesh);
    scene.add(mesh);
  }

  camera.position.z = 15;

  let animationId: number;

  function animate() {
    animationId = requestAnimationFrame(animate);
    
    // Rotate particles
    particles.rotation.x += 0.001;
    particles.rotation.y += 0.002;
    
    // Animate shapes
    shapes.forEach((shape, index) => {
      shape.rotation.x += 0.01 * (index % 2 === 0 ? 1 : -1);
      shape.rotation.y += 0.01 * (index % 3 === 0 ? 1 : -1);
      shape.rotation.z += 0.005;
      
      // Floating motion
      shape.position.y += Math.sin(Date.now() * 0.001 + index) * 0.01;
    });
    
    renderer.render(scene, camera);
  }

  animate();

  // Handle window resize
  const handleResize = () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  };

  window.addEventListener('resize', handleResize);

  // Cleanup function
  return () => {
    cancelAnimationFrame(animationId);
    window.removeEventListener('resize', handleResize);
    if (container && renderer.domElement) {
      container.removeChild(renderer.domElement);
    }
    renderer.dispose();
  };
}
