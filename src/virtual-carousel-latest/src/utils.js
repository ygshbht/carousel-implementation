export function getRotationY(element) {
  // console.log(element);
  let elmnt_tranform = new DOMMatrix(getComputedStyle(element).transform);
  let radians = Math.atan2(-elmnt_tranform.m13, elmnt_tranform.m11);
  let degrees = (radians * 180) / Math.PI;
  return degrees;
}

export function getVisibleWidth(element, includeMargin = false) {
  let width = 0;
  let elmntStyle = getComputedStyle(element);

  width += parseFloat(elmntStyle.width);

  if (elmntStyle.boxSizing === "content-box") {
    let bdrLeft = elmntStyle.borderLeft === "" ? 0 : elmntStyle.borderLeft;
    let bdrRight = elmntStyle.borderRight === "" ? 0 : elmntStyle.borderRight;
    let pdngLeft = elmntStyle.paddingLeft === "" ? 0 : elmntStyle.paddingLeft;
    let pdngRight = elmntStyle.paddingLeft === "" ? 0 : elmntStyle.paddingRight;
    width += parseFloat(pdngLeft);
    width += parseFloat(pdngRight);
    width += parseFloat(bdrLeft);
    width += parseFloat(bdrRight);
  }

  if (includeMargin) {
    let mrgnLeft = elmntStyle.marginLeft === "" ? 0 : elmntStyle.marginLeft;
    let mrgnRight = elmntStyle.marginRight === "" ? 0 : elmntStyle.marginRight;
    width += parseFloat(mrgnLeft);
    width += parseFloat(mrgnRight);
  }
  return width;
}

export function mouseHoldAtEnd(mouseXpositions, hold_threshold) {
  if (mouseXpositions.length <= 1) return false;
  let current_time = new Date().getTime();
  let last_move_time = mouseXpositions[mouseXpositions.length - 1].time;
  let difference = current_time - last_move_time;

  if (difference > hold_threshold) return true;
  return false;
}

export function calcZindex(total_rotation, extra_degress) {
  let z_index = Math.floor(
    Math.abs(180 - (Math.abs((total_rotation + extra_degress) % 360) % 360))
  );
  return parseInt(z_index);
}

export function calcTransformOrigin(project_list, circumference) {
  let radius = circumference / (Math.PI * 2);
  radius = -radius;
  project_list.forEach((project) => {
    project.initialRadius = parseFloat(radius);
    project.style.transformOrigin = `50% 50% ${parseFloat(radius)}px`;
  });
  return radius;
}

export function wrapDiv(container, div, className) {
  let wrapper = document.createElement("DIV");
  wrapper.classList.add(className);

  wrapper.appendChild(div);
  container.appendChild(wrapper);
  return wrapper;
}

export function wrapDivs(container, divs, className = "wrapper") {
  return divs.map((div) => wrapDiv(container, div, className));
}

export function rotateChild(child, toRotate) {
  child.style.transform = `rotateY(${toRotate}deg)`;
}

export function hideBackface(card) {
  let parent = card.parentElement;

  let allChildren = parent.querySelectorAll("*");
  //manual
  // let parent = card;

  let angle = getRotationY(parent);
  if ((angle >= 90 && angle <= 270) || (angle <= -90 && angle >= -270)) {
    parent.style.visibility = "hidden";
    allChildren.forEach((child) => {
      child.style.visibility = "hidden";
    });
  } else {
    parent.style.visibility = "visible";
    allChildren.forEach((child) => {
      child.style.visibility = "visible";
    });
  }
}
