import { Material } from "../simulation/material";

export class Gui {
  private materialSelectedCallbacks: ((material: Material) => void)[] = [];

  constructor(private root: HTMLElement) {
    this.render();
  }

  public onMaterialSelected(callback: (material: Material) => void) {
    this.materialSelectedCallbacks.push(callback);
  }

  private render() {
    const materialEntries = Object.entries(Material).filter(([key]) =>
      isNaN(Number(key)),
    );

    for (const [key, material] of materialEntries) {
      const button = document.createElement("button");
      button.textContent = key;
      button.className = material === Material.Water ? "selected" : "";
      button.onclick = () => {
        this.materialSelectedCallbacks.forEach((callback) =>
          callback(material as Material),
        );

        this.root.querySelectorAll("button").forEach((button) => {
          button.classList.remove("selected");
        });

        button.classList.add("selected");
      };

      this.root.appendChild(button);
    }
  }
}
