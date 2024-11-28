import { Material } from "../simulation/material";
import { Game } from "../game.ts";

function h(
  tag: keyof HTMLElementTagNameMap,
  ...args: (string | HTMLElement | object)[]
): HTMLElement {
  const el = document.createElement(tag);

  for (const arg of args) {
    if (typeof arg === "string") {
      el.textContent += arg;
    } else if (arg instanceof HTMLElement) {
      el.appendChild(arg);
    } else if (typeof arg === "object" && !Array.isArray(arg) && arg !== null) {
      Object.assign(el, arg);
    }
  }

  return el;
}

export class Gui {
  constructor(
    private root: HTMLElement,
    private game: Game,
  ) {
    this.render();
  }

  public onBrushSizeSelected: (size: number) => void = () => {};

  public onMaterialSelected: (material: Material) => void = () => {};

  public onClearButtonPressed: () => void = () => {};

  public onPauseButtonPressed: () => void = () => {};

  private render() {
    const materialEntries = Object.entries(Material).filter(([key]) =>
      isNaN(Number(key)),
    );

    this.root.append(
      h(
        "div",
        h("button", "Clear", {
          onclick: () => {
            this.onClearButtonPressed();
          },
        }),
        h("button", "Pause", {
          onclick: (e: Event) => {
            this.onPauseButtonPressed();

            (e.target as HTMLButtonElement).textContent = this.game.paused
              ? "Start"
              : "Pause";
          },
        }),
        h(
          "div",
          { style: "margin-left: auto" },
          h("input", {
            id: "brush-size",
            type: "range",
            min: 1.0,
            max: 9.0,
            step: 2.0,
            value: 5.0,
            onchange: (e: Event) => {
              this.onBrushSizeSelected(
                (e.target as HTMLInputElement).valueAsNumber,
              );
            },
          }),
          h("label", { for: "brush-size", className: "sr-only" }, "Brush size"),
        ),
      ),
      h("h2", "Materials"),
      h(
        "div",
        ...materialEntries.map(([key, material]) =>
          h("button", {
            className: material === Material.Water && "selected",
            textContent: key,
            onclick: (e: Event) => {
              this.onMaterialSelected(material as Material);

              const el = e.target as HTMLButtonElement;

              el.parentElement?.querySelectorAll("button").forEach((button) => {
                button.classList.remove("selected");
              });

              el.classList.add("selected");
            },
          }),
        ),
      ),
    );
  }
}
