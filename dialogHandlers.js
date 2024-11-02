// dialogHandlers.js

export function initializeDialogHandlers() {
    const settingsDialog = document.getElementById('settingsDialog');
    const cancelButton = document.getElementById('cancelButton');
  
    settingsButton.addEventListener('click', () => {
      settingsDialog.showModal();
    });
  
    cancelButton.addEventListener('click', () => {
      settingsDialog.close();
    });
  
    // Add event listeners for sliders if needed
    const sliders = document.querySelectorAll('.slider-item input[type="range"]');
    sliders.forEach(slider => {
        const valueSpan = document.getElementById(`${slider.id}Value`);
    valueSpan.textContent = slider.value; // Initialize with the current value

    slider.addEventListener('input', (event) => {
      valueSpan.textContent = event.target.value;
      console.log(`${event.target.name}: ${event.target.value}`);
    });
});
  }