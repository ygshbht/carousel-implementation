import Controls from "./components/Controls";
import ExternalLinks from "./components/ExternalLinks";
import Note from "./components/Note";
import CarouselProvider from "./contexts/CarouselProvider";

import "./styles/app.scss";

function App() {
  return (
    <div className="App">
      <ExternalLinks />

      <CarouselProvider>
        {/* <Carousel /> */}
        <Controls />
        {/* <CarouselType />
        <DistanceType /> */}
        {/* <Gap /> */}
        {/* <MouseVelocitySlider />
        <TouchVelocitySlider /> */}
        {/* <AddImages /> */}
        <Note />
      </CarouselProvider>
    </div>
  );
}

export default App;
