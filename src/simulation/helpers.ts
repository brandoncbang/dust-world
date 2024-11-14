const VALID_DIRECTIONS: [x: number, y: number][] = [
  [-1, -1],
  [-1, 0],
  [-1, 1],
  [0, -1],
  [0, 1],
  [1, -1],
  [1, 0],
  [1, 1],
];

export function randomInt(min: number, max: number) {
  min = Math.ceil(min);
  max = Math.floor(max);

  return Math.floor(Math.random() * (max - min)) + min;
}

export function sample<T>(arr: T[]): T {
  return arr[randomInt(0, arr.length)];
}

export function randomDirection(): [x: number, y: number] {
  return sample(VALID_DIRECTIONS);
}
