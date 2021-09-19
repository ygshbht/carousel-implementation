import { calcTotalWidth, getWidhtUpto } from "./calcTotalWidth.js";
import { calcTransformOrigin } from "./utils.js";
import { calcVelocity, addForce } from "./kinematics.js";
import { getRotationY, mouseHoldAtEnd } from "./utils.js";
import { calcZindex, rotateChild, hideBackface } from "./utils.js";
import { removeMouseEvents, removeTouchEvents } from "./utils/removeEvents.js";
import { setContainerStyles, setWrapperStyles } from "./utils/setStyles.js";
import setNewRadius from "./utils/setNewRadius.js";
import getNextElement from "./utils/getNextElement.js";
import { getPreviousElement } from "./utils/getPreviousElement.js";
import rotateElements from "./rotateElements.js";

export default class Carousel {
  mouseDown = false;
  mouse_in = true;

  hold_threshold = 120;
  friction = 0.15;
  accelerateInterval = 10;

  velocity = 0;
  mouseCoordX = 0;
  totalRotation = 0;
  totalWidth = 0;

  mouseVelMultiplier = 1;
  touchVelMultiplier = 1;
  mouseXpositions = [];

  constructor(container, elements, modifiers = {}) {
    if (!container) return;
    this.gap = modifiers.gap ?? 30;
    this.includeMargin = modifiers.includeMargin ?? false;
    this.setStyles = modifiers.setStyles ?? true;
    this.equidistantElements = modifiers.equidistantElements ?? true;
    this.isOrthographic = modifiers.isOrthographic ?? false;
    this.clickRotationDuration = modifiers.clickRotationDuration ?? 350; //milliseconds
    this.minRotationStepDist = modifiers.minRotationStepDist ?? 35; // pixels
    this.initialVelocity = modifiers.velocity ?? 0;

    this.newRotation = modifiers.newRotation ?? 0; //custom
    // console.log("constructer instantiated ", this.newRotation);
    this.container = container;

    // some custom
    // if (this.isOrthographic) {
    //   this.elements = wrapDivs(this.container, Array.from(elements));
    // } else {
    this.elements = Array.from(elements);
    // }

    this.project = this.elements[0];
    this.projectStyle = getComputedStyle(this.elements[0]);

    this.projectRotateY = getRotationY(this.project);
    this.totalElements = this.elements.length;

    container.ondragstart = () => false;
    if (this.setStyles) {
      setContainerStyles(this.container, this.isOrthographic);
      this.elements.forEach((elem) => {
        setWrapperStyles(elem, this.isOrthographic);
      });
    }

    calcTotalWidth(this.elements, {
      gap: this.gap,
      includeMargin: this.includeMargin,
      limitWidth: this.limitWidth,
    }).then((width) => {
      this.totalWidth = width;
      this.radius = calcTransformOrigin(this.elements, this.totalWidth);
      this.circumference = Math.abs(2 * Math.PI * this.radius);
      this.degreesPerCircum = 360 / this.circumference;

      let lastElement = this.elements[this.totalElements - 1];
      let firstElement = this.elements[0];

      this.elements.forEach((elem, index) => {
        let widthUpto = getWidhtUpto(
          this.elements,
          index,
          this.gap,
          this.includeMargin
        );

        elem.previousElem =
          index !== 0 ? this.elements[index - 1] : lastElement;
        elem.nextElem =
          index !== this.totalElements - 1
            ? this.elements[index + 1]
            : firstElement;
        elem.maxRadiusAbs = this.totalWidth / 2;
        let extraDegress = (widthUpto / this.totalWidth) * 360;

        elem.extraDegress = extraDegress;

        elem.style.transform = `rotateY(${
          (this.totalRotation + extraDegress) % 360
        }deg)`;

        //manual
        if (this.isOrthographic) {
          let toRotate = (this.totalRotation + extraDegress) % 360;
          rotateChild(elem.querySelector("*"), -toRotate);
        }

        elem.style.zIndex = `${calcZindex(this.totalRotation, extraDegress)}`;
      });

      if (this.newRotation) this.setRotation();

      if (this.isOrthographic && this.equidistantElements) {
        let rotation = this.newRotation;
        this.elements.forEach((elem) => {
          let toRotate = rotation + elem.extraDegress;
          setNewRadius(elem, toRotate);
          hideBackface(elem.querySelector("*"), toRotate);
          // rotateChild(elem.querySelector("*"), -toRotate);
        });
      } else if (this.isOrthographic && !this.equidistantElements) {
        let rotation = this.newRotation;
        this.elements.forEach((elem) => {
          let toRotate = rotation + elem.extraDegress;
          hideBackface(elem.querySelector("*"), toRotate);
          rotateChild(elem.querySelector("*"), -toRotate);
          setNewRadius(elem, toRotate);
        });
      }
      // if (this.initialVelocity) {
      //   this.velocity = this.initialVelocity;
      //   let force_interval = setInterval(() => {
      //     addForce(force_interval, this);
      //   }, this.accelerateInterval);
      // }
    });

    this.container.onmouseleave = this.mouseleaveHandler;
    this.container.onmouseup = this.mouseupHandler;
    this.container.onmousemove = this.mousemoveHandler;
    this.container.onmouseenter = this.mouseenterHandler;
    this.container.onmousedown = this.mousedownHandler;

    this.container.ontouchstart = this.touchstartHandler;
    this.container.ontouchmove = this.touchmoveHandler;
    this.container.ontouchend = this.touchendHandler;
    this.container.ontouchcancel = this.touchcancelHandler;
  }

  getVelocity = () => this.velocity;
  changeVelocity = (value) => (this.velocity += value);
  nullifyMouseXpositions = () => (this.mouseXpositions = []);
  removeTouchEvents = () => removeTouchEvents(this);
  removeMouseEvents = () => removeMouseEvents(this);
  removeEvents = () => {
    removeMouseEvents(this);
    removeTouchEvents(this);
  };

  next = (numOfElementsToRotateBy) => {
    this.velocity = 0;
    let nextElem = getNextElement(this.elements);

    rotateElements(this, nextElem, "right", numOfElementsToRotateBy);
  };

  previous = (numOfElementsToRotateBy) => {
    this.velocity = 0;
    let prevElem = getPreviousElement(this.elements);

    rotateElements(this, prevElem, "left", numOfElementsToRotateBy);
  };

  mousedownHandler = (e) => this.dragStart(e.clientX);

  touchstartHandler = (e) => this.dragStart(e.targetTouches[0].pageX);

  touchmoveHandler = (e) => this.drag(e.targetTouches[0].pageX);

  touchcancelHandler = (e) => this.dragEnd(this.touchVelMultiplier);

  touchendHandler = () => this.dragEnd(this.touchVelMultiplier);

  mousemoveHandler = (e) => {
    //custom
    if (this.mouseDown && this.mouse_in) {
      this.drag(e.clientX);
    }
  };

  mouseenterHandler = () => (this.mouse_in = true);

  mouseupHandler = () => {
    this.mouseDown = false;
    this.dragEnd(this.mouseVelMultiplier);
  };

  mouseleaveHandler = () => {
    this.mouse_in = this.mouseDown = false;
    if (this.velocity === 0) this.dragEnd(this.mouseVelMultiplier);
  };

  dragStart = (startingPos) => {
    this.mouseDown = true;
    this.mouseCoordX = startingPos;
    this.velocity = 0;
    this.projectRotateY = getRotationY(this.project);
    this.mouseXpositions = [];
  };

  drag = (contactPoint) => {
    let horizontalDistMoved = contactPoint - this.mouseCoordX;

    if (Math.abs(horizontalDistMoved) < 25) return; //custom

    let degressToRotate = horizontalDistMoved * this.degreesPerCircum;
    this.totalRotation = this.projectRotateY + degressToRotate;

    this.elements.forEach((elem, index) => {
      let extraDegress = elem.extraDegress;
      let toRotate = (this.totalRotation + extraDegress) % 360;
      elem.style.transform = `rotateY(${toRotate}deg)`;
      elem.style.zIndex = `${calcZindex(this.totalRotation, extraDegress)}`;

      if (this.isOrthographic) {
        rotateChild(elem.querySelector("*"), -toRotate);
        hideBackface(elem.querySelector("*"));

        if (this.equidistantElements) setNewRadius(elem, toRotate, index);
      }
    });

    this.mouseXpositions.push({
      pos: contactPoint,
      time: new Date().getTime(),
    });
    if (this.mouseXpositions.length >= 15) this.mouseXpositions.shift();
  };

  dragEnd = (multiplier) => {
    if (this.mouseXpositions.length >= 2)
      this.velocity = calcVelocity(
        this.mouseXpositions,
        this.radius,
        multiplier
      );
    else this.velocity = 0;

    if (!mouseHoldAtEnd(this.mouseXpositions, this.hold_threshold)) {
      let force_interval = setInterval(() => {
        addForce(force_interval, this);
      }, this.accelerateInterval);
    }
    this.mouseXpositions = [];
  };

  //custom
  setRotation = (rotation) => {
    this.hasSetRotationOnce = true;
    // let projectYrotation = rotation;
    let projectYrotation = this.newRotation;
    this.elements.forEach((elem) => {
      let extra_degress = elem.extraDegress;
      let toRotate = (projectYrotation + extra_degress) % 360;

      elem.style.transform = `rotateY(${toRotate}deg)`;
      if (this.isOrthographic && this.equidistantElements) {
        rotateChild(elem.querySelector("*"), -toRotate);
      }

      elem.style.zIndex = `${calcZindex(projectYrotation, extra_degress)}`;
    });
  };
}
