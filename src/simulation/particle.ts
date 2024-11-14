import { Material } from "./material.ts";
import { randomDirection, randomInt } from "./helpers.ts";
import { ParticleView } from "./simulation.ts";

export type Particle = {
  material: Material;
  seed: number;
  life: number;
  clock: number;
};

export type ParticleProps = {
  material: Material;
  seed?: number;
  life?: number;
  clock?: number;
};

export const EMPTY_PARTICLE: Particle = {
  material: Material.Empty,
  seed: 0,
  life: 0,
  clock: 0,
} as const;

export function createParticle(props: ParticleProps): Particle {
  return {
    material: props.material,
    seed: props.seed ?? randomInt(0, 256),
    life: props.life ?? 255,
    clock: props.clock ?? 0,
  };
}

export function updateParticle(neighbors: ParticleView, particle: Particle) {
  switch (particle.material) {
    case Material.Sand:
      updatePowder(neighbors, particle);
      break;
    case Material.Water:
      updateLiquid(neighbors, particle);
      break;
  }
}

function updatePowder(neighbors: ParticleView, particle: Particle) {
  const [randomX] = randomDirection();

  if (neighbors.getParticle(0, 1).material === Material.Empty) {
    neighbors.setParticle(0, 0, EMPTY_PARTICLE);
    neighbors.setParticle(0, 1, particle);
  } else if (neighbors.getParticle(randomX, 1).material === Material.Empty) {
    neighbors.setParticle(0, 0, EMPTY_PARTICLE);
    neighbors.setParticle(randomX, 1, particle);
  }
}

function updateLiquid(neighbors: ParticleView, particle: Particle) {
  const [randomX] = randomDirection();

  if (neighbors.getParticle(0, 1).material === Material.Empty) {
    neighbors.setParticle(0, 0, EMPTY_PARTICLE);
    neighbors.setParticle(0, 1, particle);
  } else if (neighbors.getParticle(randomX, 0).material === Material.Empty) {
    neighbors.setParticle(0, 0, EMPTY_PARTICLE);
    neighbors.setParticle(randomX, 0, particle);
  } else if (neighbors.getParticle(-randomX, 0).material === Material.Empty) {
    neighbors.setParticle(0, 0, EMPTY_PARTICLE);
    neighbors.setParticle(-randomX, 0, particle);
  } else if (neighbors.getParticle(randomX, 1).material === Material.Empty) {
    neighbors.setParticle(0, 0, EMPTY_PARTICLE);
    neighbors.setParticle(randomX, 1, particle);
  } else if (neighbors.getParticle(-randomX, 1).material === Material.Empty) {
    neighbors.setParticle(0, 0, EMPTY_PARTICLE);
    neighbors.setParticle(-randomX, 1, particle);
  } else if (
    neighbors.getParticle(randomX * 2, 0).material === Material.Empty
  ) {
    neighbors.setParticle(0, 0, EMPTY_PARTICLE);
    neighbors.setParticle(randomX * 2, 0, particle);
  } else if (
    neighbors.getParticle(-randomX * 2, 0).material === Material.Empty
  ) {
    neighbors.setParticle(0, 0, EMPTY_PARTICLE);
    neighbors.setParticle(-randomX * 2, 0, particle);
  }
}
