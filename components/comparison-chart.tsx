"use client"

import { useEffect, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useState } from "react"

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

interface ComparisonChartProps {
  materials: Material[]
}

export function ComparisonChart({ materials }: ComparisonChartProps) {
  const [property1, setProperty1] = useState("Su")
  const [property2, setProperty2] = useState("Sy")
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const radarCanvasRef = useRef<HTMLCanvasElement>(null)

  // Property options for comparison
  const propertyOptions = [
    { value: "Su", label: "Ultimate Tensile Strength" },
    { value: "Sy", label: "Yield Strength" },
    { value: "A5", label: "Elongation" },
    { value: "Bhn", label: "Hardness" },
    { value: "E", label: "Elastic Modulus" },
    { value: "G", label: "Shear Modulus" },
    { value: "mu", label: "Poisson's Ratio" },
    { value: "Ro", label: "Density" },
  ]

  // Draw scatter plot
  useEffect(() => {
    if (!canvasRef.current || materials.length === 0) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // Set canvas dimensions
    const width = canvas.width
    const height = canvas.height
    const padding = 40

    // Find min and max values for both properties
    const prop1Values = materials.map((m) => m[property1 as keyof Material] as number)
    const prop2Values = materials.map((m) => m[property2 as keyof Material] as number)

    const minProp1 = Math.min(...prop1Values) * 0.9
    const maxProp1 = Math.max(...prop1Values) * 1.1
    const minProp2 = Math.min(...prop2Values) * 0.9
    const maxProp2 = Math.max(...prop2Values) * 1.1

    // Draw axes
    ctx.beginPath()
    ctx.strokeStyle = "#666"
    ctx.lineWidth = 1

    // X-axis
    ctx.moveTo(padding, height - padding)
    ctx.lineTo(width - padding, height - padding)

    // Y-axis
    ctx.moveTo(padding, height - padding)
    ctx.lineTo(padding, padding)

    ctx.stroke()

    // Draw axis labels
    ctx.fillStyle = "#666"
    ctx.font = "12px Arial"
    ctx.textAlign = "center"

    // X-axis label
    ctx.fillText(propertyOptions.find((p) => p.value === property1)?.label || property1, width / 2, height - 10)

    // Y-axis label
    ctx.save()
    ctx.translate(15, height / 2)
    ctx.rotate(-Math.PI / 2)
    ctx.fillText(propertyOptions.find((p) => p.value === property2)?.label || property2, 0, 0)
    ctx.restore()

    // Draw data points
    materials.forEach((material, index) => {
      const prop1 = material[property1 as keyof Material] as number
      const prop2 = material[property2 as keyof Material] as number

      // Calculate position
      const x = padding + ((prop1 - minProp1) / (maxProp1 - minProp1)) * (width - 2 * padding)
      const y = height - padding - ((prop2 - minProp2) / (maxProp2 - minProp2)) * (height - 2 * padding)

      // Draw point
      ctx.beginPath()
      ctx.fillStyle = index === 0 ? "#ff4500" : "#3498db"
      ctx.arc(x, y, 6, 0, Math.PI * 2)
      ctx.fill()

      // Draw label
      ctx.fillStyle = "#333"
      ctx.font = "10px Arial"
      ctx.textAlign = "center"
      ctx.fillText(material.Material.split(" ").pop() || "", x, y - 10)
    })
  }, [materials, property1, property2])

  // Draw radar chart
  useEffect(() => {
    if (!radarCanvasRef.current || materials.length === 0) return

    const canvas = radarCanvasRef.current
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // Set canvas dimensions
    const width = canvas.width
    const height = canvas.height
    const centerX = width / 2
    const centerY = height / 2
    const radius = Math.min(centerX, centerY) - 30

    // Properties to display on radar
    const radarProps = ["Su", "Sy", "A5", "Bhn", "E", "G"]
    const angles = radarProps.map((_, i) => i * ((2 * Math.PI) / radarProps.length))

    // Find max values for normalization
    const maxValues: Record<string, number> = {}
    radarProps.forEach((prop) => {
      maxValues[prop] = Math.max(...materials.map((m) => m[prop as keyof Material] as number)) * 1.1
    })

    // Draw radar grid
    ctx.strokeStyle = "#ddd"
    ctx.lineWidth = 1

    // Draw circles
    for (let i = 1; i <= 5; i++) {
      const circleRadius = radius * (i / 5)
      ctx.beginPath()
      ctx.arc(centerX, centerY, circleRadius, 0, 2 * Math.PI)
      ctx.stroke()
    }

    // Draw axes
    radarProps.forEach((_, i) => {
      const angle = angles[i]
      ctx.beginPath()
      ctx.moveTo(centerX, centerY)
      ctx.lineTo(centerX + radius * Math.cos(angle), centerY + radius * Math.sin(angle))
      ctx.stroke()
    })

    // Draw property labels
    ctx.fillStyle = "#333"
    ctx.font = "12px Arial"
    ctx.textAlign = "center"

    radarProps.forEach((prop, i) => {
      const angle = angles[i]
      const labelX = centerX + (radius + 15) * Math.cos(angle)
      const labelY = centerY + (radius + 15) * Math.sin(angle)

      ctx.fillText(propertyOptions.find((p) => p.value === prop)?.label || prop, labelX, labelY)
    })

    // Draw data for each material
    materials.forEach((material, materialIndex) => {
      const color = materialIndex === 0 ? "rgba(255, 69, 0, 0.7)" : `rgba(52, 152, 219, ${0.7 - materialIndex * 0.1})`

      // Draw radar shape
      ctx.beginPath()
      radarProps.forEach((prop, i) => {
        const angle = angles[i]
        const value = material[prop as keyof Material] as number
        const normalizedValue = value / maxValues[prop]
        const pointRadius = radius * normalizedValue

        const x = centerX + pointRadius * Math.cos(angle)
        const y = centerY + pointRadius * Math.sin(angle)

        if (i === 0) {
          ctx.moveTo(x, y)
        } else {
          ctx.lineTo(x, y)
        }
      })

      ctx.closePath()
      ctx.fillStyle = color
      ctx.globalAlpha = 0.5
      ctx.fill()
      ctx.globalAlpha = 1
      ctx.strokeStyle = color
      ctx.lineWidth = 2
      ctx.stroke()

      // Draw points
      radarProps.forEach((prop, i) => {
        const angle = angles[i]
        const value = material[prop as keyof Material] as number
        const normalizedValue = value / maxValues[prop]
        const pointRadius = radius * normalizedValue

        const x = centerX + pointRadius * Math.cos(angle)
        const y = centerY + pointRadius * Math.sin(angle)

        ctx.beginPath()
        ctx.arc(x, y, 4, 0, 2 * Math.PI)
        ctx.fillStyle = color
        ctx.fill()
      })
    })

    // Draw legend
    const legendY = height - 20
    materials.forEach((material, index) => {
      const color = index === 0 ? "#ff4500" : "#3498db"
      const x = 60 + index * 150

      // Draw color box
      ctx.fillStyle = color
      ctx.fillRect(x, legendY, 12, 12)

      // Draw text
      ctx.fillStyle = "#333"
      ctx.font = "12px Arial"
      ctx.textAlign = "left"
      ctx.fillText(`${material.Material} (${material["Heat treatment"]})`, x + 18, legendY + 10)
    })
  }, [materials])

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Material Comparison</CardTitle>
        </CardHeader>
      </Card>

      <Tabs defaultValue="scatter">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="scatter">Scatter Plot</TabsTrigger>
          <TabsTrigger value="radar">Radar Chart</TabsTrigger>
        </TabsList>

        <TabsContent value="scatter" className="mt-4">
          <Card>
            <CardHeader className="pb-2">
              <div className="flex flex-col sm:flex-row justify-between gap-2">
                <Select value={property1} onValueChange={setProperty1}>
                  <SelectTrigger className="w-full sm:w-[180px]">
                    <SelectValue placeholder="X-Axis Property" />
                  </SelectTrigger>
                  <SelectContent>
                    {propertyOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={property2} onValueChange={setProperty2}>
                  <SelectTrigger className="w-full sm:w-[180px]">
                    <SelectValue placeholder="Y-Axis Property" />
                  </SelectTrigger>
                  <SelectContent>
                    {propertyOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardHeader>
            <CardContent>
              <div className="w-full h-[300px]">
                <canvas ref={canvasRef} width={500} height={300} className="w-full h-full" />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="radar" className="mt-4">
          <Card>
            <CardContent className="pt-6">
              <div className="w-full h-[350px]">
                <canvas ref={radarCanvasRef} width={500} height={350} className="w-full h-full" />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

