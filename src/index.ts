import {
  TIME_ZONES,
  createThenInitClick,
  timeZoneNumberToString,
} from "./Clock";
import "./index.css";

const createClockButton = document.getElementById("create-clock-button");
const timeZoneSelection = document.getElementById(
  "create-clock-selection"
) as HTMLSelectElement;

TIME_ZONES.sort((a, b) => a - b).forEach((n) => {
  const option = document.createElement("option");
  option.text = timeZoneNumberToString(n);
  option.value = n.toString();
  timeZoneSelection.appendChild(option);
});

createClockButton.onclick = () => {
  createThenInitClick(Number(timeZoneSelection.value));
};
