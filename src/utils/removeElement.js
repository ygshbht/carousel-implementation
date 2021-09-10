import { getRotationY } from "../virtual-carousel-latest/src/utils.js";

export default function removeElement(elem, setCarouselData) {
  let topBoundary = 300;
  let bottomBoundary = -topBoundary;
  let elemStyle = getComputedStyle(elem);
  let elemBottom = parseInt(elemStyle.bottom);

  elem.style.opacity = (topBoundary - Math.abs(elemBottom)) / topBoundary;

  if (elemBottom < bottomBoundary || elemBottom > topBoundary) {
    let img = elem.querySelector("img");

    setCarouselData((existingData) => {
      let { images, container } = existingData;

      let newRotation = getRotationY(container.firstElementChild);
      let newImages = images.filter((imageObj) => {
        return img.id !== imageObj.id;
      });
      return {
        ...existingData,
        images: newImages,
        newRotation,
      };
    });
  }

  if (elemBottom > bottomBoundary && elemBottom < topBoundary) {
    elem.style.display = "auto";
  }
}
