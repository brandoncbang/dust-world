import { EmptyParticle, Particle } from "./particle.ts";
import { Material } from "./material.ts";
import { randomDirection } from "./helpers.ts";
import { RenderBuffer } from "../core/render.ts";

export class ParticleView {
  constructor(
    private readonly simulation: Simulation,
    private x: number,
    private y: number,
  ) {}

  public getParticle(dx: number, dy: number): Particle {
    return this.simulation.getParticle(this.x + dx, this.y + dy);
  }

  public setParticle(dx: number, dy: number, particle: Particle) {
    this.simulation.setParticle(this.x + dx, this.y + dy, particle);
  }

  public setOrigin(x: number, y: number) {
    this.x = x;
    this.y = y;
  }
}

export class Simulation {
  public static readonly particleBytes = 4;

  private generation: number = 0;

  private readonly particles: Uint8ClampedArray;

  constructor(
    public readonly width: number,
    public readonly height: number,
  ) {
    this.particles = new Uint8ClampedArray(
      width * height * Simulation.particleBytes,
    );
  }

  public tick() {
    this.generation = (this.generation + 1) % 2;

    for (let x = 0; x < this.width; x++) {
      const scanX = this.generation === 0 ? this.width - (1 + x) : x;

      for (let y = 0; y < this.height; y++) {
        const particle = this.getParticle(scanX, y);

        if (particle.clock === this.generation) continue;

        const [randomX] = randomDirection();

        switch (particle.material) {
          case Material.Sand:
            if (this.getParticle(scanX, y + 1).material === Material.Empty) {
              this.setParticle(scanX, y, EmptyParticle);
              this.setParticle(scanX, y + 1, particle);
            } else if (
              this.getParticle(scanX + randomX, y + 1).material ===
              Material.Empty
            ) {
              this.setParticle(scanX, y, EmptyParticle);
              this.setParticle(scanX + randomX, y + 1, particle);
            }

            break;
        }
      }
    }
  }

  public getParticle(x: number, y: number): Particle {
    if (!this.containsPosition(x, y)) {
      return {
        material: Material.Brick,
        register0: 0,
        register1: 0,
        clock: 0,
      };
    }

    const index = this.toIndex(x, y);

    return {
      material: this.particles[index],
      register0: this.particles[index + 1],
      register1: this.particles[index + 2],
      clock: this.particles[index + 3],
    };
  }

  public setParticle(x: number, y: number, particle: Particle) {
    if (!this.containsPosition(x, y)) {
      return;
    }

    const index = this.toIndex(x, y);

    this.particles[index] = particle.material;
    this.particles[index + 1] = particle.register0;
    this.particles[index + 2] = particle.register1;
    this.particles[index + 3] = this.generation;
  }

  public draw(x: number, y: number, size: number, particle: Particle) {
    const halfSize = Math.floor(size / 2);

    for (let px = x - halfSize; px <= x + halfSize; px++) {
      for (let py = y - halfSize; py <= y + halfSize; py++) {
        this.setParticle(px, py, particle);
      }
    }
  }

  public drawLine(
    fromX: number,
    fromY: number,
    toX: number,
    toY: number,
    size: number,
    particle: Particle,
  ) {
    this.draw(fromX, fromY, size, particle);

    const distanceX = Math.abs(toX - fromX);
    const distanceY = Math.abs(toY - fromY);
    const signX = fromX < toX ? 1 : -1;
    const signY = fromY < toY ? 1 : -1;
    let err = distanceX - distanceY;

    while (fromX !== toX || fromY !== toY) {
      const e2 = 2 * err;

      if (e2 > distanceY * -1) {
        err -= distanceY;
        fromX += signX;
      }
      if (e2 < distanceX) {
        err += distanceX;
        fromY += signY;
      }

      this.draw(fromX, fromY, size, particle);
    }
  }

  public renderTo(renderBuffer: RenderBuffer) {
    if (renderBuffer.data.length !== this.particles.length) {
      throw new Error("Render buffer size mismatches simulation size.");
    }

    for (let x = 0; x < this.width; x++) {
      for (let y = 0; y < this.height; y++) {
        const particle = this.getParticle(x, y);

        let color = {
          r: 0,
          g: 0,
          b: 0,
        };

        if (particle.material === Material.Sand) {
          color = {
            r: 240,
            g: 230,
            b: 140,
          };
        }
        if (particle.material === Material.Water) {
          color = {
            r: 0,
            g: 0,
            b: 255,
          };
        }

        renderBuffer.drawPixel(x, y, color);
      }
    }
  }

  private containsPosition(x: number, y: number): boolean {
    return x >= 0 && x < this.width && y >= 0 && y < this.height;
  }

  private toIndex(x: number, y: number): number {
    return (x + this.width * y) * Simulation.particleBytes;
  }
}
