export interface Quality {
  terrainDetail: number
  waterDetail: number
  stars: number
  sparkles: number
  trees: number
  houses: number
  clouds: number
  dpr: [number, number]
  fov: number
}

export const QUALITY: Record<'high' | 'low', Quality> = {
  high: {
    terrainDetail: 14,
    waterDetail: 8,
    stars: 2600,
    sparkles: 90,
    trees: 150,
    houses: 18,
    clouds: 7,
    dpr: [1, 1.75],
    fov: 45,
  },
  low: {
    terrainDetail: 10,
    waterDetail: 6,
    stars: 1100,
    sparkles: 40,
    trees: 80,
    houses: 10,
    clouds: 4,
    dpr: [1, 1.5],
    fov: 52,
  },
}
