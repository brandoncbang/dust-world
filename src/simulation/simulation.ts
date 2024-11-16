import { EMPTY_PARTICLE, Particle, updateParticle } from "./particle.ts";
import { Material } from "./material.ts";
import { RenderBuffer } from "../core/render.ts";
import { randomInt } from "./helpers.ts";
import { CORNFLOWERBLUE } from "../core/color.ts";

export class ParticleView {
  constructor(
    private readonly simulation: Simulation,
    private x: number = 0,
    private y: number = 0,
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
  public static readonly particleBytes = Object.entries(EMPTY_PARTICLE).length;

  private generation: number = 0;

  private readonly particles: Uint8ClampedArray;

  private readonly particleView: ParticleView = new ParticleView(this);

  constructor(
    public readonly width: number,
    public readonly height: number,
  ) {
    this.particles = new Uint8ClampedArray(
      width * height * Simulation.particleBytes,
    );
  }

  get clock() {
    return this.generation % 2;
  }

  public tick() {
    this.generation = (this.generation + 1) % 1000;

    for (let x = 0; x < this.width; x++) {
      const scanX = this.clock === 0 ? this.width - (1 + x) : x;

      for (let y = 0; y < this.height; y++) {
        const particle = this.getParticle(scanX, y);

        if (particle.clock === this.clock) continue;

        this.particleView.setOrigin(scanX, y);

        updateParticle(this.particleView, particle);
      }
    }
  }

  public getParticle(x: number, y: number): Particle {
    if (!this.containsPosition(x, y)) {
      return {
        material: Material.Brick,
        seed: 0,
        life: 0,
        clock: 0,
      };
    }

    const index = this.toIndex(x, y);

    return {
      material: this.particles[index],
      seed: this.particles[index + 1],
      life: this.particles[index + 2],
      clock: this.particles[index + 3],
    };
  }

  public setParticle(x: number, y: number, particle: Particle) {
    if (!this.containsPosition(x, y)) {
      return;
    }

    const index = this.toIndex(x, y);

    this.particles[index] = particle.material;
    this.particles[index + 1] = particle.seed;
    this.particles[index + 2] = particle.life;
    this.particles[index + 3] = this.clock;
  }

  public draw(x: number, y: number, size: number, particle: Particle) {
    const halfSize = Math.floor(size / 2);

    for (let px = x - halfSize; px <= x + halfSize; px++) {
      for (let py = y - halfSize; py <= y + halfSize; py++) {
        this.setParticle(
          px,
          py,
          Object.assign(particle, { seed: randomInt(0, 256) }),
        );
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

        let color = CORNFLOWERBLUE;

        if (particle.material === Material.Sand) {
          color = [
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
