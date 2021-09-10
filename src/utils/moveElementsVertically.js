import removeElement from "./removeElement.js";

// let resetCurrentChild = () => (current_child = null);

let mouse_down = false;
let current_child;
let initialPosY;

export function moveElementsVertically(e, setCarouselData) {
  if (!current_child) return;

  if (mouse_down && current_child) {
    let dist_movedY;

    if (e.clientY) {
      dist_movedY = initialPosY - e.clientY;
    } else if (e.touches) {
      dist_movedY = initialPosY - e.touches[0].clientY;
    }
    if (Math.abs(dist_movedY) < 35) return;
    removeElement(current_child, setCarouselData);

    let power = 1.09;
    if (!current_child) return;
    if (dist_movedY >= 0) {
      current_child.style.bottom = `${dist_movedY ** power}px`;
    } else current_child.style.bottom = `${-((-dist_movedY) ** power)}px`;
  }
}

export function nullifyCurrentChild(e) {
  mouse_down = false;
  if (!current_child) return;

  current_child.style.bottom = "auto";
  current_child.style.opacity = 1;
  current_child = null;
}
export function setCurrentChild(e) {
  mouse_down = true;
  if (e.clientX && e.clientY) {
    current_child = e.target.parentElement.parentElement;
    initialPosY = e.clientY;
    // initialPosX = e.clientX;
  } else if (e.touches) {
    current_child = e.targetTouches[0].target.parentElement.parentElement;
    initialPosY = e.touches[0].clientY;
  }
}
