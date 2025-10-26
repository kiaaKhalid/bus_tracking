"use client"

import { useRef } from "react"
import { useFrame } from "@react-three/fiber"
import type * as THREE from "three"

export default function Bus3DModel() {
  const groupRef = useRef<THREE.Group>(null)

  useFrame(() => {
    if (groupRef.current) {
      groupRef.current.rotation.y += 0.005
    }
  })

  return (
    <group ref={groupRef}>
      {/* Bus body */}
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[2, 1.5, 4]} />
        <meshStandardMaterial color="#3b82f6" metalness={0.6} roughness={0.4} />
      </mesh>

      {/* Bus roof */}
      <mesh position={[0, 1, 0]}>
        <boxGeometry args={[2, 0.3, 4]} />
        <meshStandardMaterial color="#1e40af" metalness={0.6} roughness={0.4} />
      </mesh>

      {/* Front window */}
      <mesh position={[0, 0.5, 1.8]}>
        <planeGeometry args={[1.8, 0.8]} />
        <meshStandardMaterial color="#87ceeb" metalness={0.8} roughness={0.1} />
      </mesh>

      {/* Wheels */}
      {[-1.2, 1.2].map((x) => (
        <group key={x}>
          <mesh position={[x, -0.8, -1.2]}>
            <cylinderGeometry args={[0.4, 0.4, 0.3, 32]} />
            <meshStandardMaterial color="#1a1a1a" />
          </mesh>
          <mesh position={[x, -0.8, 1.2]}>
            <cylinderGeometry args={[0.4, 0.4, 0.3, 32]} />
            <meshStandardMaterial color="#1a1a1a" />
          </mesh>
        </group>
      ))}

      {/* Tracking indicator */}
      <mesh position={[0, 1.8, 0]}>
        <sphereGeometry args={[0.2, 32, 32]} />
        <meshStandardMaterial color="#f97316" emissive="#f97316" emissiveIntensity={0.5} />
      </mesh>
    </group>
  )
}
