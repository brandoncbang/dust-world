export class Input {
  public static mouseX = 0;
  public static mouseY = 0;

  public static mousePressed = false;

  private static canvas = document.querySelector<HTMLCanvasElement>("#game")!;

  static {
    document.addEventListener("mousedown", () => {
      Input.mousePressed = true;
    });

    document.addEventListener("mouseup", () => {
      Input.mousePressed = false;
    });

    document.addEventListener("mousemove", (e: MouseEvent) => {
      const gameBounds = Input.canvas.getBoundingClientRect();
      const gameScale = gameBounds.width / Input.canvas.width;

      Input.mouseX = Math.floor((e.clientX - gameBounds.left) / gameScale);
      Input.mouseY = Math.floor((e.clientY - gameBounds.top) / gameScale);
    });
  }
}
