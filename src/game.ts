import { Simulation } from "./simulation/simulation.ts";
import { Material } from "./simulation/material.ts";
import { Input } from "./core/input.ts";
import { RenderBuffer } from "./core/render.ts";
import { createParticle } from "./simulation/particle.ts";

export class Game {
  public ctx: CanvasRenderingContext2D;

  public renderBuffer: RenderBuffer;

  public simulation: Simulation;

  public lastMouseX: number = Input.mouseX;
  public lastMouseY: number = Input.mouseY;

  public brushSize: number = 7.0;
  public brushMaterial: Material = Material.Water;

  constructor(public canvas: HTMLCanvasElement) {
    this.ctx = canvas.getContext("2d")!;

    this.renderBuffer = new RenderBuffer(this.ctx);

    this.simulation = new Simulation(canvas.width, canvas.height);
  }

  start() {
    this.update();
  }

  update() {
    if (Input.mousePressed) {
      this.simulation.drawLine(
        this.lastMouseX,
        this.lastMouseY,
        Input.mouseX,
        Input.mouseY,
        this.brushSize,
        createParticle({
          material: this.brushMaterial,
        }),
      );
    }

    this.simulation.tick();

    this.render();

    this.lastMouseX = Input.mouseX;
    this.lastMouseY = Input.mouseY;

    window.requestAnimationFrame(() => this.update());
  }

  render() {
    this.simulation.renderTo(this.renderBuffer);

    this.renderBuffer.drawSquare(
      Input.mouseX - Math.ceil(this.brushSize / 2),
      Input.mouseY - Math.ceil(this.brushSize / 2),
      this.brushSize,
      this.brushSize,
      {
        r: 255,
        g: 255,
        b: 255,
      },
    );

    this.ctx.putImageData(this.renderBuffer.imageData, 0, 0);
  }
}
