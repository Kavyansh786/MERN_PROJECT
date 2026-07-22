import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaceLandmarker, HandLandmarker, FilesetResolver } from '@mediapipe/tasks-vision';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader.js';
import axios from 'axios';
import './VirtualTryOn.css';

// --- Constants and Configuration ---
const SMOOTHING_FACTOR = 0.3;
const WASM_PATH = 'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.3/wasm';
const FACE_LANDMARKER_MODEL_PATH = 'https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task';
const HAND_LANDMARKER_MODEL_PATH = 'https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task';

const VirtualTryOn3D = ({ selectedProduct, onClose }) => {
  const navigate = useNavigate();

  // --- Refs for DOM elements and Three.js objects ---
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const sceneRef = useRef(null);
  const rendererRef = useRef(null);
  const cameraRef = useRef(null);
  const jewelryModelRef = useRef(null);
  const animationFrameRef = useRef(null);

  // --- MediaPipe and Camera Refs ---
  const faceLandmarkerRef = useRef(null);
  const handLandmarkerRef = useRef(null);
  const streamRef = useRef(null);
  const lastVideoTimeRef = useRef(-1);
  const isInitializedRef = useRef(false);

  // --- State Management ---
  const [isLoading, setIsLoading] = useState(true);
  const [loadingMessage, setLoadingMessage] = useState('Initializing...');
  const [error, setError] = useState(null);
  const [isReady, setIsReady] = useState(false);
  const [jewelryTransform, setJewelryTransform] = useState({ position: new THREE.Vector3(), rotation: new THREE.Euler(), scale: new THREE.Vector3(1, 1, 1), visible: false });

  // --- Session and Interaction Tracking ---
  const [interactions, setInteractions] = useState([]);
  const sessionStartTimeRef = useRef(Date.now());

  const jewelryType = selectedProduct?.category?.toLowerCase() || 'necklace';

  // --- Cleanup Logic ---
  const cleanup = useCallback(() => {
    console.log('Performing cleanup...');
    if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    if (streamRef.current) streamRef.current.getTracks().forEach(track => track.stop());
    if (faceLandmarkerRef.current) faceLandmarkerRef.current.close();
    if (handLandmarkerRef.current) handLandmarkerRef.current.close();
    if (rendererRef.current) rendererRef.current.dispose();
    if (videoRef.current) videoRef.current.srcObject = null;
    isInitializedRef.current = false;
    setIsReady(false);
  }, []);

  // --- Initialization ---
  useEffect(() => {
    const initialize = async () => {
      if (isInitializedRef.current || !selectedProduct) return;
      isInitializedRef.current = true;

      try {
        // 1. Initialize Three.js first to have refs ready
        setLoadingMessage('Setting up 3D scene...');
        initializeThreeJS();

        // 2. Initialize Camera
        setLoadingMessage('Accessing camera...');
        const stream = await navigator.mediaDevices.getUserMedia({ video: { width: 1280, height: 720 } });
        streamRef.current = stream;

        if (videoRef.current) {
          videoRef.current.srcObject = stream;

          videoRef.current.onloadedmetadata = () => {
            videoRef.current.play().catch(err => {
              console.error("Video play failed:", err);
              setError('Could not start the camera. Please check permissions and try again.');
            });
          };

          videoRef.current.onplaying = async () => {
            const video = videoRef.current;
            const { videoWidth, videoHeight } = video;

            const renderer = rendererRef.current;
            const camera = cameraRef.current;

            // Resize renderer and canvas to match video dimensions
            renderer.setSize(videoWidth, videoHeight);
            canvasRef.current.width = videoWidth;
            canvasRef.current.height = videoHeight;

            // Update camera aspect ratio
            camera.aspect = videoWidth / videoHeight;
            camera.updateProjectionMatrix();

            // 3. Initialize MediaPipe and load the model
            await initializeMediaPipe();
            await loadJewelryModel(selectedProduct.model3d);
            
            setIsReady(true);
            setLoadingMessage('');
          };
        }
      } catch (err) {
        console.error('Initialization failed:', err);
        setError(err.message || 'An unknown error occurred during setup.');
      } finally {
        setIsLoading(false);
      }
    };

    initialize();
    return () => cleanup();
  }, [selectedProduct, cleanup]);

  const initializeThreeJS = () => {
    const scene = new THREE.Scene();
    scene.background = null;
    const camera = new THREE.PerspectiveCamera(45, 16 / 9, 0.1, 1000); // Default aspect ratio
    camera.position.set(0, 0, 15);
    const renderer = new THREE.WebGLRenderer({ canvas: canvasRef.current, alpha: true, antialias: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.outputEncoding = THREE.sRGBEncoding;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 2.0;

    // Set up an environment map for realistic reflections
    new RGBELoader().load('https://dl.polyhaven.org/file/ph-assets/HDRIs/hdr/1k/studio_small_03_1k.hdr', (texture) => {
      texture.mapping = THREE.EquirectangularReflectionMapping;
      scene.environment = texture;
    });

    // Add a strong key light to create a glint
    const keyLight = new THREE.DirectionalLight(0xffffff, 4.0);
    keyLight.position.set(5, 5, 5);
    scene.add(keyLight);

    sceneRef.current = scene;
    cameraRef.current = camera;
    rendererRef.current = renderer;
  };

  const initializeMediaPipe = async () => {
    const vision = await FilesetResolver.forVisionTasks(WASM_PATH);
    if (['necklaces', 'earrings'].includes(jewelryType)) {
      faceLandmarkerRef.current = await FaceLandmarker.createFromOptions(vision, {
        baseOptions: { modelAssetPath: FACE_LANDMARKER_MODEL_PATH, delegate: 'GPU' },
        runningMode: 'VIDEO', numFaces: 1
      });
    }
    if (['rings', 'bracelets'].includes(jewelryType)) {
      handLandmarkerRef.current = await HandLandmarker.createFromOptions(vision, {
        baseOptions: { modelAssetPath: HAND_LANDMARKER_MODEL_PATH, delegate: 'GPU' },
        runningMode: 'VIDEO', numHands: 2
      });
    }
  };

  const loadJewelryModel = async (modelUrl) => {
    const loader = new GLTFLoader();
    const gltf = await loader.loadAsync(modelUrl);
    if (jewelryModelRef.current) sceneRef.current.remove(jewelryModelRef.current);
    const model = gltf.scene;

    // Normalize model scale to ensure consistent sizing
    const box = new THREE.Box3().setFromObject(model);
    const size = box.getSize(new THREE.Vector3());
    const center = box.getCenter(new THREE.Vector3());
    const maxDim = Math.max(size.x, size.y, size.z);
    const scale = 1.0 / maxDim;
    model.scale.set(scale, scale, scale);
    model.position.sub(center.multiplyScalar(scale));

    // --- Enhance Existing Materials for a Shinier Look ---
    model.traverse((child) => {
      if (child.isMesh && child.material.isMeshStandardMaterial) {
        // Make materials more metallic and reflective
        child.material.metalness = 1.0;
        child.material.roughness *= 0.5; // Reduce roughness to make it shinier
        child.material.envMapIntensity = 2.0; // Boost reflections
      }
    });

    model.visible = false; // Initially hidden
    sceneRef.current.add(model);
    jewelryModelRef.current = model;
  };

  // --- Render Loop ---
  useEffect(() => {
    const render = () => {
      if (!isReady || !rendererRef.current || !videoRef.current) return;
      const video = videoRef.current;
      if (video.readyState < 2 || video.currentTime === lastVideoTimeRef.current) {
        animationFrameRef.current = requestAnimationFrame(render);
        return;
      }
      lastVideoTimeRef.current = video.currentTime;

      let landmarks;
      if (faceLandmarkerRef.current && ['necklaces', 'earrings'].includes(jewelryType)) {
        landmarks = faceLandmarkerRef.current.detectForVideo(video, Date.now());
        processFaceLandmarks(landmarks);
      }
      if (handLandmarkerRef.current && ['rings', 'bracelets'].includes(jewelryType)) {
        landmarks = handLandmarkerRef.current.detectForVideo(video, Date.now());
        processHandLandmarks(landmarks);
      }

      // Smoothly update model transform
      if (jewelryModelRef.current) {
        jewelryModelRef.current.visible = jewelryTransform.visible;
        if (jewelryTransform.visible) {
          jewelryModelRef.current.position.lerp(jewelryTransform.position, SMOOTHING_FACTOR);
          jewelryModelRef.current.quaternion.slerp(new THREE.Quaternion().setFromEuler(jewelryTransform.rotation), SMOOTHING_FACTOR);
          jewelryModelRef.current.scale.lerp(jewelryTransform.scale, SMOOTHING_FACTOR);
        }
      }

      rendererRef.current.render(sceneRef.current, cameraRef.current);
      animationFrameRef.current = requestAnimationFrame(render);
    };

    if (isReady) {
      animationFrameRef.current = requestAnimationFrame(render);
    }

    return () => {
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    };
  }, [isReady, jewelryType, jewelryTransform]);

  // --- Landmark Processing ---
  const processFaceLandmarks = (results) => {
    if (!results || !results.faceLandmarks || !results.faceLandmarks.length > 0 || !cameraRef.current) {
        return setJewelryTransform(prev => ({ ...prev, visible: false }));
    }
    const landmarks = results.faceLandmarks[0];
    let newTransform = { ...jewelryTransform, visible: true };

    const get3dPoint = (landmark) => {
        const vector = new THREE.Vector3();
        // Convert normalized [0, 1] to NDC [-1, 1]
        vector.x = landmark.x * 2 - 1;
        vector.y = -(landmark.y * 2 - 1); // Invert Y axis
        vector.z = 0.9; // A value between near and far plane
        // Map the 2D screen coordinate to 3D world space
        vector.unproject(cameraRef.current);
        return vector;
    };

    if (jewelryType === 'necklaces') {
        // Use jawline landmarks to determine neck position
        const leftJaw = get3dPoint(landmarks[172]);
        const rightJaw = get3dPoint(landmarks[397]);

        if (!leftJaw || !rightJaw) return;

        // Calculate the center of the jawline
        const neckCenter = new THREE.Vector3().addVectors(leftJaw, rightJaw).multiplyScalar(0.5);

        // Apply a significant vertical offset to place it on the neck
        const jawWidth = leftJaw.distanceTo(rightJaw);
        neckCenter.y -= jawWidth * 1.6; // Further increased offset for neck placement
        neckCenter.x -= 0.18;
        newTransform.position.copy(neckCenter);

        // Align rotation with the angle of the jaw
        const jawVec = new THREE.Vector3().subVectors(rightJaw, leftJaw);
        const angle = Math.atan2(jawVec.y, jawVec.x);
        newTransform.rotation.set(0, 0, angle);

        // Scale the necklace based on the jaw width for a better fit
        const scale = jawWidth * 0.6; // Slightly reduced scale
        newTransform.scale.set(scale, scale, scale);
    }
    // Add logic for 'earrings' if needed

    setJewelryTransform(newTransform);
  };

  const processHandLandmarks = (results) => {
    // Placeholder for hand landmark processing for rings/bracelets
    setJewelryTransform(prev => ({ ...prev, visible: false }));
  };

  const trackInteraction = useCallback((type, data) => {
    setInteractions(prev => [...prev, { type, ...data, timestamp: Date.now() }]);
  }, []);

  // --- User Actions ---
  const handleClose = () => {
    cleanup();
    if (onClose) onClose();
    else navigate(-1);
  };

  const handleCapture = async () => {
    if (!rendererRef.current) return;
    rendererRef.current.render(sceneRef.current, cameraRef.current); // Ensure scene is rendered before capture
    const dataUrl = rendererRef.current.domElement.toDataURL('image/png');
    trackInteraction('capture', { timestamp: Date.now(), imageData: dataUrl });
    const link = document.createElement('a');
    link.download = `virtual-tryon-${selectedProduct?.name || 'jewelry'}.png`;
    link.href = dataUrl;
    link.click();
    await saveSession(); // Optionally save session on capture
  };

  // --- Session Saving ---
  const saveSession = async () => {
    try {
      const sessionData = {
        duration: Math.floor((Date.now() - sessionStartTimeRef.current) / 1000),
        interactions
      };
      await axios.post('/api/virtual-tryon/save-session', {
        productId: selectedProduct._id,
        sessionData,
      }, { headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` } });
    } catch (err) {
      console.error('Failed to save session:', err);
    }
  };

  // --- JSX Render ---
  return (
    <div className="vto3d-wrapper">
      <div className="vto3d-header">
        <h2>Virtual Try-On: {selectedProduct?.name}</h2>
        <button className="close-button" onClick={handleClose} aria-label="Close">✕</button>
      </div>
      <div className="vto3d-stage">
        {isLoading && <div className="vto3d-loading">{loadingMessage}</div>}
        {error && <div className="vto3d-error">Error: {error} <button onClick={() => window.location.reload()}>Retry</button></div>}
        <video ref={videoRef} className="vto3d-video-feed" autoPlay playsInline muted />
        <canvas ref={canvasRef} className="vto3d-canvas" width="1280" height="720" />
      </div>
      <div className="vto3d-controls">
        <button onClick={handleCapture} disabled={!isReady || isLoading}>Capture Photo</button>
      </div>
    </div>
  );
};

export default VirtualTryOn3D;