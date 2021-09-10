import { useEffect, useRef } from "react";
import { useCarousel } from "../contexts/CarouselProvider.jsx";
import { v4 as uuid } from "uuid";
function addImage(image, setCarouselData) {
  const reader = new FileReader();

  reader.onload = function () {
    let newImage = this.result;
    setCarouselData((existingData) => {
      let newImageObj = { src: newImage, id: uuid() };

      let images =
        Math.random() > 0.5
          ? [newImageObj, ...existingData.images]
          : [...existingData.images, newImageObj];

      return {
        ...existingData,
        images,
      };
    });
  };

  reader.readAsDataURL(image);
}

export default function AddImages() {
  let inpFiles = useRef();
  let [, setCarouselData] = useCarousel();

  useEffect(() => {
    let inputFiles = inpFiles.current;
    function insertInputtedImages() {
      if (!inputFiles.files) return;
      let files = inputFiles.files;
      let totalFiles = files.length;
      for (let i = 0; i < totalFiles; i++) {
        let file = files[i];
        addImage(file, setCarouselData);
      }
      inputFiles.value = null;
    }

    inputFiles.addEventListener("change", insertInputtedImages);
    return () => {
      inputFiles.removeEventListener("change", insertInputtedImages);
    };
  }, [setCarouselData]);

  return (
    <div id="add-imgs-container">
      <label htmlFor="inpFiles">
        <input ref={inpFiles} multiple id="inpFiles" type="file" />
        Add images
      </label>
    </div>
  );
}
