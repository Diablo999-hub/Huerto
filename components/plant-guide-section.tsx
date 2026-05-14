"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Droplets, Sun, Clock, Sprout } from "lucide-react"
import { useState } from "react"

const plants = [
  {
    name: "Hierbabuena / Menta",
    description: "Casi imposibles de matar. Ideales para principiantes y perfectas para infusiones.",
    water: "Alta",
    sun: "Sombra parcial",
    time: "2-3 semanas",
    difficulty: "Fácil",
    tips: "Requieren mucha agua. Ideales para macetas pequeñas en interiores.",
    image: "🌿"
  },
  {
    name: "Suculentas",
    description: "Perfectas para quienes olvidan regar. Decorativas y resistentes.",
    water: "Mínima",
    sun: "Luz indirecta",
    time: "Variable",
    difficulty: "Muy fácil",
    tips: "Riego cada 15 días. Necesitan mucha luz indirecta y buen drenaje.",
    image: "🪴"
  },
  {
    name: "Lechuga",
    description: "De crecimiento rápido. Perfecta para ensaladas frescas todo el año.",
    water: "Media",
    sun: "Sol parcial",
    time: "30-60 días",
    difficulty: "Fácil",
    tips: "Se pueden cultivar en contenedores poco profundos. Cosecha las hojas externas.",
    image: "🥬"
  },
  {
    name: "Tomate Cherry",
    description: "Requieren más atención pero ofrecen recompensas deliciosas.",
    water: "Media-Alta",
    sun: "Sol directo",
    time: "60-80 días",
    difficulty: "Intermedio",
    tips: "Requieren una ventana con mucho sol y un tutor para apoyarse mientras crecen.",
    image: "🍅"
  }
]

export function PlantGuideSection() {
  const [selectedPlant, setSelectedPlant] = useState(0)

  return (
    <section id="guias" className="py-24 bg-background scroll-mt-20">
      <div className="container mx-auto px-6">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <p className="text-sm font-medium text-primary mb-3 tracking-wide uppercase">Guía de Inicio</p>
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6 text-balance">
            Plantas para Principiantes
          </h2>
          <p className="text-lg text-muted-foreground text-pretty">
            Especies resistentes y de fácil manejo. Perfectas para comenzar tu aventura en la jardinería urbana.
          </p>
        </div>

        {/* Plant Cards */}
        <div className="grid lg:grid-cols-2 gap-8 items-start">
          {/* Plant Selection */}
          <div className="space-y-4">
            {plants.map((plant, index) => (
              <Card 
                key={plant.name}
                className={`cursor-pointer transition-all border-2 ${
                  selectedPlant === index 
                    ? 'border-primary bg-primary/5 shadow-md' 
                    : 'border-transparent bg-card hover:bg-muted/50'
                }`}
                onClick={() => setSelectedPlant(index)}
              >
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <span className="text-4xl">{plant.image}</span>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-foreground">{plant.name}</h3>
                      <p className="text-sm text-muted-foreground">{plant.description}</p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      plant.difficulty === 'Muy fácil' ? 'bg-accent/20 text-accent' :
                      plant.difficulty === 'Fácil' ? 'bg-primary/20 text-primary' :
                      'bg-secondary text-secondary-foreground'
                    }`}>
                      {plant.difficulty}
                    </span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Plant Details */}
          <Card className="bg-card border-none shadow-lg sticky top-8">
            <CardContent className="p-8">
              <div className="text-center mb-8">
                <span className="text-8xl block mb-4">{plants[selectedPlant].image}</span>
                <h3 className="text-2xl font-bold text-foreground">{plants[selectedPlant].name}</h3>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-8">
                <div className="flex items-center gap-3 p-4 rounded-lg bg-muted/50">
                  <Droplets className="w-5 h-5 text-primary" />
                  <div>
                    <p className="text-xs text-muted-foreground">Riego</p>
                    <p className="font-medium text-foreground">{plants[selectedPlant].water}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-4 rounded-lg bg-muted/50">
                  <Sun className="w-5 h-5 text-primary" />
                  <div>
                    <p className="text-xs text-muted-foreground">Luz</p>
                    <p className="font-medium text-foreground">{plants[selectedPlant].sun}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-4 rounded-lg bg-muted/50">
                  <Clock className="w-5 h-5 text-primary" />
                  <div>
                    <p className="text-xs text-muted-foreground">Tiempo</p>
                    <p className="font-medium text-foreground">{plants[selectedPlant].time}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-4 rounded-lg bg-muted/50">
                  <Sprout className="w-5 h-5 text-primary" />
                  <div>
                    <p className="text-xs text-muted-foreground">Dificultad</p>
                    <p className="font-medium text-foreground">{plants[selectedPlant].difficulty}</p>
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-lg bg-primary/5 border border-primary/10">
                <p className="text-sm font-medium text-primary mb-1">Consejo de experto</p>
                <p className="text-muted-foreground">{plants[selectedPlant].tips}</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}
