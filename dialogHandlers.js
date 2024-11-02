// dialogHandlers.js
import { sliderValues } from './sliderValues.js';

export function initializeDialogHandlers() {
    const settingsDialog = document.getElementById('settingsDialog');
    const cancelButton = document.getElementById('cancelButton');
    const settingsButton = document.getElementById('settingsButton');

    settingsButton.addEventListener('click', () => {
        settingsDialog.showModal();
    });
/*
    cancelButton.addEventListener('click', () => {
        settingsDialog.close();
    });
*/
    // Add event listeners for sliders
    const sliders = document.querySelectorAll('.slider-item input[type="range"]');
    sliders.forEach(slider => {
        slider.value = sliderValues[slider.id]; // Initialize the corresponding value in sliderValues
        const valueSpan = document.getElementById(`${slider.id}Value`);
        valueSpan.textContent = slider.value; // Initialize with the current value

        slider.addEventListener('input', (event) => {
            valueSpan.textContent = event.target.value;
            sliderValues[slider.id] = event.target.value; // Update the corresponding value in sliderValues
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