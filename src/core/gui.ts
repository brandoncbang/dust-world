import { Material } from "../simulation/material";

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
  private materialSelectedCallbacks: ((material: Material) => void)[] = [];
  private clearButtonPressedCallbacks: (() => void)[] = [];

  constructor(private root: HTMLElement) {
    this.render();
  }

  public onMaterialSelected(callback: (material: Material) => void) {
    this.materialSelectedCallbacks.push(callback);
  }

  public onClearButtonPressed(callback: () => void) {
    this.clearButtonPressedCallbacks.push(callback);
  }

  private render() {
    const materialEntries = Object.entries(Material).filter(([key]) =>
      isNaN(Number(key)),
    );

    this.root.append(
      h(
        "div",
        h("button", "Clear", {
          onclick: () => {
            this.clearButtonPressedCallbacks.forEach((callback) => {
              callback();
            });
          },
        }),
        h("button", "Pause"),
      ),
      h("h2", "Materials"),
      h(
        "div",
        ...materialEntries.map(([key, material]) =>
          h("button", {
            className: material === Material.Water && "selected",
            textContent: key,
            onclick: (e: Event) => {
              const el = e.target as HTMLButtonElement;

              this.materialSelectedCallbacks.forEach((callback) =>
                callback(material as Material),
              );

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
