"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Checkbox } from "@/components/ui/checkbox"

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

interface MaterialSelectorProps {
  materials: Material[]
  selectedMaterial: Material
  onSelect: (material: Material) => void
  comparisonMaterials: Material[]
  onToggleComparison: (material: Material) => void
}

export function MaterialSelector({
  materials,
  selectedMaterial,
  onSelect,
  comparisonMaterials,
  onToggleComparison,
}: MaterialSelectorProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [filterType, setFilterType] = useState<string | null>(null)

  // Filter materials based on search term and filter type
  const filteredMaterials = materials.filter((material) => {
    const matchesSearch =
      material.Material.toLowerCase().includes(searchTerm.toLowerCase()) ||
      material["Heat treatment"].toLowerCase().includes(searchTerm.toLowerCase())

    const matchesFilter = !filterType || material.Material.includes(filterType)

    return matchesSearch && matchesFilter
  })

  // Get unique material types for filtering
  const materialTypes = Array.from(
    new Set(
      materials.map((m) => {
        // Extract the base material type (e.g., "Steel SAE 1015" -> "Steel SAE")
        const match = m.Material.match(/(.*?)\s\d+/)
        return match ? match[1] : m.Material
      }),
    ),
  )

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Material Selection</h2>

      <div className="space-y-2">
        <Input placeholder="Search materials..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />

        <div className="flex flex-wrap gap-2">
          <Button variant={filterType === null ? "default" : "outline"} size="sm" onClick={() => setFilterType(null)}>
            All
          </Button>

          {materialTypes.map((type) => (
            <Button
              key={type}
              variant={filterType === type ? "default" : "outline"}
              size="sm"
              onClick={() => setFilterType(type)}
            >
              {type}
            </Button>
          ))}
        </div>
      </div>

      <div className="border rounded-md max-h-[400px] overflow-y-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[30px]"></TableHead>
              <TableHead>Material</TableHead>
              <TableHead>Heat Treatment</TableHead>
              <TableHead className="w-[50px]">Compare</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredMaterials.map((material) => (
              <TableRow
                key={material.ID}
                className={selectedMaterial.ID === material.ID ? "bg-muted" : ""}
                onClick={() => onSelect(material)}
              >
                <TableCell>
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{
                      backgroundColor: `rgb(
                        ${Math.min(255, material.Su / 5)},
                        ${Math.min(255, material.Sy / 4)},
                        ${Math.min(255, material.Bhn * 1.2)}
                      )`,
                    }}
                  />
                </TableCell>
                <TableCell>{material.Material}</TableCell>
                <TableCell>{material["Heat treatment"]}</TableCell>
                <TableCell onClick={(e) => e.stopPropagation()}>
                  <Checkbox
                    checked={comparisonMaterials.some((m) => m.ID === material.ID)}
                    onCheckedChange={() => onToggleComparison(material)}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}

