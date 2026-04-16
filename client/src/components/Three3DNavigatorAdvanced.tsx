import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { hospitalGraph } from "@/../../shared/hospitalGraph";

interface Three3DNavigatorAdvancedProps {
  startModuleId?: string;
  endModuleId?: string;
  onModuleClick?: (moduleId: string) => void;
}

export default function Three3DNavigatorAdvanced({
  startModuleId,
  endModuleId,
  onModuleClick,
}: Three3DNavigatorAdvancedProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.Camera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);
  const moduleMeshesRef = useRef<Map<string, THREE.Mesh>>(new Map());
  const markersRef = useRef<{ start?: THREE.Group; end?: THREE.Group }>({});
  const routeLineRef = useRef<THREE.Mesh | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Inicializar escena
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xf0f0f0);
    sceneRef.current = scene;

    // Configurar cámara isométrica
    const width = containerRef.current.clientWidth;
    const height = containerRef.current.clientHeight;
    const camera = new THREE.OrthographicCamera(
      -width / 2,
      width / 2,
      height / 2,
      -height / 2,
      0.1,
      1000
    );
    camera.position.set(50, 50, 50);
    camera.lookAt(0, 0, 0);
    cameraRef.current = camera;

    // Configurar renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(width, height);
    renderer.shadowMap.enabled = true;
    containerRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Agregar luces
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(50, 100, 50);
    directionalLight.castShadow = true;
    directionalLight.shadow.mapSize.width = 2048;
    directionalLight.shadow.mapSize.height = 2048;
    scene.add(directionalLight);

    // Agregar controles
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableRotate = true;
    controls.enableZoom = true;
    controls.enablePan = true;
    controls.autoRotate = false;
    controlsRef.current = controls;

    // Crear plano del pasillo principal
    const corridorNode = hospitalGraph.nodes.find((n) => n.id === "corridor_main");
    if (corridorNode) {
      const corridorGeometry = new THREE.PlaneGeometry(
        corridorNode.width || 90,
        corridorNode.height || 2
      );
      const corridorMaterial = new THREE.MeshStandardMaterial({
        color: 0xf4d03f,
        roughness: 0.4,
        metalness: 0.1,
      });
      const corridorMesh = new THREE.Mesh(corridorGeometry, corridorMaterial);
      corridorMesh.position.set(
        (corridorNode.x || 0) - 50,
        (corridorNode.y || 0) - 50,
        0.01
      );
      corridorMesh.receiveShadow = true;
      scene.add(corridorMesh);
    }

    // Crear módulos 3D
    hospitalGraph.nodes.forEach((node) => {
      if (node.id === "corridor_main") return;

      const geometry = new THREE.BoxGeometry(
        node.width || 10,
        node.height || 10,
        4 // altura uniforme
      );
      const material = new THREE.MeshStandardMaterial({
        color: getModuleColor(node.id),
        roughness: 0.5,
        metalness: 0.3,
      });
      const mesh = new THREE.Mesh(geometry, material);
      mesh.position.set((node.x || 0) - 50, (node.y || 0) - 50, 2);
      mesh.castShadow = true;
      mesh.receiveShadow = true;
      mesh.userData.nodeId = node.id;

      // Agregar etiqueta de texto
      const canvas = document.createElement("canvas");
      canvas.width = 256;
      canvas.height = 256;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.fillStyle = "#000000";
        ctx.font = "bold 48px Arial";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(node.id.replace("modulo_", "").toUpperCase(), 128, 128);
      }

      const texture = new THREE.CanvasTexture(canvas);
      const labelGeometry = new THREE.PlaneGeometry(node.width || 10, 2);
      const labelMaterial = new THREE.MeshBasicMaterial({ map: texture });
      const labelMesh = new THREE.Mesh(labelGeometry, labelMaterial);
      labelMesh.position.z = 4.5;
      mesh.add(labelMesh);

      scene.add(mesh);
      moduleMeshesRef.current.set(node.id, mesh);
    });

    // Raycaster para detección de clics
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    const onMouseClick = (event: MouseEvent) => {
      const rect = renderer.domElement.getBoundingClientRect();
      mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(
        Array.from(moduleMeshesRef.current.values())
      );

      if (intersects.length > 0) {
        const clickedMesh = intersects[0].object as THREE.Mesh;
        const nodeId = clickedMesh.userData.nodeId;
        if (nodeId && onModuleClick) {
          onModuleClick(nodeId);
        }
      }
    };

    renderer.domElement.addEventListener("click", onMouseClick);

    // Crear marcadores
    const createMarker = (color: number): THREE.Group => {
      const group = new THREE.Group();

      // Cono como marcador
      const coneGeometry = new THREE.ConeGeometry(1, 3, 32);
      const coneMaterial = new THREE.MeshStandardMaterial({
        color: color,
        emissive: color,
        emissiveIntensity: 0.5,
      });
      const cone = new THREE.Mesh(coneGeometry, coneMaterial);
      cone.position.z = 2;
      group.add(cone);

      // Luz puntual
      const light = new THREE.PointLight(color, 1, 20);
      light.position.z = 3;
      group.add(light);

      return group;
    };

    // Actualizar marcadores
    const updateMarkers = () => {
      // Remover marcadores anteriores
      if (markersRef.current.start) scene.remove(markersRef.current.start);
      if (markersRef.current.end) scene.remove(markersRef.current.end);

      // Agregar marcador de inicio
      if (startModuleId) {
        const startNode = hospitalGraph.nodes.find((n) => n.id === startModuleId);
        if (startNode) {
          const startMarker = createMarker(0x00ff00); // Verde
          startMarker.position.set(
            (startNode.x || 0) - 50,
            (startNode.y || 0) - 50,
            0
          );
          scene.add(startMarker);
          markersRef.current.start = startMarker;
        }
      }

      // Agregar marcador de destino
      if (endModuleId) {
        const endNode = hospitalGraph.nodes.find((n) => n.id === endModuleId);
        if (endNode) {
          const endMarker = createMarker(0xff0000); // Rojo
          endMarker.position.set(
            (endNode.x || 0) - 50,
            (endNode.y || 0) - 50,
            0
          );
          scene.add(endMarker);
          markersRef.current.end = endMarker;
        }
      }
    };

    updateMarkers();

    // Crear ruta 3D
    const createRoute = () => {
      if (!startModuleId || !endModuleId) return;

      const startNode = hospitalGraph.nodes.find((n) => n.id === startModuleId);
      const endNode = hospitalGraph.nodes.find((n) => n.id === endModuleId);
      const corridorNode = hospitalGraph.nodes.find((n) => n.id === "corridor_main");

      if (!startNode || !endNode || !corridorNode) return;

      // Crear curva de ruta
      const points = [
        new THREE.Vector3((startNode.x || 0) - 50, (startNode.y || 0) - 50, 0.5),
        new THREE.Vector3(
          (corridorNode.x || 0) - 50,
          (startNode.y || 0) - 50,
          0.5
        ),
        new THREE.Vector3(
          (corridorNode.x || 0) - 50,
          (corridorNode.y || 0) - 50,
          0.5
        ),
        new THREE.Vector3(
          (corridorNode.x || 0) - 50,
          (endNode.y || 0) - 50,
          0.5
        ),
        new THREE.Vector3((endNode.x || 0) - 50, (endNode.y || 0) - 50, 0.5),
      ];

      const curve = new THREE.CatmullRomCurve3(points);
      const tubeGeometry = new THREE.TubeGeometry(curve, 20, 0.5, 8, false);
      const tubeMaterial = new THREE.MeshStandardMaterial({
        color: 0x3498db,
        emissive: 0x3498db,
        emissiveIntensity: 0.3,
        metalness: 0.8,
        roughness: 0.2,
      });

      if (routeLineRef.current) scene.remove(routeLineRef.current);

      const routeMesh = new THREE.Mesh(tubeGeometry, tubeMaterial);
      routeMesh.castShadow = true;
      routeMesh.receiveShadow = true;
      scene.add(routeMesh);
      routeLineRef.current = routeMesh;
    };

    createRoute();

    // Loop de animación
    let animationId: number;
    const animate = () => {
      animationId = requestAnimationFrame(animate);
      controls.update();

      // Animar marcadores
      if (markersRef.current.start) {
        markersRef.current.start.rotation.z += 0.02;
      }
      if (markersRef.current.end) {
        markersRef.current.end.rotation.z += 0.02;
      }

      renderer.render(scene, camera);
    };

    animate();

    // Manejar redimensionamiento
    const handleResize = () => {
      if (!containerRef.current) return;
      const newWidth = containerRef.current.clientWidth;
      const newHeight = containerRef.current.clientHeight;

      if (camera instanceof THREE.OrthographicCamera) {
        camera.left = -newWidth / 2;
        camera.right = newWidth / 2;
        camera.top = newHeight / 2;
        camera.bottom = -newHeight / 2;
        camera.updateProjectionMatrix();
      }

      renderer.setSize(newWidth, newHeight);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      renderer.domElement.removeEventListener("click", onMouseClick);
      cancelAnimationFrame(animationId);
      containerRef.current?.removeChild(renderer.domElement);
    };
  }, [startModuleId, endModuleId, onModuleClick]);

  return (
    <div
      ref={containerRef}
      className="w-full h-96 md:h-500px lg:h-600px rounded-lg border border-gray-300 touch-none"
      style={{ touchAction: "none" }}
    />
  );
}

function getModuleColor(nodeId: string): number {
  const colors: Record<string, number> = {
    modulo_i1_sup: 0x6c3483,
    modulo_d_sup: 0x1e8449,
    neuro_infantil: 0x2980b9,
    modulo_i3_inf: 0x884ea0,
    modulo_i2_inf: 0xaf7ac5,
    modulo_e_inf: 0xd4ac0d,
    inchijap_inf: 0xe74c3c,
    modulo_b_inf: 0x8e44ad,
    sala_espera_inf: 0x3498db,
    modulo_a_inf: 0x2e86c1,
    sui_inf: 0x16a085,
    recaudacion_inf: 0xc0392b,
    espera_c_inf: 0xf39c12,
    modulo_c_der: 0xca6f1e,
  };
  return colors[nodeId] || 0x95a5a6;
}
