import React, { useState, useEffect } from "react";
import { useCarousel } from "../contexts/CarouselProvider";
import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormControl from "@material-ui/core/FormControl";
import FormLabel from "@material-ui/core/FormLabel";
import { TextField } from "@material-ui/core";

export default function DistanceType() {
  let [carouselData, setCarouselData] = useCarousel();

  let [disabled, setDisabled] = useState(() => {
    return !carouselData.isOrthographic;
  });

  useEffect(() => {
    setDisabled(!carouselData.isOrthographic);
  }, [carouselData.isOrthographic]);

  const [distanceType, setDistanceType] = React.useState(() => {
    return carouselData.equidistantElements ? "equal" : "sinusoidal";
  });

  let [moveRightBy, setMoveRightBy] = useState(() => {
    return carouselData.moveRightBy;
  });
  useEffect(() => {
    setMoveRightBy(carouselData.moveRightBy);
  }, [carouselData.moveRightBy]);

  const handleChange = (event) => {
    setDistanceType(event.target.value);
    setCarouselData((existingData) => {
      let equidistantElements = event.target.value === "equal";
      return {
        ...existingData,
        equidistantElements,
      };
    });
  };

  return (
    <div>
      <FormControl component="fieldset">
        <FormLabel component="legend">Distance Type</FormLabel>
        <RadioGroup
          aria-label="gender"
          name="gender1"
          value={distanceType}
          onChange={handleChange}
        >
          <FormControlLabel
            disabled={disabled}
            value="equal"
            control={<Radio />}
            label="Equal"
          />
          <FormControlLabel
            value="sinusoidal"
            control={<Radio />}
            label="Sinosuidal"
            disabled={disabled}
          />
        </RadioGroup>
      </FormControl>
      <br />
      <br />
      <TextField
        label="Move right"
        InputProps={{
          inputProps: { min: 1, max: 100 },
          style: {
            fontSize: 32,
          },
        }}
        value={moveRightBy}
        onChange={(e) => {
          setCarouselData((d) => ({ ...d, moveRightBy: e.target.value }));
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
