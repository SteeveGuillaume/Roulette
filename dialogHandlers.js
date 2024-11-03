import { sliders } from './sliderValues.js';

export function initializeDialogHandlers() {
    const settingsDialog = document.getElementById('settingsDialog');
    const cancelButton = document.getElementById('cancelButton');
    const settingsButton = document.getElementById('settingsButton');

    settingsButton.addEventListener('click', () => {
        settingsDialog.showModal();
    });

    sliders.forEach(slider => {
        const sliderElement = document.getElementById(slider.id);
        noUiSlider.create(sliderElement, {
            start: slider.start,
            connect: slider.min !== undefined,
            range: {
                'min': slider.min !== undefined ? slider.min : 0,
                'max': slider.max
            },
            step: slider.step,
            format: {
                to: function (value) {
                    return Math.round(value);
                },
                from: function (value) {
                    return Number(value);
                }
            }
        });

        if (slider.minSpan) {
            const minSpan = document.getElementById(slider.minSpan);
            sliderElement.noUiSlider.on('update', function (values, handle) {
                minSpan.innerHTML = values[0];
            });
        }

        const maxSpan = document.getElementById(slider.maxSpan);
        sliderElement.noUiSlider.on('update', function (values, handle) {
            maxSpan.innerHTML = values[slider.minSpan ? 1 : 0];
        });
    });

    // Add event listener for the submit button
    submitButton.addEventListener('click', (event) => {
        event.preventDefault(); // Prevent the form from submitting in the traditional way
        settingsDialog.close(); // Close the dialog

        // Dispatch a custom event to notify main.js
        const updateEvent = new CustomEvent('settingsSubmitted', {
            detail: sliderValues
        });
        document.dispatchEvent(updateEvent);
    });
}