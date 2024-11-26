import { Material } from "./material.ts";
import { randomDirection, randomInt } from "./helpers.ts";
import { ParticleView } from "./simulation.ts";
import { Color, CORNFLOWERBLUE, FUCSHIA } from "../core/color.ts";

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
    default:
      neighbors.setParticle(0, 0, particle);
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

export function getParticleColor(particle: Particle): Color {
  switch (particle.material) {
    case Material.Empty:
      return CORNFLOWERBLUE;
    case Material.Fire:
      return {
        r: 255,
        g: 165,
        b: 0,
      };
    case Material.Water:
      return {
        r: 0,
        g: 0,
        b: 255,
      };
    case Material.Sand:
      return [
        {
          r: 239,
          g: 203,
          b: 154,
        },
        {
          r: 240,
          g: 230,
          b: 140,
        },
        {
          r: 245,
          g: 245,
          b: 220,
        },
      ][particle.seed % 3];
    case Material.Wood:
      return {
        r: 244,
        g: 164,
        b: 96,
      };
    case Material.Brick:
      return {
        r: 178,
        g: 34,
        b: 34,
      };
  }

  return FUCSHIA;
}
