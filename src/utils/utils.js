import { setCurrentChild } from "./moveElementsVertically";

export function addMouseEventsToElements(elements) {
  elements.forEach((element) => {
    element.addEventListener("mousedown", setCurrentChild);
    element.addEventListener("touchstart", setCurrentChild);
  });
}
