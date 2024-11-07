import { MathUtils } from 'three';

export function initializeCameraSliders(controls) {

  const rotateSliderElement = document.getElementById("rotateSlider");
  const verticalSliderElement = document.getElementById("verticalSlider");
  // Create the horizontal slider
  noUiSlider.create(rotateSliderElement, {
    start: 0,
    range: {
      min: -90,
      max: 90
    },
    orientation: 'horizontal',
    direction: 'ltr'
  });

  // Create the vertical slider
  noUiSlider.create(verticalSliderElement, {
    start: 60,
    range: {
      min: 0,
      max: 90
    },
    orientation: 'vertical',
    direction: 'rtl'
  });

  const handleSliderChange = (event) => {
    //dragging = true;
    const currentValue = parseInt(event, 10);
    const azimuthAngle = MathUtils.degToRad(-currentValue + 180); // Convert degrees to radians
  
    // Set the azimuthal angle directly
    controls.minAzimuthAngle = azimuthAngle;
    controls.maxAzimuthAngle = azimuthAngle;
  
    controls.update();
  };

  const handleVerticalSliderChange = (event) => {
    //dragging = true;
    const currentValue = parseInt(event, 10);
    const polarAngle = MathUtils.degToRad(currentValue); // Convert degrees to radians

    // Set the polar angle directly
    controls.minPolarAngle = polarAngle;
    controls.maxPolarAngle = polarAngle;

    controls.update();
  };

  const startSlider = () => {
  };

  const stopSlider = () => { 
  }

  // Add event listeners for the horizontal slider
  rotateSliderElement.noUiSlider.on('update', (values, handle) => {
    handleSliderChange(values[handle]);
  });
  rotateSliderElement.noUiSlider.on('start', startSlider);
  rotateSliderElement.noUiSlider.on('end', stopSlider);

  // Add event listeners for the vertical slider
  verticalSliderElement.noUiSlider.on('update', (values, handle) => {
    handleVerticalSliderChange(values[handle]);
  });
  verticalSliderElement.noUiSlider.on('start', startSlider);
  verticalSliderElement.noUiSlider.on('end', stopSlider);
}