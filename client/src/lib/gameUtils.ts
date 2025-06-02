/**
 * Convert world coordinates to grid coordinates
 */
export function worldToGrid(worldX: number, worldZ: number, tileSize: number) {
  return {
    x: Math.floor(worldX / tileSize),
    z: Math.floor(worldZ / tileSize)
  };
}

/**
 * Convert grid coordinates to world coordinates (center of tile)
 */
export function gridToWorld(gridX: number, gridZ: number, tileSize: number) {
  return {
    x: gridX * tileSize + tileSize / 2,
    z: gridZ * tileSize + tileSize / 2
  };
}

/**
 * Check if a grid position is valid within bounds
 */
export function isValidGridPosition(x: number, z: number, gridSize: number) {
  return x >= 0 && x < gridSize && z >= 0 && z < gridSize;
}

/**
 * Calculate distance between two grid positions
 */
export function gridDistance(pos1: { x: number; z: number }, pos2: { x: number; z: number }) {
  return Math.sqrt(Math.pow(pos1.x - pos2.x, 2) + Math.pow(pos1.z - pos2.z, 2));
}

/**
 * Get neighboring grid positions
 */
export function getNeighbors(x: number, z: number, gridSize: number) {
  const neighbors = [];
  const directions = [
    { x: -1, z: 0 }, { x: 1, z: 0 },
    { x: 0, z: -1 }, { x: 0, z: 1 }
  ];
  
  for (const dir of directions) {
    const newX = x + dir.x;
    const newZ = z + dir.z;
    
    if (isValidGridPosition(newX, newZ, gridSize)) {
      neighbors.push({ x: newX, z: newZ });
    }
  }
  
  return neighbors;
}
