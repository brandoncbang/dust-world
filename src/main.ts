import "./style.css";
import { Game } from "./game.ts";
import { Gui } from "./core/gui.ts";

const game = new Game(document.querySelector<HTMLCanvasElement>("#game")!);
const gui = new Gui(document.querySelector<HTMLElement>("#gui")!, game);

game.setUpGui(gui);

game.start();
