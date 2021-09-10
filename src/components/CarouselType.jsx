import React from "react";
import { useCarousel } from "../contexts/CarouselProvider";
import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormControl from "@material-ui/core/FormControl";
import FormLabel from "@material-ui/core/FormLabel";

export default function CarouselType() {
  let [carouselData, setCarouselData] = useCarousel();

  const [carouselType, setCarouselType] = React.useState(() => {
    return carouselData.isOrthographic ? "orthographic" : "perspective";
  });

  const handleChange = (event) => {
    setCarouselType(event.target.value);
    setCarouselData((existingData) => {
      let isOrthographic = event.target.value === "orthographic";
      return {
        ...existingData,
        isOrthographic,
      };
    });
  };

  return (
    <FormControl component="fieldset">
      <FormLabel component="legend">Carousel Type</FormLabel>
      <RadioGroup
        aria-label="gender"
        name="gender1"
        value={carouselType}
        onChange={handleChange}
      >
        <FormControlLabel
          value="orthographic"
          control={<Radio />}
          label="Orthographic"
        />
        <FormControlLabel
          value="perspective"
          control={<Radio />}
          label="Perspective"
        />
      </RadioGroup>
      <div>{carouselType}</div>
    </FormControl>
  );
}
