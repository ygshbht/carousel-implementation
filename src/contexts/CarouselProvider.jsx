import React, { useContext } from "react";
import { useState, useEffect } from "react";
// import CarouselLib from "../virtual-carousel/scripts/main.js";
import { v4 as uuid } from "uuid";
import MoveButtons from "../components/MoveButtons";
import {
  moveElementsVertically,
  nullifyCurrentChild,
} from "../utils/moveElementsVertically";
import { addMouseEventsToElements } from "../utils/utils.js";
import VirtualCarousel from "../virtual-carousel-latest/src/index";
import { getRotationY } from "../virtual-carousel-latest/src/utils";

const CarouselContext = React.createContext();
let setCarouselData;

export function useCarousel() {
  return [useContext(CarouselContext), setCarouselData];
}

export default function CarouselProvider({ children }) {
  let carouselData;
  [carouselData, setCarouselData] = useState({
    gap: 30,
    elements: [],
    images: [
      { src: "/assets/pexels-anjana-c-674010.jpg", id: uuid() },
      { src: "/assets/pexels-photo-1133957.jpeg", id: uuid() },
      { src: "/assets/pexels-pixabay-206359.jpg", id: uuid() },
      { src: "/assets/pexels-pixabay-207247.jpg", id: uuid() },
      { src: "/assets/pexels-pixabay-415708.jpg", id: uuid() },
    ],
    newRotation: 0,
    isOrthographic: true,
    touchVelMultiplier: 5,
    mouseVelMultiplier: 3,
    equidistantElements: true,
    carousel: {},
    moveLeftBy: 1,
    moveRightBy: 1,
  });

  useEffect(() => {
    let velocity = carouselData.carousel.velocity ?? 0;
    let elements = document.querySelectorAll(".wrapper");
    let container = document.querySelector(".container");
    setCarouselData((existingData) => {
      if (existingData.carousel) existingData.carousel.velocity = 0;
      let allContainerChildren = container.querySelectorAll("*");

      let { mouseVelMultiplier, touchVelMultiplier, equidistantElements } =
        existingData;

      let carousel = {
        next() {},
        previous() {},
      };

      if (existingData.images.length > 0) {
        let oldRotation = getRotationY(elements[0]);

        allContainerChildren.forEach((child) => {
          child.style.transform = "none";
          child.style.visibility = "visible";
          child.style.transformStyle = "initial";
        });

        carousel = new VirtualCarousel(container, elements, {
          gap: existingData.gap,
          setStyles: true,
          isOrthographic: existingData.isOrthographic,
          newRotation: oldRotation,
          equidistantElements,
          velocity,
        });

        carousel.mouseVelMultiplier = mouseVelMultiplier;
        carousel.touchVelMultiplier = touchVelMultiplier;
      } else {
        allContainerChildren.forEach((child) => {
          child.style.transform = "none";
          child.style.visibility = "visible";
          child.style.transformStyle = "initial";
        });
      }

      addMouseEventsToElements(elements);
      return {
        ...existingData,
        container,
        elements,
        carousel,
        mouseVelMultiplier,
        touchVelMultiplier,
        equidistantElements,
      };
    });
  }, [
    carouselData.images.length,
    carouselData.gap,
    carouselData.isOrthographic,
    carouselData.mouseVelMultiplier,
    carouselData.touchVelMultiplier,
    carouselData.equidistantElements,
  ]);

  useEffect(() => {
    addMouseEventsToElements(carouselData.elements);
  }, [carouselData.elements]);

  useEffect(() => {
    function handleMouseMove(e) {
      moveElementsVertically(e, setCarouselData);
    }
    function handleTouchMove(e) {
      moveElementsVertically(
        e,

        setCarouselData
      );
    }
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("touchmove", handleTouchMove);
    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("touchmove", handleTouchMove);
    };
  }, []);
  useEffect(() => {
    document.addEventListener("mouseup", nullifyCurrentChild);
    document.addEventListener("touchend", nullifyCurrentChild);
    document.addEventListener("touchcancel", nullifyCurrentChild);

    return () => {
      document.removeEventListener("mouseup", nullifyCurrentChild);
      document.removeEventListener("touchend", nullifyCurrentChild);
      document.removeEventListener("touchcancel", nullifyCurrentChild);
    };
  }, []);

  return (
    <CarouselContext.Provider value={carouselData}>
      <div id="carousel-container">
        <div className="container">
          {carouselData.images.map((img) => {
            return (
              <div key={img.id} className="wrapper">
                <div className="element">
                  <img src={img.src} id={img.id} alt="imageSoemt" />
                </div>
              </div>
            );
          })}
        </div>
        <MoveButtons carouselData={carouselData}></MoveButtons>
      </div>
      {children}
    </CarouselContext.Provider>
  );
}
