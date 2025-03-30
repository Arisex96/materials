"use client"

import { useState } from "react"
import { MaterialViewer } from "@/components/material-viewer"
import { MaterialSelector } from "@/components/material-selector"
import { MaterialProperties } from "@/components/material-properties"
import { materialData } from "@/lib/material-data"
import { ComparisonChart } from "@/components/comparison-chart"

export default function Home() {
  const [selectedMaterial, setSelectedMaterial] = useState(materialData[0])
  const [comparisonMaterials, setComparisonMaterials] = useState<typeof materialData>([])

  const toggleComparison = (material: (typeof materialData)[0]) => {
    if (comparisonMaterials.some((m) => m.ID === material.ID)) {
      setComparisonMaterials(comparisonMaterials.filter((m) => m.ID !== material.ID))
    } else {
      setComparisonMaterials([...comparisonMaterials, material])
    }
  }

  return (
    <main className="flex min-h-screen flex-col">
      <header className="bg-primary text-primary-foreground p-4">
        <h1 className="text-2xl font-bold">Material Properties Visualization</h1>
        <p className="text-sm opacity-80">Explore steel materials and their properties in 3D</p>
      </header>

      <div className="flex flex-col lg:flex-row flex-1">
        <div className="w-full lg:w-1/4 p-4 border-r">
          <MaterialSelector
            materials={materialData}
            selectedMaterial={selectedMaterial}
            onSelect={setSelectedMaterial}
            comparisonMaterials={comparisonMaterials}
            onToggleComparison={toggleComparison}
          />
        </div>

        <div className="w-full lg:w-3/4 flex flex-col">
          <div className="h-[500px] border-b">
            <MaterialViewer material={selectedMaterial} />
          </div>

          <div className="flex flex-col md:flex-row flex-1">
            <div className="w-full md:w-1/2 p-4 border-r">
              <MaterialProperties material={selectedMaterial} />
            </div>

            <div className="w-full md:w-1/2 p-4">
              <ComparisonChart materials={[selectedMaterial, ...comparisonMaterials]} />
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}

