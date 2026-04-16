import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { type Specialty } from '../../../shared/data';

interface Three3DNavigatorProps {
  origin?: string;
  destination?: Specialty | null;
  isOpen: boolean;
}

const HOSPITAL_CONFIG = {
  canvasWidth: 100,
  canvasHeight: 100,
  corridorY: 45,
  corridorX: { start: 0, end: 90 },
  moduleHeight: 4,
};

const MODULES_3D: Record<string, { x: number; y: number; width: number; height: number; color: string; label: string }> = {
  i1_sup: { x: 10, y: 10, width: 10, height: 33, color: '#6C3483', label: 'Módulo i1' },
  d_sup: { x: 22, y: 10, width: 10, height: 33, color: '#1E8449', label: 'Módulo D' },
  neuro_inf: { x: 70, y: 5, width: 12, height: 10, color: '#117A65', label: 'Neuro Infantil' },
  i3_inf: { x: 2, y: 52, width: 8, height: 30, color: '#922B21', label: 'Módulo i3' },
  i2_inf: { x: 11, y: 52, width: 8, height: 30, color: '#1A5276', label: 'Módulo i2' },
  e_inf: { x: 20, y: 52, width: 8, height: 30, color: '#D4AC0D', label: 'Módulo E' },
  inchijap_inf: { x: 29, y: 52, width: 8, height: 30, color: '#8E44AD', label: 'Inchijap' },
  b_inf: { x: 38, y: 52, width: 8, height: 30, color: '#8E44AD', label: 'Módulo B' },
  espera_inf: { x: 47, y: 52, width: 8, height: 30, color: '#95A5A6', label: 'Sala de Espera' },
  a_inf: { x: 56, y: 52, width: 8, height: 30, color: '#2E86C1', label: 'Módulo A' },
  sui_inf: { x: 65, y: 52, width: 4, height: 30, color: '#34495E', label: 'SUI' },
  recaudacion_inf: { x: 70, y: 52, width: 6, height: 20, color: '#7F8C8D', label: 'Recaudación' },
  esperac_inf: { x: 77, y: 52, width: 8, height: 30, color: '#95A5A6', label: 'Espera C' },
  c_der: { x: 88, y: 35, width: 8, height: 45, color: '#CA6F1E', label: 'Módulo C y C2' },
};

const SPECIALTY_TO_MODULE: Record<string, string> = {
  A: 'a_inf',
  B: 'b_inf',
  C: 'c_der',
  C2: 'c_der',
  D: 'd_sup',
  D2: 'd_sup',
  E: 'e_inf',
  i1: 'i1_sup',
  i2: 'i2_inf',
  i3: 'i3_inf',
};

export default function Three3DNavigator({ origin, destination, isOpen }: Three3DNavigatorProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.Camera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const routeLineRef = useRef<THREE.Object3D | null>(null);
  const animationIdRef = useRef<number | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    if (!isOpen || !containerRef.current) return;

    let isDragging = false;
    let previousMousePosition = { x: 0, y: 0 };

    const initThreeJS = () => {
      const container = containerRef.current;
      if (!container) return;

      const width = container.clientWidth || 800;
      const height = container.clientHeight || 600;

      // Escena
      const scene = new THREE.Scene();
      scene.background = new THREE.Color(0xf5f5f5);
      sceneRef.current = scene;

      // Cámara isométrica
      const camera = new THREE.OrthographicCamera(
        -60,
        60,
        60,
        -60,
        0.1,
        1000
      );
      camera.position.set(50, 50, 50);
      camera.lookAt(50, 45, 0);
      cameraRef.current = camera;

      // Renderer
      const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
      renderer.setSize(width, height);
      renderer.setPixelRatio(window.devicePixelRatio);
      renderer.shadowMap.enabled = true;
      container.appendChild(renderer.domElement);
      rendererRef.current = renderer;

      // Iluminación
      const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
      scene.add(ambientLight);

      const directionalLight = new THREE.DirectionalLight(0xffffff, 0.6);
      directionalLight.position.set(50, 50, 50);
      directionalLight.castShadow = true;
      directionalLight.shadow.mapSize.width = 2048;
      directionalLight.shadow.mapSize.height = 2048;
      scene.add(directionalLight);

      // Piso (pasillo principal)
      const floorGeometry = new THREE.PlaneGeometry(90, 5);
      const floorMaterial = new THREE.MeshStandardMaterial({
        color: 0xe8e8e8,
        roughness: 0.7,
      });
      const floor = new THREE.Mesh(floorGeometry, floorMaterial);
      floor.position.set(45, 45, 0);
      floor.receiveShadow = true;
      scene.add(floor);

      // Crear módulos 3D
      Object.entries(MODULES_3D).forEach(([key, module]) => {
        const geometry = new THREE.BoxGeometry(
          module.width,
          HOSPITAL_CONFIG.moduleHeight,
          module.height
        );
        const material = new THREE.MeshStandardMaterial({
          color: module.color,
          roughness: 0.6,
          metalness: 0.2,
        });
        const mesh = new THREE.Mesh(geometry, material);
        mesh.position.set(
          module.x + module.width / 2,
          HOSPITAL_CONFIG.moduleHeight / 2,
          module.y + module.height / 2
        );
        mesh.castShadow = true;
        mesh.receiveShadow = true;
        mesh.userData = { moduleId: key, label: module.label };
        scene.add(mesh);

        // Etiqueta de texto
        const canvas = document.createElement('canvas');
        canvas.width = 256;
        canvas.height = 128;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.fillStyle = '#000000';
          ctx.font = 'bold 24px Arial';
          ctx.textAlign = 'center';
          ctx.fillText(module.label, 128, 64);
        }

        const texture = new THREE.CanvasTexture(canvas);
        const labelGeometry = new THREE.PlaneGeometry(module.width * 0.8, 1.5);
        const labelMaterial = new THREE.MeshBasicMaterial({ map: texture });
        const label = new THREE.Mesh(labelGeometry, labelMaterial);
        label.position.set(
          module.x + module.width / 2,
          HOSPITAL_CONFIG.moduleHeight + 1,
          module.y + module.height / 2
        );
        label.rotation.x = -Math.PI / 4;
        scene.add(label);
      });

      // Marcadores de origen y destino
      if (origin) {
        const originModuleKey = SPECIALTY_TO_MODULE[origin] || origin;
        const originModule = MODULES_3D[originModuleKey];
        if (originModule) {
          const markerGeometry = new THREE.ConeGeometry(1, 2, 32);
          const markerMaterial = new THREE.MeshStandardMaterial({ color: 0x00ff00 });
          const marker = new THREE.Mesh(markerGeometry, markerMaterial);
          marker.position.set(
            originModule.x + originModule.width / 2,
            HOSPITAL_CONFIG.moduleHeight + 2,
            originModule.y + originModule.height / 2
          );
          marker.castShadow = true;
          scene.add(marker);
        }
      }

      if (destination) {
        const destModuleKey = SPECIALTY_TO_MODULE[destination.module];
        const destModule = MODULES_3D[destModuleKey];
        if (destModule) {
          const markerGeometry = new THREE.ConeGeometry(1, 2, 32);
          const markerMaterial = new THREE.MeshStandardMaterial({ color: 0xff0000 });
          const marker = new THREE.Mesh(markerGeometry, markerMaterial);
          marker.position.set(
            destModule.x + destModule.width / 2,
            HOSPITAL_CONFIG.moduleHeight + 2,
            destModule.y + destModule.height / 2
          );
          marker.castShadow = true;
          scene.add(marker);

          // Dibujar ruta
          if (origin) {
            const originModuleKey = SPECIALTY_TO_MODULE[origin] || origin;
            const originModule = MODULES_3D[originModuleKey];
            if (originModule) {
              const routePoints = [
                new THREE.Vector3(
                  originModule.x + originModule.width / 2,
                  HOSPITAL_CONFIG.moduleHeight + 0.5,
                  originModule.y + originModule.height / 2
                ),
                new THREE.Vector3(
                  originModule.x + originModule.width / 2,
                  HOSPITAL_CONFIG.moduleHeight + 0.5,
                  HOSPITAL_CONFIG.corridorY
                ),
                new THREE.Vector3(
                  destModule.x + destModule.width / 2,
                  HOSPITAL_CONFIG.moduleHeight + 0.5,
                  HOSPITAL_CONFIG.corridorY
                ),
                new THREE.Vector3(
                  destModule.x + destModule.width / 2,
                  HOSPITAL_CONFIG.moduleHeight + 0.5,
                  destModule.y + destModule.height / 2
                ),
              ];

              // Crear ruta con TubeGeometry para efecto 3D
              const curve = new THREE.CatmullRomCurve3(routePoints);
              const tubeGeometry = new THREE.TubeGeometry(curve, 20, 0.5, 8, false);
              const tubeMaterial = new THREE.MeshStandardMaterial({
                color: 0x0099ff,
                emissive: 0x0066ff,
                emissiveIntensity: 0.5,
                metalness: 0.8,
                roughness: 0.2,
              });
              const tube = new THREE.Mesh(tubeGeometry, tubeMaterial);
              tube.castShadow = true;
              tube.receiveShadow = true;
              routeLineRef.current = tube;
              scene.add(tube);

              // También agregar una línea simple para referencia
              const routeGeometry = new THREE.BufferGeometry().setFromPoints(routePoints);
              const routeMaterial = new THREE.LineBasicMaterial({
                color: 0x00ccff,
                linewidth: 2,
                transparent: true,
              });
              const routeLine = new THREE.Line(routeGeometry, routeMaterial);
              scene.add(routeLine);
            }
          }
        }
      }

      // Controles
      const onMouseDown = (e: MouseEvent) => {
        isDragging = true;
        previousMousePosition = { x: e.clientX, y: e.clientY };
      };

      const onMouseMove = (e: MouseEvent) => {
        if (!isDragging || !cameraRef.current) return;

        const deltaX = e.clientX - previousMousePosition.x;
        const deltaY = e.clientY - previousMousePosition.y;

        const camera = cameraRef.current as THREE.OrthographicCamera;
        camera.position.x -= deltaX * 0.1;
        camera.position.y += deltaY * 0.1;
        camera.lookAt(50, 45, 0);

        previousMousePosition = { x: e.clientX, y: e.clientY };
      };

      const onMouseUp = () => {
        isDragging = false;
      };

      const onWheel = (e: WheelEvent) => {
        e.preventDefault();
        const camera = cameraRef.current as THREE.OrthographicCamera;
        const zoomFactor = e.deltaY > 0 ? 1.1 : 0.9;

        camera.left /= zoomFactor;
        camera.right /= zoomFactor;
        camera.top /= zoomFactor;
        camera.bottom /= zoomFactor;
        camera.updateProjectionMatrix();
      };

      // Touch controls
      let touchStartX = 0;
      let touchStartY = 0;

      const onTouchStart = (e: TouchEvent) => {
        if (e.touches.length === 1) {
          touchStartX = e.touches[0].clientX;
          touchStartY = e.touches[0].clientY;
          isDragging = true;
        }
      };

      const onTouchMove = (e: TouchEvent) => {
        if (!isDragging || !cameraRef.current || e.touches.length !== 1) return;

        const deltaX = e.touches[0].clientX - touchStartX;
        const deltaY = e.touches[0].clientY - touchStartY;

        const camera = cameraRef.current as THREE.OrthographicCamera;
        camera.position.x -= deltaX * 0.1;
        camera.position.y += deltaY * 0.1;
        camera.lookAt(50, 45, 0);

        touchStartX = e.touches[0].clientX;
        touchStartY = e.touches[0].clientY;
      };

      const onTouchEnd = () => {
        isDragging = false;
      };

      renderer.domElement.addEventListener('mousedown', onMouseDown);
      renderer.domElement.addEventListener('mousemove', onMouseMove);
      renderer.domElement.addEventListener('mouseup', onMouseUp);
      renderer.domElement.addEventListener('wheel', onWheel, { passive: false });
      renderer.domElement.addEventListener('touchstart', onTouchStart);
      renderer.domElement.addEventListener('touchmove', onTouchMove);
      renderer.domElement.addEventListener('touchend', onTouchEnd);

      // Loop de animación
      const animate = () => {
        animationIdRef.current = requestAnimationFrame(animate);

        if (routeLineRef.current && 'material' in routeLineRef.current) {
          const time = Date.now() * 0.001;
          const material = (routeLineRef.current as any).material as THREE.MeshStandardMaterial;
          material.emissiveIntensity = 0.3 + Math.sin(time * 2) * 0.3;
        }

        renderer.render(scene, camera);
      };

      animate();

      // Cleanup
      return () => {
        renderer.domElement.removeEventListener('mousedown', onMouseDown);
        renderer.domElement.removeEventListener('mousemove', onMouseMove);
        renderer.domElement.removeEventListener('mouseup', onMouseUp);
        renderer.domElement.removeEventListener('wheel', onWheel);
        renderer.domElement.removeEventListener('touchstart', onTouchStart);
        renderer.domElement.removeEventListener('touchmove', onTouchMove);
        renderer.domElement.removeEventListener('touchend', onTouchEnd);
        if (animationIdRef.current) cancelAnimationFrame(animationIdRef.current);
        renderer.dispose();
        container.removeChild(renderer.domElement);
      };
    };

    const cleanup = initThreeJS();
    setIsInitialized(true);

    // Handle window resize
    const handleResize = () => {
      if (!containerRef.current || !rendererRef.current || !cameraRef.current) return;

      const width = containerRef.current.clientWidth || 800;
      const height = containerRef.current.clientHeight || 600;

      rendererRef.current.setSize(width, height);

      const camera = cameraRef.current as THREE.OrthographicCamera;
      const aspect = width / height;
      const frustumSize = 120;

      camera.left = (-frustumSize * aspect) / 2;
      camera.right = (frustumSize * aspect) / 2;
      camera.top = frustumSize / 2;
      camera.bottom = -frustumSize / 2;
      camera.updateProjectionMatrix();
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      cleanup?.();
    };
  }, [isOpen, origin, destination]);

  return (
    <div
      ref={containerRef}
      className="w-full h-96 md:h-[500px] lg:h-[600px] bg-gradient-to-b from-slate-100 to-slate-50 rounded-lg overflow-hidden border border-slate-200"
      style={{ touchAction: 'none' }}
    />
  );
}
