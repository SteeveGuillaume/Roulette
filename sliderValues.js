export const sliders = [
    { id: 'maxSlider', max: 200, step: 5, start: 150, maxSpan: 'maxValueMax' },
    { id: 'nbColumnSlider', max: 9, step: 1, start: 7, maxSpan: 'nbColumnValueMax' },
    { id: 'pleinSlider', min: 5, max: 20, step: 5, start: [10, 15], minSpan: 'pleinValueMin', maxSpan: 'pleinValueMax' },
    { id: 'chevalSlider', min: 5, max: 40, step: 5, start: [15, 30], minSpan: 'chevalValueMin', maxSpan: 'chevalValueMax' },
    { id: 'transversaleSlider', min: 5, max: 60, step: 5, start: [20, 50], minSpan: 'transversaleValueMin', maxSpan: 'transversaleValueMax' },
    { id: 'carreSlider', min: 5, max: 80, step: 5, start: [30, 60], minSpan: 'carreValueMin', maxSpan: 'carreValueMax' },
    { id: 'sixainSlider', min: 5, max: 120, step: 5, start: [40, 100], minSpan: 'sixainValueMin', maxSpan: 'sixainValueMax' }
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
            currentValues[slider.id] = sliderElement.noUiSlider.get();
        }
    });
    return currentValues;
}