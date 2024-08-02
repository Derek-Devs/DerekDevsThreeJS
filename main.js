import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Add a light source
const light = new THREE.DirectionalLight(0xffffff, 1);
light.position.set(5, 5, 5);
scene.add(light);

// Add ambient light
const ambientLight = new THREE.AmbientLight(0x404040);
scene.add(ambientLight);

camera.position.z = 5;

const loader = new GLTFLoader();
let model;

loader.load('/assets/hourglass.glb', function (gltf) {
    model = gltf.scene;
    model.scale.set(1, 1, 1);  // Adjust the scale if needed
    model.position.set(0, 0, 0);  // Adjust the position if needed
    scene.add(model);
    console.log("Model loaded successfully", gltf);

    // Optional: Adjust camera position based on model's bounding box
    const box = new THREE.Box3().setFromObject(model);
    const boxSize = box.getSize(new THREE.Vector3()).length();
    const boxCenter = box.getCenter(new THREE.Vector3());

    // Set the camera to frame the model
    camera.position.copy(boxCenter);
    camera.position.z += boxSize;
    camera.lookAt(boxCenter);
}, undefined, function (error) {
    console.error("Error loading model:", error);
});

function animate() {
    if (model) {
        const scrollY = window.scrollY;
        model.rotation.y = scrollY * 0.01;  // Rotate based on scroll position
    }
    renderer.render(scene, camera);
    requestAnimationFrame(animate);
}

// Resize handling
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

// Start the animation loop
animate();
