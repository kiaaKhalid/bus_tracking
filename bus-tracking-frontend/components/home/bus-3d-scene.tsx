"use client"

import { Canvas } from "@react-three/fiber"
import { PerspectiveCamera, OrbitControls, Environment } from "@react-three/drei"
import Bus3DModel from "./bus-3d-model"
import { Suspense } from "react"

export default function Bus3DScene() {
  return (
    <div className="w-full h-[600px] rounded-2xl overflow-hidden">
      <Canvas>
        <Suspense fallback={null}>
          <PerspectiveCamera makeDefault position={[0, 2, 5]} />
          <OrbitControls autoRotate autoRotateSpeed={4} enableZoom={false} enablePan={false} />
          <Environment preset="city" />
          <Bus3DModel />
          <ambientLight intensity={0.5} />
          <pointLight position={[10, 10, 10]} intensity={1} />
        </Suspense>
      </Canvas>
    </div>
  )
}
