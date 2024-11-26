import "./style.css";
import { Game } from "./game.ts";

const game = new Game(
  document.querySelector<HTMLCanvasElement>("#game")!,
  document.querySelector<HTMLElement>("#gui")!,
);
game.start();
