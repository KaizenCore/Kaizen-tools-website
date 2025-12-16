export interface Container {
  name: string;
  slots: number;
  stackSize: number;
}

export interface PowerSource {
  name: string;
  strength: number;
  description: string;
}

export interface Component {
  name: string;
  behavior: string;
}

export const containers: Container[] = [
  { name: 'Chest', slots: 27, stackSize: 64 },
  { name: 'Double Chest', slots: 54, stackSize: 64 },
  { name: 'Hopper', slots: 5, stackSize: 64 },
  { name: 'Furnace', slots: 3, stackSize: 64 },
  { name: 'Blast Furnace', slots: 3, stackSize: 64 },
  { name: 'Smoker', slots: 3, stackSize: 64 },
  { name: 'Barrel', slots: 27, stackSize: 64 },
  { name: 'Dropper', slots: 9, stackSize: 64 },
  { name: 'Dispenser', slots: 9, stackSize: 64 },
  { name: 'Brewing Stand', slots: 5, stackSize: 64 },
  { name: 'Hopper Minecart', slots: 5, stackSize: 64 },
  { name: 'Chest Minecart', slots: 27, stackSize: 64 },
  { name: 'Shulker Box', slots: 27, stackSize: 64 },
];

export const powerSources: PowerSource[] = [
  { name: 'Redstone Block', strength: 15, description: 'Constant power' },
  { name: 'Redstone Torch', strength: 15, description: 'Constant power (inverts)' },
  { name: 'Lever', strength: 15, description: 'Toggle on/off' },
  { name: 'Button', strength: 15, description: 'Temporary (1.5s wood, 1s stone)' },
  { name: 'Pressure Plate', strength: 15, description: 'Activates when stepped on' },
  { name: 'Daylight Sensor', strength: 15, description: 'Varies with time (0-15)' },
  { name: 'Trapped Chest', strength: 15, description: 'When opened' },
  { name: 'Target Block', strength: 15, description: 'When hit (varies by distance)' },
  { name: 'Observer', strength: 15, description: 'Detects block updates (1 tick pulse)' },
  { name: 'Lectern (with book)', strength: 15, description: 'Varies by page (1-15)' },
  { name: 'Sculk Sensor', strength: 15, description: 'Detects vibrations (1-15)' },
];

export const components: Component[] = [
  { name: 'Redstone Wire', behavior: 'Transmits power, decays by 1 per block (max 15)' },
  { name: 'Repeater', behavior: 'Refreshes signal to 15, adds delay (1-4 ticks)' },
  { name: 'Comparator', behavior: 'Compare or subtract mode, measures containers' },
  { name: 'Redstone Torch', behavior: 'Inverts signal, 1 tick delay when turning off' },
  { name: 'Piston', behavior: 'Extends in 1.5 ticks (3 game ticks), retracts in 1.5 ticks' },
  { name: 'Sticky Piston', behavior: 'Same as piston, pulls blocks back' },
  { name: 'Note Block', behavior: 'Plays note when powered (pitch 0-24)' },
  { name: 'Hopper', behavior: 'Transfers items, locks when powered' },
];

export const pistonTimings = {
  extension: { ticks: 3, seconds: 0.15 },
  retraction: { ticks: 3, seconds: 0.15 },
  budDelay: { ticks: 2, seconds: 0.1 },
};

export const tickToSeconds = (ticks: number): number => {
  return ticks / 20;
};

export const secondsToTicks = (seconds: number): number => {
  return seconds * 20;
};

/**
 * Calculate comparator signal strength from container
 * Formula: floor(1 + (itemCount / maxItems) * 14)
 */
export const calculateComparatorSignal = (
  itemCount: number,
  slots: number,
  stackSize: number
): number => {
  if (itemCount === 0) return 0;
  const maxItems = slots * stackSize;
  return Math.floor(1 + (itemCount / maxItems) * 14);
};

/**
 * Calculate items needed for a specific signal strength
 * Inverse formula: itemCount = ceil((signal - 1) * maxItems / 14)
 */
export const calculateItemsForSignal = (
  targetSignal: number,
  slots: number,
  stackSize: number
): number => {
  if (targetSignal === 0) return 0;
  const maxItems = slots * stackSize;
  return Math.ceil(((targetSignal - 1) * maxItems) / 14);
};

/**
 * Calculate signal strength after traveling distance through redstone wire
 */
export const calculateSignalStrength = (initialStrength: number, distance: number): number => {
  return Math.max(0, initialStrength - distance);
};
