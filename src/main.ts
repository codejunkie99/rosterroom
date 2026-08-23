import { createApp } from "./app/controller";
import { rosters } from "./data";
import "./styles.css";

const root = document.querySelector<HTMLElement>("#app");
if (!root) throw new Error("Application root not found");

createApp(root, rosters);

