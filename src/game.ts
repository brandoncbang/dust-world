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

  private simulation: Simulation;
  private readonly renderBuffer: RenderBuffer;
  private gui: Gui;

  private lastMouseX: number = Input.mouseX;
  private lastMouseY: number = Input.mouseY;

  private brushSize: number = 5.0;
  private brushMaterial: Material = Material.Water;

  constructor(
    public canvas: HTMLCanvasElement,
    public guiRoot: HTMLElement,
  ) {
    this.ctx = canvas.getContext("2d")!;
    this.renderBuffer = new RenderBuffer(this.ctx);

    this.gui = new Gui(guiRoot, this);
    this.setUpGui();

    this.simulation = new Simulation(canvas.width, canvas.height);
  }

  setUpGui() {
    this.gui.onBrushSizeSelected = (size: number) => {
      this.brushSize = size;
    };

    this.gui.onMaterialSelected = (material: Material) => {
      this.brushMaterial = material;
    };

    this.gui.onClearButtonPressed = () => {
      this.simulation.clear();
    };

    this.gui.onPauseButtonPressed = () => {
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
    this.simulation.renderTo(this.renderBuffer);

    this.renderBuffer.drawSquare(
      Input.mouseX - Math.floor(this.brushSize / 2.0),
      Input.mouseY - Math.floor(this.brushSize / 2.0),
      this.brushSize - 1,
      this.brushSize - 1,
      WHITE,
    );

    this.ctx.putImageData(this.renderBuffer.imageData, 0, 0);
  }
}
