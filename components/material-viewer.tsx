"use client"

import { useRef, useEffect } from "react"
import { Canvas, useFrame, useThree } from "@react-three/fiber"
import { OrbitControls, Environment, Text } from "@react-three/drei"
import * as THREE from "three"

// Material type definition based on the data table
type Material = {
  Std: string
  ID: string
  Material: string
  "Heat treatment": string
  Su: number
  Sy: number
  A5: number
  Bhn: number
  E: number
  G: number
  mu: number
  Ro: number
  pH?: number
  Desc?: string
}

// Function to generate a color based on material properties
const getMaterialColor = (material: Material) => {
  // Normalize strength values to create a color
  const r = Math.min(1, material.Su / 1200)
  const g = Math.min(1, material.Sy / 800)
  const b = Math.min(1, material.Bhn / 500)

  return new THREE.Color(r, g, b)
}

// Function to create a microstructure geometry based on material properties
const createMicrostructureGeometry = (material: Material) => {
  const geometry = new THREE.BufferGeometry()
  const vertices = []
  const colors = []

  // Base color for the material
  const baseColor = getMaterialColor(material)

  // Number of grains based on hardness
  const grainCount = Math.floor(material.Bhn / 5) + 20

  // Create random grain positions
  for (let i = 0; i < grainCount; i++) {
    // Position
    const x = (Math.random() - 0.5) * 2
    const y = (Math.random() - 0.5) * 2
    const z = (Math.random() - 0.5) * 2

    // Size based on strength
    const size = 0.05 + material.Su / 10000

    // Create a grain (cube)
    vertices.push(
      // Front face
      x - size,
      y - size,
      z + size,
      x + size,
      y - size,
      z + size,
      x + size,
      y + size,
      z + size,

      x + size,
      y + size,
      z + size,
      x - size,
      y + size,
      z + size,
      x - size,
      y - size,
      z + size,

      // Back face
      x - size,
      y - size,
      z - size,
      x - size,
      y + size,
      z - size,
      x + size,
      y + size,
      z - size,

      x + size,
      y + size,
      z - size,
      x + size,
      y - size,
      z - size,
      x - size,
      y - size,
      z - size,

      // Top face
      x - size,
      y + size,
      z - size,
      x - size,
      y + size,
      z + size,
      x + size,
      y + size,
      z + size,

      x + size,
      y + size,
      z + size,
      x + size,
      y + size,
      z - size,
      x - size,
      y + size,
      z - size,

      // Bottom face
      x - size,
      y - size,
      z - size,
      x + size,
      y - size,
      z - size,
      x + size,
      y - size,
      z + size,

      x + size,
      y - size,
      z + size,
      x - size,
      y - size,
      z + size,
      x - size,
      y - size,
      z - size,

      // Right face
      x + size,
      y - size,
      z - size,
      x + size,
      y + size,
      z - size,
      x + size,
      y + size,
      z + size,

      x + size,
      y + size,
      z + size,
      x + size,
      y - size,
      z + size,
      x + size,
      y - size,
      z - size,

      // Left face
      x - size,
      y - size,
      z - size,
      x - size,
      y - size,
      z + size,
      x - size,
      y + size,
      z + size,

      x - size,
      y + size,
      z + size,
      x - size,
      y + size,
      z - size,
      x - size,
      y - size,
      z - size,
    )

    // Slight color variation for each grain
    const colorVariation = 0.1
    const grainColor = new THREE.Color(
      baseColor.r * (1 + (Math.random() - 0.5) * colorVariation),
      baseColor.g * (1 + (Math.random() - 0.5) * colorVariation),
      baseColor.b * (1 + (Math.random() - 0.5) * colorVariation),
    )

    // Add colors for each vertex
    for (let j = 0; j < 36; j++) {
      colors.push(grainColor.r, grainColor.g, grainColor.b)
    }
  }

  geometry.setAttribute("position", new THREE.Float32BufferAttribute(vertices, 3))
  geometry.setAttribute("color", new THREE.Float32BufferAttribute(colors, 3))
  geometry.computeVertexNormals()

  return geometry
}

// Microstructure component
const Microstructure = ({ material }: { material: Material }) => {
  const meshRef = useRef<THREE.Mesh>(null)
  const { camera } = useThree()

  useEffect(() => {
    // Position camera
    camera.position.set(0, 0, 5)
    camera.lookAt(0, 0, 0)
  }, [camera])

  useFrame(() => {
    if (meshRef.current) {
      // Rotate the microstructure slowly
      meshRef.current.rotation.y += 0.002
      meshRef.current.rotation.x += 0.001
    }
  })

  // Create geometry based on material properties
  const geometry = createMicrostructureGeometry(material)

  return (
    <mesh ref={meshRef}>
      <primitive object={geometry} attach="geometry" />
      <meshStandardMaterial vertexColors roughness={0.4} metalness={0.8} />

      <Text position={[0, -2.5, 0]} fontSize={0.2} color="white" anchorX="center" anchorY="middle">
        {`${material.Material} - ${material["Heat treatment"]}`}
      </Text>
    </mesh>
  )
}

// Stress visualization component
const StressVisualization = ({ material }: { material: Material }) => {
  const meshRef = useRef<THREE.Mesh>(null)

  useFrame(({ clock }) => {
    if (meshRef.current) {
      // Calculate deformation based on material properties and time
      const elasticity = material.E / 207000 // Normalize elasticity
      const time = clock.getElapsedTime()
      const deformation = Math.sin(time) * (1 - elasticity) * 0.2

      // Apply deformation to the mesh
      meshRef.current.scale.set(1 + deformation, 1 - deformation, 1)
    }
  })

  return (
    <mesh ref={meshRef} position={[0, 0, -3]}>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color={getMaterialColor(material)} roughness={0.4} metalness={0.8} />

      <Text position={[0, -1, 0]} fontSize={0.15} color="white" anchorX="center" anchorY="middle">
        Stress Simulation
      </Text>
    </mesh>
  )
}

// Main material viewer component
export function MaterialViewer({ material }: { material: Material }) {
  return (
    <div className="w-full h-full">
      <Canvas>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1} />
        <Microstructure material={material} />
        <StressVisualization material={material} />
        <OrbitControls enablePan={true} enableZoom={true} enableRotate={true} />
        <Environment preset="studio" />
      </Canvas>
    </div>
  )
}

