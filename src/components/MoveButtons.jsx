import { IconButton } from "@material-ui/core";
import ChevronLeftIcon from "@material-ui/icons/ChevronLeft";
import ChevronRightIcon from "@material-ui/icons/ChevronRight";
import { useEffect, useState } from "react";

export default function MoveButtons({ carouselData }) {
  let { carousel } = carouselData;
  let [moveLeftBy, setMoveLeftBy] = useState(1);
  let [moveRightBy, setMoveRightBy] = useState(1);

  useEffect(() => {
    setMoveLeftBy(carouselData.moveLeftBy);
    setMoveRightBy(carouselData.moveRightBy);
  }, [carouselData.moveLeftBy, carouselData.moveRightBy]);

  function onClickLeft() {
    carousel.previous(moveLeftBy);
  }
  function onClickRight() {
    carousel.next(moveRightBy);
  }
  return (
    <div id="move-buttons">
      <span className="icon-container">
        <IconButton id="chevron-left" onClick={onClickLeft}>
          <ChevronLeftIcon></ChevronLeftIcon>
        </IconButton>
        {/* <TextField
          className="move-input"
          value={moveLeftBy}
          onChange={(e) => setMoveLeftBy(e.target.value)}
          type="number"
        ></TextField> */}
      </span>
      <span className="icon-container">
        {/* <TextField
          className="move-input"
          value={moveRightBy}
          type="number"
          onChange={(e) => setMoveRightBy(e.target.value)}
        ></TextField> */}
        <IconButton id="chevron-right" onClick={onClickRight}>
          <ChevronRightIcon></ChevronRightIcon>
        </IconButton>
      </span>
    </div>
  );
}
