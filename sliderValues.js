export const sliders = [
    { id: 'maxSlider', max: 200, step: 5, start: 25, maxSpan: 'maxValueMax' },
    { id: 'nbColumnSlider', max: 9, step: 1, start: 9, maxSpan: 'nbColumnValueMax' },
    { id: 'pleinSlider', min: 5, max: 20, step: 5, start: [5, 15], minSpan: 'pleinValueMin', maxSpan: 'pleinValueMax' },
    { id: 'chevalSlider', min: 5, max: 40, step: 5, start: [5, 25], minSpan: 'chevalValueMin', maxSpan: 'chevalValueMax' },
    { id: 'transversaleSlider', min: 5, max: 60, step: 5, start: [5, 30], minSpan: 'transversaleValueMin', maxSpan: 'transversaleValueMax' },
    { id: 'carreSlider', min: 5, max: 80, step: 5, start: [5, 30], minSpan: 'carreValueMin', maxSpan: 'carreValueMax' },
    { id: 'sixainSlider', min: 5, max: 120, step: 5, start: [5, 40], minSpan: 'sixainValueMin', maxSpan: 'sixainValueMax' }
];

export function updateSliderValues(sliderId, values) {
    const slider = sliders.find(s => s.id === sliderId);
    if (slider) {
        slider.start = values;
    }
}

export function getCurrentSliderValues() {
    const currentValues = {};
    sliders.forEach(slider => {
        const sliderElement = document.getElementById(slider.id);
        if (sliderElement && sliderElement.noUiSlider) {
            let value = sliderElement.noUiSlider.get();
            if (value === undefined) {
                value = slider.start;
            }
            currentValues[slider.id] = value;
        } else {
            currentValues[slider.id] = slider.start;
        }
    });
    return currentValues;
}