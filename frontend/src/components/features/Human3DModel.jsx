import React, { useRef, useEffect, useState, useContext } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { Loader2 } from 'lucide-react';
import { ThemeContext } from '../../context/ThemeContext';

const Human3DModel = ({ highlightedParts }) => {
    const mountRef = useRef(null);
    const bodyPartsRef = useRef({});
    const { theme } = useContext(ThemeContext);
    const [isModelLoading, setIsModelLoading] = useState(true);

    useEffect(() => {
        const mountNode = mountRef.current;
        if (!mountNode) return;
        let renderer, animationFrameId;

        const init = () => {
            const scene = new THREE.Scene();
            const camera = new THREE.PerspectiveCamera(50, mountNode.clientWidth / mountNode.clientHeight, 0.1, 1000);
            camera.position.set(0, 1.5, 6);

            renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
            renderer.setSize(mountNode.clientWidth, mountNode.clientHeight);
            renderer.setPixelRatio(window.devicePixelRatio);
            mountNode.appendChild(renderer.domElement);

            const controls = new OrbitControls(camera, renderer.domElement);
            controls.target.set(0, 1, 0);
            controls.enableDamping = true;
            controls.enableZoom = false;
            controls.enablePan = false;

            const ambientLight = new THREE.AmbientLight(0xffffff, 1.5);
            scene.add(ambientLight);
            const directionalLight = new THREE.DirectionalLight(0xffffff, 1.5);
            directionalLight.position.set(5, 10, 7.5);
            scene.add(directionalLight);

            const loader = new GLTFLoader();
            // IMPORTANT: Loading model from the local public/models directory
            loader.load('/models/Soldier.glb', (gltf) => {
                const model = gltf.scene;
                model.scale.set(1.2, 1.2, 1.2);
                model.position.y = -1.5;
                scene.add(model);
                model.traverse((child) => {
                    if (child.isMesh) {
                        child.originalMaterial = child.material;
                        bodyPartsRef.current['head'] = child;
                        bodyPartsRef.current['torso'] = child;
                        bodyPartsRef.current['arms'] = child;
                        bodyPartsRef.current['legs'] = child;
                    }
                });
                
                // Simplified organ representation
                const organMaterial = new THREE.MeshStandardMaterial({ color: 0x888888, transparent: true, opacity: 0.5, roughness: 0.5 });
                const heart = new THREE.Mesh(new THREE.SphereGeometry(0.1, 16, 16), organMaterial.clone());
                heart.position.set(-0.1, 1.3, 0.2);
                bodyPartsRef.current['heart'] = heart;
                scene.add(heart);

                const pancreas = new THREE.Mesh(new THREE.CapsuleGeometry(0.05, 0.2, 4, 8), organMaterial.clone());
                pancreas.position.set(0.1, 1.1, 0.15);
                pancreas.rotation.z = Math.PI / 4;
                bodyPartsRef.current['pancreas'] = pancreas;
                scene.add(pancreas);

                const liver = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.2, 0.15), organMaterial.clone());
                liver.position.set(0.25, 1.2, 0.2);
                bodyPartsRef.current['liver'] = liver;
                scene.add(liver);
                
                setIsModelLoading(false);
            }, undefined, (error) => {
                console.error('An error happened while loading the model:', error);
                setIsModelLoading(false);
            });
            
            const animate = () => {
                animationFrameId = requestAnimationFrame(animate);
                controls.update();
                renderer.render(scene, camera);
            };
            animate();
        };
        const frameId = requestAnimationFrame(init);

        return () => {
            cancelAnimationFrame(frameId);
            if (animationFrameId) cancelAnimationFrame(animationFrameId);
            if (renderer && mountNode && renderer.domElement) {
                mountNode.removeChild(renderer.domElement);
            }
        };
    }, []);

    useEffect(() => {
        // Reset all materials
        Object.values(bodyPartsRef.current).flat().forEach(part => {
            if(part.material && part.material.emissive) {
                part.material.emissive.set(0x000000);
            }
        });
        
        // Highlight specified parts
        if (highlightedParts && highlightedParts.length > 0) {
            highlightedParts.forEach(partName => {
                const parts = bodyPartsRef.current[partName];
                if (parts) {
                    (Array.isArray(parts) ? parts : [parts]).forEach(part => {
                        if(part.material && part.material.emissive) {
                            part.material.emissive.set(new THREE.Color(theme.chartColor1));
                        }
                    });
                }
            });
        }
    }, [highlightedParts, theme]);

    return (
        <div className="relative w-full h-full min-h-[400px]">
            {isModelLoading && (
                <div className="absolute inset-0 flex items-center justify-center">
                    <Loader2 className={`w-12 h-12 animate-spin ${theme.text}`} />
                </div>
            )}
            <div ref={mountRef} className="w-full h-full"></div>
        </div>
    );
};

export default Human3DModel;