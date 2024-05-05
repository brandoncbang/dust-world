import "./style.css";
import { Game } from "./game.ts";

const game = new Game(document.querySelector<HTMLCanvasElement>("#game")!);
game.start();
