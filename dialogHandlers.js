import { sliders } from './dialogSliders.js';

export function initializeDialogHandlers() {
    const settingsDialog = document.getElementById('settingsDialog');
    const settingsButton = document.getElementById('settingsButton');
    const checkboxes = Array.from(document.querySelectorAll('input[type="checkbox"]')).filter(checkbox => checkbox.id !== 'twoPlayersSwitch');
    const twoPlayersSwitch = document.getElementById('twoPlayersSwitch');
    const submitButton = document.getElementById('submitButton');

    let twoPlayers = true;

    settingsButton.addEventListener('click', () => {
        settingsDialog.showModal();
        document.dispatchEvent(new CustomEvent('dialogOpened'));
    });
    
    settingsDialog.addEventListener('close', () => {
        document.dispatchEvent(new CustomEvent('dialogClosed'));
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

  
    checkboxes.forEach(checkbox => {
        checkbox.addEventListener('change', (event) => {
        const sliderId = event.target.id;
        const slider = document.querySelector(`.slider[data-checkbox="${sliderId}"]`);
        
        if (event.target.checked) {
            slider.classList.remove('disabled');
        } else {
            slider.classList.add('disabled');
        }
        });
    });

    twoPlayersSwitch.addEventListener('change', (event) => {
        twoPlayers = event.target.checked;
    });

    // Add event listener for the submit button
    submitButton.addEventListener('click', (event) => {
        event.preventDefault(); // Prevent the form from submitting in the traditional way
        settingsDialog.close(); // Close the dialog

        // Dispatch a custom event to notify main.js
        const updateEvent = new CustomEvent('settingsSubmitted', {
            detail: {
                sliders,
                twoPlayers
            }
        });
        document.dispatchEvent(updateEvent);
    });
}