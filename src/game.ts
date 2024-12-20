import { Simulation } from "./simulation/simulation.ts";
import { Material } from "./simulation/material.ts";
import { Input } from "./core/input.ts";
import { RenderBuffer } from "./core/render.ts";
import { createParticle } from "./simulation/particle.ts";
import { Gui } from "./core/gui.ts";
import { WHITE } from "./core/color.ts";

export class Game {
  public paused: boolean = false;

  private readonly ctx: CanvasRenderingContext2D;

  private readonly simulation: Simulation;
  private readonly renderBuffer: RenderBuffer;

  private lastMouseX: number = Input.mouseX;
  private lastMouseY: number = Input.mouseY;

  private brushSize: number = 5.0;
  private brushMaterial: Material = Material.Water;

  constructor(public canvas: HTMLCanvasElement) {
    this.ctx = canvas.getContext("2d", { alpha: false })!;

    this.renderBuffer = new RenderBuffer(canvas.width, canvas.height);
    this.simulation = new Simulation(canvas.width, canvas.height);
  }

  setUpGui(gui: Gui) {
    gui.onBrushSizeSelected = (size: number) => {
      this.brushSize = size;
    };

    gui.onMaterialSelected = (material: Material) => {
      this.brushMaterial = material;
    };

    gui.onClearButtonPressed = () => {
      this.simulation.clear();
    };

    gui.onPauseButtonPressed = () => {
      this.paused = !this.paused;
    };
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

    if (!this.paused) {
      this.simulation.tick();
    }

    this.render();

    this.lastMouseX = Input.mouseX;
    this.lastMouseY = Input.mouseY;

    window.requestAnimationFrame(() => this.update());
  }

  render() {
    this.renderBuffer.drawSimulation(this.simulation);

    this.renderBuffer.drawSquare(
      Input.mouseX - Math.floor(this.brushSize / 2.0),
      Input.mouseY - Math.floor(this.brushSize / 2.0),
      this.brushSize - 1,
      this.brushSize - 1,
      WHITE,
    );

    this.renderBuffer.renderToContext2D(this.ctx);
  }
}
