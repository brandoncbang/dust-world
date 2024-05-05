import { Material } from "./material.ts";

export type Particle = {
  material: Material;
  register0: number;
  register1: number;
  clock: number;
};

export const EmptyParticle = {
  material: Material.Empty,
  register0: 0,
  register1: 0,
  clock: 0,
} as const;
