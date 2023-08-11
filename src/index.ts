import { ClockController, ClockModel, ClockView, EditMode } from "./Clock";
import "./index.css";

const model = new ClockModel();
const controller = new ClockController(model);
const view = new ClockView(model, controller);

view.display();

setInterval(controller.updateClock, 1000);
