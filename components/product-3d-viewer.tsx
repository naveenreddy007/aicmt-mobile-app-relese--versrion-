"use client"

import { useRef, useState } from "react"
import { Canvas, useFrame } from "@react-three/fiber"
import { OrbitControls, PerspectiveCamera, Environment, useGLTF } from "@react-three/drei"
import { Suspense } from "react"
import { Loader2, ZoomIn, ZoomOut, RotateCcw } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

// 3D Model component
interface ModelProps {
  modelPath: string;
  scale?: number;
  rotation?: [number, number, number];
  position?: [number, number, number];
}

function Model({ modelPath, scale = 1, rotation = [0, 0, 0], position = [0, 0, 0] }: ModelProps) {
  const gltf = useGLTF(modelPath)
  const meshRef = useRef<any>(null)

  // Gentle auto-rotation
  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.002
    }
  })

  return <primitive ref={meshRef} object={gltf.scene} scale={scale} rotation={rotation} position={position} />
}

export function Product3DViewer() {
  const [zoom, setZoom] = useState(1)
  const [isLoading, setIsLoading] = useState(true)
  const [activeModel, setActiveModel] = useState("bag")

  const models = {
    bag: {
      path: "/models/compostable-bag.glb",
      scale: 1,
      position: [0, 0, 0],
      rotation: [0, 0, 0],
    },
    container: {
      path: "/models/food-container.glb",
      scale: 0.8,
      position: [0, -1, 0],
      rotation: [0, 0, 0],
    },
    film: {
      path: "/models/plastic-film.glb",
      scale: 1.2,
      position: [0, 0, 0],
      rotation: [0, 0, 0],
    },
  }

  const handleZoomIn = () => {
    setZoom((prev) => Math.min(prev + 0.2, 2))
  }

  const handleZoomOut = () => {
    setZoom((prev) => Math.max(prev - 0.2, 0.5))
  }

  const handleReset = () => {
    setZoom(1)
  }

  const handleModelLoaded = () => {
    setIsLoading(false)
  }

  return (
    <div className="w-full h-[500px] bg-gray-50 rounded-lg overflow-hidden relative">
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 bg-opacity-80 z-10">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-2 text-green-600" />
            <p>Loading 3D Model...</p>
          </div>
        </div>
      )}

      <div className="absolute top-4 left-4 z-10">
        <Tabs value={activeModel} onValueChange={setActiveModel} className="bg-white rounded-lg shadow-sm">
          <TabsList>
            <TabsTrigger value="bag">Carry Bag</TabsTrigger>
            <TabsTrigger value="container">Food Container</TabsTrigger>
            <TabsTrigger value="film">Film</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <div className="absolute bottom-4 right-4 z-10 flex flex-col gap-2">
        <Button variant="outline" size="icon" onClick={handleZoomIn} className="bg-white">
          <ZoomIn className="h-4 w-4" />
        </Button>
        <Button variant="outline" size="icon" onClick={handleZoomOut} className="bg-white">
          <ZoomOut className="h-4 w-4" />
        </Button>
        <Button variant="outline" size="icon" onClick={handleReset} className="bg-white">
          <RotateCcw className="h-4 w-4" />
        </Button>
      </div>

      <Canvas shadows>
        <Suspense fallback={null} onLoad={handleModelLoaded}>
          <PerspectiveCamera makeDefault position={[0, 0, 5]} zoom={zoom} />
          <ambientLight intensity={0.5} />
          <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1} castShadow />
          <Model
            modelPath={models[activeModel].path}
            scale={models[activeModel].scale}
            position={models[activeModel].position}
            rotation={models[activeModel].rotation}
          />
          <OrbitControls enablePan={true} enableZoom={true} enableRotate={true} />
          <Environment preset="city" />
        </Suspense>
      </Canvas>
    </div>
  )
}
