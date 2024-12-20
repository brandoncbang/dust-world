import { Color } from "./color.ts";
import { getParticleColor } from "../simulation/particle.ts";
import { Simulation } from "../simulation/simulation.ts";

export class RenderBuffer {
  public imageData: ImageData;

  constructor(width: number, height: number) {
    this.imageData = new ImageData(width, height);
  }

  public drawSimulation(simulation: Simulation) {
    if (this.imageData.data.length !== simulation.size) {
      throw new Error("Render buffer size mismatches simulation size.");
    }

    for (let x = 0; x < simulation.width; x++) {
      for (let y = 0; y < simulation.height; y++) {
        const particle = simulation.getParticle(x, y);
        const color = getParticleColor(particle);

        this.drawPixel(x, y, color);
      }
    }
  }

  public drawPixel(x: number, y: number, color: Color) {
    const pixelIndex = (x + this.imageData.width * y) * 4;

    if (
      x < 0 ||
      x >= this.imageData.width ||
      y < 0 ||
      y >= this.imageData.height
    ) {
      return;
    }

    this.imageData.data[pixelIndex] = color.r;
    this.imageData.data[pixelIndex + 1] = color.g;
    this.imageData.data[pixelIndex + 2] = color.b;
    this.imageData.data[pixelIndex + 3] = 255;
  }

  public drawLine(
    fromX: number,
    fromY: number,
    toX: number,
    toY: number,
    color: Color,
  ) {
    this.drawPixel(fromX, fromY, color);

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

      this.drawPixel(fromX, fromY, color);
    }
  }

  public drawSquare(
    x: number,
    y: number,
    width: number,
    height: number,
    color: Color,
  ) {
    this.drawLine(x, y, x + width, y, color);
    this.drawLine(x, y, x, y + height, color);
    this.drawLine(x + width, y, x + width, y + height, color);
    this.drawLine(x, y + height, x + width, y + height, color);
  }

  renderToContext2D(ctx: CanvasRenderingContext2D) {
    ctx.putImageData(this.imageData, 0, 0);
  }
}
