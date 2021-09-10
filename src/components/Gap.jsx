import React, { useState } from "react";
import { withStyles, makeStyles } from "@material-ui/core/styles";
import Slider from "@material-ui/core/Slider";
import Typography from "@material-ui/core/Typography";
import { useCarousel } from "../contexts/CarouselProvider";

const useStyles = makeStyles((theme) => ({
  root: {
    width: 300 + theme.spacing(3) * 2,
  },
  margin: {
    height: theme.spacing(3),
  },
}));

const PrettoSlider = withStyles({
  root: {
    color: "#52af77",
    height: 8,
  },
  thumb: {
    height: 24,
    width: 24,
    backgroundColor: "#fff",
    border: "2px solid currentColor",
    marginTop: -8,
    marginLeft: -12,
    "&:focus, &:hover, &$active": {
      boxShadow: "inherit",
    },
  },
  active: {},
  valueLabel: {
    left: "calc(-50% + 4px)",
  },
  track: {
    height: 8,
    borderRadius: 4,
  },
  rail: {
    height: 8,
    borderRadius: 4,
  },
})(Slider);

export default function Gap() {
  const [carouselData, setCarouselData] = useCarousel();
  const [gap, setGap] = useState(carouselData.gap);
  const classes = useStyles();
  function onGapChange(e, data) {
    setGap(data);
    setCarouselData((existingData) => {
      // console.log("setting gap data to", data);
      return {
        ...existingData,
        gap: data,
      };
    });
  }

  return (
    <div id="carousel-gap" className={classes.root}>
      <Typography>Gap</Typography>
      <PrettoSlider
        onChange={onGapChange}
        valueLabelDisplay="auto"
        aria-label="pretto slider"
        defaultValue={gap}
        value={gap}
        min={-70}
        max={1000}
        step={10}
      />
    </div>
  );
}
