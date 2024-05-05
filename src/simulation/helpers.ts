export function randomInt(min: number, max: number) {
  min = Math.ceil(min);
  max = Math.floor(max);

  return Math.floor(Math.random() * (max - min)) + min;
}

export function randomDirection(): [x: number, y: number] {
  const validDirections: [x: number, y: number][] = [
    [-1, -1],
    [-1, 0],
    [-1, 1],
    [0, -1],
    [0, 1],
    [1, -1],
    [1, 0],
    [1, 1],
  ];

  return validDirections[randomInt(0, validDirections.length)];
}
