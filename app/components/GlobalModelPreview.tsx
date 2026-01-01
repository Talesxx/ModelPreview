import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { useModelPreviewStore } from '../store/modelPreviewStore';

export type MaterialMode = 'default' | 'white' | 'albedo' | 'normal';

export default function GlobalModelPreview() {
  const { isOpen, modelUrl, closePreview } = useModelPreviewStore();

  const containerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);
  const modelRef = useRef<THREE.Group | null>(null);
  const spotLightRef = useRef<THREE.PointLight | null>(null);
  const ambientLightRef = useRef<THREE.AmbientLight | null>(null);
  const cameraLightRef = useRef<THREE.PointLight | null>(null);
  const animationIdRef = useRef<number | null>(null);
  const lightControl2DRef = useRef<HTMLDivElement>(null);
  const isDragging2DRef = useRef<boolean>(false);

  // 状态管理
  const [materialMode, setMaterialMode] = useState<MaterialMode>('default');
  const [ambientIntensity, setAmbientIntensity] = useState(0.5);
  const [spotLightIntensity, setSpotLightIntensity] = useState(1);
  const [spotLightPosition, setSpotLightPosition] = useState({ x: 5, y: 5, z: 5 });
  const [sunPosition, setSunPosition] = useState({ x: 0, y: 0 }); // 2D控制器中的位置
  const [spotLightColor, setSpotLightColor] = useState('#ffffff'); // 射灯颜色
  const [cameraLightEnabled, setCameraLightEnabled] = useState(true); // 相机光开关
  const [cameraLightIntensity, setCameraLightIntensity] = useState(1); // 相机光强度
  const [modelInfo, setModelInfo] = useState<{
    triangles: number;
    faces: number;
    vertices: number;
  } | null>(null); // 模型信息

  // 初始化Three.js场景
  useEffect(() => {
    if (!isOpen || !containerRef.current) return;

    // 获取窗口尺寸
    const width = window.innerWidth;
    const height = window.innerHeight;

    // 创建场景
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x1a1a1a);
    sceneRef.current = scene;

    // 创建相机
    const camera = new THREE.PerspectiveCamera(
      75,
      width / height,
      0.1,
      1000
    );
    camera.position.set(0, 2, 5);
    cameraRef.current = camera;

    // 创建渲染器
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(width, height);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    containerRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // 添加轨道控制器
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controlsRef.current = controls;

    // 添加环境光
    const ambientLight = new THREE.AmbientLight(0xffffff, ambientIntensity);
    scene.add(ambientLight);
    ambientLightRef.current = ambientLight;

    // 添加相机射灯
    const cameraLight = new THREE.PointLight(0xffffff, cameraLightIntensity, 100);
    cameraLight.position.copy(camera.position);
    scene.add(cameraLight);
    cameraLightRef.current = cameraLight;

    // 添加射灯（原射灯）
    const spotLight = new THREE.PointLight(0xffffff, spotLightIntensity, 100);
    spotLight.position.set(spotLightPosition.x, spotLightPosition.y, spotLightPosition.z);
    scene.add(spotLight);
    spotLightRef.current = spotLight;

    // 添加地面
    // const groundGeometry = new THREE.PlaneGeometry(20, 20);
    // const groundMaterial = new THREE.MeshStandardMaterial({ color: 0x333333 });
    // const ground = new THREE.Mesh(groundGeometry, groundMaterial);
    // ground.rotation.x = -Math.PI / 2;
    // ground.receiveShadow = true;
    // scene.add(ground);

    // 添加默认立方体（如果没有模型）
    if (!modelUrl) {
      const geometry = new THREE.BoxGeometry(1, 1, 1);
      const material = new THREE.MeshStandardMaterial({ color: 0x00ff00 });
      const cube = new THREE.Mesh(geometry, material);
      cube.position.y = 0.5;
      cube.castShadow = true;
      scene.add(cube);
      modelRef.current = new THREE.Group();
      modelRef.current.add(cube);
    }

    // 动画循环
    const animate = () => {
      animationIdRef.current = requestAnimationFrame(animate);
      controls.update();
      
      // 更新相机光位置：保持与模型固定距离
      if (cameraLightRef.current && cameraRef.current) {
        const modelCenter = new THREE.Vector3(0, 0, 0);
        const cameraPos = cameraRef.current.position;
        const direction = new THREE.Vector3().subVectors(modelCenter, cameraPos).normalize();
        const fixedDistance = 5; // 固定距离
        const lightPos = new THREE.Vector3().addVectors(
          modelCenter,
          direction.multiplyScalar(-fixedDistance)
        );
        cameraLightRef.current.position.copy(lightPos);
      }
      
      renderer.render(scene, camera);
    };
    animate();

    // 处理窗口大小变化
    const handleResize = () => {
      const newWidth = window.innerWidth;
      const newHeight = window.innerHeight;
      
      camera.aspect = newWidth / newHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(newWidth, newHeight);
    };
    window.addEventListener('resize', handleResize);

    // 清理函数
    return () => {
      if (animationIdRef.current) {
        cancelAnimationFrame(animationIdRef.current);
      }
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
      if (containerRef.current && renderer.domElement.parentNode === containerRef.current) {
        containerRef.current.removeChild(renderer.domElement);
      }
    };
  }, [isOpen]);

  // 加载模型
  useEffect(() => {
    if (!modelUrl || !sceneRef.current || !isOpen) return;

    const loader = new GLTFLoader();
    loader.load(
      modelUrl,
      (gltf) => {
        // 移除旧模型
        if (modelRef.current && sceneRef.current) {
          sceneRef.current.remove(modelRef.current);
        }

        const model = gltf.scene;
        
        // 计算模型信息
        let triangleCount = 0;
        let faceCount = 0;
        let vertexCount = 0;
        
        model.traverse((child) => {
          if ((child as THREE.Mesh).isMesh) {
            child.castShadow = true;
            child.receiveShadow = true;
            
            const mesh = child as THREE.Mesh;
            const geometry = mesh.geometry;
            
            if (geometry) {
              // 计算顶点数
              if (geometry.attributes.position) {
                vertexCount += geometry.attributes.position.count;
              }
              
              // 计算面数和三角形数
              if (geometry.index) {
                triangleCount += geometry.index.count / 3;
                faceCount += geometry.index.count / 3;
              } else if (geometry.attributes.position) {
                triangleCount += geometry.attributes.position.count / 3;
                faceCount += geometry.attributes.position.count / 3;
              }
            }
          }
        });
        
        // 更新模型信息
        setModelInfo({
          triangles: Math.floor(triangleCount),
          faces: Math.floor(faceCount),
          vertices: vertexCount,
        });

        // 居中模型
        const box = new THREE.Box3().setFromObject(model);
        const center = box.getCenter(new THREE.Vector3());
        model.position.sub(center);

        sceneRef.current!.add(model);
        modelRef.current = model;
      },
      undefined,
      (error) => {
        console.error('模型加载失败:', error);
      }
    );
  }, [modelUrl, isOpen]);

  // 更新环境光强度
  useEffect(() => {
    if (ambientLightRef.current) {
      ambientLightRef.current.intensity = ambientIntensity;
    }
  }, [ambientIntensity]);

  // 更新射灯强度
  useEffect(() => {
    if (spotLightRef.current) {
      spotLightRef.current.intensity = spotLightIntensity;
    }
  }, [spotLightIntensity]);

  // 更新射灯颜色
  useEffect(() => {
    if (spotLightRef.current) {
      spotLightRef.current.color.set(spotLightColor);
    }
  }, [spotLightColor]);

  // 更新相机光强度
  useEffect(() => {
    if (cameraLightRef.current) {
      cameraLightRef.current.intensity = cameraLightEnabled ? cameraLightIntensity : 0;
    }
  }, [cameraLightIntensity, cameraLightEnabled]);

  // 更新射灯位置
  useEffect(() => {
    if (spotLightRef.current) {
      spotLightRef.current.position.set(
        spotLightPosition.x,
        spotLightPosition.y,
        spotLightPosition.z
      );
    }
  }, [spotLightPosition]);

  // 切换材质模式
  useEffect(() => {
    if (!modelRef.current) return;

    modelRef.current.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh;
        const originalMaterial = mesh.material as THREE.MeshStandardMaterial;

        switch (materialMode) {
          case 'white':
            // 白膜模式
            mesh.material = new THREE.MeshStandardMaterial({
              color: 0xffffff,
              roughness: 0.5,
              metalness: 0,
            });
            break;

          case 'albedo':
            // 反照率模式（显示基础颜色）
            if (originalMaterial.map) {
              mesh.material = new THREE.MeshBasicMaterial({
                map: originalMaterial.map,
              });
            } else {
              mesh.material = new THREE.MeshBasicMaterial({
                color: originalMaterial.color || 0xcccccc,
              });
            }
            break;

          case 'normal':
            // 法线模式
            mesh.material = new THREE.MeshNormalMaterial();
            break;

          case 'default':
          default:
            // 恢复默认材质（如果有保存的话）
            if (mesh.userData.originalMaterial) {
              mesh.material = mesh.userData.originalMaterial;
            }
            break;
        }
      }
    });
  }, [materialMode]);

  // 关闭时重置状态
  useEffect(() => {
    if (!isOpen) {
      setMaterialMode('default');
      setAmbientIntensity(0.5);
      setSpotLightIntensity(1);
      setSpotLightPosition({ x: 5, y: 5, z: 5 });
      setSunPosition({ x: 0, y: 0 });
      setSpotLightColor('#ffffff');
      setCameraLightEnabled(true);
      setCameraLightIntensity(1);
      setModelInfo(null);
    }
  }, [isOpen]);

  // 处理2D控制器的鼠标移动
  const handle2DMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!lightControl2DRef.current) return;
    
    const rect = lightControl2DRef.current.getBoundingClientRect();
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const mouseX = e.clientX - rect.left - centerX;
    const mouseY = e.clientY - rect.top - centerY;
    
    // 计算距离中心的距离
    const distance = Math.sqrt(mouseX * mouseX + mouseY * mouseY);
    const maxDistance = centerX - 20; // 留出一些边距
    
    // 限制在圆形范围内
    let finalX = mouseX;
    let finalY = mouseY;
    if (distance > maxDistance) {
      const angle = Math.atan2(mouseY, mouseX);
      finalX = Math.cos(angle) * maxDistance;
      finalY = Math.sin(angle) * maxDistance;
    }
    
    setSunPosition({ x: finalX, y: finalY });
    
    // 映射到3D射灯位置
    // 将 -maxDistance 到 +maxDistance 映射到 -10 到 +10
    const scale = 10 / maxDistance;
    const newX = finalX * scale;
    const newZ = finalY * scale;
    setSpotLightPosition(prev => ({ ...prev, x: newX, z: newZ }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50">
      {/* 全屏画布容器 */}
      <div
        ref={containerRef}
        className="absolute inset-0"
      />

      {/* 关闭按钮 - 左上角 */}
      <button
        onClick={closePreview}
        className="absolute top-6 left-6 z-10 w-12 h-12 flex items-center justify-center hover:bg-red-700 text-white rounded-full transition-colors shadow-lg"
        title="关闭预览"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </button>

      {/* 模型信息面板 - 关闭按钮下方 */}
      {modelInfo && (
        <div 
          className="absolute top-20 left-6 z-10 px-6 py-4 rounded-xl text-white min-w-[180px]"
          style={{
            backdropFilter: 'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)',
            background: 'rgba(0, 0, 0, 0.7)',
          }}
        >
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-gray-400 text-sm">拓扑</span>
              <span className="text-white font-medium">三角面</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-400 text-sm">面数</span>
              <span className="text-white font-medium">{modelInfo.faces.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-400 text-sm">顶点数</span>
              <span className="text-white font-medium">{modelInfo.vertices.toLocaleString()}</span>
            </div>
          </div>
        </div>
      )}

      {/* 控制面板 - 右侧居中，高斯模糊背景 */}
      <div className="absolute right-6 top-1/2 -translate-y-1/2 z-10">
        <div 
          className="flex flex-col gap-4 p-6 rounded-xl text-white min-w-[320px] max-h-[90vh] overflow-y-auto "
          style={{
            backdropFilter: 'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)',
            background: 'rgba(0, 0, 0, 0.15)',
          }}
        >
          <h3 className="text-lg font-bold mb-2">控制面板</h3>

            {/* 材质模式 */}
            <div>
              <label className="block text-sm font-medium mb-2">材质模式</label>
              <div className="flex flex-col gap-2">
                <button
                  onClick={() => setMaterialMode('default')}
                  className={`px-4 py-2 rounded transition-colors ${
                    materialMode === 'default' ? 'bg-blue-600' : 'bg-gray-700 hover:bg-gray-600'
                  }`}
                >
                  默认材质
                </button>
                <button
                  onClick={() => setMaterialMode('white')}
                  className={`px-4 py-2 rounded transition-colors ${
                    materialMode === 'white' ? 'bg-blue-600' : 'bg-gray-700 hover:bg-gray-600'
                  }`}
                >
                  白膜
                </button>
                <button
                  onClick={() => setMaterialMode('albedo')}
                  className={`px-4 py-2 rounded transition-colors ${
                    materialMode === 'albedo' ? 'bg-blue-600' : 'bg-gray-700 hover:bg-gray-600'
                  }`}
                >
                  反照率
                </button>
                <button
                  onClick={() => setMaterialMode('normal')}
                  className={`px-4 py-2 rounded transition-colors ${
                    materialMode === 'normal' ? 'bg-blue-600' : 'bg-gray-700 hover:bg-gray-600'
                  }`}
                >
                  法线
                </button>
              </div>
            </div>

            {/* 相机光开关 */}
            <div>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={cameraLightEnabled}
                  onChange={(e) => setCameraLightEnabled(e.target.checked)}
                  className="w-4 h-4"
                />
                <span className="text-sm">相机光</span>
              </label>
            </div>

            {/* 相机光大小 */}
            <div className={!cameraLightEnabled ? 'opacity-50' : ''}>
              <label className="block text-sm font-medium mb-2">
                相机光大小: {cameraLightIntensity.toFixed(2)}
              </label>
              <input
                type="range"
                min="0"
                max="5"
                step="0.1"
                value={cameraLightIntensity}
                onChange={(e) => setCameraLightIntensity(parseFloat(e.target.value))}
                className="w-full"
                disabled={!cameraLightEnabled}
              />
            </div>

            {/* 环境光强度 */}
            <div>
              <label className="block text-sm font-medium mb-2">
                环境光强度: {ambientIntensity.toFixed(2)}
              </label>
              <input
                type="range"
                min="0"
                max="2"
                step="0.1"
                value={ambientIntensity}
                onChange={(e) => setAmbientIntensity(parseFloat(e.target.value))}
                className="w-full"
              />
            </div>

            {/* 射灯强度 */}
            <div>
              <label className="block text-sm font-medium mb-2">
                射灯强度: {spotLightIntensity.toFixed(2)}
              </label>
              <input
                type="range"
                min="0"
                max="10"
                step="0.1"
                value={spotLightIntensity}
                onChange={(e) => setSpotLightIntensity(parseFloat(e.target.value))}
                className="w-full"
              />
            </div>

            {/* 射灯颜色值 */}
            <div>
              <label className="block text-sm font-medium mb-2">射灯颜色值</label>
              <div className="flex gap-2 items-center">
                <input
                  type="color"
                  value={spotLightColor}
                  onChange={(e) => setSpotLightColor(e.target.value)}
                  className="w-14 h-10 rounded cursor-pointer border-0"
                  style={{
                    background: spotLightColor,
                  }}
                />
                <input
                  type="text"
                  value={spotLightColor.toUpperCase()}
                  onChange={(e) => {
                    const value = e.target.value;
                    if (/^#[0-9A-Fa-f]{0,6}$/.test(value)) {
                      setSpotLightColor(value);
                    }
                  }}
                  className="flex-1 px-3 py-2 bg-gray-700 text-white rounded border border-gray-600 focus:outline-none focus:border-blue-500"
                  placeholder="#FFFFFF"
                  maxLength={7}
                />
              </div>
            </div>

            {/* 2D射灯位置控制器 */}
            <div>
              <label className="block text-sm font-medium mb-2">射灯角度</label>
              <div 
                ref={lightControl2DRef}
                className="relative w-48 h-48 mx-auto rounded-full bg-white flex items-center justify-center cursor-move"
                style={{
                  boxShadow: 'inset 0 0 20px rgba(0,0,0,0.2)'
                }}
                onMouseDown={(e) => {
                  isDragging2DRef.current = true;
                  handle2DMouseMove(e);
                }}
                onMouseMove={(e) => {
                  if (isDragging2DRef.current) {
                    handle2DMouseMove(e);
                  }
                }}
                onMouseUp={() => {
                  isDragging2DRef.current = false;
                }}
                onMouseLeave={() => {
                  isDragging2DRef.current = false;
                }}
              >
                {/* 内圆（灰色球体） */}
                <div className="absolute w-32 h-32 rounded-full bg-gradient-to-br from-gray-300 to-gray-500 shadow-lg" />
                
                {/* 太阳icon */}
                <div
                  className="absolute w-10 h-10 flex items-center justify-center transition-transform pointer-events-none"
                  style={{
                    left: `calc(50% + ${sunPosition.x}px - 20px)`,
                    top: `calc(50% + ${sunPosition.y}px - 20px)`,
                  }}
                >
                  <img 
                    src="/Sun.png" 
                    alt="太阳" 
                    className="w-10 h-10 drop-shadow-lg"
                    draggable={false}
                    style={{
                        userSelect: 'none',
                    }}
                  />
                </div>
              </div>
              <p className="text-xs text-gray-400 mt-2 text-center">
                拖动太阳图标调节射灯角度
              </p>
            </div>
        </div>
      </div>
    </div>
  );
}
