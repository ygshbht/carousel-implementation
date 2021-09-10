import React from "react";
import AddImages from "./AddImages";
import CarouselType from "./CarouselType";
import DistanceType from "./DistanceType";
import Gap from "./Gap";
import MouseVelocitySlider from "./MouseVelocitySlider";
import TouchVelocitySlider from "./TouchVelocitySlider";

export default function Controls() {
  return (
    <div id="carousel-settings">
      <CarouselType />
      <div id="sliders">
        {/* <MouseVelocitySlider /> */}
        <div id="gap-and-image">
          <AddImages />
          <Gap />
          <MouseVelocitySlider />
          <TouchVelocitySlider />
        </div>
        {/* <TouchVelocitySlider /> */}
      </div>
      <DistanceType />
    </div>
  );
}
