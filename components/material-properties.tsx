"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table"

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

interface MaterialPropertiesProps {
  material: Material
}

export function MaterialProperties({ material }: MaterialPropertiesProps) {
  // Property descriptions for tooltips and explanations
  const propertyDescriptions = {
    Su: "Ultimate Tensile Strength (MPa) - Maximum stress that a material can withstand while being stretched before breaking",
    Sy: "Yield Strength (MPa) - Stress at which a material begins to deform plastically",
    A5: "Elongation (%) - Increase in length that occurs before a material breaks under tension",
    Bhn: "Brinell Hardness Number - Measure of material hardness",
    E: "Elastic Modulus (MPa) - Measure of material stiffness",
    G: "Shear Modulus (MPa) - Measure of material's resistance to shear deformation",
    mu: "Poisson's Ratio - Ratio of transverse contraction strain to longitudinal extension strain",
    Ro: "Density (kg/m³) - Mass per unit volume",
  }

  // Calculate material performance metrics
  const strengthToWeightRatio = (material.Su / material.Ro) * 1000
  const stiffnessToWeightRatio = (material.E / material.Ro) * 1000
  const toughness = (material.Su * material.A5) / 100

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>{material.Material}</CardTitle>
          <CardDescription>{material["Heat treatment"]}</CardDescription>
        </CardHeader>
      </Card>

      <Tabs defaultValue="mechanical">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="mechanical">Mechanical</TabsTrigger>
          <TabsTrigger value="physical">Physical</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
        </TabsList>

        <TabsContent value="mechanical" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Mechanical Properties</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-medium">Ultimate Tensile Strength (Su)</TableCell>
                    <TableCell>{material.Su} MPa</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Yield Strength (Sy)</TableCell>
                    <TableCell>{material.Sy} MPa</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Elongation (A5)</TableCell>
                    <TableCell>{material.A5}%</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Hardness (Bhn)</TableCell>
                    <TableCell>{material.Bhn}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Elastic Modulus (E)</TableCell>
                    <TableCell>{material.E} MPa</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Shear Modulus (G)</TableCell>
                    <TableCell>{material.G} MPa</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="physical" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Physical Properties</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-medium">Density (Ro)</TableCell>
                    <TableCell>{material.Ro} kg/m³</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Poisson's Ratio (mu)</TableCell>
                    <TableCell>{material.mu}</TableCell>
                  </TableRow>
                  {material.pH && (
                    <TableRow>
                      <TableCell className="font-medium">pH</TableCell>
                      <TableCell>{material.pH}</TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="performance" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Performance Metrics</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-medium">Strength-to-Weight Ratio</TableCell>
                    <TableCell>{strengthToWeightRatio.toFixed(2)} Nm/kg</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Stiffness-to-Weight Ratio</TableCell>
                    <TableCell>{stiffnessToWeightRatio.toFixed(2)} Nm/kg</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Toughness (Estimated)</TableCell>
                    <TableCell>{toughness.toFixed(2)} MPa</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Ductility</TableCell>
                    <TableCell>{material.A5 > 30 ? "High" : material.A5 > 15 ? "Medium" : "Low"}</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

