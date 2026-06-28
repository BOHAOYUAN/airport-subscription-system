/**
 * AeroTwin 3D Airport Digital Twin - Core 3D Logic
 * Powered by Three.js & WebGL
 */

import * as THREE from 'https://unpkg.com/three@0.150.0/build/three.module.js';
import { OrbitControls } from 'https://unpkg.com/three@0.150.0/examples/jsm/controls/OrbitControls.js';

export class AirportTwin {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(60, this.container.clientWidth / this.container.clientHeight, 1, 5000);
        this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
        
        this.aircrafts = new Map(); // UUID -> AircraftTwinInstance
        this.runwayLights = [];
        
        this.init();
    }

    init() {
        // Setup Renderer
        this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        this.renderer.shadowMap.enabled = true;
        this.container.appendChild(this.renderer.domElement);

        // Setup Camera & Controls
        this.camera.position.set(200, 150, 300);
        this.controls = new OrbitControls(this.camera, this.renderer.domElement);
        this.controls.enableDamping = true;
        this.controls.dampingFactor = 0.05;
        this.controls.maxPolarAngle = Math.PI / 2 - 0.05; // Don't go below ground

        // Ambient & Directional Lights (Sunlight)
        const ambientLight = new THREE.AmbientLight(0x0f172a, 0.6);
        this.scene.add(ambientLight);
        
        const sun = new THREE.DirectionalLight(0xffffff, 1.2);
        sun.position.set(400, 500, 200);
        sun.castShadow = true;
        this.scene.add(sun);

        // Build Environment (Runways & Terminal block placeholders)
        this.buildTerminalBlock();
        this.buildRunways();
        this.initRunwayLights();

        // Window Resize Listener
        window.addEventListener('resize', () => this.onWindowResize());
        
        this.animate();
    }

    buildTerminalBlock() {
        // Mock Terminal Building
        const geometry = new THREE.BoxGeometry(120, 30, 80);
        const material = new THREE.MeshStandardMaterial({ 
            color: 0x1e293b, 
            roughness: 0.2, 
            metalness: 0.8,
            transparent: true,
            opacity: 0.95
        });
        const terminal = new THREE.Mesh(geometry, material);
        terminal.position.set(0, 15, -100);
        this.scene.add(terminal);
    }

    buildRunways() {
        // Main Runway
        const runwayGeo = new THREE.PlaneGeometry(800, 40);
        const runwayMat = new THREE.MeshStandardMaterial({ color: 0x111827, roughness: 0.9 });
        const runway = new THREE.Mesh(runwayGeo, runwayMat);
        runway.rotation.x = -Math.PI / 2;
        runway.position.set(0, 0.1, 100);
        this.scene.add(runway);
    }

    initRunwayLights() {
        // Entry PAPI lights & Runway Edge lights
        const lightGeo = new THREE.SphereGeometry(1, 8, 8);
        const redMat = new THREE.MeshBasicMaterial({ color: 0xff0000 });
        const greenMat = new THREE.MeshBasicMaterial({ color: 0x00ff00 });

        for (let i = -400; i <= 400; i += 40) {
            const leftLight = new THREE.Mesh(lightGeo, greenMat);
            leftLight.position.set(i, 1.5, 80);
            const rightLight = new THREE.Mesh(lightGeo, greenMat);
            rightLight.position.set(i, 1.5, 120);

            this.scene.add(leftLight);
            this.scene.add(rightLight);
            this.runwayLights.push(leftLight, rightLight);
        }
    }

    animate() {
        requestAnimationFrame(() => this.animate());
        this.controls.update();

        // Sparkle runway lights slightly
        const time = Date.now() * 0.005;
        this.runwayLights.forEach((light, index) => {
            light.material.opacity = 0.5 + Math.sin(time + index) * 0.5;
        });

        this.renderer.render(this.scene, this.camera);
    }

    onWindowResize() {
        this.camera.aspect = this.container.clientWidth / this.container.clientHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);
    }
}
