import React, { useEffect, useState } from "react";
import { useCarousel } from "../contexts/CarouselProvider";
import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormControl from "@material-ui/core/FormControl";
import FormLabel from "@material-ui/core/FormLabel";
import { TextField } from "@material-ui/core";

export default function CarouselType() {
  let [carouselData, setCarouselData] = useCarousel();
  let [moveLeftBy, setMoveLeftBy] = useState(() => {
    return carouselData.moveLeftBy;
  });
  useEffect(() => {
    setMoveLeftBy(carouselData.moveLeftBy);
  }, [carouselData.moveLeftBy]);
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
    <div>
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
      </FormControl>
      <br />
      <br />
      <TextField
        label="Move left"
        InputProps={{
          inputProps: { min: 1, max: 100 },
          style: {
            fontSize: 32,
          },
        }}
        value={moveLeftBy}
        onChange={(e) => {
          setCarouselData((d) => ({ ...d, moveLeftBy: e.target.value }));
        }}
        type="number"
        style={{
          width: 90,
          fontSize: 32,
        }}
      ></TextField>
    </div>
  );
}
