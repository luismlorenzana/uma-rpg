// Placeholder place markers (T007), drawn in code at each place's registry position. One small drawer per kind of
// building or site; per-place colours keep the 36 places tellable apart until real pixel art replaces them.
import type Phaser from 'phaser'

type G = Phaser.GameObjects.Graphics
type Draw = (g: G, x: number, y: number) => void

/** Ambient effects a marker asks for; the scene animates them each frame. */
export type Ambient =
  | { kind: 'shimmer'; x: number; y: number; w: number; color: number }
  | { kind: 'sway'; x: number; y: number; w: number; color: number }
  | { kind: 'smoke'; x: number; y: number }
  | { kind: 'glow'; x: number; y: number; r: number; color: number }

const shadow = (g: G, x: number, y: number, w: number) => {
  g.fillStyle(0x000000, 0.28)
  g.fillEllipse(x, y + 16, w, 9)
}

function plot(g: G, x: number, y: number, soil = 0x6e5032) {
  shadow(g, x, y, 60)
  g.fillStyle(0x4a3420, 1)
  g.fillRoundedRect(x - 30, y - 12, 60, 30, 6)
  g.fillStyle(soil, 1)
  g.fillRoundedRect(x - 28, y - 14, 56, 28, 6)
}

function rows(g: G, x: number, y: number, color: number, dots = false) {
  for (let i = 0; i < 3; i++) {
    const ry = y - 8 + i * 8
    g.fillStyle(0x5a3f26, 1)
    g.fillRect(x - 24, ry + 2, 48, 3)
    g.fillStyle(color, 1)
    if (dots) for (let k = 0; k < 6; k++) g.fillCircle(x - 20 + k * 8, ry, 2.6)
    else g.fillRect(x - 24, ry - 2, 48, 3)
  }
}

function tree(g: G, x: number, y: number, canopy: number, fruit?: number, r = 10) {
  g.fillStyle(0x5b3b22, 1)
  g.fillRect(x - 2, y, 4, 10)
  g.fillStyle(canopy, 1)
  g.fillCircle(x, y - 4, r)
  g.fillStyle(0xffffff, 0.12)
  g.fillCircle(x - r / 3, y - 4 - r / 3, r / 2.2)
  if (fruit !== undefined) {
    g.fillStyle(fruit, 1)
    for (const [dx, dy] of [[-5, -6], [4, -2], [-1, 2], [5, -9]]) g.fillCircle(x + (dx ?? 0), y + (dy ?? 0), 1.8)
  }
}

function pine(g: G, x: number, y: number, color: number, h = 22) {
  g.fillStyle(0x4a2f1c, 1)
  g.fillRect(x - 2, y + h / 2 - 4, 4, 6)
  g.fillStyle(color, 1)
  g.fillTriangle(x, y - h / 2, x - h / 2.4, y + h / 2 - 2, x + h / 2.4, y + h / 2 - 2)
  g.fillStyle(0xffffff, 0.1)
  g.fillTriangle(x, y - h / 2, x - h / 2.4, y + h / 2 - 2, x - 1, y + h / 2 - 2)
}

function mound(g: G, x: number, y: number, rock: number) {
  shadow(g, x, y, 62)
  g.fillStyle(rock, 1)
  g.fillEllipse(x, y + 2, 62, 36)
  g.fillStyle(0xffffff, 0.1)
  g.fillEllipse(x - 8, y - 6, 34, 14)
}

function house(g: G, x: number, y: number, wall: number, roof: number, chimney = false) {
  shadow(g, x, y, 56)
  g.fillStyle(wall, 1)
  g.fillRect(x - 22, y - 6, 44, 24)
  g.fillStyle(roof, 1)
  g.fillTriangle(x - 27, y - 5, x + 27, y - 5, x, y - 22)
  g.fillStyle(0x2b1d12, 1)
  g.fillRect(x - 5, y + 6, 10, 12)
  g.fillStyle(0xffe6a0, 0.9)
  g.fillRect(x + 9, y + 1, 7, 6)
  if (chimney) {
    g.fillStyle(0x5d4a40, 1)
    g.fillRect(x + 11, y - 21, 6, 12)
  }
}

function tower(g: G, x: number, y: number, wall: number, roof: number) {
  shadow(g, x, y, 40)
  g.fillStyle(wall, 1)
  g.fillRect(x - 12, y - 16, 24, 34)
  g.fillStyle(roof, 1)
  g.fillTriangle(x - 16, y - 15, x + 16, y - 15, x, y - 36)
  g.fillStyle(0xffe6a0, 0.9)
  g.fillRect(x - 3, y - 8, 6, 8)
  g.fillStyle(0x2b1d12, 1)
  g.fillRect(x - 4, y + 8, 8, 10)
}

function hall(g: G, x: number, y: number, wall: number, roof: number, banner: number) {
  shadow(g, x, y, 66)
  g.fillStyle(wall, 1)
  g.fillRect(x - 30, y - 6, 60, 24)
  g.fillStyle(roof, 1)
  g.fillRect(x - 33, y - 12, 66, 8)
  g.fillTriangle(x - 14, y - 12, x + 14, y - 12, x, y - 26)
  g.fillStyle(banner, 1)
  g.fillRect(x - 24, y - 2, 7, 14)
  g.fillRect(x + 17, y - 2, 7, 14)
  g.fillStyle(0x2b1d12, 1)
  g.fillRect(x - 6, y + 6, 12, 12)
}

function shed(g: G, x: number, y: number, roof: number, metal: number) {
  shadow(g, x, y, 62)
  g.fillStyle(0x7a5a3a, 1)
  g.fillRect(x - 26, y - 4, 34, 22)
  g.fillStyle(roof, 1)
  g.fillTriangle(x - 30, y - 3, x + 12, y - 3, x - 9, y - 18)
  // weapon rack
  g.fillStyle(0x4a321e, 1)
  g.fillRect(x + 12, y + 2, 16, 3)
  g.fillRect(x + 12, y + 14, 16, 3)
  g.fillStyle(metal, 1)
  for (let i = 0; i < 3; i++) g.fillRect(x + 14 + i * 5, y - 10, 2, 26)
}

const DRAW: Record<string, Draw> = {
  // Farmlands
  fields: (g, x, y) => { plot(g, x, y); rows(g, x, y, 0xe4c45a) },
  orchard: (g, x, y) => { shadow(g, x, y, 62); tree(g, x - 16, y + 2, 0x4f8f3a, 0xe0483a); tree(g, x + 14, y + 4, 0x56953f, 0xf09a3a); tree(g, x - 1, y - 6, 0x4a8636, 0xe0483a) },
  fishery: (g, x, y) => { shadow(g, x, y, 64); g.fillStyle(0x6b5a3a, 1); g.fillEllipse(x, y + 2, 64, 34); g.fillStyle(0x2f6fa8, 1); g.fillEllipse(x, y + 2, 56, 28); g.fillStyle(0x6cb4e8, 0.5); g.fillEllipse(x - 8, y - 2, 24, 8); g.fillStyle(0x7a5530, 1); g.fillRect(x + 14, y - 14, 14, 4) },
  'herb-garden': (g, x, y) => { plot(g, x, y, 0x5c4a30); rows(g, x, y, 0x7ccf6a, true) },
  'vegetable-garden': (g, x, y) => { plot(g, x, y); rows(g, x, y, 0xf08a2a, true) },
  'mushroom-cave': (g, x, y) => { mound(g, x, y, 0x55525a); g.fillStyle(0x15131a, 1); g.fillEllipse(x, y + 8, 26, 22); for (const [dx, c] of [[-22, 0xd8483a], [20, 0xe6d2b0], [-14, 0xb07ae0]] as const) { g.fillStyle(0xeee0c8, 1); g.fillRect(x + dx - 1, y + 10, 3, 6); g.fillStyle(c, 1); g.fillEllipse(x + dx, y + 10, 10, 6) } },
  'sugar-grove': (g, x, y) => { shadow(g, x, y, 62); for (let i = 0; i < 4; i++) { g.fillStyle(0x8e5ab0, 1); g.fillRect(x + 12 + i * 4, y - 18, 3, 34) } for (const dx of [-22, -6]) { g.fillStyle(0xe6b43a, 1); g.fillRoundedRect(x + dx - 7, y - 4, 14, 18, 3); g.fillStyle(0x8a5a14, 1); g.fillRect(x + dx - 7, y + 2, 14, 2); g.fillRect(x + dx - 7, y + 8, 14, 2) } },
  'nut-grove': (g, x, y) => { shadow(g, x, y, 62); tree(g, x - 14, y + 2, 0x7b8a3a, 0x8a5a2a, 11); tree(g, x + 14, y + 0, 0x6f7f34, 0x8a5a2a, 12) },
  pantry: (g, x, y) => house(g, x, y, 0xcfb894, 0x3f6fa8),
  kitchen: (g, x, y) => house(g, x, y, 0xd8c09a, 0xb4482e, true),
  // Wilds
  'monster-den': (g, x, y) => { mound(g, x, y, 0x4a4236); g.fillStyle(0x0d0b0a, 1); g.fillEllipse(x, y + 6, 30, 24); g.fillStyle(0xf2d23a, 1); g.fillCircle(x - 5, y + 4, 2); g.fillCircle(x + 5, y + 4, 2) },
  'ley-spring': (g, x, y) => { shadow(g, x, y, 60); g.fillStyle(0x6c6878, 1); g.fillEllipse(x, y + 2, 58, 32); g.fillStyle(0x2ad0c8, 1); g.fillEllipse(x, y + 2, 46, 22) },
  mine: (g, x, y) => { mound(g, x, y, 0x5f5a54); g.fillStyle(0x6b4a2a, 1); g.fillRect(x - 16, y - 6, 32, 24); g.fillStyle(0x0d0c0b, 1); g.fillRect(x - 11, y - 1, 22, 19); g.fillStyle(0x9a9a9a, 1); g.fillRect(x - 9, y + 16, 2, 6); g.fillRect(x + 7, y + 16, 2, 6) },
  'crystal-cavern': (g, x, y) => { mound(g, x, y, 0x4a4660); for (const [dx, h, c] of [[-14, 20, 0xa070f0], [0, 28, 0x70d8f0], [13, 18, 0xc890f8]] as const) { g.fillStyle(c, 1); g.fillTriangle(x + dx - 6, y + 12, x + dx + 6, y + 12, x + dx, y + 12 - h); g.fillStyle(0xffffff, 0.35); g.fillTriangle(x + dx - 6, y + 12, x + dx, y + 12, x + dx, y + 12 - h) } },
  quarry: (g, x, y) => { shadow(g, x, y, 62); for (const [dx, dy, c] of [[-16, 6, 0xb8b0a0], [6, 8, 0xa8a090], [-6, -8, 0xc8c0b0], [16, -4, 0x989080]] as const) { g.fillStyle(c, 1); g.fillRect(x + dx - 9, y + dy - 7, 18, 14); g.fillStyle(0x000000, 0.18); g.fillRect(x + dx - 9, y + dy + 4, 18, 3) } },
  meadow: (g, x, y) => { shadow(g, x, y, 60); g.fillStyle(0x6a9a4a, 1); g.fillEllipse(x, y + 2, 60, 30); for (let i = 0; i < 9; i++) { const px = x - 24 + i * 6, py = y - 4 + ((i * 7) % 12); g.fillStyle(0x8ac25a, 1); g.fillTriangle(px - 3, py + 6, px + 3, py + 6, px, py - 4); g.fillStyle(i % 2 ? 0xf0f0f0 : 0x8fb4ff, 1); g.fillCircle(px + 2, py - 3, 1.6) } },
  forest: (g, x, y) => { shadow(g, x, y, 64); pine(g, x - 16, y + 2, 0x2f6a3a); pine(g, x + 16, y + 3, 0x2a5f34); pine(g, x, y - 4, 0x357a42, 28) },
  'fossil-dig': (g, x, y) => { shadow(g, x, y, 62); g.fillStyle(0x8a6a44, 1); g.fillEllipse(x, y + 4, 58, 30); g.fillStyle(0x5a4228, 1); g.fillEllipse(x, y + 6, 40, 18); g.fillStyle(0xeee4cc, 1); g.fillRect(x - 10, y + 4, 20, 4); g.fillCircle(x - 11, y + 3, 3); g.fillCircle(x - 11, y + 9, 3); g.fillCircle(x + 11, y + 3, 3); g.fillCircle(x + 11, y + 9, 3) },
  workbench: (g, x, y) => house(g, x, y, 0xb8a080, 0x5a6a7a),
  forge: (g, x, y) => { house(g, x, y, 0x6a5a52, 0x3a3434, true); g.fillStyle(0xff8a2a, 0.9); g.fillRect(x - 4, y + 7, 8, 11) },
  // Learning District
  'brawler-dojo': (g, x, y) => hall(g, x, y, 0xd8c8a8, 0x7a2a22, 0xd8483a),
  'mage-tower': (g, x, y) => tower(g, x, y, 0x8a84a8, 0x5a3a9a),
  'spell-blade-salle': (g, x, y) => hall(g, x, y, 0xc8d0d8, 0x2a6a72, 0x3ab0b8),
  'cleric-chapel': (g, x, y) => tower(g, x, y, 0xeeeadf, 0xd8a83a),
  'summoner-circle': (g, x, y) => { shadow(g, x, y, 62); g.fillStyle(0x5a5878, 1); g.fillEllipse(x, y + 4, 60, 30); g.fillStyle(0x2a2840, 1); g.fillEllipse(x, y + 4, 44, 20); for (let i = 0; i < 8; i++) { const a = (i / 8) * Math.PI * 2; g.fillStyle(0x9a98b0, 1); g.fillRect(x + Math.cos(a) * 27 - 2, y + 4 + Math.sin(a) * 13 - 6, 4, 8) } },
  'rangers-lodge': (g, x, y) => shed(g, x, y, 0x3f7a3a, 0xc8d0d8),
  'lancers-barracks': (g, x, y) => shed(g, x, y, 0x8a5a2a, 0xb0b8c0),
  'arcane-armory': (g, x, y) => shed(g, x, y, 0x5a3a8a, 0xb89ae8),
  'knights-bastion': (g, x, y) => shed(g, x, y, 0x5a6478, 0xe0e4ea),
  // Town
  stable: (g, x, y) => { shadow(g, x, y, 62); g.fillStyle(0xa83a2e, 1); g.fillRect(x - 26, y - 6, 52, 24); g.fillStyle(0x6a2a22, 1); g.fillTriangle(x - 30, y - 5, x + 30, y - 5, x, y - 24); g.fillStyle(0xf0e6d0, 1); g.fillRect(x - 9, y + 2, 18, 16); g.fillStyle(0xa83a2e, 1); g.fillRect(x - 1, y + 2, 2, 16) },
  'party-hall': (g, x, y) => { hall(g, x, y, 0xe0d2b4, 0x3a5a8a, 0xd6a23e); g.fillStyle(0xd6a23e, 1); g.fillTriangle(x - 2, y - 26, x - 2, y - 36, x + 8, y - 31) },
  'scenario-gate': (g, x, y) => { shadow(g, x, y, 76); g.fillStyle(0xa8a090, 1); g.fillRect(x - 34, y - 22, 14, 40); g.fillRect(x + 20, y - 22, 14, 40); g.fillRect(x - 36, y - 28, 72, 10); g.fillStyle(0xd6a23e, 1); g.fillRect(x - 36, y - 30, 72, 3); g.fillStyle(0x1a2030, 0.85); g.fillRect(x - 20, y - 18, 40, 36) },
  warehouse: (g, x, y) => { shadow(g, x, y, 66); g.fillStyle(0x8a6a48, 1); g.fillRect(x - 30, y - 10, 60, 28); g.fillStyle(0x5a4630, 1); g.fillRect(x - 33, y - 16, 66, 7); for (const dx of [-20, -6]) { g.fillStyle(0xb88a50, 1); g.fillRect(x + dx, y + 6, 12, 12); g.fillStyle(0x6a4a28, 1); g.fillRect(x + dx, y + 11, 12, 2) } g.fillStyle(0x2b1d12, 1); g.fillRect(x + 10, y + 2, 14, 16) },
  exchange: (g, x, y) => { shadow(g, x, y, 62); g.fillStyle(0x7a5a3a, 1); g.fillRect(x - 26, y, 52, 18); for (let i = 0; i < 6; i++) { g.fillStyle(i % 2 ? 0xf0e6d0 : 0x2e8a5a, 1); g.fillRect(x - 28 + i * 9.4, y - 14, 9.4, 12) } g.fillStyle(0x8fd18a, 1); g.fillCircle(x - 10, y + 6, 3); g.fillStyle(0xf2c94c, 1); g.fillCircle(x + 2, y + 6, 3); g.fillCircle(x + 12, y + 6, 3) },
  observatory: (g, x, y) => { shadow(g, x, y, 56); g.fillStyle(0xc8c4d8, 1); g.fillRect(x - 22, y - 2, 44, 20); g.fillStyle(0x4a4a78, 1); g.fillEllipse(x, y - 2, 46, 34); g.fillStyle(0x2a2a48, 1); g.fillRect(x - 3, y - 18, 6, 16); g.fillStyle(0xd6d0f0, 1); g.fillRect(x + 2, y - 26, 18, 5) },
  'tier-finale': (g, x, y) => { shadow(g, x, y, 70); g.fillStyle(0x9a8a72, 1); g.fillEllipse(x, y + 2, 68, 38); g.fillStyle(0x6a5a46, 1); g.fillEllipse(x, y + 4, 50, 24); g.fillStyle(0x8a6a3a, 1); g.fillEllipse(x, y + 5, 40, 17); for (let i = 0; i < 7; i++) { g.fillStyle(0x3a2e24, 1); g.fillRect(x - 28 + i * 9, y - 12, 4, 6) } g.fillStyle(0xd6a23e, 1); g.fillTriangle(x + 22, y - 18, x + 22, y - 28, x + 32, y - 23) },
}

/** Draws a place's marker centred at (x, y) and returns the ambient effects it wants. */
export function drawMarker(g: G, id: string, x: number, y: number): Ambient[] {
  const draw = DRAW[id]
  if (!draw) {
    shadow(g, x, y, 50)
    g.fillStyle(0x8a8a9a, 1)
    g.fillRoundedRect(x - 20, y - 12, 40, 28, 5)
    return []
  }
  draw(g, x, y)
  switch (id) {
    case 'fishery':
      return [{ kind: 'shimmer', x, y: y + 2, w: 40, color: 0xbfe6ff }]
    case 'ley-spring':
      return [{ kind: 'glow', x, y: y + 2, r: 18, color: 0x7ff6ee }, { kind: 'shimmer', x, y: y + 2, w: 30, color: 0xdffffb }]
    case 'fields':
      return [{ kind: 'sway', x, y: y - 8, w: 48, color: 0xf2dc7a }, { kind: 'sway', x, y: y, w: 48, color: 0xf2dc7a }]
    case 'kitchen':
    case 'forge':
      return [{ kind: 'smoke', x: x + 14, y: y - 22 }]
    case 'summoner-circle':
      return [{ kind: 'glow', x, y: y + 4, r: 16, color: 0xb08aff }]
    case 'crystal-cavern':
      return [{ kind: 'glow', x, y: y + 2, r: 14, color: 0x9fd8ff }]
    default:
      return []
  }
}
